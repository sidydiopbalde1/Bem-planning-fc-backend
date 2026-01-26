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
exports.IndicateursAcademiquesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const indicateurs_academiques_service_1 = require("./indicateurs-academiques.service");
const create_indicateur_academique_dto_1 = require("./dto/create-indicateur-academique.dto");
const update_indicateur_academique_dto_1 = require("./dto/update-indicateur-academique.dto");
const decorators_1 = require("../common/decorators");
const roles_constant_1 = require("../common/constants/roles.constant");
let IndicateursAcademiquesController = class IndicateursAcademiquesController {
    indicateursService;
    constructor(indicateursService) {
        this.indicateursService = indicateursService;
    }
    findAll(programmeId, periodeId) {
        return this.indicateursService.findAll(programmeId, periodeId);
    }
    findOne(id) {
        return this.indicateursService.findOne(id);
    }
    create(data) {
        return this.indicateursService.create(data);
    }
    update(id, data) {
        return this.indicateursService.update(id, data);
    }
    partialUpdate(id, data) {
        return this.indicateursService.update(id, data);
    }
    remove(id) {
        return this.indicateursService.remove(id);
    }
};
exports.IndicateursAcademiquesController = IndicateursAcademiquesController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR, roles_constant_1.Role.TEACHER),
    (0, swagger_1.ApiOperation)({ summary: 'Lister tous les indicateurs académiques' }),
    (0, swagger_1.ApiQuery)({ name: 'programmeId', required: false, description: 'Filtrer par programme' }),
    (0, swagger_1.ApiQuery)({ name: 'periodeId', required: false, description: 'Filtrer par période académique' }),
    __param(0, (0, common_1.Query)('programmeId')),
    __param(1, (0, common_1.Query)('periodeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], IndicateursAcademiquesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir un indicateur académique' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IndicateursAcademiquesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un indicateur académique' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_indicateur_academique_dto_1.CreateIndicateurAcademiqueDto]),
    __metadata("design:returntype", void 0)
], IndicateursAcademiquesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un indicateur académique' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_indicateur_academique_dto_1.UpdateIndicateurAcademiqueDto]),
    __metadata("design:returntype", void 0)
], IndicateursAcademiquesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour partiellement un indicateur académique' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_indicateur_academique_dto_1.UpdateIndicateurAcademiqueDto]),
    __metadata("design:returntype", void 0)
], IndicateursAcademiquesController.prototype, "partialUpdate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un indicateur académique' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IndicateursAcademiquesController.prototype, "remove", null);
exports.IndicateursAcademiquesController = IndicateursAcademiquesController = __decorate([
    (0, swagger_1.ApiTags)('indicateurs-academiques'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('indicateurs-academiques'),
    __metadata("design:paramtypes", [indicateurs_academiques_service_1.IndicateursAcademiquesService])
], IndicateursAcademiquesController);
//# sourceMappingURL=indicateurs-academiques.controller.js.map