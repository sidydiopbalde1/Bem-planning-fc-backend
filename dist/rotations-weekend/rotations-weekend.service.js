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
exports.RotationsWeekendService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const journal_service_1 = require("../journal/journal.service");
const client_1 = require("@prisma/client");
let RotationsWeekendService = class RotationsWeekendService {
    prisma;
    journalService;
    constructor(prisma, journalService) {
        this.prisma = prisma;
        this.journalService = journalService;
    }
    async findAll(pagination, filters) {
        const { skip, take, sortBy, sortOrder } = pagination;
        const where = {};
        if (filters.annee)
            where.annee = parseInt(filters.annee);
        if (filters.responsableId)
            where.responsableId = filters.responsableId;
        if (filters.status)
            where.status = filters.status;
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
        const stats = {
            total,
            termines: rotations.filter(r => r.status === client_1.StatutRotation.TERMINE).length,
            absences: rotations.filter(r => r.status === client_1.StatutRotation.ABSENT).length,
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
    async findOne(id) {
        const rotation = await this.prisma.rotationWeekend.findUnique({
            where: { id },
            include: {
                responsable: true,
                substitut: true,
                rapportSupervision: true,
            },
        });
        if (!rotation) {
            throw new common_1.NotFoundException('Rotation non trouvée');
        }
        return rotation;
    }
    async generateRotations(nbSemaines, dateDebut, currentUserId, currentUserName) {
        const start = dateDebut || this.getProchainSamedi(new Date());
        const responsables = await this.prisma.user.findMany({
            where: { role: 'COORDINATOR' },
        });
        if (responsables.length === 0) {
            throw new Error('Aucun coordinateur disponible');
        }
        const rotations = [];
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
                    status: client_1.StatutRotation.PLANIFIE,
                },
                include: {
                    responsable: { select: { id: true, name: true, email: true } },
                },
            });
            rotations.push(rotation);
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
    async declareAbsence(id, raison, currentUserId, currentUserName) {
        const rotation = await this.findOne(id);
        const remplacant = await this.prisma.user.findFirst({
            where: {
                role: 'COORDINATOR',
                id: { not: rotation.responsableId },
            },
        });
        if (!remplacant) {
            throw new Error('Aucun remplaçant disponible');
        }
        const updated = await this.prisma.rotationWeekend.update({
            where: { id },
            data: {
                status: client_1.StatutRotation.ABSENT,
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
            nouvelleValeur: { status: client_1.StatutRotation.ABSENT, responsableId: remplacant.id, raison },
            userId: currentUserId,
            userName: currentUserName,
        });
        return updated;
    }
    async terminerRotation(id, rapportData, currentUserId, currentUserName) {
        const rotation = await this.findOne(id);
        const status = rapportData ? client_1.StatutRotation.TERMINE : client_1.StatutRotation.TERMINE_SANS_RAPPORT;
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
    getProchainSamedi(date) {
        const result = new Date(date);
        const day = result.getDay();
        const daysUntilSaturday = (6 - day + 7) % 7 || 7;
        result.setDate(result.getDate() + daysUntilSaturday);
        result.setHours(0, 0, 0, 0);
        return result;
    }
    getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    }
};
exports.RotationsWeekendService = RotationsWeekendService;
exports.RotationsWeekendService = RotationsWeekendService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        journal_service_1.JournalService])
], RotationsWeekendService);
//# sourceMappingURL=rotations-weekend.service.js.map