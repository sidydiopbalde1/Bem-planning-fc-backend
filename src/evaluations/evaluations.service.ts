import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, StatutCampagne } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JournalService } from '../journal/journal.service';
import { PaginationDto } from '../common/dto';
import * as crypto from 'crypto';

export interface EvaluationFilters {
  moduleId?: string;
  statut?: StatutCampagne;
}

export class CreateEvaluationDto {
  moduleId: string;
  intervenantId: string;
  dateDebut: string;
  dateFin: string;
  nombreInvitations?: number;
}

export class UpdateEvaluationDto {
  moduleId?: string;
  intervenantId?: string;
  dateDebut?: string;
  dateFin?: string;
  nombreInvitations?: number;
  statut?: StatutCampagne;
}

export class SubmitResponseDto {
  noteQualiteCours?: number;
  noteQualitePedagogie?: number;
  noteDisponibilite?: number;
  commentaires?: string;
}

@Injectable()
export class EvaluationsService {
  constructor(
    private prisma: PrismaService,
    private journalService: JournalService,
  ) {}

  async findAll(pagination: PaginationDto, filters: EvaluationFilters) {
    const { skip, take, sortBy, sortOrder } = pagination;
    const where: Prisma.EvaluationEnseignementWhereInput = {};

    if (filters.moduleId) where.moduleId = filters.moduleId;
    if (filters.statut) where.statut = filters.statut;

    const [evaluations, total] = await Promise.all([
      this.prisma.evaluationEnseignement.findMany({
        where,
        skip,
        take,
        include: {
          module: {
            include: {
              programme: { select: { id: true, name: true, code: true } },
            },
          },
          intervenant: {
            select: { id: true, civilite: true, nom: true, prenom: true },
          },
        },
        orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
      }),
      this.prisma.evaluationEnseignement.count({ where }),
    ]);

    const limit = pagination.limit ?? 20;

    return {
      data: evaluations,
      pagination: {
        page: pagination.page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const evaluation = await this.prisma.evaluationEnseignement.findUnique({
      where: { id },
      include: {
        module: { include: { programme: true } },
        intervenant: true,
      },
    });

    if (!evaluation) {
      throw new NotFoundException('Évaluation non trouvée');
    }

    return evaluation;
  }

  async findByLien(lienEvaluation: string) {
    const evaluation = await this.prisma.evaluationEnseignement.findFirst({
      where: { lienEvaluation },
      include: {
        module: { include: { programme: true } },
        intervenant: { select: { civilite: true, nom: true, prenom: true } },
      },
    });

    if (!evaluation) {
      throw new NotFoundException('Évaluation non trouvée');
    }

    return evaluation;
  }

  async create(
    data: CreateEvaluationDto,
    currentUserId?: string,
    currentUserName?: string,
  ) {
    const lienEvaluation = crypto.randomBytes(32).toString('hex');

    const evaluation = await this.prisma.evaluationEnseignement.create({
      data: {
        moduleId: data.moduleId,
        intervenantId: data.intervenantId,
        dateDebut: new Date(data.dateDebut),
        dateFin: new Date(data.dateFin),
        nombreInvitations: data.nombreInvitations || 0,
        lienEvaluation,
        statut: 'BROUILLON',
      },
      include: {
        module: true,
        intervenant: true,
      },
    });

    await this.journalService.log({
      action: 'CREATION',
      entite: 'Evaluation',
      entiteId: evaluation.id,
      description: `Création d'une évaluation pour le module ${evaluation.module.code}`,
      nouvelleValeur: {
        moduleId: data.moduleId,
        intervenantId: data.intervenantId,
        dateDebut: data.dateDebut,
        dateFin: data.dateFin,
      },
      userId: currentUserId,
      userName: currentUserName,
    });

    return evaluation;
  }

  async update(
    id: string,
    data: UpdateEvaluationDto,
    currentUserId?: string,
    currentUserName?: string,
  ) {
    const oldEvaluation = await this.findOne(id);

    const updateData: Prisma.EvaluationEnseignementUpdateInput = {
      ...(data.moduleId && { module: { connect: { id: data.moduleId } } }),
      ...(data.intervenantId && {
        intervenant: { connect: { id: data.intervenantId } },
      }),
      ...(data.nombreInvitations !== undefined && {
        nombreInvitations: data.nombreInvitations,
      }),
      ...(data.statut && { statut: data.statut }),
      ...(data.dateDebut && { dateDebut: new Date(data.dateDebut) }),
      ...(data.dateFin && { dateFin: new Date(data.dateFin) }),
    };

    const updatedEvaluation = await this.prisma.evaluationEnseignement.update({
      where: { id },
      data: updateData,
    });

    await this.journalService.log({
      action: 'MODIFICATION',
      entite: 'Evaluation',
      entiteId: id,
      description: `Modification de l'évaluation pour le module ${oldEvaluation.module.code}`,
      ancienneValeur: { statut: oldEvaluation.statut },
      nouvelleValeur: { statut: updatedEvaluation.statut },
      userId: currentUserId,
      userName: currentUserName,
    });

    return updatedEvaluation;
  }

  async submitResponse(lienEvaluation: string, responses: SubmitResponseDto) {
    const evaluation = await this.findByLien(lienEvaluation);

    // Mettre à jour les notes
    const updated = await this.prisma.evaluationEnseignement.update({
      where: { id: evaluation.id },
      data: {
        nombreReponses: { increment: 1 },
        noteQualiteCours: responses.noteQualiteCours,
        noteQualitePedagogie: responses.noteQualitePedagogie,
        noteDisponibilite: responses.noteDisponibilite,
        commentaires: responses.commentaires,
      },
    });

    await this.journalService.log({
      action: 'MODIFICATION',
      entite: 'Evaluation',
      entiteId: evaluation.id,
      description: `Nouvelle réponse soumise pour l'évaluation du module ${evaluation.module.code}`,
      nouvelleValeur: { nombreReponses: updated.nombreReponses },
    });

    return { message: 'Réponse enregistrée avec succès', evaluation: updated };
  }

  async remove(id: string, currentUserId?: string, currentUserName?: string) {
    const evaluation = await this.findOne(id);
    await this.prisma.evaluationEnseignement.delete({ where: { id } });

    await this.journalService.log({
      action: 'SUPPRESSION',
      entite: 'Evaluation',
      entiteId: id,
      description: `Suppression de l'évaluation pour le module ${evaluation.module.code}`,
      ancienneValeur: {
        moduleId: evaluation.moduleId,
        intervenantId: evaluation.intervenantId,
      },
      userId: currentUserId,
      userName: currentUserName,
    });

    return { message: 'Évaluation supprimée avec succès' };
  }
}
