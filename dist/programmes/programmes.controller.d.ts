import { ProgrammesService } from './programmes.service';
import { PaginationDto } from '../common/dto';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';
export declare class ProgrammesController {
    private readonly programmesService;
    constructor(programmesService: ProgrammesService);
    findAll(user: AuthenticatedUser, pagination: PaginationDto, status?: string, semestre?: string): Promise<{
        data: {
            alerts: import("./programmes.service").Alert[];
            _count: {
                modules: number;
            };
            modules: ({
                intervenant: {
                    id: string;
                    prenom: string;
                    nom: string;
                } | null;
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
        }[];
        pagination: {
            page: number | undefined;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findOne(user: AuthenticatedUser, id: string): Promise<{
        modules: ({
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
            seances: {
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
            }[];
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
        user: {
            id: string;
            name: string | null;
            email: string;
        };
    } & {
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
    }>;
    create(user: AuthenticatedUser, data: any): Promise<{
        modules: {
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
        }[];
    } & {
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
    }>;
    update(user: AuthenticatedUser, id: string, data: any): Promise<{
        modules: {
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
        }[];
    } & {
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
    }>;
    remove(user: AuthenticatedUser, id: string): Promise<{
        message: string;
    }>;
}
