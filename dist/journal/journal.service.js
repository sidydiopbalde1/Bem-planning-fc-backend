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
exports.JournalService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let JournalService = class JournalService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOne(id) {
        const log = await this.prisma.journalActivite.findUnique({
            where: { id },
        });
        if (!log) {
            throw new common_1.NotFoundException(`Log avec l'ID ${id} non trouvé`);
        }
        return log;
    }
    async log(data) {
        try {
            return await this.prisma.journalActivite.create({
                data: {
                    action: data.action,
                    entite: data.entite,
                    entiteId: data.entiteId || 'unknown',
                    description: data.description,
                    ancienneValeur: data.ancienneValeur ? JSON.stringify(data.ancienneValeur) : null,
                    nouvelleValeur: data.nouvelleValeur ? JSON.stringify(data.nouvelleValeur) : null,
                    userId: data.userId || 'system',
                    userName: data.userName,
                    ipAddress: data.ipAddress,
                    userAgent: data.userAgent,
                },
            });
        }
        catch (error) {
            console.error('Erreur logging:', error);
        }
    }
    async findAll(filters) {
        const { page = 1, limit = 10 } = filters;
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.action)
            where.action = filters.action;
        if (filters.entite)
            where.entite = filters.entite;
        if (filters.entiteId)
            where.entiteId = filters.entiteId;
        if (filters.userId)
            where.userId = filters.userId;
        if (filters.userName)
            where.userName = { contains: filters.userName, mode: 'insensitive' };
        if (filters.startDate || filters.endDate) {
            where.createdAt = {};
            if (filters.startDate)
                where.createdAt.gte = new Date(filters.startDate);
            if (filters.endDate)
                where.createdAt.lte = new Date(filters.endDate);
        }
        if (filters.search) {
            where.description = { contains: filters.search, mode: 'insensitive' };
        }
        const [logs, total] = await Promise.all([
            this.prisma.journalActivite.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.journalActivite.count({ where }),
        ]);
        return {
            logs,
            stats: {
                total: total,
                last24h: await this.prisma.journalActivite.count({
                    where: {
                        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
                    },
                }),
                actifusers: await this.prisma.journalActivite.groupBy({
                    by: ['userId'],
                    _count: { userId: true },
                    orderBy: { _count: { userId: 'desc' } },
                    take: 5,
                }),
                typesActions: await this.prisma.journalActivite.groupBy({
                    by: ['action'],
                    _count: { action: true },
                    orderBy: { _count: { action: 'desc' } },
                    take: 5,
                }),
                byEntities: await this.prisma.journalActivite.groupBy({
                    by: ['entite'],
                    _count: { entite: true },
                    orderBy: { _count: { entite: 'desc' } },
                    take: 10,
                }),
            },
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        };
    }
    async getStats(startDate, endDate) {
        const where = {};
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = new Date(startDate);
            if (endDate)
                where.createdAt.lte = new Date(endDate);
        }
        const [totalLogs, actionStats, entiteStats, recentActivity,] = await Promise.all([
            this.prisma.journalActivite.count({ where }),
            this.prisma.journalActivite.groupBy({
                by: ['action'],
                where,
                _count: { action: true },
                orderBy: { _count: { action: 'desc' } },
            }),
            this.prisma.journalActivite.groupBy({
                by: ['entite'],
                where,
                _count: { entite: true },
                orderBy: { _count: { entite: 'desc' } },
                take: 10,
            }),
            this.prisma.journalActivite.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: {
                    id: true,
                    action: true,
                    entite: true,
                    description: true,
                    userName: true,
                    createdAt: true,
                },
            }),
        ]);
        return {
            totalLogs,
            parAction: actionStats.map(s => ({ action: s.action, count: s._count.action })),
            parEntite: entiteStats.map(s => ({ entite: s.entite, count: s._count.entite })),
            activiteRecente: recentActivity,
        };
    }
    async getEntites() {
        const entites = await this.prisma.journalActivite.groupBy({
            by: ['entite'],
            _count: { entite: true },
            orderBy: { _count: { entite: 'desc' } },
        });
        return entites.map(e => e.entite);
    }
    async getLogsByEntite(entite, entiteId) {
        return this.prisma.journalActivite.findMany({
            where: { entite, entiteId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async deleteOldLogs(daysToKeep = 90) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        const result = await this.prisma.journalActivite.deleteMany({
            where: {
                createdAt: { lt: cutoffDate },
            },
        });
        return { deletedCount: result.count, cutoffDate };
    }
};
exports.JournalService = JournalService;
exports.JournalService = JournalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JournalService);
//# sourceMappingURL=journal.service.js.map