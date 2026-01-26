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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const journal_service_1 = require("./journal.service");
const decorators_1 = require("../common/decorators");
const roles_constant_1 = require("../common/constants/roles.constant");
const dto_1 = require("./dto");
let JournalController = class JournalController {
    journalService;
    constructor(journalService) {
        this.journalService = journalService;
    }
    findAll(query) {
        return this.journalService.findAll(query);
    }
    getStats(startDate, endDate) {
        return this.journalService.getStats(startDate, endDate);
    }
    getEntites() {
        return this.journalService.getEntites();
    }
    getLogsByEntite(entite, entiteId) {
        return this.journalService.getLogsByEntite(entite, entiteId);
    }
    findOne(id) {
        return this.journalService.findOne(id);
    }
    deleteOldLogs(daysToKeep) {
        return this.journalService.deleteOldLogs(daysToKeep ? Number(daysToKeep) : undefined);
    }
};
exports.JournalController = JournalController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir le journal d\'activités avec filtres et pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des logs avec pagination' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.QueryJournalDto]),
    __metadata("design:returntype", void 0)
], JournalController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir les statistiques du journal d\'activités' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, description: 'Date de début (ISO 8601)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, description: 'Date de fin (ISO 8601)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistiques des activités' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], JournalController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('entites'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir la liste des entités journalisées' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des entités distinctes' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JournalController.prototype, "getEntites", null);
__decorate([
    (0, common_1.Get)('entite/:entite/:entiteId'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir l\'historique des modifications d\'une entité spécifique' }),
    (0, swagger_1.ApiParam)({ name: 'entite', description: 'Type de l\'entité (ex: User, Professeur, Cours)' }),
    (0, swagger_1.ApiParam)({ name: 'entiteId', description: 'ID de l\'entité' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Historique des modifications de l\'entité' }),
    __param(0, (0, common_1.Param)('entite')),
    __param(1, (0, common_1.Param)('entiteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], JournalController.prototype, "getLogsByEntite", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir un log spécifique par son ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID du log' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Détails du log' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Log non trouvé' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JournalController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)('cleanup'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer les anciens logs (archivage)' }),
    (0, swagger_1.ApiQuery)({ name: 'daysToKeep', required: false, description: 'Nombre de jours à conserver (défaut: 90)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nombre de logs supprimés' }),
    __param(0, (0, common_1.Query)('daysToKeep')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], JournalController.prototype, "deleteOldLogs", null);
exports.JournalController = JournalController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('admin/logs'),
    __metadata("design:paramtypes", [journal_service_1.JournalService])
], JournalController);
//# sourceMappingURL=journal.controller.js.map