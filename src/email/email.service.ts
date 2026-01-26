import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
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

  async sendEmail(options: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }): Promise<boolean> {
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
    } catch (error) {
      this.logger.error(`Erreur envoi email: ${error.message}`);
      return false;
    }
  }

  // Templates
  programmeEnRetardTemplate(programme: any, coordinateur: any): string {
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

  moduleSansIntervenantTemplate(module: any, programme: any): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f39c12;">Module sans intervenant</h2>
        <p>Le module <strong>${module.name}</strong> (${module.code}) du programme ${programme.name} n'a pas d'intervenant assigné.</p>
        <p>Date de début prévue: ${new Date(module.dateDebut).toLocaleDateString('fr-FR')}</p>
      </div>
    `;
  }

  seanceNonTermineeTemplate(seance: any, intervenant: any): string {
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
}
