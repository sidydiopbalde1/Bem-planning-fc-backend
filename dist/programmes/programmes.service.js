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
exports.ProgrammesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const journal_service_1 = require("../journal/journal.service");
const client_1 = require("@prisma/client");
let ProgrammesService = class ProgrammesService {
    prisma;
    journalService;
    constructor(prisma, journalService) {
        this.prisma = prisma;
        this.journalService = journalService;
    }
    async findAll(userId, role, pagination, filters) {
        const { skip, take, search, sortBy, sortOrder } = pagination;
        const where = {};
        if (role === 'COORDINATOR') {
            where.userId = userId;
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (filters?.status)
            where.status = filters.status;
        if (filters?.semestre)
            where.semestre = filters.semestre;
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
        const programmesWithAlerts = programmes.map(p => {
            const alerts = [];
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
    async findOne(id, userId, role) {
        const where = { id };
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
            throw new common_1.NotFoundException('Programme non trouvé');
        }
        return programme;
    }
    async create(data, userId, userName) {
        const existing = await this.prisma.programme.findUnique({
            where: { code: data.code },
        });
        if (existing) {
            throw new common_1.ConflictException('Un programme avec ce code existe déjà');
        }
        let calculatedVHT = 0;
        if (data.modules) {
            calculatedVHT = data.modules.reduce((sum, m) => {
                return sum + (m.cm || 0) + (m.td || 0) + (m.tp || 0) + (m.tpe || 0);
            }, 0);
        }
        const { modules, vht, ...programmeData } = data;
        const programme = await this.prisma.programme.create({
            data: {
                ...programmeData,
                totalVHT: data.totalVHT || calculatedVHT,
                userId,
                modules: data.modules ? {
                    create: data.modules.map((m) => ({
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
    async update(id, data, userId, role, userName) {
        const oldProgramme = await this.findOne(id, userId, role);
        if (data.code) {
            const existing = await this.prisma.programme.findFirst({
                where: { code: data.code, NOT: { id } },
            });
            if (existing) {
                throw new common_1.ConflictException('Un programme avec ce code existe déjà');
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
    async remove(id, userId, role, userName) {
        const programme = await this.findOne(id, userId, role);
        const seancesFutures = await this.prisma.seance.count({
            where: {
                module: { programmeId: id },
                dateSeance: { gt: new Date() },
                status: { not: 'ANNULE' },
            },
        });
        if (seancesFutures > 0) {
            throw new common_1.BadRequestException('Impossible de supprimer: ce programme a des séances futures');
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
    async updateProgression(programmeId) {
        const modules = await this.prisma.module.findMany({
            where: { programmeId },
        });
        if (modules.length === 0)
            return;
        const avgProgression = modules.reduce((sum, m) => sum + m.progression, 0) / modules.length;
        let status = client_1.StatusProgramme.PLANIFIE;
        if (avgProgression >= 100)
            status = client_1.StatusProgramme.TERMINE;
        else if (avgProgression > 0)
            status = client_1.StatusProgramme.EN_COURS;
        await this.prisma.programme.update({
            where: { id: programmeId },
            data: { progression: avgProgression, status },
        });
    }
};
exports.ProgrammesService = ProgrammesService;
exports.ProgrammesService = ProgrammesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        journal_service_1.JournalService])
], ProgrammesService);
//# sourceMappingURL=programmes.service.js.map