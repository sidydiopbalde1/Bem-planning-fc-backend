import { ModulesService } from './modules.service';
import { PaginationDto } from '../common/dto';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';
export declare class ModulesController {
    private readonly modulesService;
    constructor(modulesService: ModulesService);
    findAll(pagination: PaginationDto, programmeId?: string, intervenantId?: string, status?: string): Promise<{
        data: ({
            _count: {
                seances: number;
            };
            intervenant: {
                id: string;
                prenom: string;
                nom: string;
                civilite: string;
            } | null;
            programme: {
                id: string;
                name: string;
                code: string;
            };
        } & {
            id: string;
            description: string | null;
            userId: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            code: string;
            cm: number;
            td: number;
            tp: number;
            tpe: number;
            vht: number;
            coefficient: number;
            credits: number;
            status: import(".prisma/client").$Enums.StatusModule;
            progression: number;
            dateDebut: Date | null;
            dateFin: Date | null;
            programmeId: string;
            intervenantId: string | null;
        })[];
        pagination: {
            page: number | undefined;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findOne(id: string): Promise<{
        intervenant: {
            id: string;
            createdAt: Date;
            email: string;
            updatedAt: Date;
            prenom: string;
            nom: string;
            civilite: string;
            telephone: string | null;
            grade: string | null;
            specialite: string | null;
            etablissement: string | null;
            disponible: boolean;
            creneauxPreferences: string | null;
            heuresMaxJour: number;
            heuresMaxSemaine: number;
            joursPreferences: string | null;
        } | null;
        seances: ({
            intervenant: {
                prenom: string;
                nom: string;
                civilite: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.StatusSeance;
            intervenantId: string;
            dateSeance: Date;
            heureDebut: string;
            heureFin: string;
            duree: number;
            typeSeance: import(".prisma/client").$Enums.TypeSeance;
            salle: string | null;
            batiment: string | null;
            moduleId: string;
            notes: string | null;
            objectifs: string | null;
        })[];
        programme: {
            id: string;
            description: string | null;
            userId: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            code: string;
            status: import(".prisma/client").$Enums.StatusProgramme;
            progression: number;
            dateDebut: Date;
            dateFin: Date;
            semestre: import(".prisma/client").$Enums.Semestre;
            niveau: string;
            totalVHT: number;
        };
    } & {
        id: string;
        description: string | null;
        userId: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        code: string;
        cm: number;
        td: number;
        tp: number;
        tpe: number;
        vht: number;
        coefficient: number;
        credits: number;
        status: import(".prisma/client").$Enums.StatusModule;
        progression: number;
        dateDebut: Date | null;
        dateFin: Date | null;
        programmeId: string;
        intervenantId: string | null;
    }>;
    create(user: AuthenticatedUser, data: any): Promise<{
        intervenant: {
            id: string;
            prenom: string;
            nom: string;
        } | null;
        programme: {
            id: string;
            name: string;
            code: string;
        };
    } & {
        id: string;
        description: string | null;
        userId: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        code: string;
        cm: number;
        td: number;
        tp: number;
        tpe: number;
        vht: number;
        coefficient: number;
        credits: number;
        status: import(".prisma/client").$Enums.StatusModule;
        progression: number;
        dateDebut: Date | null;
        dateFin: Date | null;
        programmeId: string;
        intervenantId: string | null;
    }>;
    update(id: string, data: any, user: AuthenticatedUser): Promise<{
        intervenant: {
            id: string;
            createdAt: Date;
            email: string;
            updatedAt: Date;
            prenom: string;
            nom: string;
            civilite: string;
            telephone: string | null;
            grade: string | null;
            specialite: string | null;
            etablissement: string | null;
            disponible: boolean;
            creneauxPreferences: string | null;
            heuresMaxJour: number;
            heuresMaxSemaine: number;
            joursPreferences: string | null;
        } | null;
        programme: {
            id: string;
            description: string | null;
            userId: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            code: string;
            status: import(".prisma/client").$Enums.StatusProgramme;
            progression: number;
            dateDebut: Date;
            dateFin: Date;
            semestre: import(".prisma/client").$Enums.Semestre;
            niveau: string;
            totalVHT: number;
        };
    } & {
        id: string;
        description: string | null;
        userId: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        code: string;
        cm: number;
        td: number;
        tp: number;
        tpe: number;
        vht: number;
        coefficient: number;
        credits: number;
        status: import(".prisma/client").$Enums.StatusModule;
        progression: number;
        dateDebut: Date | null;
        dateFin: Date | null;
        programmeId: string;
        intervenantId: string | null;
    }>;
    remove(id: string, user: AuthenticatedUser): Promise<{
        message: string;
    }>;
}
