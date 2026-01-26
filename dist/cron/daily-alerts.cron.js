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
var DailyAlertsCron_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyAlertsCron = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
const notifications_service_1 = require("../notifications/notifications.service");
let DailyAlertsCron = DailyAlertsCron_1 = class DailyAlertsCron {
    prisma;
    emailService;
    notificationsService;
    configService;
    logger = new common_1.Logger(DailyAlertsCron_1.name);
    constructor(prisma, emailService, notificationsService, configService) {
        this.prisma = prisma;
        this.emailService = emailService;
        this.notificationsService = notificationsService;
        this.configService = configService;
    }
    async handleDailyAlerts() {
        if (!this.configService.get('cron.enabled')) {
            this.logger.log('Cron désactivé');
            return;
        }
        this.logger.log('Exécution des alertes quotidiennes');
        try {
            await this.checkProgrammesEnRetard();
            await this.checkModulesSansIntervenant();
            await this.checkSeancesNonTerminees();
            this.logger.log('Alertes quotidiennes terminées');
        }
        catch (error) {
            this.logger.error('Erreur alertes quotidiennes', error.stack);
        }
    }
    async checkProgrammesEnRetard() {
        const now = new Date();
        const programmes = await this.prisma.programme.findMany({
            where: {
                status: { not: 'TERMINE' },
                dateFin: { lt: now },
                progression: { lt: 100 },
            },
            include: {
                user: true,
            },
        });
        for (const programme of programmes) {
            if (programme.user?.email) {
                await this.emailService.sendEmail({
                    to: programme.user.email,
                    subject: `[BEM Planning] Programme en retard: ${programme.name}`,
                    html: this.emailService.programmeEnRetardTemplate(programme, programme.user),
                });
                await this.notificationsService.create({
                    titre: 'Programme en retard',
                    message: `Le programme ${programme.name} est en retard`,
                    type: 'PROGRAMME_EN_RETARD',
                    priorite: 'HAUTE',
                    destinataireId: programme.userId,
                });
            }
        }
        this.logger.log(`${programmes.length} programmes en retard notifiés`);
    }
    async checkModulesSansIntervenant() {
        const sevenDays = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const modules = await this.prisma.module.findMany({
            where: {
                intervenantId: null,
                dateDebut: { lte: sevenDays },
            },
            include: {
                programme: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        for (const module of modules) {
            if (module.programme.user?.email) {
                await this.notificationsService.create({
                    titre: 'Module sans intervenant',
                    message: `Le module ${module.name} n'a pas d'intervenant assigné`,
                    type: 'MODULE_SANS_INTERVENANT',
                    priorite: 'HAUTE',
                    destinataireId: module.programme.userId,
                });
            }
        }
        this.logger.log(`${modules.length} modules sans intervenant notifiés`);
    }
    async checkSeancesNonTerminees() {
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
        const seances = await this.prisma.seance.findMany({
            where: {
                dateSeance: { lt: twoHoursAgo },
                status: { notIn: ['TERMINE', 'ANNULE'] },
            },
            include: {
                module: true,
                intervenant: true,
            },
        });
        for (const seance of seances) {
            if (seance.intervenant?.email) {
                await this.emailService.sendEmail({
                    to: seance.intervenant.email,
                    subject: `[BEM Planning] Séance non terminée`,
                    html: this.emailService.seanceNonTermineeTemplate(seance, seance.intervenant),
                });
            }
        }
        this.logger.log(`${seances.length} séances non terminées notifiées`);
    }
};
exports.DailyAlertsCron = DailyAlertsCron;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_8AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DailyAlertsCron.prototype, "handleDailyAlerts", null);
exports.DailyAlertsCron = DailyAlertsCron = DailyAlertsCron_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService,
        notifications_service_1.NotificationsService,
        config_1.ConfigService])
], DailyAlertsCron);
//# sourceMappingURL=daily-alerts.cron.js.map