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
exports.SeancesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const journal_service_1 = require("../journal/journal.service");
const client_1 = require("@prisma/client");
let SeancesService = class SeancesService {
    prisma;
    journalService;
    constructor(prisma, journalService) {
        this.prisma = prisma;
        this.journalService = journalService;
    }
    async findAll(pagination, filters) {
        const { skip, take, sortBy, sortOrder } = pagination;
        const where = {};
        if (filters.programmeId) {
            where.module = { programmeId: filters.programmeId };
        }
        if (filters.moduleId)
            where.moduleId = filters.moduleId;
        if (filters.intervenantId)
            where.intervenantId = filters.intervenantId;
        if (filters.status)
            where.status = filters.status;
        if (filters.startDate || filters.endDate) {
            where.dateSeance = {};
            if (filters.startDate)
                where.dateSeance.gte = new Date(filters.startDate);
            if (filters.endDate)
                where.dateSeance.lte = new Date(filters.endDate);
        }
        const [seances, total] = await Promise.all([
            this.prisma.seance.findMany({
                where,
                skip,
                take,
                include: {
                    module: {
                        include: {
                            programme: { select: { id: true, name: true, code: true } },
                        },
                    },
                    intervenant: { select: { id: true, civilite: true, nom: true, prenom: true, email: true } },
                },
                orderBy: sortBy ? { [sortBy]: sortOrder } : [{ dateSeance: 'asc' }, { heureDebut: 'asc' }],
            }),
            this.prisma.seance.count({ where }),
        ]);
        const limit = pagination.limit ?? 20;
        return {
            data: seances,
            pagination: {
                page: pagination.page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const seance = await this.prisma.seance.findUnique({
            where: { id },
            include: {
                module: {
                    include: {
                        programme: true,
                    },
                },
                intervenant: true,
            },
        });
        if (!seance) {
            throw new common_1.NotFoundException('Séance non trouvée');
        }
        return seance;
    }
    async create(data, currentUserId, currentUserName) {
        const conflicts = await this.detectConflicts(data);
        if (conflicts.length > 0) {
            throw new common_1.ConflictException({
                message: 'Conflits d\'horaires détectés',
                conflicts,
            });
        }
        const [hDebut, mDebut] = data.heureDebut.split(':').map(Number);
        const [hFin, mFin] = data.heureFin.split(':').map(Number);
        const duree = (hFin * 60 + mFin) - (hDebut * 60 + mDebut);
        if (duree <= 0) {
            throw new common_1.BadRequestException('L\'heure de fin doit être après l\'heure de début');
        }
        const seance = await this.prisma.seance.create({
            data: {
                ...data,
                duree,
                dateSeance: new Date(data.dateSeance),
            },
            include: {
                module: true,
                intervenant: true,
            },
        });
        await this.journalService.log({
            action: 'CREATION',
            entite: 'Seance',
            entiteId: seance.id,
            description: `Création de la séance du ${new Date(data.dateSeance).toLocaleDateString('fr-FR')} (${data.heureDebut}-${data.heureFin})`,
            nouvelleValeur: { dateSeance: data.dateSeance, heureDebut: data.heureDebut, heureFin: data.heureFin, moduleId: data.moduleId },
            userId: currentUserId,
            userName: currentUserName,
        });
        return seance;
    }
    async update(id, data, currentUserId, currentUserName) {
        const oldSeance = await this.findOne(id);
        if (data.heureDebut || data.heureFin || data.dateSeance) {
            const conflicts = await this.detectConflicts({ ...data, id });
            if (conflicts.length > 0) {
                throw new common_1.ConflictException({
                    message: 'Conflits d\'horaires détectés',
                    conflicts,
                });
            }
        }
        const updatedSeance = await this.prisma.seance.update({
            where: { id },
            data: {
                ...data,
                ...(data.dateSeance && { dateSeance: new Date(data.dateSeance) }),
            },
            include: {
                module: true,
                intervenant: true,
            },
        });
        await this.journalService.log({
            action: 'MODIFICATION',
            entite: 'Seance',
            entiteId: id,
            description: `Modification de la séance du ${updatedSeance.dateSeance.toLocaleDateString('fr-FR')}`,
            ancienneValeur: { dateSeance: oldSeance.dateSeance, heureDebut: oldSeance.heureDebut, heureFin: oldSeance.heureFin, status: oldSeance.status },
            nouvelleValeur: { dateSeance: updatedSeance.dateSeance, heureDebut: updatedSeance.heureDebut, heureFin: updatedSeance.heureFin, status: updatedSeance.status },
            userId: currentUserId,
            userName: currentUserName,
        });
        return updatedSeance;
    }
    async remove(id, currentUserId, currentUserName) {
        const seance = await this.findOne(id);
        await this.prisma.seance.delete({ where: { id } });
        await this.journalService.log({
            action: 'SUPPRESSION',
            entite: 'Seance',
            entiteId: id,
            description: `Suppression de la séance du ${seance.dateSeance.toLocaleDateString('fr-FR')} (${seance.heureDebut}-${seance.heureFin})`,
            ancienneValeur: { dateSeance: seance.dateSeance, heureDebut: seance.heureDebut, heureFin: seance.heureFin, moduleId: seance.moduleId },
            userId: currentUserId,
            userName: currentUserName,
        });
        return { message: 'Séance supprimée avec succès' };
    }
    async complete(id, data, currentUserId, currentUserName) {
        const seance = await this.findOne(id);
        const updated = await this.prisma.seance.update({
            where: { id },
            data: {
                status: client_1.StatusSeance.TERMINE,
                notes: data.notes,
                ...(data.realDuration && { duree: data.realDuration }),
            },
        });
        await this.updateModuleProgression(seance.moduleId);
        await this.journalService.log({
            action: 'MODIFICATION',
            entite: 'Seance',
            entiteId: id,
            description: `Séance du ${seance.dateSeance.toLocaleDateString('fr-FR')} marquée comme terminée`,
            ancienneValeur: { status: seance.status },
            nouvelleValeur: { status: client_1.StatusSeance.TERMINE, notes: data.notes },
            userId: currentUserId,
            userName: currentUserName,
        });
        return updated;
    }
    async detectConflicts(data) {
        const conflicts = [];
        const dateSeance = new Date(data.dateSeance);
        if (data.intervenantId) {
            const intervenantConflict = await this.prisma.seance.findFirst({
                where: {
                    intervenantId: data.intervenantId,
                    dateSeance,
                    status: { not: client_1.StatusSeance.ANNULE },
                    ...(data.id && { NOT: { id: data.id } }),
                    OR: [
                        {
                            heureDebut: { lte: data.heureDebut },
                            heureFin: { gt: data.heureDebut },
                        },
                        {
                            heureDebut: { lt: data.heureFin },
                            heureFin: { gte: data.heureFin },
                        },
                        {
                            heureDebut: { gte: data.heureDebut },
                            heureFin: { lte: data.heureFin },
                        },
                    ],
                },
                include: { intervenant: true },
            });
            if (intervenantConflict) {
                conflicts.push(`L'intervenant a déjà une séance de ${intervenantConflict.heureDebut} à ${intervenantConflict.heureFin}`);
            }
        }
        if (data.salle) {
            const salleConflict = await this.prisma.seance.findFirst({
                where: {
                    salle: data.salle,
                    dateSeance,
                    status: { not: client_1.StatusSeance.ANNULE },
                    ...(data.id && { NOT: { id: data.id } }),
                    OR: [
                        {
                            heureDebut: { lte: data.heureDebut },
                            heureFin: { gt: data.heureDebut },
                        },
                        {
                            heureDebut: { lt: data.heureFin },
                            heureFin: { gte: data.heureFin },
                        },
                        {
                            heureDebut: { gte: data.heureDebut },
                            heureFin: { lte: data.heureFin },
                        },
                    ],
                },
            });
            if (salleConflict) {
                conflicts.push(`La salle ${data.salle} est occupée de ${salleConflict.heureDebut} à ${salleConflict.heureFin}`);
            }
        }
        return conflicts;
    }
    async updateModuleProgression(moduleId) {
        const module = await this.prisma.module.findUnique({
            where: { id: moduleId },
        });
        if (!module)
            return;
        const seancesTerminees = await this.prisma.seance.findMany({
            where: { moduleId, status: client_1.StatusSeance.TERMINE },
        });
        const heuresEffectuees = seancesTerminees.reduce((sum, s) => sum + s.duree, 0) / 60;
        const progression = Math.min(100, (heuresEffectuees / module.vht) * 100);
        let status = client_1.StatusModule.PLANIFIE;
        if (progression >= 100)
            status = client_1.StatusModule.TERMINE;
        else if (progression > 0)
            status = client_1.StatusModule.EN_COURS;
        await this.prisma.module.update({
            where: { id: moduleId },
            data: { progression, status },
        });
        const modules = await this.prisma.module.findMany({
            where: { programmeId: module.programmeId },
        });
        const avgProgression = modules.reduce((sum, m) => sum + m.progression, 0) / modules.length;
        let programmeStatus = client_1.StatusProgramme.PLANIFIE;
        if (avgProgression >= 100)
            programmeStatus = client_1.StatusProgramme.TERMINE;
        else if (avgProgression > 0)
            programmeStatus = client_1.StatusProgramme.EN_COURS;
        await this.prisma.programme.update({
            where: { id: module.programmeId },
            data: { progression: avgProgression, status: programmeStatus },
        });
    }
};
exports.SeancesService = SeancesService;
exports.SeancesService = SeancesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        journal_service_1.JournalService])
], SeancesService);
//# sourceMappingURL=seances.service.js.map