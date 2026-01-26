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
exports.CoordinateurService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CoordinateurService = class CoordinateurService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProgrammes(userId, role, filters, pagination = {}) {
        const page = pagination.page || 1;
        const limit = pagination.limit || 10;
        const skip = (page - 1) * limit;
        const where = {};
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
        const stats = {
            total,
            parStatut: await this.prisma.programme.groupBy({
                by: ['status'],
                where,
                _count: { status: true },
            }),
            progressionMoyenne: programmes.length > 0
                ? Math.round(programmes.reduce((sum, p) => sum + p.progression, 0) /
                    programmes.length)
                : 0,
            enRetard: programmes.filter((p) => {
                if (p.status === 'TERMINE')
                    return false;
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
    async getDashboard(userId, role) {
        const where = role === 'COORDINATOR' ? { userId } : {};
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
    async getModules(userId, role, filters, pagination = {}) {
        const page = pagination.page || 1;
        const limit = pagination.limit || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (role === 'COORDINATOR') {
            where.programme = { userId };
        }
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
    async checkAlerts(userId, role) {
        const now = new Date();
        const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const where = role === 'COORDINATOR' ? { userId } : {};
        const programmesEnRetard = await this.prisma.programme.findMany({
            where: {
                ...where,
                status: { not: 'TERMINE' },
                dateFin: { lt: now },
                progression: { lt: 100 },
            },
        });
        const modulesSansIntervenant = await this.prisma.module.findMany({
            where: {
                ...(where.userId && { programme: { userId: where.userId } }),
                intervenantId: null,
                dateDebut: { lte: sevenDays },
            },
            include: { programme: { select: { name: true } } },
        });
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
};
exports.CoordinateurService = CoordinateurService;
exports.CoordinateurService = CoordinateurService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoordinateurService);
//# sourceMappingURL=coordinateur.service.js.map