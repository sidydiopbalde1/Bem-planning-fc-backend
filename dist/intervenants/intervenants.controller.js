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
exports.IntervenantsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const intervenants_service_1 = require("./intervenants.service");
const decorators_1 = require("../common/decorators");
const roles_constant_1 = require("../common/constants/roles.constant");
const dto_1 = require("../common/dto");
let IntervenantsController = class IntervenantsController {
    intervenantsService;
    constructor(intervenantsService) {
        this.intervenantsService = intervenantsService;
    }
    findAll(pagination) {
        return this.intervenantsService.findAll(pagination);
    }
    getMesSeances(user, status, startDate, endDate) {
        return this.intervenantsService.getMesSeances(user.email, { status, startDate, endDate });
    }
    findOne(id) {
        return this.intervenantsService.findOne(id);
    }
    create(data, user) {
        return this.intervenantsService.create(data, user.id, user.name);
    }
    update(id, data, user) {
        return this.intervenantsService.update(id, data, user.id, user.name);
    }
    updateDisponibilite(id, disponible, user) {
        return this.intervenantsService.updateDisponibilite(id, disponible, user.id, user.name);
    }
    remove(id, user) {
        return this.intervenantsService.remove(id, user.id, user.name);
    }
};
exports.IntervenantsController = IntervenantsController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Lister tous les intervenants' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], IntervenantsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('mes-seances'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir mes séances (pour intervenant)' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], IntervenantsController.prototype, "getMesSeances", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir un intervenant' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IntervenantsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un intervenant' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], IntervenantsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un intervenant' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], IntervenantsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/disponibilite'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour la disponibilité' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('disponible')),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, Object]),
    __metadata("design:returntype", void 0)
], IntervenantsController.prototype, "updateDisponibilite", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un intervenant' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], IntervenantsController.prototype, "remove", null);
exports.IntervenantsController = IntervenantsController = __decorate([
    (0, swagger_1.ApiTags)('intervenants'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('intervenants'),
    __metadata("design:paramtypes", [intervenants_service_1.IntervenantsService])
], IntervenantsController);
//# sourceMappingURL=intervenants.controller.js.map