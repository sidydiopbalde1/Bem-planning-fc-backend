import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoordinateurService {
  constructor(private prisma: PrismaService) {}

  async getProgrammes(
    userId: string,
    role: string,
    filters: { search?: string; status?: string; semestre?: string },
    pagination: { page?: number; limit?: number } = {},
  ) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Les coordinateurs ne voient que leurs programmes
    if (role === 'COORDINATOR') {
      where.userId = userId;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { code: { contains: filters.search, mode: 'insensitive' } },
        { niveau: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.semestre) {
      where.semestre = filters.semestre;
    }

    const [programmes, total] = await Promise.all([
      this.prisma.programme.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              modules: true,
              activitesAcademiques: true,
              indicateursAcademiques: true,
            },
          },
        },
        orderBy: [{ status: 'asc' }, { dateDebut: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.programme.count({ where }),
    ]);

    // Calculer les statistiques
    const stats = {
      total,
      parStatut: await this.prisma.programme.groupBy({
        by: ['status'],
        where,
        _count: { status: true },
      }),
      progressionMoyenne:
        programmes.length > 0
          ? Math.round(
              programmes.reduce((sum, p) => sum + p.progression, 0) /
                programmes.length,
            )
          : 0,
      enRetard: programmes.filter((p) => {
        if (p.status === 'TERMINE') return false;
        const now = new Date();
        const fin = new Date(p.dateFin);
        return now > fin && p.progression < 100;
      }).length,
    };

    return {
      programmes,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getDashboard(userId: string, role: string) {
    const where = role === 'COORDINATOR' ? { userId } : {};

    // Stats programmes
    const programmes = await this.prisma.programme.findMany({ where });
    const programmesStats = {
      total: programmes.length,
      enCours: programmes.filter(p => p.status === 'EN_COURS').length,
      termines: programmes.filter(p => p.status === 'TERMINE').length,
      planifies: programmes.filter(p => p.status === 'PLANIFIE').length,
      progressionMoyenne: programmes.length > 0
        ? programmes.reduce((sum, p) => sum + p.progression, 0) / programmes.length
        : 0,
    };

    // Stats modules
    const modules = await this.prisma.module.findMany({
      where: where.userId ? { programme: { userId: where.userId } } : {},
      include: { intervenant: true },
    });
    const modulesStats = {
      total: modules.length,
      enCours: modules.filter(m => m.status === 'EN_COURS').length,
      termines: modules.filter(m => m.status === 'TERMINE').length,
      avecIntervenant: modules.filter(m => m.intervenantId).length,
      sansIntervenant: modules.filter(m => !m.intervenantId).length,
      totalVHT: modules.reduce((sum, m) => sum + m.vht, 0),

    };

    // Programmes en retard
    const now = new Date();
    const programmesEnRetard = programmes
      .filter(p => p.dateFin < now && p.progression < 100)
      .slice(0, 10)
      .map(p => ({
        id: p.id,
        code: p.code,
        name: p.name,
        progression: p.progression,
        dateFin: p.dateFin,
      }));

    // Modules sans intervenant
    const modulesSansIntervenant = modules
      .filter(m => !m.intervenantId)
      .slice(0, 10)
      .map(m => ({
        id: m.id,
        code: m.code,
        name: m.name,
        vht: m.vht,
        status: m.status,
      }));

    // Activité récente
    const recentActivity = await this.prisma.journalActivite.findMany({
      where: where.userId ? { userId: where.userId } : {},
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return {
      programmesStats,
      modulesStats,
      programmesEnRetard,
      modulesSansIntervenant,
      recentActivity,
    };
  }

  async getModules(
    userId: string,
    role: string,
    filters: { search?: string; status?: string; programmeId?: string },
    pagination: { page?: number; limit?: number } = {},
  ) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Les coordinateurs ne voient que les modules de leurs programmes
    if (role === 'COORDINATOR') {
      where.programme = { userId };
    }

    // Filtrer par programme si spécifié
    if (filters.programmeId) {
      where.programmeId = filters.programmeId;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { code: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.status) {
      where.status = filters.status;
    }

    const [modules, total] = await Promise.all([
      this.prisma.module.findMany({
        where,
        include: {
          programme: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
          intervenant: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              email: true,
            },
          },
          _count: {
            select: {
              seances: true,
            },
          },
        },
        orderBy: { code: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.module.count({ where }),
    ]);

    return {
      modules,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async checkAlerts(userId: string, role: string) {
    const now = new Date();
    const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const where = role === 'COORDINATOR' ? { userId } : {};

    // Programmes en retard
    const programmesEnRetard = await this.prisma.programme.findMany({
      where: {
        ...where,
        status: { not: 'TERMINE' },
        dateFin: { lt: now },
        progression: { lt: 100 },
      },
    });

    // Modules sans intervenant qui débutent bientôt
    const modulesSansIntervenant = await this.prisma.module.findMany({
      where: {
        ...(where.userId && { programme: { userId: where.userId } }),
        intervenantId: null,
        dateDebut: { lte: sevenDays },
      },
      include: { programme: { select: { name: true } } },
    });

    // Modules débutant dans 7 jours
    const modulesProchains = await this.prisma.module.findMany({
      where: {
        ...(where.userId && { programme: { userId: where.userId } }),
        dateDebut: { gte: now, lte: sevenDays },
      },
      include: {
        programme: { select: { name: true } },
        intervenant: { select: { nom: true, prenom: true } },
      },
    });

    return {
      programmesEnRetard: {
        count: programmesEnRetard.length,
        items: programmesEnRetard,
      },
      modulesSansIntervenant: {
        count: modulesSansIntervenant.length,
        items: modulesSansIntervenant,
      },
      modulesProchains: {
        count: modulesProchains.length,
        items: modulesProchains,
      },
      totalAlerts: programmesEnRetard.length + modulesSansIntervenant.length,
    };
  }
}
