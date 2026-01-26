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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("../prisma/prisma.service");
const journal_service_1 = require("../journal/journal.service");
const roles_constant_1 = require("../common/constants/roles.constant");
let AuthService = class AuthService {
    prisma;
    jwtService;
    journalService;
    constructor(prisma, jwtService, journalService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.journalService = journalService;
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        if (!user || !user.password) {
            return null;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }
        return {
            id: user.id,
            email: user.email,
            name: user.name || '',
            role: user.role,
            createdAt: user.createdAt,
        };
    }
    async login(loginDto, ipAddress, userAgent) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            await this.journalService.log({
                action: 'CONNEXION',
                entite: 'Auth',
                entiteId: 'failed',
                description: `Tentative de connexion échouée pour ${loginDto.email}`,
                ipAddress,
                userAgent,
            });
            throw new common_1.UnauthorizedException('Email ou mot de passe invalide');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        await this.journalService.log({
            action: 'CONNEXION',
            entite: 'User',
            entiteId: user.id,
            description: `Connexion de l'utilisateur ${user.name} (${user.email})`,
            userId: user.id,
            userName: user.name,
            ipAddress,
            userAgent,
        });
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }
    async signup(signupDto, ipAddress, userAgent) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: signupDto.email.toLowerCase() },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Un utilisateur avec cet email existe déjà');
        }
        const hashedPassword = await bcrypt.hash(signupDto.password, 12);
        const user = await this.prisma.user.create({
            data: {
                email: signupDto.email.toLowerCase(),
                name: signupDto.name,
                password: hashedPassword,
                role: signupDto.role || roles_constant_1.Role.TEACHER,
            },
        });
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        await this.journalService.log({
            action: 'CREATION',
            entite: 'User',
            entiteId: user.id,
            description: `Inscription de l'utilisateur ${user.name} (${user.email})`,
            nouvelleValeur: { email: user.email, name: user.name, role: user.role },
            userId: user.id,
            userName: user.name || '',
            ipAddress,
            userAgent,
        });
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name || '',
                role: user.role,
                createdAt: user.createdAt,
            },
        };
    }
    async validateGoogleUser(profile, ipAddress, userAgent) {
        let user = await this.prisma.user.findUnique({
            where: { email: profile.email.toLowerCase() },
        });
        if (!user) {
            const randomPassword = await bcrypt.hash(Math.random().toString(36), 12);
            user = await this.prisma.user.create({
                data: {
                    email: profile.email.toLowerCase(),
                    name: profile.name,
                    password: randomPassword,
                    role: roles_constant_1.Role.TEACHER,
                },
            });
            await this.journalService.log({
                action: 'CREATION',
                entite: 'User',
                entiteId: user.id,
                description: `Création du compte via Google pour ${user.name} (${user.email})`,
                nouvelleValeur: { email: user.email, name: user.name, role: user.role },
                userId: user.id,
                userName: user.name || '',
                ipAddress,
                userAgent,
            });
        }
        return {
            id: user.id,
            email: user.email,
            name: user.name || '',
            role: user.role,
            createdAt: user.createdAt,
        };
    }
    async googleLogin(user, ipAddress, userAgent) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        await this.journalService.log({
            action: 'CONNEXION',
            entite: 'User',
            entiteId: user.id,
            description: `Connexion via Google de ${user.name} (${user.email})`,
            userId: user.id,
            userName: user.name,
            ipAddress,
            userAgent,
        });
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Utilisateur non trouvé');
        }
        return {
            id: user.id,
            email: user.email,
            name: user.name || '',
            role: user.role,
            createdAt: user.createdAt,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        journal_service_1.JournalService])
], AuthService);
//# sourceMappingURL=auth.service.js.map