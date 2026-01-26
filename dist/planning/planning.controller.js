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
exports.PlanningController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const planning_service_1 = require("./planning.service");
const decorators_1 = require("../common/decorators");
const roles_constant_1 = require("../common/constants/roles.constant");
let PlanningController = class PlanningController {
    planningService;
    constructor(planningService) {
        this.planningService = planningService;
    }
    getSuggestedSlots(moduleId, intervenantId, startDate, endDate, duree, limit) {
        return this.planningService.getSuggestedSlots({
            moduleId,
            intervenantId,
            startDate: startDate || new Date().toISOString(),
            endDate,
            duree,
            limit,
        });
    }
    generateAutoPlanning(data, user) {
        return this.planningService.generateAutoPlanning(data, user.id, user.name);
    }
};
exports.PlanningController = PlanningController;
__decorate([
    (0, common_1.Get)('schedule'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir des suggestions de créneaux' }),
    __param(0, (0, common_1.Query)('moduleId')),
    __param(1, (0, common_1.Query)('intervenantId')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Query)('duree')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Number, Number]),
    __metadata("design:returntype", void 0)
], PlanningController.prototype, "getSuggestedSlots", null);
__decorate([
    (0, common_1.Post)('schedule'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Générer un planning automatique' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PlanningController.prototype, "generateAutoPlanning", null);
exports.PlanningController = PlanningController = __decorate([
    (0, swagger_1.ApiTags)('planning'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('planning'),
    __metadata("design:paramtypes", [planning_service_1.PlanningService])
], PlanningController);
//# sourceMappingURL=planning.controller.js.map