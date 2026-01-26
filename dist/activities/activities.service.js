"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivitiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
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
let ActivitiesService = class ActivitiesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    formatRelativeTime(date) {
        const now = new Date();
        const diffMs = now.getTime() - new Date(date).getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffMins < 1)
            return "À l'instant";
        if (diffMins < 60)
            return `Il y a ${diffMins} min`;
        if (diffHours < 24)
            return `Il y a ${diffHours}h`;
        if (diffDays === 1)
            return 'Hier';
        if (diffDays < 7)
            return `Il y a ${diffDays}j`;
        if (diffDays < 30)
            return `Il y a ${Math.floor(diffDays / 7)} sem`;
        return `Il y a ${Math.floor(diffDays / 30)} mois`;
    }
    async getRecentActivities(limit = 10) {
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
};
exports.ActivitiesService = ActivitiesService;
exports.ActivitiesService = ActivitiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ActivitiesService);
//# sourceMappingURL=activities.service.js.map