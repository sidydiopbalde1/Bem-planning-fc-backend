import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JournalService } from '../journal/journal.service';
import { PaginationDto } from '../common/dto';
import { StatusProgramme } from '@prisma/client';

export interface Alert {
  type: string;
  message: string;
}

@Injectable()
export class ProgrammesService {
  constructor(
    private prisma: PrismaService,
    private journalService: JournalService,
  ) {}

  async findAll(userId: string, role: string, pagination: PaginationDto, filters?: any) {
    const { skip, take, search, sortBy, sortOrder } = pagination;

    const where: any = {};

    // Coordinateur voit uniquement ses programmes
    if (role === 'COORDINATOR') {
      where.userId = userId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (filters?.status) where.status = filters.status;
    if (filters?.semestre) where.semestre = filters.semestre;

    const [programmes, total] = await Promise.all([
      this.prisma.programme.findMany({
        where,
        skip,
        take,
        orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
        include: {
          modules: {
            include: {
              intervenant: { select: { id: true, nom: true, prenom: true } },
            },
          },
          _count: {
            select: { modules: true },
          },
        },
      }),
      this.prisma.programme.count({ where }),
    ]);

    // Calcul des alertes
    const programmesWithAlerts = programmes.map(p => {
      const alerts: Alert[] = [];
      const now = new Date();

      if (p.dateFin < now && p.progression < 100) {
        alerts.push({ type: 'RETARD', message: 'Programme en retard' });
      }

      const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      if (p.dateFin <= sevenDays && p.dateFin > now && p.progression < 100) {
        alerts.push({ type: 'ECHEANCE', message: 'Échéance proche' });
      }

      return { ...p, alerts };
    });

    const limit = pagination.limit ?? 20;

    return {
      data: programmesWithAlerts,
      pagination: {
        page: pagination.page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId?: string, role?: string) {
    const where: any = { id };

    if (role === 'COORDINATOR') {
      where.userId = userId;
    }

    const programme = await this.prisma.programme.findFirst({
      where,
      include: {
        modules: {
          include: {
            intervenant: true,
            seances: {
              orderBy: { dateSeance: 'asc' },
            },
          },
        },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!programme) {
      throw new NotFoundException('Programme non trouvé');
    }

    return programme;
  }

  async create(data: any, userId: string, userName?: string) {
    const existing = await this.prisma.programme.findUnique({
      where: { code: data.code },
    });

    if (existing) {
      throw new ConflictException('Un programme avec ce code existe déjà');
    }

    // Calcul VHT si modules fournis
    let calculatedVHT = 0;
    if (data.modules) {
      calculatedVHT = data.modules.reduce((sum: number, m: any) => {
        return sum + (m.cm || 0) + (m.td || 0) + (m.tp || 0) + (m.tpe || 0);
      }, 0);
    }

    // Extraire les champs à exclure du spread
    const { modules, vht, ...programmeData } = data;

    const programme = await this.prisma.programme.create({
      data: {
        ...programmeData,
        totalVHT: data.totalVHT || calculatedVHT,
        userId,
        modules: data.modules ? {
          create: data.modules.map((m: any) => ({
            ...m,
            vht: (m.cm || 0) + (m.td || 0) + (m.tp || 0) + (m.tpe || 0),
          })),
        } : undefined,
      },
      include: {
        modules: true,
      },
    });

    await this.journalService.log({
      action: 'CREATION',
      entite: 'Programme',
      entiteId: programme.id,
      description: `Création du programme ${programme.code} - ${programme.name}`,
      nouvelleValeur: { code: programme.code, name: programme.name, semestre: programme.semestre, totalVHT: programme.totalVHT },
      userId,
      userName,
    });

    return programme;
  }

  async update(id: string, data: any, userId: string, role: string, userName?: string) {
    const oldProgramme = await this.findOne(id, userId, role);

    if (data.code) {
      const existing = await this.prisma.programme.findFirst({
        where: { code: data.code, NOT: { id } },
      });

      if (existing) {
        throw new ConflictException('Un programme avec ce code existe déjà');
      }
    }

    const updatedProgramme = await this.prisma.programme.update({
      where: { id },
      data,
      include: { modules: true },
    });

    await this.journalService.log({
      action: 'MODIFICATION',
      entite: 'Programme',
      entiteId: id,
      description: `Modification du programme ${updatedProgramme.code} - ${updatedProgramme.name}`,
      ancienneValeur: { code: oldProgramme.code, name: oldProgramme.name, status: oldProgramme.status },
      nouvelleValeur: { code: updatedProgramme.code, name: updatedProgramme.name, status: updatedProgramme.status },
      userId,
      userName,
    });

    return updatedProgramme;
  }

  async remove(id: string, userId: string, role: string, userName?: string) {
    const programme = await this.findOne(id, userId, role);

    // Vérifier s'il y a des séances futures
    const seancesFutures = await this.prisma.seance.count({
      where: {
        module: { programmeId: id },
        dateSeance: { gt: new Date() },
        status: { not: 'ANNULE' },
      },
    });

    if (seancesFutures > 0) {
      throw new BadRequestException('Impossible de supprimer: ce programme a des séances futures');
    }

    await this.prisma.programme.delete({ where: { id } });

    await this.journalService.log({
      action: 'SUPPRESSION',
      entite: 'Programme',
      entiteId: id,
      description: `Suppression du programme ${programme.code} - ${programme.name}`,
      ancienneValeur: { code: programme.code, name: programme.name, semestre: programme.semestre },
      userId,
      userName,
    });

    return { message: 'Programme supprimé avec succès' };
  }

  async updateProgression(programmeId: string) {
    const modules = await this.prisma.module.findMany({
      where: { programmeId },
    });

    if (modules.length === 0) return;

    const avgProgression = modules.reduce((sum, m) => sum + m.progression, 0) / modules.length;

    let status: StatusProgramme = StatusProgramme.PLANIFIE;
    if (avgProgression >= 100) status = StatusProgramme.TERMINE;
    else if (avgProgression > 0) status = StatusProgramme.EN_COURS;

    await this.prisma.programme.update({
      where: { id: programmeId },
      data: { progression: avgProgression, status },
    });
  }
}
