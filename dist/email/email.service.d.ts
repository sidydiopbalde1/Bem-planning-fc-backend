import { ConfigService } from '@nestjs/config';
interface ProgrammeEmailData {
    name: string;
    code: string;
    progression: number;
    dateFin: string | Date;
}
interface CoordinateurEmailData {
    name: string | null;
}
interface ModuleEmailData {
    name: string;
    code: string;
    dateDebut: string | Date;
}
interface SeanceEmailData {
    dateSeance: string | Date;
    heureDebut: string;
    heureFin: string;
    module?: {
        name: string;
    };
}
interface IntervenantEmailData {
    prenom: string;
    nom: string;
}
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
    programmeEnRetardTemplate(programme: ProgrammeEmailData, coordinateur: CoordinateurEmailData): string;
    moduleSansIntervenantTemplate(module: ModuleEmailData, programme: {
        name: string;
    }): string;
    seanceNonTermineeTemplate(seance: SeanceEmailData, intervenant: IntervenantEmailData): string;
}
export {};
