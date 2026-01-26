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
exports.PeriodesAcademiquesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const journal_service_1 = require("../journal/journal.service");
let PeriodesAcademiquesService = class PeriodesAcademiquesService {
    prisma;
    journalService;
    constructor(prisma, journalService) {
        this.prisma = prisma;
        this.journalService = journalService;
    }
    async findAll(pagination, activeOnly = false) {
        const { skip, take, sortBy, sortOrder } = pagination;
        const where = activeOnly ? { active: true } : {};
        const [periodes, total, actives] = await Promise.all([
            this.prisma.periodeAcademique.findMany({
                where,
                skip,
                take,
                orderBy: sortBy ? { [sortBy]: sortOrder } : { annee: 'desc' },
            }),
            this.prisma.periodeAcademique.count({ where }),
            this.prisma.periodeAcademique.count({ where: { active: true } }),
        ]);
        const periodeCourante = periodes.find((p) => p.active) || null;
        const limit = pagination.limit ?? 20;
        return {
            data: periodes,
            pagination: {
                page: pagination.page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
            stats: {
                total,
                actives,
                inactives: total - actives,
                periodeCourante: periodeCourante?.nom || null,
            },
        };
    }
    async findOne(id) {
        const periode = await this.prisma.periodeAcademique.findUnique({
            where: { id },
        });
        if (!periode) {
            throw new common_1.NotFoundException(`Période académique ${id} non trouvée`);
        }
        return periode;
    }
    async create(data, currentUserId, currentUserName) {
        if (data.active) {
            await this.prisma.periodeAcademique.updateMany({
                where: { active: true },
                data: { active: false },
            });
        }
        const periode = await this.prisma.periodeAcademique.create({
            data: {
                nom: data.nom,
                annee: data.annee,
                debutS1: new Date(data.debutS1),
                finS1: new Date(data.finS1),
                debutS2: new Date(data.debutS2),
                finS2: new Date(data.finS2),
                vacancesNoel: new Date(data.vacancesNoel),
                finVacancesNoel: new Date(data.finVacancesNoel),
                vacancesPaques: data.vacancesPaques ? new Date(data.vacancesPaques) : null,
                finVacancesPaques: data.finVacancesPaques ? new Date(data.finVacancesPaques) : null,
                active: data.active || false,
            },
        });
        await this.journalService.log({
            action: 'CREATION',
            entite: 'PeriodeAcademique',
            entiteId: periode.id,
            description: `Création de la période académique ${periode.nom} (${periode.annee})`,
            nouvelleValeur: { nom: periode.nom, annee: periode.annee, active: periode.active },
            userId: currentUserId,
            userName: currentUserName,
        });
        return periode;
    }
    async update(id, data, currentUserId, currentUserName) {
        const oldPeriode = await this.findOne(id);
        if (data.active) {
            await this.prisma.periodeAcademique.updateMany({
                where: { active: true, NOT: { id } },
                data: { active: false },
            });
        }
        const updateData = {};
        if (data.nom !== undefined)
            updateData.nom = data.nom;
        if (data.annee !== undefined)
            updateData.annee = data.annee;
        if (data.debutS1 !== undefined)
            updateData.debutS1 = new Date(data.debutS1);
        if (data.finS1 !== undefined)
            updateData.finS1 = new Date(data.finS1);
        if (data.debutS2 !== undefined)
            updateData.debutS2 = new Date(data.debutS2);
        if (data.finS2 !== undefined)
            updateData.finS2 = new Date(data.finS2);
        if (data.vacancesNoel !== undefined)
            updateData.vacancesNoel = new Date(data.vacancesNoel);
        if (data.finVacancesNoel !== undefined)
            updateData.finVacancesNoel = new Date(data.finVacancesNoel);
        if (data.vacancesPaques !== undefined)
            updateData.vacancesPaques = data.vacancesPaques ? new Date(data.vacancesPaques) : null;
        if (data.finVacancesPaques !== undefined)
            updateData.finVacancesPaques = data.finVacancesPaques ? new Date(data.finVacancesPaques) : null;
        if (data.active !== undefined)
            updateData.active = data.active;
        const updatedPeriode = await this.prisma.periodeAcademique.update({
            where: { id },
            data: updateData,
        });
        await this.journalService.log({
            action: 'MODIFICATION',
            entite: 'PeriodeAcademique',
            entiteId: id,
            description: `Modification de la période académique ${updatedPeriode.nom}`,
            ancienneValeur: { nom: oldPeriode.nom, annee: oldPeriode.annee, active: oldPeriode.active },
            nouvelleValeur: { nom: updatedPeriode.nom, annee: updatedPeriode.annee, active: updatedPeriode.active },
            userId: currentUserId,
            userName: currentUserName,
        });
        return updatedPeriode;
    }
    async remove(id, currentUserId, currentUserName) {
        const periode = await this.findOne(id);
        await this.prisma.periodeAcademique.delete({
            where: { id },
        });
        await this.journalService.log({
            action: 'SUPPRESSION',
            entite: 'PeriodeAcademique',
            entiteId: id,
            description: `Suppression de la période académique ${periode.nom} (${periode.annee})`,
            ancienneValeur: { nom: periode.nom, annee: periode.annee },
            userId: currentUserId,
            userName: currentUserName,
        });
        return { message: 'Période académique supprimée avec succès' };
    }
};
exports.PeriodesAcademiquesService = PeriodesAcademiquesService;
exports.PeriodesAcademiquesService = PeriodesAcademiquesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        journal_service_1.JournalService])
], PeriodesAcademiquesService);
//# sourceMappingURL=periodes-academiques.service.js.map