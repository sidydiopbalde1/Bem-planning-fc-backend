import { PrismaService } from '../prisma/prisma.service';
import { JournalService } from '../journal/journal.service';
import { PaginationDto } from '../common/dto';
export interface Alert {
    type: string;
    message: string;
}
export declare class ProgrammesService {
    private prisma;
    private journalService;
    constructor(prisma: PrismaService, journalService: JournalService);
    findAll(userId: string, role: string, pagination: PaginationDto, filters?: any): Promise<{
        data: {
            alerts: Alert[];
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
        }[];
        pagination: {
            page: number | undefined;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findOne(id: string, userId?: string, role?: string): Promise<{
        user: {
            id: string;
            name: string | null;
            email: string;
        };
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
            }[];
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
    } & {
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
    }>;
    create(data: any, userId: string, userName?: string): Promise<{
        modules: {
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
        }[];
    } & {
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
    }>;
    update(id: string, data: any, userId: string, role: string, userName?: string): Promise<{
        modules: {
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
        }[];
    } & {
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
    }>;
    remove(id: string, userId: string, role: string, userName?: string): Promise<{
        message: string;
    }>;
    updateProgression(programmeId: string): Promise<void>;
}
