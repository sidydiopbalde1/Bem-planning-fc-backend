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
exports.ActivitiesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const activities_service_1 = require("./activities.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
let ActivitiesController = class ActivitiesController {
    activitiesService;
    constructor(activitiesService) {
        this.activitiesService = activitiesService;
    }
    getRecentActivities(limit) {
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.activitiesService.getRecentActivities(limitNum);
    }
};
exports.ActivitiesController = ActivitiesController;
__decorate([
    (0, common_1.Get)('recent'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir les activités récentes pour le dashboard' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Nombre d\'activités à retourner (max 50)' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ActivitiesController.prototype, "getRecentActivities", null);
exports.ActivitiesController = ActivitiesController = __decorate([
    (0, swagger_1.ApiTags)('activities'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('activities'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [activities_service_1.ActivitiesService])
], ActivitiesController);
//# sourceMappingURL=activities.controller.js.map