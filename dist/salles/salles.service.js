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
exports.SallesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const journal_service_1 = require("../journal/journal.service");
let SallesService = class SallesService {
    prisma;
    journalService;
    constructor(prisma, journalService) {
        this.prisma = prisma;
        this.journalService = journalService;
    }
    async findAll(pagination, batiment) {
        const { skip, take, search, sortBy, sortOrder } = pagination;
        const where = {};
        if (search) {
            where.OR = [
                { nom: { contains: search, mode: 'insensitive' } },
                { batiment: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (batiment)
            where.batiment = batiment;
        const [salles, total, statsByBatiment] = await Promise.all([
            this.prisma.salle.findMany({
                where,
                skip,
                take,
                orderBy: sortBy ? { [sortBy]: sortOrder } : { nom: 'asc' },
            }),
            this.prisma.salle.count({ where }),
            this.prisma.salle.groupBy({
                by: ['batiment'],
                _count: true,
            }),
        ]);
        const limit = pagination.limit ?? 10;
        return {
            data: salles,
            pagination: {
                page: pagination.page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
            stats: {
                total,
                disponibles: salles.filter(s => s.disponible).length,
                parBatiment: statsByBatiment.reduce((acc, item) => {
                    acc[item.batiment || 'Non défini'] = item._count;
                    return acc;
                }, {}),
            },
        };
    }
    async findOne(id) {
        const salle = await this.prisma.salle.findUnique({
            where: { id },
        });
        if (!salle) {
            throw new common_1.NotFoundException('Salle non trouvée');
        }
        return salle;
    }
    async create(data, currentUserId, currentUserName) {
        const existing = await this.prisma.salle.findUnique({
            where: { nom: data.nom },
        });
        if (existing) {
            throw new common_1.ConflictException('Une salle avec ce nom existe déjà');
        }
        const salle = await this.prisma.salle.create({ data });
        await this.journalService.log({
            action: 'CREATION',
            entite: 'Salle',
            entiteId: salle.id,
            description: `Création de la salle ${salle.nom}`,
            nouvelleValeur: { nom: salle.nom, batiment: salle.batiment, capacite: salle.capacite },
            userId: currentUserId,
            userName: currentUserName,
        });
        return salle;
    }
    async update(id, data, currentUserId, currentUserName) {
        const oldSalle = await this.findOne(id);
        if (data.nom) {
            const existing = await this.prisma.salle.findFirst({
                where: { nom: data.nom, NOT: { id } },
            });
            if (existing) {
                throw new common_1.ConflictException('Une salle avec ce nom existe déjà');
            }
        }
        const updatedSalle = await this.prisma.salle.update({ where: { id }, data });
        await this.journalService.log({
            action: 'MODIFICATION',
            entite: 'Salle',
            entiteId: id,
            description: `Modification de la salle ${updatedSalle.nom}`,
            ancienneValeur: { nom: oldSalle.nom, batiment: oldSalle.batiment, capacite: oldSalle.capacite },
            nouvelleValeur: { nom: updatedSalle.nom, batiment: updatedSalle.batiment, capacite: updatedSalle.capacite },
            userId: currentUserId,
            userName: currentUserName,
        });
        return updatedSalle;
    }
    async remove(id, currentUserId, currentUserName) {
        const salle = await this.findOne(id);
        await this.prisma.salle.delete({ where: { id } });
        await this.journalService.log({
            action: 'SUPPRESSION',
            entite: 'Salle',
            entiteId: id,
            description: `Suppression de la salle ${salle.nom}`,
            ancienneValeur: { nom: salle.nom, batiment: salle.batiment, capacite: salle.capacite },
            userId: currentUserId,
            userName: currentUserName,
        });
        return { message: 'Salle supprimée avec succès' };
    }
};
exports.SallesService = SallesService;
exports.SallesService = SallesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        journal_service_1.JournalService])
], SallesService);
//# sourceMappingURL=salles.service.js.map