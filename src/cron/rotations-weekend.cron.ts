import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class RotationsWeekendCron {
  private readonly logger = new Logger(RotationsWeekendCron.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private notificationsService: NotificationsService,
    private configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleRotationsCheck() {
    if (!this.configService.get('cron.enabled')) {
      this.logger.log('Cron désactivé');
      return;
    }

    this.logger.log('Vérification des rotations weekend...');

    try {
      const stats = {
        notifications7j: 0,
        rappels48h: 0,
        passagesEnCours: 0,
        errors: 0,
      };

      await this.notifier7JoursAvant(stats);
      await this.rappel48hAvant(stats);
      await this.marquerRotationsEnCours(stats);

      this.logger.log(
        `Rotations: ${stats.notifications7j} notif(s), ${stats.rappels48h} rappel(s), ${stats.passagesEnCours} en cours, ${stats.errors} erreur(s)`,
      );
    } catch (error) {
      this.logger.error('Erreur vérification rotations', error.stack);
    }
  }

  /**
   * Notifier les responsables 7 jours avant leur rotation
   */
  private async notifier7JoursAvant(stats: Record<string, number>) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dans7Jours = new Date(today);
    dans7Jours.setDate(dans7Jours.getDate() + 7);

    const lendemain = new Date(dans7Jours);
    lendemain.setDate(lendemain.getDate() + 1);

    const rotations = await this.prisma.rotationWeekend.findMany({
      where: {
        dateDebut: { gte: dans7Jours, lt: lendemain },
        status: 'PLANIFIE',
        notificationEnvoyee: false,
      },
      include: { responsable: true },
    });

    for (const rotation of rotations) {
      try {
        await this.notificationsService.create({
          titre: 'Rotation Weekend dans 7 jours',
          message: `Vous êtes assigné à la supervision du weekend du ${new Date(rotation.dateDebut).toLocaleDateString('fr-FR')}. ${rotation.nbSeancesTotal} séance(s) prévue(s).`,
          type: 'SYSTEME',
          priorite: 'NORMALE',
          destinataireId: rotation.responsableId,
          lienAction: `/rotations-weekend/${rotation.id}`,
        });

        if (rotation.responsable?.email) {
          await this.emailService.sendEmail({
            to: rotation.responsable.email,
            subject: `[BEM Planning] Rotation Weekend dans 7 jours - ${new Date(rotation.dateDebut).toLocaleDateString('fr-FR')}`,
            html: this.rotationEmailTemplate(rotation, rotation.responsable, '7 jours', false),
          });
        }

        await this.prisma.rotationWeekend.update({
          where: { id: rotation.id },
          data: { notificationEnvoyee: true },
        });

        stats.notifications7j++;
        this.logger.log(`Notification 7j envoyée à ${rotation.responsable?.name}`);
      } catch (error) {
        stats.errors++;
        this.logger.error(`Erreur notification rotation ${rotation.id}:`, error.message);
      }
    }
  }

  /**
   * Rappel 48h avant la rotation
   */
  private async rappel48hAvant(stats: Record<string, number>) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dans2Jours = new Date(today);
    dans2Jours.setDate(dans2Jours.getDate() + 2);

    const lendemain = new Date(dans2Jours);
    lendemain.setDate(lendemain.getDate() + 1);

    const rotations = await this.prisma.rotationWeekend.findMany({
      where: {
        dateDebut: { gte: dans2Jours, lt: lendemain },
        status: { in: ['PLANIFIE', 'CONFIRME'] },
        rappelEnvoye: false,
      },
      include: { responsable: true },
    });

    for (const rotation of rotations) {
      try {
        await this.notificationsService.create({
          titre: 'Rappel: Rotation ce weekend',
          message: `Rappel: Vous superviserez les cours ce weekend (${new Date(rotation.dateDebut).toLocaleDateString('fr-FR')}). Pensez à confirmer votre présence.`,
          type: 'SYSTEME',
          priorite: 'HAUTE',
          destinataireId: rotation.responsableId,
          lienAction: `/rotations-weekend/${rotation.id}`,
        });

        if (rotation.responsable?.email) {
          await this.emailService.sendEmail({
            to: rotation.responsable.email,
            subject: `[BEM Planning] Rappel: Supervision Weekend - ${new Date(rotation.dateDebut).toLocaleDateString('fr-FR')}`,
            html: this.rotationEmailTemplate(rotation, rotation.responsable, '48 heures', true),
          });
        }

        await this.prisma.rotationWeekend.update({
          where: { id: rotation.id },
          data: { rappelEnvoye: true },
        });

        stats.rappels48h++;
        this.logger.log(`Rappel 48h envoyé à ${rotation.responsable?.name}`);
      } catch (error) {
        stats.errors++;
        this.logger.error(`Erreur rappel rotation ${rotation.id}:`, error.message);
      }
    }
  }

  /**
   * Passer les rotations confirmées au statut EN_COURS le jour J
   */
  private async marquerRotationsEnCours(stats: Record<string, number>) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await this.prisma.rotationWeekend.updateMany({
      where: {
        dateDebut: { lte: today },
        dateFin: { gte: today },
        status: 'CONFIRME',
      },
      data: { status: 'EN_COURS' },
    });

    stats.passagesEnCours = result.count;

    if (result.count > 0) {
      this.logger.log(`${result.count} rotation(s) passée(s) EN_COURS`);
    }
  }

  /**
   * Template email pour les notifications de rotation
   */
  private rotationEmailTemplate(
    rotation: any,
    responsable: any,
    delai: string,
    isRappel: boolean,
  ): string {
    const frontendUrl = this.configService.get<string>('frontend.url');
    const dateDebut = new Date(rotation.dateDebut).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const dateFin = new Date(rotation.dateFin).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0;">${isRappel ? 'Rappel: Supervision Weekend' : 'Rotation Weekend'}</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">BEM Planning FC</p>
        </div>

        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <p>Bonjour <strong>${responsable.name ?? 'Responsable'}</strong>,</p>

          ${
            isRappel
              ? `<div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 5px; margin: 15px 0;">
                  <strong>Rappel important:</strong> Votre rotation de supervision est prévue <strong>ce weekend</strong>.
                </div>`
              : `<p>Vous avez été assigné à la supervision des cours du weekend dans <strong>${delai}</strong>.</p>`
          }

          <div style="background: white; border-left: 4px solid #DC2626; padding: 15px; margin: 15px 0; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #DC2626;">Détails de la Rotation</h3>
            <p><strong>Date:</strong> ${dateDebut} - ${dateFin}</p>
            <p><strong>Semaine:</strong> ${rotation.semaineNumero}</p>
            <p><strong>Séances prévues:</strong> ${rotation.nbSeancesTotal}</p>
          </div>

          ${
            isRappel
              ? `<div style="background: white; border-left: 4px solid #10b981; padding: 15px; border-radius: 5px; margin: 15px 0;">
                  <h4 style="margin-top: 0; color: #10b981;">A faire avant le weekend:</h4>
                  <ul>
                    <li>Confirmer votre présence dans l'application</li>
                    <li>Consulter le planning des séances à superviser</li>
                    <li>En cas d'empêchement, déclarer votre absence au plus tôt</li>
                  </ul>
                </div>`
              : `<p><strong>Note:</strong> Si vous n'êtes pas disponible, déclarez votre absence dans l'application pour qu'un remplaçant soit assigné.</p>`
          }

          <p style="text-align: center;">
            <a href="${frontendUrl}/rotations-weekend/${rotation.id}"
               style="display: inline-block; background: #DC2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">
              Voir les Détails
            </a>
          </p>
        </div>

        <div style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px;">
          <p>Message envoyé automatiquement par BEM Planning FC.</p>
        </div>
      </div>
    `;
  }
}
