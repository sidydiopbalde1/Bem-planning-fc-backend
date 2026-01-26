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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const dto_1 = require("./dto");
const decorators_1 = require("../common/decorators");
const roles_constant_1 = require("../common/constants/roles.constant");
const dto_2 = require("../common/dto");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    findAll(pagination, role) {
        return this.usersService.findAll(pagination, role);
    }
    getProfile(user) {
        return this.usersService.findOne(user.id);
    }
    updateProfile(user, dto) {
        return this.usersService.updateProfile(user.id, dto);
    }
    updatePassword(user, dto) {
        return this.usersService.updatePassword(user.id, dto);
    }
    findOne(id) {
        return this.usersService.findOne(id);
    }
    create(createUserDto, currentUser) {
        return this.usersService.create(createUserDto, currentUser.id, currentUser.email);
    }
    update(id, updateUserDto, currentUser) {
        return this.usersService.update(id, updateUserDto, currentUser.id, currentUser.email);
    }
    remove(id, currentUser) {
        return this.usersService.remove(id, currentUser.id, currentUser.email);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Lister tous les utilisateurs' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_2.PaginationDto, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir son profil' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour son profil' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.UpdateProfileDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Put)('password'),
    (0, swagger_1.ApiOperation)({ summary: 'Changer son mot de passe' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.UpdatePasswordDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir un utilisateur' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un utilisateur' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un utilisateur' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorators_1.Roles)(roles_constant_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un utilisateur' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map