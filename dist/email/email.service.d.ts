import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    sendEmail(options: {
        to: string;
        subject: string;
        html: string;
        text?: string;
    }): Promise<boolean>;
    programmeEnRetardTemplate(programme: any, coordinateur: any): string;
    moduleSansIntervenantTemplate(module: any, programme: any): string;
    seanceNonTermineeTemplate(seance: any, intervenant: any): string;
}
