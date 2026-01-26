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
exports.EvaluationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const evaluations_service_1 = require("./evaluations.service");
const decorators_1 = require("../common/decorators");
const roles_constant_1 = require("../common/constants/roles.constant");
const dto_1 = require("../common/dto");
let EvaluationsController = class EvaluationsController {
    evaluationsService;
    constructor(evaluationsService) {
        this.evaluationsService = evaluationsService;
    }
    findAll(pagination, moduleId, statut) {
        return this.evaluationsService.findAll(pagination, { moduleId, statut });
    }
    findOne(id) {
        return this.evaluationsService.findOne(id);
    }
    create(data, user) {
        return this.evaluationsService.create(data, user.id, user.name);
    }
    update(id, data, user) {
        return this.evaluationsService.update(id, data, user.id, user.name);
    }
    remove(id, user) {
        return this.evaluationsService.remove(id, user.id, user.name);
    }
    findByLien(lien) {
        return this.evaluationsService.findByLien(lien);
    }
    submitResponse(lien, responses) {
        return this.evaluationsService.submitResponse(lien, responses);
    }
};
exports.EvaluationsController = EvaluationsController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les évaluations' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('moduleId')),
    __param(2, (0, common_1.Query)('statut')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.PaginationDto, String, String]),
    __metadata("design:returntype", void 0)
], EvaluationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir une évaluation' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EvaluationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une évaluation' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], EvaluationsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une évaluation' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], EvaluationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une évaluation' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EvaluationsController.prototype, "remove", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Get)('public/:lien'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir une évaluation par lien (public)' }),
    __param(0, (0, common_1.Param)('lien')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EvaluationsController.prototype, "findByLien", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Post)('public/:lien/submit'),
    (0, swagger_1.ApiOperation)({ summary: 'Soumettre une réponse d\'évaluation (public)' }),
    __param(0, (0, common_1.Param)('lien')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EvaluationsController.prototype, "submitResponse", null);
exports.EvaluationsController = EvaluationsController = __decorate([
    (0, swagger_1.ApiTags)('evaluations'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('evaluations-enseignements'),
    __metadata("design:paramtypes", [evaluations_service_1.EvaluationsService])
], EvaluationsController);
//# sourceMappingURL=evaluations.controller.js.map