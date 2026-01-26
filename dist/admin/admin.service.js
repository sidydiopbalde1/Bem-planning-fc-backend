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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        const [usersCount, programmesCount, modulesCount, seancesCount, intervenantsCount,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.programme.count(),
            this.prisma.module.count(),
            this.prisma.seance.count(),
            this.prisma.intervenant.count(),
        ]);
        const programmesByStatus = await this.prisma.programme.groupBy({
            by: ['status'],
            _count: true,
        });
        const seancesByStatus = await this.prisma.seance.groupBy({
            by: ['status'],
            _count: true,
        });
        const programmes = await this.prisma.programme.findMany({
            select: { progression: true },
        });
        const avgProgression = programmes.length > 0
            ? programmes.reduce((sum, p) => sum + p.progression, 0) / programmes.length
            : 0;
        return {
            counts: {
                users: usersCount,
                programmes: programmesCount,
                modules: modulesCount,
                seances: seancesCount,
                intervenants: intervenantsCount,
            },
            programmesByStatus: programmesByStatus.reduce((acc, item) => {
                acc[item.status] = item._count;
                return acc;
            }, {}),
            seancesByStatus: seancesByStatus.reduce((acc, item) => {
                acc[item.status] = item._count;
                return acc;
            }, {}),
            avgProgression,
        };
    }
    async getIntervenantsStats() {
        const intervenants = await this.prisma.intervenant.findMany({
            include: {
                _count: {
                    select: { modules: true, seances: true },
                },
            },
        });
        const disponibles = intervenants.filter(i => i.disponible).length;
        const avecModules = intervenants.filter(i => i._count.modules > 0).length;
        return {
            total: intervenants.length,
            disponibles,
            indisponibles: intervenants.length - disponibles,
            avecModules,
            sansModules: intervenants.length - avecModules,
            details: intervenants.map(i => ({
                id: i.id,
                nom: `${i.prenom} ${i.nom}`,
                disponible: i.disponible,
                modulesCount: i._count.modules,
                seancesCount: i._count.seances,
            })),
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map