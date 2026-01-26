import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      usersCount,
      programmesCount,
      modulesCount,
      seancesCount,
      intervenantsCount,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.programme.count(),
      this.prisma.module.count(),
      this.prisma.seance.count(),
      this.prisma.intervenant.count(),
    ]);

    // Stats par statut
    const programmesByStatus = await this.prisma.programme.groupBy({
      by: ['status'],
      _count: true,
    });

    const seancesByStatus = await this.prisma.seance.groupBy({
      by: ['status'],
      _count: true,
    });

    // Progression moyenne
    const programmes = await this.prisma.programme.findMany({
      select: { progression: true },
    });
    const avgProgression = programmes.length > 0
      ? programmes.reduce((sum, p) => sum + p.progression, 0) / programmes.length
      : 0;

    return {
      counts: {
        users: usersCount,
        programmes: programmesCount,
        modules: modulesCount,
        seances: seancesCount,
        intervenants: intervenantsCount,
      },
      programmesByStatus: programmesByStatus.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {}),
      seancesByStatus: seancesByStatus.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {}),
      avgProgression,
    };
  }

  async getIntervenantsStats() {
    const intervenants = await this.prisma.intervenant.findMany({
      include: {
        _count: {
          select: { modules: true, seances: true },
        },
      },
    });

    const disponibles = intervenants.filter(i => i.disponible).length;
    const avecModules = intervenants.filter(i => i._count.modules > 0).length;

    return {
      total: intervenants.length,
      disponibles,
      indisponibles: intervenants.length - disponibles,
      avecModules,
      sansModules: intervenants.length - avecModules,
      details: intervenants.map(i => ({
        id: i.id,
        nom: `${i.prenom} ${i.nom}`,
        disponible: i.disponible,
        modulesCount: i._count.modules,
        seancesCount: i._count.seances,
      })),
    };
  }
}
