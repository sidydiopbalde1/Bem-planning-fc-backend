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
exports.IndicateursAcademiquesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let IndicateursAcademiquesService = class IndicateursAcademiquesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(programmeId, periodeId) {
        const where = {};
        if (programmeId)
            where.programmeId = programmeId;
        if (periodeId)
            where.periodeId = periodeId;
        return this.prisma.indicateurAcademique.findMany({
            where,
            include: {
                programme: {
                    select: { id: true, name: true, code: true },
                },
                periode: {
                    select: { id: true, nom: true, annee: true },
                },
                responsable: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const indicateur = await this.prisma.indicateurAcademique.findUnique({
            where: { id },
            include: {
                programme: {
                    select: { id: true, name: true, code: true },
                },
                periode: {
                    select: { id: true, nom: true, annee: true },
                },
                responsable: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
        if (!indicateur) {
            throw new common_1.NotFoundException(`Indicateur académique ${id} non trouvé`);
        }
        return indicateur;
    }
    async create(data) {
        return this.prisma.indicateurAcademique.create({
            data: {
                nom: data.nom,
                description: data.description,
                valeurCible: data.valeurCible,
                valeurReelle: data.valeurReelle,
                periodicite: data.periodicite,
                methodeCalcul: data.methodeCalcul,
                unite: data.unite || '%',
                type: data.type,
                programmeId: data.programmeId,
                periodeId: data.periodeId,
                responsableId: data.responsableId,
                dateCollecte: data.dateCollecte ? new Date(data.dateCollecte) : null,
            },
            include: {
                programme: {
                    select: { id: true, name: true, code: true },
                },
                periode: {
                    select: { id: true, nom: true, annee: true },
                },
                responsable: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
    }
    async update(id, data) {
        await this.findOne(id);
        const updateData = {};
        if (data.nom !== undefined)
            updateData.nom = data.nom;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.valeurCible !== undefined)
            updateData.valeurCible = data.valeurCible;
        if (data.valeurReelle !== undefined)
            updateData.valeurReelle = data.valeurReelle;
        if (data.periodicite !== undefined)
            updateData.periodicite = data.periodicite;
        if (data.methodeCalcul !== undefined)
            updateData.methodeCalcul = data.methodeCalcul;
        if (data.unite !== undefined)
            updateData.unite = data.unite;
        if (data.type !== undefined)
            updateData.type = data.type;
        if (data.programmeId !== undefined)
            updateData.programmeId = data.programmeId;
        if (data.periodeId !== undefined)
            updateData.periodeId = data.periodeId;
        if (data.responsableId !== undefined)
            updateData.responsableId = data.responsableId;
        if (data.dateCollecte !== undefined) {
            updateData.dateCollecte = data.dateCollecte ? new Date(data.dateCollecte) : null;
        }
        return this.prisma.indicateurAcademique.update({
            where: { id },
            data: updateData,
            include: {
                programme: {
                    select: { id: true, name: true, code: true },
                },
                periode: {
                    select: { id: true, nom: true, annee: true },
                },
                responsable: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.indicateurAcademique.delete({
            where: { id },
        });
    }
};
exports.IndicateursAcademiquesService = IndicateursAcademiquesService;
exports.IndicateursAcademiquesService = IndicateursAcademiquesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], IndicateursAcademiquesService);
//# sourceMappingURL=indicateurs-academiques.service.js.map