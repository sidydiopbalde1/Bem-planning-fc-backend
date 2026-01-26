import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class DailyAlertsCron {
  private readonly logger = new Logger(DailyAlertsCron.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private notificationsService: NotificationsService,
    private configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
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
    } catch (error) {
      this.logger.error('Erreur alertes quotidiennes', error.stack);
    }
  }

  private async checkProgrammesEnRetard() {
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

  private async checkModulesSansIntervenant() {
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

  private async checkSeancesNonTerminees() {
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
}
