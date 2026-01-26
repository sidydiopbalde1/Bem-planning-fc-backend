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
exports.PlanningService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const journal_service_1 = require("../journal/journal.service");
let PlanningService = class PlanningService {
    prisma;
    journalService;
    creneaux = [
        { debut: '08:00', fin: '10:00', periode: 'matin' },
        { debut: '10:15', fin: '12:15', periode: 'matin' },
        { debut: '14:00', fin: '16:00', periode: 'apres-midi' },
        { debut: '16:15', fin: '18:15', periode: 'apres-midi' },
    ];
    constructor(prisma, journalService) {
        this.prisma = prisma;
        this.journalService = journalService;
    }
    async getSuggestedSlots(filters) {
        const { moduleId, intervenantId, startDate, endDate, duree = 120, limit = 20 } = filters;
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);
        const suggestions = [];
        let currentDate = new Date(start);
        while (currentDate <= end && suggestions.length < limit) {
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                for (const creneau of this.creneaux) {
                    const intervenantOccupe = intervenantId ? await this.isIntervenantOccupe(intervenantId, currentDate, creneau.debut, creneau.fin) : false;
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
    async generateAutoPlanning(data, currentUserId, currentUserName) {
        const module = await this.prisma.module.findUnique({
            where: { id: data.moduleId },
        });
        if (!module) {
            throw new Error('Module non trouvé');
        }
        const heuresRestantes = module.vht - (module.progression * module.vht / 100);
        const { suggestions } = await this.getSuggestedSlots({
            ...data,
            limit: Math.ceil(heuresRestantes / 2),
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
    async isIntervenantOccupe(intervenantId, date, heureDebut, heureFin) {
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
    calculateScore(date, creneau, index) {
        let score = 100;
        if (creneau.periode === 'matin')
            score += 10;
        const day = date.getDay();
        if (day === 2 || day === 4)
            score += 5;
        score -= Math.floor(index / 4) * 2;
        return Math.max(0, Math.min(100, score));
    }
    getJourSemaine(day) {
        const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        return jours[day];
    }
};
exports.PlanningService = PlanningService;
exports.PlanningService = PlanningService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        journal_service_1.JournalService])
], PlanningService);
//# sourceMappingURL=planning.service.js.map