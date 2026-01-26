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
exports.ActivitesAcademiquesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ActivitesAcademiquesService = class ActivitesAcademiquesService {
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
        return this.prisma.activiteAcademique.findMany({
            where,
            include: {
                programme: {
                    select: { id: true, name: true, code: true },
                },
                periode: {
                    select: { id: true, nom: true, annee: true },
                },
            },
            orderBy: { datePrevue: 'asc' },
        });
    }
    async findOne(id) {
        const activite = await this.prisma.activiteAcademique.findUnique({
            where: { id },
            include: {
                programme: {
                    select: { id: true, name: true, code: true },
                },
                periode: {
                    select: { id: true, nom: true, annee: true },
                },
            },
        });
        if (!activite) {
            throw new common_1.NotFoundException(`Activité académique ${id} non trouvée`);
        }
        return activite;
    }
    async create(data) {
        return this.prisma.activiteAcademique.create({
            data: {
                nom: data.nom,
                description: data.description,
                datePrevue: data.datePrevue ? new Date(data.datePrevue) : null,
                dateReelle: data.dateReelle ? new Date(data.dateReelle) : null,
                type: data.type,
                programmeId: data.programmeId,
                periodeId: data.periodeId,
            },
            include: {
                programme: {
                    select: { id: true, name: true, code: true },
                },
                periode: {
                    select: { id: true, nom: true, annee: true },
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
        if (data.datePrevue !== undefined)
            updateData.datePrevue = data.datePrevue ? new Date(data.datePrevue) : null;
        if (data.dateReelle !== undefined)
            updateData.dateReelle = data.dateReelle ? new Date(data.dateReelle) : null;
        if (data.type !== undefined)
            updateData.type = data.type;
        if (data.programmeId !== undefined)
            updateData.programmeId = data.programmeId;
        if (data.periodeId !== undefined)
            updateData.periodeId = data.periodeId;
        return this.prisma.activiteAcademique.update({
            where: { id },
            data: updateData,
            include: {
                programme: {
                    select: { id: true, name: true, code: true },
                },
                periode: {
                    select: { id: true, nom: true, annee: true },
                },
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.activiteAcademique.delete({
            where: { id },
        });
    }
};
exports.ActivitesAcademiquesService = ActivitesAcademiquesService;
exports.ActivitesAcademiquesService = ActivitesAcademiquesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ActivitesAcademiquesService);
//# sourceMappingURL=activites-academiques.service.js.map