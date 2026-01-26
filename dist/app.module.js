"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const schedule_1 = require("@nestjs/schedule");
const configuration_1 = __importDefault(require("./config/configuration"));
const validation_schema_1 = require("./config/validation.schema");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const intervenants_module_1 = require("./intervenants/intervenants.module");
const programmes_module_1 = require("./programmes/programmes.module");
const modules_module_1 = require("./modules/modules.module");
const seances_module_1 = require("./seances/seances.module");
const planning_module_1 = require("./planning/planning.module");
const salles_module_1 = require("./salles/salles.module");
const notifications_module_1 = require("./notifications/notifications.module");
const email_module_1 = require("./email/email.module");
const journal_module_1 = require("./journal/journal.module");
const rotations_weekend_module_1 = require("./rotations-weekend/rotations-weekend.module");
const evaluations_module_1 = require("./evaluations/evaluations.module");
const coordinateur_module_1 = require("./coordinateur/coordinateur.module");
const admin_module_1 = require("./admin/admin.module");
const cron_module_1 = require("./cron/cron.module");
const periodes_academiques_module_1 = require("./periodes-academiques/periodes-academiques.module");
const activites_academiques_module_1 = require("./activites-academiques/activites-academiques.module");
const statistics_module_1 = require("./statistics/statistics.module");
const activities_module_1 = require("./activities/activities.module");
const indicateurs_academiques_module_1 = require("./indicateurs-academiques/indicateurs-academiques.module");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const roles_guard_1 = require("./common/guards/roles.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
                validationSchema: validation_schema_1.validationSchema,
            }),
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            intervenants_module_1.IntervenantsModule,
            programmes_module_1.ProgrammesModule,
            modules_module_1.ModulesModule,
            seances_module_1.SeancesModule,
            planning_module_1.PlanningModule,
            salles_module_1.SallesModule,
            notifications_module_1.NotificationsModule,
            email_module_1.EmailModule,
            journal_module_1.JournalModule,
            rotations_weekend_module_1.RotationsWeekendModule,
            evaluations_module_1.EvaluationsModule,
            coordinateur_module_1.CoordinateurModule,
            admin_module_1.AdminModule,
            cron_module_1.CronModule,
            periodes_academiques_module_1.PeriodesAcademiquesModule,
            activites_academiques_module_1.ActivitesAcademiquesModule,
            statistics_module_1.StatisticsModule,
            activities_module_1.ActivitiesModule,
            indicateurs_academiques_module_1.IndicateursAcademiquesModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map