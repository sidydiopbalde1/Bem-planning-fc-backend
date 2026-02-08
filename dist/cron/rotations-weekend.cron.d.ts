import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class RotationsWeekendCron {
    private prisma;
    private emailService;
    private notificationsService;
    private configService;
    private readonly logger;
    constructor(prisma: PrismaService, emailService: EmailService, notificationsService: NotificationsService, configService: ConfigService);
    handleRotationsCheck(): Promise<void>;
    private notifier7JoursAvant;
    private rappel48hAvant;
    private marquerRotationsEnCours;
    private rotationEmailTemplate;
}
