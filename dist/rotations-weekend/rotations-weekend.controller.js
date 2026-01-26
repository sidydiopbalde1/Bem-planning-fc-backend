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
exports.RotationsWeekendController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rotations_weekend_service_1 = require("./rotations-weekend.service");
const decorators_1 = require("../common/decorators");
const roles_constant_1 = require("../common/constants/roles.constant");
const dto_1 = require("../common/dto");
let RotationsWeekendController = class RotationsWeekendController {
    rotationsService;
    constructor(rotationsService) {
        this.rotationsService = rotationsService;
    }
    findAll(pagination, annee, responsableId, status) {
        return this.rotationsService.findAll(pagination, { annee, responsableId, status });
    }
    findOne(id) {
        return this.rotationsService.findOne(id);
    }
    generateRotations(nbSemaines = 12, dateDebut, user) {
        return this.rotationsService.generateRotations(nbSemaines, dateDebut ? new Date(dateDebut) : undefined, user?.id, user?.name);
    }
    declareAbsence(id, raison, user) {
        return this.rotationsService.declareAbsence(id, raison, user.id, user.name);
    }
    terminerRotation(id, rapportData, user) {
        return this.rotationsService.terminerRotation(id, rapportData, user?.id, user?.name);
    }
};
exports.RotationsWeekendController = RotationsWeekendController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les rotations' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('annee')),
    __param(2, (0, common_1.Query)('responsableId')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.PaginationDto, String, String, String]),
    __metadata("design:returntype", void 0)
], RotationsWeekendController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir une rotation' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RotationsWeekendController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('generate'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Générer les rotations' }),
    __param(0, (0, common_1.Body)('nbSemaines')),
    __param(1, (0, common_1.Body)('dateDebut')),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", void 0)
], RotationsWeekendController.prototype, "generateRotations", null);
__decorate([
    (0, common_1.Post)(':id/absence'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Déclarer une absence' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('raison')),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], RotationsWeekendController.prototype, "declareAbsence", null);
__decorate([
    (0, common_1.Post)(':id/terminer'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Terminer une rotation' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], RotationsWeekendController.prototype, "terminerRotation", null);
exports.RotationsWeekendController = RotationsWeekendController = __decorate([
    (0, swagger_1.ApiTags)('rotations-weekend'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('rotations-weekend'),
    __metadata("design:paramtypes", [rotations_weekend_service_1.RotationsWeekendService])
], RotationsWeekendController);
//# sourceMappingURL=rotations-weekend.controller.js.map