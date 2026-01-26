"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("../prisma/prisma.service");
const journal_service_1 = require("../journal/journal.service");
const roles_constant_1 = require("../common/constants/roles.constant");
let UsersService = class UsersService {
    prisma;
    journalService;
    constructor(prisma, journalService) {
        this.prisma = prisma;
        this.journalService = journalService;
    }
    async create(createUserDto, currentUserId, currentUserName) {
        const existing = await this.findByEmail(createUserDto.email);
        if (existing) {
            throw new common_1.ConflictException('Un utilisateur avec cet email existe déjà');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
        const user = await this.prisma.user.create({
            data: {
                email: createUserDto.email.toLowerCase(),
                name: createUserDto.name,
                password: hashedPassword,
                role: createUserDto.role || roles_constant_1.Role.TEACHER,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });
        await this.journalService.log({
            action: 'CREATION',
            entite: 'User',
            entiteId: user.id,
            description: `Création de l'utilisateur ${user.name} (${user.email})`,
            nouvelleValeur: { email: user.email, name: user.name, role: user.role },
            userId: currentUserId,
            userName: currentUserName,
        });
        return user;
    }
    async findAll(pagination, role) {
        const { skip, take, search, sortBy, sortOrder } = pagination;
        const where = {};
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (role) {
            where.role = role;
        }
        const [users, total, statsByRole] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
            }),
            this.prisma.user.count({ where }),
            this.prisma.user.groupBy({
                by: ['role'],
                _count: true,
            }),
        ]);
        const limit = pagination.limit ?? 20;
        return {
            data: users,
            pagination: {
                page: pagination.page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
            stats: {
                byRole: statsByRole.reduce((acc, item) => {
                    acc[item.role] = item._count;
                    return acc;
                }, {}),
            },
        };
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        return user;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
    }
    async update(id, updateUserDto, currentUserId, currentUserName) {
        const oldUser = await this.findOne(id);
        if (updateUserDto.email) {
            const existing = await this.prisma.user.findFirst({
                where: {
                    email: updateUserDto.email.toLowerCase(),
                    NOT: { id },
                },
            });
            if (existing) {
                throw new common_1.ConflictException('Un utilisateur avec cet email existe déjà');
            }
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: {
                ...(updateUserDto.email && { email: updateUserDto.email.toLowerCase() }),
                ...(updateUserDto.name && { name: updateUserDto.name }),
                ...(updateUserDto.role && { role: updateUserDto.role }),
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                updatedAt: true,
            },
        });
        await this.journalService.log({
            action: 'MODIFICATION',
            entite: 'User',
            entiteId: id,
            description: `Modification de l'utilisateur ${updatedUser.name} (${updatedUser.email})`,
            ancienneValeur: { email: oldUser.email, name: oldUser.name, role: oldUser.role },
            nouvelleValeur: { email: updatedUser.email, name: updatedUser.name, role: updatedUser.role },
            userId: currentUserId,
            userName: currentUserName,
        });
        return updatedUser;
    }
    async updateProfile(userId, dto) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { name: dto.name },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                updatedAt: true,
            },
        });
    }
    async updatePassword(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        const isValid = await bcrypt.compare(dto.currentPassword, user.password);
        if (!isValid) {
            throw new common_1.ConflictException('Mot de passe actuel incorrect');
        }
        const hashedPassword = await bcrypt.hash(dto.newPassword, 12);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        return { message: 'Mot de passe mis à jour avec succès' };
    }
    async remove(id, currentUserId, currentUserName) {
        const user = await this.findOne(id);
        await this.prisma.user.delete({
            where: { id },
        });
        await this.journalService.log({
            action: 'SUPPRESSION',
            entite: 'User',
            entiteId: id,
            description: `Suppression de l'utilisateur ${user.name} (${user.email})`,
            ancienneValeur: { email: user.email, name: user.name, role: user.role },
            userId: currentUserId,
            userName: currentUserName,
        });
        return { message: 'Utilisateur supprimé avec succès' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        journal_service_1.JournalService])
], UsersService);
//# sourceMappingURL=users.service.js.map