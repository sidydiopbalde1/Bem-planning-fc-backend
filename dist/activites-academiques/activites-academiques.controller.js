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
exports.ActivitesAcademiquesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const activites_academiques_service_1 = require("./activites-academiques.service");
const create_activite_academique_dto_1 = require("./dto/create-activite-academique.dto");
const update_activite_academique_dto_1 = require("./dto/update-activite-academique.dto");
const decorators_1 = require("../common/decorators");
const roles_constant_1 = require("../common/constants/roles.constant");
let ActivitesAcademiquesController = class ActivitesAcademiquesController {
    activitesService;
    constructor(activitesService) {
        this.activitesService = activitesService;
    }
    findAll(programmeId, periodeId) {
        return this.activitesService.findAll(programmeId, periodeId);
    }
    findOne(id) {
        return this.activitesService.findOne(id);
    }
    create(data) {
        return this.activitesService.create(data);
    }
    update(id, data) {
        return this.activitesService.update(id, data);
    }
    partialUpdate(id, data) {
        return this.activitesService.update(id, data);
    }
    remove(id) {
        return this.activitesService.remove(id);
    }
};
exports.ActivitesAcademiquesController = ActivitesAcademiquesController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR, roles_constant_1.Role.TEACHER),
    (0, swagger_1.ApiOperation)({ summary: 'Lister toutes les activités académiques' }),
    __param(0, (0, common_1.Query)('programmeId')),
    __param(1, (0, common_1.Query)('periodeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ActivitesAcademiquesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir une activité académique' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ActivitesAcademiquesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une activité académique' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_activite_academique_dto_1.CreateActiviteAcademiqueDto]),
    __metadata("design:returntype", void 0)
], ActivitesAcademiquesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une activité académique' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_activite_academique_dto_1.UpdateActiviteAcademiqueDto]),
    __metadata("design:returntype", void 0)
], ActivitesAcademiquesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour partiellement une activité académique' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_activite_academique_dto_1.UpdateActiviteAcademiqueDto]),
    __metadata("design:returntype", void 0)
], ActivitesAcademiquesController.prototype, "partialUpdate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une activité académique' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ActivitesAcademiquesController.prototype, "remove", null);
exports.ActivitesAcademiquesController = ActivitesAcademiquesController = __decorate([
    (0, swagger_1.ApiTags)('activites-academiques'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('activites-academiques'),
    __metadata("design:paramtypes", [activites_academiques_service_1.ActivitesAcademiquesService])
], ActivitesAcademiquesController);
//# sourceMappingURL=activites-academiques.controller.js.map