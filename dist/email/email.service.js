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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let EmailService = EmailService_1 = class EmailService {
    configService;
    logger = new common_1.Logger(EmailService_1.name);
    transporter;
    constructor(configService) {
        this.configService = configService;
        const host = this.configService.get('email.host');
        if (host) {
            this.transporter = nodemailer.createTransport({
                host,
                port: this.configService.get('email.port'),
                secure: this.configService.get('email.secure'),
                auth: {
                    user: this.configService.get('email.user'),
                    pass: this.configService.get('email.password'),
                },
            });
        }
    }
    async sendEmail(options) {
        if (!this.transporter) {
            this.logger.warn('Email non configuré, envoi ignoré');
            return false;
        }
        try {
            await this.transporter.sendMail({
                from: this.configService.get('email.from'),
                ...options,
            });
            this.logger.log(`Email envoyé à ${options.to}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Erreur envoi email: ${error.message}`);
            return false;
        }
    }
    programmeEnRetardTemplate(programme, coordinateur) {
        return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e74c3c;">Programme en retard</h2>
        <p>Bonjour ${coordinateur.name},</p>
        <p>Le programme <strong>${programme.name}</strong> (${programme.code}) est en retard.</p>
        <ul>
          <li>Progression: ${programme.progression}%</li>
          <li>Date de fin prévue: ${new Date(programme.dateFin).toLocaleDateString('fr-FR')}</li>
        </ul>
        <p>Merci de prendre les mesures nécessaires.</p>
      </div>
    `;
    }
    moduleSansIntervenantTemplate(module, programme) {
        return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f39c12;">Module sans intervenant</h2>
        <p>Le module <strong>${module.name}</strong> (${module.code}) du programme ${programme.name} n'a pas d'intervenant assigné.</p>
        <p>Date de début prévue: ${new Date(module.dateDebut).toLocaleDateString('fr-FR')}</p>
      </div>
    `;
    }
    seanceNonTermineeTemplate(seance, intervenant) {
        return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f39c12;">Séance non terminée</h2>
        <p>Bonjour ${intervenant.prenom} ${intervenant.nom},</p>
        <p>La séance du ${new Date(seance.dateSeance).toLocaleDateString('fr-FR')} n'a pas été marquée comme terminée.</p>
        <p>Module: ${seance.module?.name || 'N/A'}</p>
        <p>Horaire: ${seance.heureDebut} - ${seance.heureFin}</p>
      </div>
    `;
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map