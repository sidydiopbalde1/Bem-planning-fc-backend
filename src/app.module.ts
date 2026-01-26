import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { IntervenantsModule } from './intervenants/intervenants.module';
import { ProgrammesModule } from './programmes/programmes.module';
import { ModulesModule } from './modules/modules.module';
import { SeancesModule } from './seances/seances.module';
import { PlanningModule } from './planning/planning.module';
import { SallesModule } from './salles/salles.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EmailModule } from './email/email.module';
import { JournalModule } from './journal/journal.module';
import { RotationsWeekendModule } from './rotations-weekend/rotations-weekend.module';
import { EvaluationsModule } from './evaluations/evaluations.module';
import { CoordinateurModule } from './coordinateur/coordinateur.module';
import { AdminModule } from './admin/admin.module';
import { CronModule } from './cron/cron.module';
import { PeriodesAcademiquesModule } from './periodes-academiques/periodes-academiques.module';
import { ActivitesAcademiquesModule } from './activites-academiques/activites-academiques.module';
import { StatisticsModule } from './statistics/statistics.module';
import { ActivitiesModule } from './activities/activities.module';
import { IndicateursAcademiquesModule } from './indicateurs-academiques/indicateurs-academiques.module';

import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),

    // Schedule pour les cron jobs
    ScheduleModule.forRoot(),

    // Modules core
    PrismaModule,
    AuthModule,

    // Modules métier
    UsersModule,
    IntervenantsModule,
    ProgrammesModule,
    ModulesModule,
    SeancesModule,
    PlanningModule,
    SallesModule,
    NotificationsModule,
    EmailModule,
    JournalModule,
    RotationsWeekendModule,
    EvaluationsModule,
    CoordinateurModule,
    AdminModule,
    CronModule,
    PeriodesAcademiquesModule,
    ActivitesAcademiquesModule,
    StatisticsModule,
    ActivitiesModule,
    IndicateursAcademiquesModule,
  ],
  providers: [
    // Guards globaux
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
