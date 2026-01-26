import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Mapping des actions vers des couleurs et descriptions
const actionConfig = {
  CREATION: { color: 'green', verb: 'créé' },
  MODIFICATION: { color: 'blue', verb: 'modifié' },
  SUPPRESSION: { color: 'red', verb: 'supprimé' },
  CONNEXION: { color: 'purple', verb: 'connecté' },
  DECONNEXION: { color: 'gray', verb: 'déconnecté' },
  PLANIFICATION_AUTO: { color: 'indigo', verb: 'planifié automatiquement' },
  RESOLUTION_CONFLIT: { color: 'orange', verb: 'résolu' },
  EXPORT_DONNEES: { color: 'cyan', verb: 'exporté' },
  ALERTE: { color: 'yellow', verb: 'alerté' },
};

// Mapping des entités vers des noms lisibles
const entiteLabels = {
  Programme: 'Programme',
  Module: 'Module',
  Intervenant: 'Intervenant',
  Seance: 'Séance',
  User: 'Utilisateur',
  Salle: 'Salle',
  Conflit: 'Conflit',
  Evaluation: 'Évaluation',
  RotationWeekend: 'Rotation Weekend',
};

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Formater le temps relatif
   */
  private formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} sem`;
    return `Il y a ${Math.floor(diffDays / 30)} mois`;
  }

  /**
   * Récupérer les activités récentes pour le dashboard
   */
  async getRecentActivities(limit: number = 10) {
    const limitNum = Math.min(limit, 50);

    const activities = await this.prisma.journalActivite.findMany({
      orderBy: { createdAt: 'desc' },
      take: limitNum,
      select: {
        id: true,
        action: true,
        entite: true,
        description: true,
        userName: true,
        createdAt: true,
      },
    });

    // Formater les activités pour l'affichage
    const formattedActivities = activities.map((activity) => {
      const config = actionConfig[activity.action] || { color: 'gray', verb: 'modifié' };
      const entiteLabel = entiteLabels[activity.entite] || activity.entite;

      return {
        id: activity.id,
        color: config.color,
        text: activity.description || `${entiteLabel} ${config.verb}`,
        time: this.formatRelativeTime(activity.createdAt),
        user: activity.userName,
        action: activity.action,
        entite: activity.entite,
        createdAt: activity.createdAt,
      };
    });

    return {
      activities: formattedActivities,
      total: formattedActivities.length,
    };
  }
}
