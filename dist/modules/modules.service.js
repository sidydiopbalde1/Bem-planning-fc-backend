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
exports.ModulesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const journal_service_1 = require("../journal/journal.service");
const client_1 = require("@prisma/client");
let ModulesService = class ModulesService {
    prisma;
    journalService;
    constructor(prisma, journalService) {
        this.prisma = prisma;
        this.journalService = journalService;
    }
    async findAll(pagination, filters) {
        const { skip, take, search, sortBy, sortOrder } = pagination;
        const where = {};
        if (filters?.programmeId) {
            where.programmeId = filters.programmeId;
        }
        if (filters?.intervenantId) {
            where.intervenantId = filters.intervenantId;
        }
        if (filters?.status) {
            where.status = filters.status;
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [modules, total] = await Promise.all([
            this.prisma.module.findMany({
                where,
                skip,
                take,
                orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
                include: {
                    programme: { select: { id: true, name: true, code: true } },
                    intervenant: { select: { id: true, nom: true, prenom: true, civilite: true } },
                    _count: { select: { seances: true } },
                },
            }),
            this.prisma.module.count({ where }),
        ]);
        const limit = pagination.limit ?? 5;
        return {
            data: modules,
            pagination: {
                page: pagination.page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const module = await this.prisma.module.findUnique({
            where: { id },
            include: {
                programme: true,
                intervenant: true,
                seances: {
                    orderBy: { dateSeance: 'asc' },
                    include: {
                        intervenant: { select: { civilite: true, nom: true, prenom: true } },
                    },
                },
            },
        });
        if (!module) {
            throw new common_1.NotFoundException('Module non trouvé');
        }
        return module;
    }
    async create(data, userId, userName) {
        const existing = await this.prisma.module.findFirst({
            where: { code: data.code, programmeId: data.programmeId },
        });
        if (existing) {
            throw new common_1.ConflictException('Un module avec ce code existe déjà dans ce programme');
        }
        const cm = parseInt(data.cm, 10) || 0;
        const td = parseInt(data.td, 10) || 0;
        const tp = parseInt(data.tp, 10) || 0;
        const tpe = parseInt(data.tpe, 10) || 0;
        const coefficient = parseInt(data.coefficient, 10) || 1;
        const credits = parseInt(data.credits, 10) || 1;
        const vht = cm + td + tp + tpe;
        if (vht <= 0) {
            throw new common_1.BadRequestException('Le volume horaire total doit être supérieur à 0');
        }
        const intervenantId = data.intervenantId && data.intervenantId.trim() !== ''
            ? data.intervenantId
            : null;
        const module = await this.prisma.module.create({
            data: {
                code: data.code.toUpperCase(),
                name: data.name,
                description: data.description || null,
                cm,
                td,
                tp,
                tpe,
                vht,
                coefficient,
                credits,
                status: data.status || 'PLANIFIE',
                progression: data.progression || 0,
                dateDebut: data.dateDebut ? new Date(data.dateDebut) : null,
                dateFin: data.dateFin ? new Date(data.dateFin) : null,
                programmeId: data.programmeId,
                intervenantId,
                userId,
            },
            include: {
                programme: { select: { id: true, name: true, code: true } },
                intervenant: { select: { id: true, nom: true, prenom: true } },
            },
        });
        await this.journalService.log({
            action: 'CREATION',
            entite: 'Module',
            entiteId: module.id,
            description: `Création du module ${module.code} - ${module.name}`,
            nouvelleValeur: { code: module.code, name: module.name, vht: module.vht, programmeId: module.programmeId },
            userId,
            userName,
        });
        return module;
    }
    async update(id, data, currentUserId, currentUserName) {
        const oldModule = await this.findOne(id);
        if (data.code) {
            const existing = await this.prisma.module.findFirst({
                where: {
                    code: data.code,
                    programmeId: oldModule.programmeId,
                    NOT: { id },
                },
            });
            if (existing) {
                throw new common_1.ConflictException('Un module avec ce code existe déjà dans ce programme');
            }
        }
        const cm = data.cm !== undefined ? (parseInt(data.cm, 10) || 0) : oldModule.cm;
        const td = data.td !== undefined ? (parseInt(data.td, 10) || 0) : oldModule.td;
        const tp = data.tp !== undefined ? (parseInt(data.tp, 10) || 0) : oldModule.tp;
        const tpe = data.tpe !== undefined ? (parseInt(data.tpe, 10) || 0) : oldModule.tpe;
        const vht = cm + td + tp + tpe;
        const updateData = {
            ...(data.name && { name: data.name }),
            ...(data.code && { code: data.code.toUpperCase() }),
            ...(data.description !== undefined && { description: data.description || null }),
            ...(data.cm !== undefined && { cm }),
            ...(data.td !== undefined && { td }),
            ...(data.tp !== undefined && { tp }),
            ...(data.tpe !== undefined && { tpe }),
            ...(data.coefficient !== undefined && { coefficient: parseInt(data.coefficient, 10) || 1 }),
            ...(data.credits !== undefined && { credits: parseInt(data.credits, 10) || 1 }),
            ...(data.status && { status: data.status }),
            ...(data.progression !== undefined && { progression: parseInt(data.progression, 10) || 0 }),
            ...(data.dateDebut !== undefined && { dateDebut: data.dateDebut ? new Date(data.dateDebut) : null }),
            ...(data.dateFin !== undefined && { dateFin: data.dateFin ? new Date(data.dateFin) : null }),
            vht,
        };
        if (data.intervenantId !== undefined) {
            updateData.intervenantId = data.intervenantId && data.intervenantId.trim() !== ''
                ? data.intervenantId
                : null;
        }
        const updatedModule = await this.prisma.module.update({
            where: { id },
            data: updateData,
            include: {
                programme: true,
                intervenant: true,
            },
        });
        await this.journalService.log({
            action: 'MODIFICATION',
            entite: 'Module',
            entiteId: id,
            description: `Modification du module ${updatedModule.code} - ${updatedModule.name}`,
            ancienneValeur: { code: oldModule.code, name: oldModule.name, vht: oldModule.vht, status: oldModule.status },
            nouvelleValeur: { code: updatedModule.code, name: updatedModule.name, vht: updatedModule.vht, status: updatedModule.status },
            userId: currentUserId,
            userName: currentUserName,
        });
        return updatedModule;
    }
    async remove(id, currentUserId, currentUserName) {
        const module = await this.findOne(id);
        const seancesFutures = await this.prisma.seance.count({
            where: {
                moduleId: id,
                dateSeance: { gt: new Date() },
                status: { not: 'ANNULE' },
            },
        });
        if (seancesFutures > 0) {
            throw new common_1.BadRequestException('Impossible de supprimer: ce module a des séances futures');
        }
        await this.prisma.module.delete({ where: { id } });
        await this.journalService.log({
            action: 'SUPPRESSION',
            entite: 'Module',
            entiteId: id,
            description: `Suppression du module ${module.code} - ${module.name}`,
            ancienneValeur: { code: module.code, name: module.name, vht: module.vht, programmeId: module.programmeId },
            userId: currentUserId,
            userName: currentUserName,
        });
        return { message: 'Module supprimé avec succès' };
    }
    async updateProgression(moduleId) {
        const module = await this.prisma.module.findUnique({
            where: { id: moduleId },
        });
        if (!module)
            return;
        const seancesTerminees = await this.prisma.seance.findMany({
            where: { moduleId, status: 'TERMINE' },
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
        return { progression, status };
    }
};
exports.ModulesService = ModulesService;
exports.ModulesService = ModulesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        journal_service_1.JournalService])
], ModulesService);
//# sourceMappingURL=modules.service.js.map