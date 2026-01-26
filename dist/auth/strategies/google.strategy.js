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
var GoogleStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("../auth.service");
let GoogleStrategy = GoogleStrategy_1 = class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    authService;
    logger = new common_1.Logger(GoogleStrategy_1.name);
    constructor(configService, authService) {
        const clientID = configService.get('google.clientId') || 'not-configured';
        const clientSecret = configService.get('google.clientSecret') || 'not-configured';
        const callbackURL = configService.get('google.callbackUrl') || 'http://localhost:3001/api/auth/google/callback';
        super({
            clientID,
            clientSecret,
            callbackURL,
            scope: ['email', 'profile'],
        });
        this.authService = authService;
        if (clientID === 'not-configured') {
            this.logger.warn('Google OAuth non configuré. Définissez GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET.');
        }
    }
    async validate(accessToken, refreshToken, profile) {
        const { emails, displayName } = profile;
        const email = emails?.[0]?.value;
        if (!email) {
            throw new Error('Email non disponible depuis Google');
        }
        return this.authService.validateGoogleUser({
            email,
            name: displayName,
        });
    }
};
exports.GoogleStrategy = GoogleStrategy;
exports.GoogleStrategy = GoogleStrategy = GoogleStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        auth_service_1.AuthService])
], GoogleStrategy);
//# sourceMappingURL=google.strategy.js.map