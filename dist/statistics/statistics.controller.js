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
exports.StatisticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const statistics_service_1 = require("./statistics.service");
const decorators_1 = require("../common/decorators");
const roles_constant_1 = require("../common/constants/roles.constant");
let StatisticsController = class StatisticsController {
    statisticsService;
    constructor(statisticsService) {
        this.statisticsService = statisticsService;
    }
    async getStatistics(user, type = 'global', startDate, endDate) {
        switch (type) {
            case 'global':
                return this.statisticsService.getGlobalStatistics(user.id, user.role);
            case 'intervenants':
                return this.statisticsService.getIntervenantsStatistics(user.id, user.role, startDate, endDate);
            case 'programmes':
                return this.statisticsService.getProgrammesStatistics(user.id, user.role);
            case 'planning':
                return this.statisticsService.getPlanningStatistics(user.id, user.role, startDate, endDate);
            case 'performance':
                return this.statisticsService.getPerformanceIndicators(user.id, user.role);
            default:
                return this.statisticsService.getGlobalStatistics(user.id, user.role);
        }
    }
    async getGlobalStatistics(user) {
        return this.statisticsService.getGlobalStatistics(user.id, user.role);
    }
    async getIntervenantsStatistics(user, startDate, endDate) {
        return this.statisticsService.getIntervenantsStatistics(user.id, user.role, startDate, endDate);
    }
    async getProgrammesStatistics(user) {
        return this.statisticsService.getProgrammesStatistics(user.id, user.role);
    }
    async getPlanningStatistics(user, startDate, endDate) {
        return this.statisticsService.getPlanningStatistics(user.id, user.role, startDate, endDate);
    }
    async getPerformanceIndicators(user) {
        return this.statisticsService.getPerformanceIndicators(user.id, user.role);
    }
};
exports.StatisticsController = StatisticsController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir les statistiques' }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: false,
        enum: ['global', 'intervenants', 'programmes', 'planning', 'performance'],
        description: 'Type de statistiques à récupérer',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: false,
        description: 'Date de début (format ISO)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: false,
        description: 'Date de fin (format ISO)',
    }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('global'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Statistiques globales du système' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getGlobalStatistics", null);
__decorate([
    (0, common_1.Get)('intervenants'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Statistiques par intervenant' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getIntervenantsStatistics", null);
__decorate([
    (0, common_1.Get)('programmes'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Statistiques par programme' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getProgrammesStatistics", null);
__decorate([
    (0, common_1.Get)('planning'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Statistiques de planning' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getPlanningStatistics", null);
__decorate([
    (0, common_1.Get)('performance'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Indicateurs de performance (KPI)' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getPerformanceIndicators", null);
exports.StatisticsController = StatisticsController = __decorate([
    (0, swagger_1.ApiTags)('statistics'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('statistics'),
    __metadata("design:paramtypes", [statistics_service_1.StatisticsService])
], StatisticsController);
//# sourceMappingURL=statistics.controller.js.map