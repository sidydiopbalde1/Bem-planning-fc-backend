import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Statistiques globales du système
   */
  async getGlobalStatistics(userId: string, role: string) {
    const userFilter = role === 'COORDINATOR' ? { userId } : {};
    const moduleUserFilter = role === 'COORDINATOR' ? { module: { userId } } : {};

    const [
      totalProgrammes,
      totalModules,
      totalIntervenants,
      totalSeances,
      programmesEnCours,
      seancesTerminees,
      conflitsNonResolus,
      intervenantsDisponibles,
    ] = await Promise.all([
      this.prisma.programme.count({ where: userFilter }),
      this.prisma.module.count({ where: userFilter }),
      this.prisma.intervenant.count(),
      this.prisma.seance.count({ where: moduleUserFilter }),
      this.prisma.programme.count({
        where: { ...userFilter, status: 'EN_COURS' },
      }),
      this.prisma.seance.count({
        where: { ...moduleUserFilter, status: 'TERMINE' },
      }),
      this.prisma.conflit.count({ where: { resolu: false } }),
      this.prisma.intervenant.count({ where: { disponible: true } }),
    ]);

    // Calcul des heures totales planifiées
    const heuresPlanifiees = await this.prisma.seance.aggregate({
      where: { ...moduleUserFilter, status: { not: 'ANNULE' } },
      _sum: { duree: true },
    });

    // Progression moyenne des programmes
    const progressionMoyenne = await this.prisma.programme.aggregate({
      where: userFilter,
      _avg: { progression: true },
    });

    // Nouveaux éléments ce mois
    const debutMois = new Date();
    debutMois.setDate(1);
    debutMois.setHours(0, 0, 0, 0);

    const [
      nouveauxProgrammes,
      nouveauxModules,
      nouveauxIntervenants,
      nouvellesSeances,
    ] = await Promise.all([
      this.prisma.programme.count({
        where: {
          ...userFilter,
          createdAt: { gte: debutMois },
        },
      }),
      this.prisma.module.count({
        where: {
          ...userFilter,
          createdAt: { gte: debutMois },
        },
      }),
      this.prisma.intervenant.count({
        where: {
          createdAt: { gte: debutMois },
        },
      }),
      this.prisma.seance.count({
        where: {
          ...moduleUserFilter,
          createdAt: { gte: debutMois },
        },
      }),
    ]);

    const nouveauxCeMois = {
      programmes: nouveauxProgrammes,
      modules: nouveauxModules,
      intervenants: nouveauxIntervenants,
      seances: nouvellesSeances,
    };

    return {
      type: 'global',
      statistics: {
        totaux: {
          programmes: totalProgrammes,
          modules: totalModules,
          intervenants: totalIntervenants,
          seances: totalSeances,
        },
        activite: {
          programmesEnCours,
          seancesTerminees,
          tauxCompletion:
            totalSeances > 0
              ? Math.round((seancesTerminees / totalSeances) * 100)
              : 0,
        },
        heures: {
          totalPlanifie: Math.round((heuresPlanifiees._sum.duree || 0) / 60),
          totalRealise: Math.round((seancesTerminees * 120) / 60),
        },
        qualite: {
          conflitsEnAttente: conflitsNonResolus,
          progressionMoyenne: Math.round(
            progressionMoyenne._avg.progression || 0,
          ),
        },
        intervenants: {
          total: totalIntervenants,
          disponibles: intervenantsDisponibles,
          tauxDisponibilite:
            totalIntervenants > 0
              ? Math.round((intervenantsDisponibles / totalIntervenants) * 100)
              : 100,
        },
        nouveauxCeMois,
      },
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Statistiques détaillées par intervenant
   */
  async getIntervenantsStatistics(
    userId: string,
    role: string,
    startDate?: string,
    endDate?: string,
  ) {
    const userFilter = role === 'COORDINATOR' ? { userId } : {};
    const dateFilters: any = {};
    if (startDate) dateFilters.gte = new Date(startDate);
    if (endDate) dateFilters.lte = new Date(endDate);

    const intervenants = await this.prisma.intervenant.findMany({
      include: {
        modules: {
          where: userFilter,
          select: { id: true, name: true, vht: true },
        },
        seances: {
          where: {
            module: userFilter,
            ...(startDate || endDate ? { dateSeance: dateFilters } : {}),
          },
          select: {
            id: true,
            duree: true,
            status: true,
            typeSeance: true,
            dateSeance: true,
          },
        },
      },
    });

    const statistiquesIntervenants = intervenants.map((intervenant) => {
      const totalHeures =
        intervenant.seances.reduce((acc, s) => acc + (s.duree || 0), 0) / 60;
      const seancesTerminees = intervenant.seances.filter(
        (s) => s.status === 'TERMINE',
      ).length;
      const seancesTotal = intervenant.seances.length;

      const repartitionTypes = intervenant.seances.reduce(
        (acc, s) => {
          acc[s.typeSeance] = (acc[s.typeSeance] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      const chargeHebdo = this.calculateWeeklyLoad(intervenant.seances);

      return {
        id: intervenant.id,
        nom: `${intervenant.civilite} ${intervenant.prenom} ${intervenant.nom}`,
        email: intervenant.email,
        grade: intervenant.grade,
        specialite: intervenant.specialite,
        disponible: intervenant.disponible,
        statistiques: {
          modulesAssignes: intervenant.modules.length,
          totalSeances: seancesTotal,
          seancesTerminees,
          totalHeures: Math.round(totalHeures * 10) / 10,
          tauxRealisation:
            seancesTotal > 0
              ? Math.round((seancesTerminees / seancesTotal) * 100)
              : 0,
          chargeHebdomadaireMoyenne: chargeHebdo,
          repartitionTypes,
        },
        indicateurs: {
          surcharge: chargeHebdo > 20,
          sousUtilise: chargeHebdo < 5 && intervenant.disponible,
          efficacite:
            seancesTotal > 0
              ? Math.round((seancesTerminees / seancesTotal) * 100)
              : 0,
        },
      };
    });

    statistiquesIntervenants.sort(
      (a, b) => b.statistiques.totalHeures - a.statistiques.totalHeures,
    );

    return {
      type: 'intervenants',
      statistics: {
        intervenants: statistiquesIntervenants,
        resume: {
          totalIntervenants: intervenants.length,
          disponibles: intervenants.filter((i) => i.disponible).length,
          enSurcharge: statistiquesIntervenants.filter(
            (i) => i.indicateurs.surcharge,
          ).length,
          sousUtilises: statistiquesIntervenants.filter(
            (i) => i.indicateurs.sousUtilise,
          ).length,
          chargeGlobaleMoyenne:
            statistiquesIntervenants.length > 0
              ? Math.round(
                  (statistiquesIntervenants.reduce(
                    (acc, i) => acc + i.statistiques.chargeHebdomadaireMoyenne,
                    0,
                  ) /
                    statistiquesIntervenants.length) *
                    10,
                ) / 10
              : 0,
        },
      },
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Statistiques par programme
   */
  async getProgrammesStatistics(userId: string, role: string) {
    const userFilter = role === 'COORDINATOR' ? { userId } : {};

    const programmes = await this.prisma.programme.findMany({
      where: userFilter,
      include: {
        modules: {
          include: {
            seances: {
              select: {
                id: true,
                duree: true,
                status: true,
                typeSeance: true,
              },
            },
            intervenant: {
              select: { nom: true, prenom: true },
            },
          },
        },
      },
    });

    const statistiquesProgrammes = programmes.map((programme) => {
      const totalModules = programme.modules.length;
      const modulesTermines = programme.modules.filter(
        (m) => m.status === 'TERMINE',
      ).length;

      const totalSeances = programme.modules.reduce(
        (acc, m) => acc + m.seances.length,
        0,
      );
      const seancesTerminees = programme.modules.reduce(
        (acc, m) =>
          acc + m.seances.filter((s) => s.status === 'TERMINE').length,
        0,
      );

      const heuresPlanifiees =
        programme.modules.reduce(
          (acc, m) =>
            acc + m.seances.reduce((a, s) => a + (s.duree || 0), 0),
          0,
        ) / 60;

      const heuresRealisees =
        programme.modules.reduce(
          (acc, m) =>
            acc +
            m.seances
              .filter((s) => s.status === 'TERMINE')
              .reduce((a, s) => a + (s.duree || 0), 0),
          0,
        ) / 60;

      const intervenants = [
        ...new Set(
          programme.modules
            .filter((m) => m.intervenant)
            .map((m) => `${m.intervenant!.prenom} ${m.intervenant!.nom}`),
        ),
      ];

      const estEnRetard =
        programme.dateFin < new Date() &&
        programme.status !== 'TERMINE' &&
        programme.status !== 'ANNULE';

      return {
        id: programme.id,
        nom: programme.name,
        code: programme.code,
        niveau: programme.niveau,
        semestre: programme.semestre,
        status: programme.status,
        progression: programme.progression,
        dates: {
          debut: programme.dateDebut,
          fin: programme.dateFin,
          enRetard: estEnRetard,
        },
        statistiques: {
          modules: {
            total: totalModules,
            termines: modulesTermines,
            tauxCompletion:
              totalModules > 0
                ? Math.round((modulesTermines / totalModules) * 100)
                : 0,
          },
          seances: {
            total: totalSeances,
            terminees: seancesTerminees,
            tauxRealisation:
              totalSeances > 0
                ? Math.round((seancesTerminees / totalSeances) * 100)
                : 0,
          },
          heures: {
            planifiees: Math.round(heuresPlanifiees * 10) / 10,
            realisees: Math.round(heuresRealisees * 10) / 10,
            restantes: Math.round((heuresPlanifiees - heuresRealisees) * 10) / 10,
          },
          intervenants: intervenants.length,
        },
        intervenantsAssignes: intervenants,
      };
    });

    const resume = {
      totalProgrammes: programmes.length,
      parStatus: programmes.reduce(
        (acc, p) => {
          acc[p.status] = (acc[p.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
      enRetard: statistiquesProgrammes.filter((p) => p.dates.enRetard).length,
      progressionMoyenne: Math.round(
        statistiquesProgrammes.reduce((acc, p) => acc + p.progression, 0) /
          (statistiquesProgrammes.length || 1),
      ),
    };

    return {
      type: 'programmes',
      statistics: {
        programmes: statistiquesProgrammes,
        resume,
      },
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Statistiques de planning (vue temporelle)
   */
  async getPlanningStatistics(
    userId: string,
    role: string,
    startDate?: string,
    endDate?: string,
  ) {
    const userFilter = role === 'COORDINATOR' ? { module: { userId } } : {};
    const debut = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const fin = endDate ? new Date(endDate) : new Date();

    const seances = await this.prisma.seance.findMany({
      where: {
        ...userFilter,
        dateSeance: { gte: debut, lte: fin },
      },
      include: {
        module: { select: { name: true, code: true } },
        intervenant: { select: { nom: true, prenom: true } },
      },
      orderBy: { dateSeance: 'asc' },
    });

    const parJourSemaine = [0, 0, 0, 0, 0, 0, 0];
    const joursNom = [
      'Dimanche',
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi',
      'Samedi',
    ];

    const parType: Record<string, number> = {};
    const parStatus: Record<string, number> = {};
    const parSemaine: Record<string, { seances: number; heures: number }> = {};

    seances.forEach((seance) => {
      const jour = new Date(seance.dateSeance).getDay();
      parJourSemaine[jour]++;

      parType[seance.typeSeance] = (parType[seance.typeSeance] || 0) + 1;
      parStatus[seance.status] = (parStatus[seance.status] || 0) + 1;

      const semaineKey = this.getWeekKey(new Date(seance.dateSeance));
      if (!parSemaine[semaineKey]) {
        parSemaine[semaineKey] = { seances: 0, heures: 0 };
      }
      parSemaine[semaineKey].seances++;
      parSemaine[semaineKey].heures += (seance.duree || 0) / 60;
    });

    const distributionJours = joursNom.map((nom, index) => ({
      jour: nom,
      nombreSeances: parJourSemaine[index],
      pourcentage:
        seances.length > 0
          ? Math.round((parJourSemaine[index] / seances.length) * 100)
          : 0,
    }));

    const joursOuvrables = this.calculateWorkingDays(debut, fin);

    return {
      type: 'planning',
      statistics: {
        periode: { debut, fin },
        totalSeances: seances.length,
        distributions: {
          parJourSemaine: distributionJours.filter((d) => d.nombreSeances > 0),
          parType,
          parStatus,
          parSemaine: Object.entries(parSemaine).map(([semaine, data]) => ({
            semaine,
            ...data,
            heures: Math.round(data.heures * 10) / 10,
          })),
        },
        moyennes: {
          seancesParJour: Math.round((seances.length / joursOuvrables) * 10) / 10,
          heuresParSemaine:
            Object.values(parSemaine).length > 0
              ? Math.round(
                  (Object.values(parSemaine).reduce((acc, s) => acc + s.heures, 0) /
                    Object.values(parSemaine).length) *
                    10,
                ) / 10
              : 0,
        },
      },
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Indicateurs de performance (KPI)
   */
  async getPerformanceIndicators(userId: string, role: string) {
    const userFilter = role === 'COORDINATOR' ? { userId } : {};
    const moduleUserFilter =
      role === 'COORDINATOR' ? { module: { userId } } : {};

    const now = new Date();
    const debutMois = new Date(now.getFullYear(), now.getMonth(), 1);
    const debutSemaine = this.getStartOfWeek(now);

    const [seancesMois, seancesSemaine, conflitsMois, programmesActifs] =
      await Promise.all([
        this.prisma.seance.count({
          where: {
            ...moduleUserFilter,
            dateSeance: { gte: debutMois },
            status: 'TERMINE',
          },
        }),
        this.prisma.seance.count({
          where: {
            ...moduleUserFilter,
            dateSeance: { gte: debutSemaine },
            status: 'TERMINE',
          },
        }),
        this.prisma.conflit.count({
          where: { createdAt: { gte: debutMois } },
        }),
        this.prisma.programme.count({
          where: { ...userFilter, status: 'EN_COURS' },
        }),
      ]);

    const seancesPlanifieesMois = await this.prisma.seance.count({
      where: {
        ...moduleUserFilter,
        dateSeance: { gte: debutMois, lte: now },
        status: { not: 'ANNULE' },
      },
    });

    const heuresMois = await this.prisma.seance.aggregate({
      where: {
        ...moduleUserFilter,
        dateSeance: { gte: debutMois },
        status: 'TERMINE',
      },
      _sum: { duree: true },
    });

    const alertes = this.generatePerformanceAlerts(
      seancesMois,
      conflitsMois,
      programmesActifs,
    );

    return {
      type: 'performance',
      statistics: {
        periode: {
          mois: now.toLocaleDateString('fr-FR', {
            month: 'long',
            year: 'numeric',
          }),
          semaineCourante: `Semaine du ${debutSemaine.toLocaleDateString('fr-FR')}`,
        },
        kpi: {
          tauxRealisation:
            seancesPlanifieesMois > 0
              ? Math.round((seancesMois / seancesPlanifieesMois) * 100)
              : 100,
          seancesRealiseesMois: seancesMois,
          seancesRealiseesSemaine: seancesSemaine,
          heuresRealiseesMois: Math.round((heuresMois._sum.duree || 0) / 60),
          conflitsGeneres: conflitsMois,
          programmesActifs,
        },
        tendances: {
          rythmeHebdomadaire: seancesSemaine,
          objectifMensuel: 40,
          progressionObjectif: Math.round((seancesMois / 40) * 100),
        },
        alertes,
      },
      generatedAt: new Date().toISOString(),
    };
  }

  // Fonctions utilitaires
  private calculateWeeklyLoad(
    seances: Array<{ duree: number; dateSeance: Date }>,
  ): number {
    if (seances.length === 0) return 0;

    const semaines = new Set<string>();
    let totalHeures = 0;

    seances.forEach((seance) => {
      semaines.add(this.getWeekKey(new Date(seance.dateSeance)));
      totalHeures += (seance.duree || 0) / 60;
    });

    return semaines.size > 0
      ? Math.round((totalHeures / semaines.size) * 10) / 10
      : 0;
  }

  private calculateWorkingDays(start: Date, end: Date): number {
    let count = 0;
    const current = new Date(start);

    while (current <= end) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) count++;
      current.setDate(current.getDate() + 1);
    }

    return count || 1;
  }

  private getWeekKey(date: Date): string {
    const start = this.getStartOfWeek(date);
    return start.toISOString().split('T')[0];
  }

  private getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  private generatePerformanceAlerts(
    seancesMois: number,
    conflits: number,
    programmesActifs: number,
  ) {
    const alertes: Array<{
      type: string;
      message: string;
      suggestion: string;
    }> = [];

    if (seancesMois < 10) {
      alertes.push({
        type: 'WARNING',
        message: 'Faible activité ce mois-ci',
        suggestion: 'Planifier davantage de séances',
      });
    }

    if (conflits > 5) {
      alertes.push({
        type: 'ERROR',
        message: `${conflits} conflits générés ce mois`,
        suggestion: 'Vérifier la planification des intervenants',
      });
    }

    if (programmesActifs === 0) {
      alertes.push({
        type: 'INFO',
        message: 'Aucun programme en cours',
        suggestion: 'Démarrer un nouveau programme',
      });
    }

    return alertes;
  }
}
