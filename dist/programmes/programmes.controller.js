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
exports.ProgrammesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const programmes_service_1 = require("./programmes.service");
const decorators_1 = require("../common/decorators");
const roles_constant_1 = require("../common/constants/roles.constant");
const dto_1 = require("../common/dto");
let ProgrammesController = class ProgrammesController {
    programmesService;
    constructor(programmesService) {
        this.programmesService = programmesService;
    }
    findAll(user, pagination, status, semestre) {
        return this.programmesService.findAll(user.id, user.role, pagination, { status, semestre });
    }
    findOne(user, id) {
        return this.programmesService.findOne(id, user.id, user.role);
    }
    create(user, data) {
        return this.programmesService.create(data, user.id, user.name);
    }
    update(user, id, data) {
        return this.programmesService.update(id, data, user.id, user.role, user.name);
    }
    remove(user, id) {
        return this.programmesService.remove(id, user.id, user.role, user.name);
    }
};
exports.ProgrammesController = ProgrammesController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Lister tous les programmes' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('semestre')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.PaginationDto, String, String]),
    __metadata("design:returntype", void 0)
], ProgrammesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir un programme' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProgrammesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un programme' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProgrammesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un programme' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], ProgrammesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.COORDINATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un programme' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProgrammesController.prototype, "remove", null);
exports.ProgrammesController = ProgrammesController = __decorate([
    (0, swagger_1.ApiTags)('programmes'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('programmes'),
    __metadata("design:paramtypes", [programmes_service_1.ProgrammesService])
], ProgrammesController);
//# sourceMappingURL=programmes.controller.js.map