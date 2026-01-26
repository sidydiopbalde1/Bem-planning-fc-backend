import { PrismaService } from '../prisma/prisma.service';
import { JournalService } from '../journal/journal.service';
import { PaginationDto } from '../common/dto';
export declare class ModulesService {
    private prisma;
    private journalService;
    constructor(prisma: PrismaService, journalService: JournalService);
    findAll(pagination: PaginationDto, filters?: {
        programmeId?: string;
        intervenantId?: string;
        status?: string;
    }): Promise<{
        data: ({
            programme: {
                id: string;
                name: string;
                code: string;
            };
            intervenant: {
                id: string;
                prenom: string;
                nom: string;
                civilite: string;
            } | null;
            _count: {
                seances: number;
            };
        } & {
            description: string | null;
            userId: string;
            id: string;
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
        programme: {
            description: string | null;
            userId: string;
            id: string;
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
            salle: string | null;
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
            batiment: string | null;
            moduleId: string;
            notes: string | null;
            objectifs: string | null;
        })[];
    } & {
        description: string | null;
        userId: string;
        id: string;
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
    create(data: any, userId: string, userName?: string): Promise<{
        programme: {
            id: string;
            name: string;
            code: string;
        };
        intervenant: {
            id: string;
            prenom: string;
            nom: string;
        } | null;
    } & {
        description: string | null;
        userId: string;
        id: string;
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
    update(id: string, data: any, currentUserId?: string, currentUserName?: string): Promise<{
        programme: {
            description: string | null;
            userId: string;
            id: string;
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
    } & {
        description: string | null;
        userId: string;
        id: string;
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
    remove(id: string, currentUserId?: string, currentUserName?: string): Promise<{
        message: string;
    }>;
    updateProgression(moduleId: string): Promise<{
        progression: number;
        status: "PLANIFIE" | "EN_COURS" | "TERMINE";
    } | undefined>;
}
