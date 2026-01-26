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
exports.CoordinateurController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const coordinateur_service_1 = require("./coordinateur.service");
const decorators_1 = require("../common/decorators");
const roles_constant_1 = require("../common/constants/roles.constant");
let CoordinateurController = class CoordinateurController {
    coordinateurService;
    constructor(coordinateurService) {
        this.coordinateurService = coordinateurService;
    }
    getProgrammes(user, search, status, semestre) {
        return this.coordinateurService.getProgrammes(user.id, user.role, { search, status, semestre });
    }
    getModules(user, search, status, programmeId) {
        return this.coordinateurService.getModules(user.id, user.role, { search, status, programmeId });
    }
    getDashboard(user) {
        return this.coordinateurService.getDashboard(user.id, user.role);
    }
    checkAlerts(user) {
        return this.coordinateurService.checkAlerts(user.id, user.role);
    }
    triggerAlertCheck(user) {
        return this.coordinateurService.checkAlerts(user.id, user.role);
    }
};
exports.CoordinateurController = CoordinateurController;
__decorate([
    (0, common_1.Get)('programmes'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir les programmes du coordinateur' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('semestre')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], CoordinateurController.prototype, "getProgrammes", null);
__decorate([
    (0, common_1.Get)('modules'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir les modules du coordinateur' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('programmeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], CoordinateurController.prototype, "getModules", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir le dashboard coordinateur' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CoordinateurController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('alerts'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Vérifier les alertes' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CoordinateurController.prototype, "checkAlerts", null);
__decorate([
    (0, common_1.Post)('alerts/check'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Déclencher une vérification des alertes' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CoordinateurController.prototype, "triggerAlertCheck", null);
exports.CoordinateurController = CoordinateurController = __decorate([
    (0, swagger_1.ApiTags)('coordinateur'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('coordinateur'),
    __metadata("design:paramtypes", [coordinateur_service_1.CoordinateurService])
], CoordinateurController);
//# sourceMappingURL=coordinateur.controller.js.map