import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JournalService } from '../journal/journal.service';

export interface SlotSuggestion {
  date: string;
  jourSemaine: string;
  heureDebut: string;
  heureFin: string;
  duree: number;
  periode: string;
  score: number;
  recommandation: string;
}

@Injectable()
export class PlanningService {
  private readonly creneaux = [
    { debut: '08:00', fin: '10:00', periode: 'matin' },
    { debut: '10:15', fin: '12:15', periode: 'matin' },
    { debut: '14:00', fin: '16:00', periode: 'apres-midi' },
    { debut: '16:15', fin: '18:15', periode: 'apres-midi' },
  ];

  constructor(
    private prisma: PrismaService,
    private journalService: JournalService,
  ) {}

  async getSuggestedSlots(filters: {
    moduleId?: string;
    intervenantId?: string;
    startDate: string;
    endDate?: string;
    duree?: number;
    limit?: number;
  }) {
    const { moduleId, intervenantId, startDate, endDate, duree = 120, limit = 20 } = filters;

    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);

    const suggestions: SlotSuggestion[] = [];
    let currentDate = new Date(start);

    while (currentDate <= end && suggestions.length < limit) {
      const dayOfWeek = currentDate.getDay();

      // Ignorer weekends
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        for (const creneau of this.creneaux) {
          // Vérifier disponibilité intervenant
          const intervenantOccupe = intervenantId ? await this.isIntervenantOccupe(
            intervenantId,
            currentDate,
            creneau.debut,
            creneau.fin,
          ) : false;

          if (!intervenantOccupe) {
            const score = this.calculateScore(currentDate, creneau, suggestions.length);

            suggestions.push({
              date: currentDate.toISOString().split('T')[0],
              jourSemaine: this.getJourSemaine(dayOfWeek),
              heureDebut: creneau.debut,
              heureFin: creneau.fin,
              duree,
              periode: creneau.periode,
              score,
              recommandation: score >= 80 ? 'Fortement recommandé' :
                             score >= 60 ? 'Recommandé' : 'Acceptable',
            });
          }
        }
      }

      currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    }

    // Trier par score décroissant
    suggestions.sort((a, b) => b.score - a.score);

    return {
      suggestions: suggestions.slice(0, limit),
      metadata: {
        moduleId,
        intervenantId,
        periode: { start: startDate, end: end.toISOString().split('T')[0] },
        totalSuggestions: suggestions.length,
      },
    };
  }

  async generateAutoPlanning(data: {
    moduleId: string;
    intervenantId: string;
    startDate: string;
    endDate?: string;
  }, currentUserId?: string, currentUserName?: string) {
    const module = await this.prisma.module.findUnique({
      where: { id: data.moduleId },
    });

    if (!module) {
      throw new Error('Module non trouvé');
    }

    // Récupérer les heures à planifier
    const heuresRestantes = module.vht - (module.progression * module.vht / 100);

    // Obtenir les suggestions
    const { suggestions } = await this.getSuggestedSlots({
      ...data,
      limit: Math.ceil(heuresRestantes / 2), // 2h par séance en moyenne
    });

    const result = {
      module,
      heuresRestantes,
      suggestions,
      seancesProposees: suggestions.length,
    };

    await this.journalService.log({
      action: 'PLANIFICATION_AUTO',
      entite: 'Planning',
      entiteId: data.moduleId,
      description: `Génération automatique de planning pour le module ${module.code} - ${suggestions.length} créneaux proposés`,
      nouvelleValeur: { moduleId: data.moduleId, intervenantId: data.intervenantId, seancesProposees: suggestions.length },
      userId: currentUserId,
      userName: currentUserName,
    });

    return result;
  }

  private async isIntervenantOccupe(
    intervenantId: string,
    date: Date,
    heureDebut: string,
    heureFin: string,
  ): Promise<boolean> {
    const conflict = await this.prisma.seance.findFirst({
      where: {
        intervenantId,
        dateSeance: date,
        status: { not: 'ANNULE' },
        OR: [
          { heureDebut: { lte: heureDebut }, heureFin: { gt: heureDebut } },
          { heureDebut: { lt: heureFin }, heureFin: { gte: heureFin } },
        ],
      },
    });

    return !!conflict;
  }

  private calculateScore(date: Date, creneau: any, index: number): number {
    let score = 100;

    // Bonus matin
    if (creneau.periode === 'matin') score += 10;

    // Bonus mardi/jeudi
    const day = date.getDay();
    if (day === 2 || day === 4) score += 5;

    // Malus pour dates plus éloignées
    score -= Math.floor(index / 4) * 2;

    return Math.max(0, Math.min(100, score));
  }

  private getJourSemaine(day: number): string {
    const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return jours[day];
  }
}
