"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const journal_service_1 = require("../journal/journal.service");
const crypto = __importStar(require("crypto"));
let EvaluationsService = class EvaluationsService {
    prisma;
    journalService;
    constructor(prisma, journalService) {
        this.prisma = prisma;
        this.journalService = journalService;
    }
    async findAll(pagination, filters) {
        const { skip, take, sortBy, sortOrder } = pagination;
        const where = {};
        if (filters.moduleId)
            where.moduleId = filters.moduleId;
        if (filters.statut)
            where.statut = filters.statut;
        const [evaluations, total] = await Promise.all([
            this.prisma.evaluationEnseignement.findMany({
                where,
                skip,
                take,
                include: {
                    module: {
                        include: {
                            programme: { select: { id: true, name: true, code: true } },
                        },
                    },
                    intervenant: { select: { id: true, civilite: true, nom: true, prenom: true } },
                },
                orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
            }),
            this.prisma.evaluationEnseignement.count({ where }),
        ]);
        const limit = pagination.limit ?? 20;
        return {
            data: evaluations,
            pagination: {
                page: pagination.page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const evaluation = await this.prisma.evaluationEnseignement.findUnique({
            where: { id },
            include: {
                module: { include: { programme: true } },
                intervenant: true,
            },
        });
        if (!evaluation) {
            throw new common_1.NotFoundException('Évaluation non trouvée');
        }
        return evaluation;
    }
    async findByLien(lienEvaluation) {
        const evaluation = await this.prisma.evaluationEnseignement.findFirst({
            where: { lienEvaluation },
            include: {
                module: { include: { programme: true } },
                intervenant: { select: { civilite: true, nom: true, prenom: true } },
            },
        });
        if (!evaluation) {
            throw new common_1.NotFoundException('Évaluation non trouvée');
        }
        return evaluation;
    }
    async create(data, currentUserId, currentUserName) {
        const lienEvaluation = crypto.randomBytes(32).toString('hex');
        const evaluation = await this.prisma.evaluationEnseignement.create({
            data: {
                moduleId: data.moduleId,
                intervenantId: data.intervenantId,
                dateDebut: new Date(data.dateDebut),
                dateFin: new Date(data.dateFin),
                nombreInvitations: data.nombreInvitations || 0,
                lienEvaluation,
                statut: 'BROUILLON',
            },
            include: {
                module: true,
                intervenant: true,
            },
        });
        await this.journalService.log({
            action: 'CREATION',
            entite: 'Evaluation',
            entiteId: evaluation.id,
            description: `Création d'une évaluation pour le module ${evaluation.module.code}`,
            nouvelleValeur: { moduleId: data.moduleId, intervenantId: data.intervenantId, dateDebut: data.dateDebut, dateFin: data.dateFin },
            userId: currentUserId,
            userName: currentUserName,
        });
        return evaluation;
    }
    async update(id, data, currentUserId, currentUserName) {
        const oldEvaluation = await this.findOne(id);
        const updatedEvaluation = await this.prisma.evaluationEnseignement.update({
            where: { id },
            data: {
                ...data,
                ...(data.dateDebut && { dateDebut: new Date(data.dateDebut) }),
                ...(data.dateFin && { dateFin: new Date(data.dateFin) }),
            },
        });
        await this.journalService.log({
            action: 'MODIFICATION',
            entite: 'Evaluation',
            entiteId: id,
            description: `Modification de l'évaluation pour le module ${oldEvaluation.module.code}`,
            ancienneValeur: { statut: oldEvaluation.statut },
            nouvelleValeur: { statut: updatedEvaluation.statut },
            userId: currentUserId,
            userName: currentUserName,
        });
        return updatedEvaluation;
    }
    async submitResponse(lienEvaluation, responses) {
        const evaluation = await this.findByLien(lienEvaluation);
        const updated = await this.prisma.evaluationEnseignement.update({
            where: { id: evaluation.id },
            data: {
                nombreReponses: { increment: 1 },
                noteQualiteCours: responses.noteQualiteCours,
                noteQualitePedagogie: responses.noteQualitePedagogie,
                noteDisponibilite: responses.noteDisponibilite,
                commentaires: responses.commentaires,
            },
        });
        await this.journalService.log({
            action: 'MODIFICATION',
            entite: 'Evaluation',
            entiteId: evaluation.id,
            description: `Nouvelle réponse soumise pour l'évaluation du module ${evaluation.module.code}`,
            nouvelleValeur: { nombreReponses: updated.nombreReponses },
        });
        return { message: 'Réponse enregistrée avec succès', evaluation: updated };
    }
    async remove(id, currentUserId, currentUserName) {
        const evaluation = await this.findOne(id);
        await this.prisma.evaluationEnseignement.delete({ where: { id } });
        await this.journalService.log({
            action: 'SUPPRESSION',
            entite: 'Evaluation',
            entiteId: id,
            description: `Suppression de l'évaluation pour le module ${evaluation.module.code}`,
            ancienneValeur: { moduleId: evaluation.moduleId, intervenantId: evaluation.intervenantId },
            userId: currentUserId,
            userName: currentUserName,
        });
        return { message: 'Évaluation supprimée avec succès' };
    }
};
exports.EvaluationsService = EvaluationsService;
exports.EvaluationsService = EvaluationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        journal_service_1.JournalService])
], EvaluationsService);
//# sourceMappingURL=evaluations.service.js.map