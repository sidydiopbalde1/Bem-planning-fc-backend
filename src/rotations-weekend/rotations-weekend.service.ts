import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JournalService } from '../journal/journal.service';
import { PaginationDto } from '../common/dto';
import { StatutRotation } from '@prisma/client';

@Injectable()
export class RotationsWeekendService {
  constructor(
    private prisma: PrismaService,
    private journalService: JournalService,
  ) {}

  async findAll(pagination: PaginationDto, filters: any) {
    const { skip, take, sortBy, sortOrder } = pagination;
    const where: any = {};

    if (filters.annee) where.annee = parseInt(filters.annee);
    if (filters.responsableId) where.responsableId = filters.responsableId;
    if (filters.status) where.status = filters.status;

    const [rotations, total] = await Promise.all([
      this.prisma.rotationWeekend.findMany({
        where,
        skip,
        take,
        include: {
          responsable: { select: { id: true, name: true, email: true } },
          substitut: { select: { id: true, name: true, email: true } },
        },
        orderBy: sortBy ? { [sortBy]: sortOrder } : { dateDebut: 'desc' },
      }),
      this.prisma.rotationWeekend.count({ where }),
    ]);
    const limit = pagination.limit ?? 20;
    // Stats
    const stats = {
      total,
      termines: rotations.filter(r => r.status === StatutRotation.TERMINE).length,
      absences: rotations.filter(r => r.status === StatutRotation.ABSENT).length,
      
    };  

    return {
      data: rotations,
      pagination: {
        page: pagination.page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats,
    };
  }

  async findOne(id: string) {
    const rotation = await this.prisma.rotationWeekend.findUnique({
      where: { id },
      include: {
        responsable: true,
        substitut: true,
        rapportSupervision: true,
      },
    });

    if (!rotation) {
      throw new NotFoundException('Rotation non trouvée');
    }

    return rotation;
  }

  async generateRotations(nbSemaines: number, dateDebut?: Date, currentUserId?: string, currentUserName?: string) {
    const start = dateDebut || this.getProchainSamedi(new Date());
    const responsables = await this.prisma.user.findMany({
      where: { role: 'COORDINATOR' },
    });

    if (responsables.length === 0) {
      throw new Error('Aucun coordinateur disponible');
    }

    const rotations: any[] = [];
    let currentDate = new Date(start);
    let responsableIndex = 0;

    for (let i = 0; i < nbSemaines; i++) {
      const rotationDateDebut = new Date(currentDate);
      const dateFin = new Date(currentDate);
      dateFin.setDate(dateFin.getDate() + 1);

      const semaineNumero = this.getWeekNumber(currentDate);
      const annee = currentDate.getFullYear();

      const rotation = await this.prisma.rotationWeekend.create({
        data: {
          dateDebut: rotationDateDebut,
          dateFin,
          semaineNumero,
          annee,
          responsableId: responsables[responsableIndex].id,
          status: StatutRotation.PLANIFIE,
        },
        include: {
          responsable: { select: { id: true, name: true, email: true } },
        },
      });

      rotations.push(rotation);

      // Prochaine semaine
      currentDate.setDate(currentDate.getDate() + 7);
      responsableIndex = (responsableIndex + 1) % responsables.length;
    }

    await this.journalService.log({
      action: 'CREATION',
      entite: 'RotationWeekend',
      entiteId: 'batch',
      description: `Génération de ${rotations.length} rotations weekend à partir du ${start.toLocaleDateString('fr-FR')}`,
      nouvelleValeur: { nbSemaines, dateDebut: start, total: rotations.length },
      userId: currentUserId,
      userName: currentUserName,
    });

    return { rotations, total: rotations.length };
  }

  async declareAbsence(id: string, raison: string, currentUserId?: string, currentUserName?: string) {
    const rotation = await this.findOne(id);

    // Trouver un remplaçant
    const remplacant = await this.prisma.user.findFirst({
      where: {
        role: 'COORDINATOR',
        id: { not: rotation.responsableId },
      },
    });

    if (!remplacant) {
      throw new Error('Aucun remplaçant disponible');
    }

    // Mettre à jour la rotation - use commentaire and estAbsence instead of raisonAbsence
    const updated = await this.prisma.rotationWeekend.update({
      where: { id },
      data: {
        status: StatutRotation.ABSENT,
        commentaire: raison,
        estAbsence: true,
        substitutId: rotation.responsableId,
        responsableId: remplacant.id,
      },
      include: {
        responsable: true,
        substitut: true,
      },
    });

    await this.journalService.log({
      action: 'MODIFICATION',
      entite: 'RotationWeekend',
      entiteId: id,
      description: `Déclaration d'absence pour la rotation du ${rotation.dateDebut.toLocaleDateString('fr-FR')} - Remplaçant: ${remplacant.name}`,
      ancienneValeur: { status: rotation.status, responsableId: rotation.responsableId },
      nouvelleValeur: { status: StatutRotation.ABSENT, responsableId: remplacant.id, raison },
      userId: currentUserId,
      userName: currentUserName,
    });

    return updated;
  }

  async terminerRotation(id: string, rapportData?: any, currentUserId?: string, currentUserName?: string) {
    const rotation = await this.findOne(id);

    const status = rapportData ? StatutRotation.TERMINE : StatutRotation.TERMINE_SANS_RAPPORT;

    const updated = await this.prisma.rotationWeekend.update({
      where: { id },
      data: { status },
    });

    if (rapportData) {
      await this.prisma.rapportSupervision.create({
        data: {
          rotationId: id,
          ...rapportData,
        },
      });
    }

    await this.journalService.log({
      action: 'MODIFICATION',
      entite: 'RotationWeekend',
      entiteId: id,
      description: `Rotation du ${rotation.dateDebut.toLocaleDateString('fr-FR')} terminée ${rapportData ? 'avec' : 'sans'} rapport`,
      ancienneValeur: { status: rotation.status },
      nouvelleValeur: { status, avecRapport: !!rapportData },
      userId: currentUserId,
      userName: currentUserName,
    });

    return updated;
  }

  private getProchainSamedi(date: Date): Date {
    const result = new Date(date);
    const day = result.getDay();
    const daysUntilSaturday = (6 - day + 7) % 7 || 7;
    result.setDate(result.getDate() + daysUntilSaturday);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }
}
