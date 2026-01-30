import { RotationsWeekendService } from './rotations-weekend.service';
import { PaginationDto } from '../common/dto';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';
export declare class RotationsWeekendController {
    private readonly rotationsService;
    constructor(rotationsService: RotationsWeekendService);
    findAll(pagination: PaginationDto, annee?: string, responsableId?: string, status?: string): Promise<{
        data: ({
            responsable: {
                id: string;
                name: string | null;
                email: string;
            };
            substitut: {
                id: string;
                name: string | null;
                email: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.StatutRotation;
            dateDebut: Date;
            dateFin: Date;
            semaineNumero: number;
            annee: number;
            responsableId: string;
            substitutId: string | null;
            nbSeancesTotal: number;
            nbSeancesRealisees: number;
            commentaire: string | null;
            estAbsence: boolean;
            notificationEnvoyee: boolean;
            rappelEnvoye: boolean;
            createdBy: string | null;
        })[];
        pagination: {
            page: number | undefined;
            limit: number;
            total: number;
            pages: number;
        };
        stats: {
            total: number;
            termines: number;
            absences: number;
        };
    }>;
    findOne(id: string): Promise<{
        rapportSupervision: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            heureArrivee: string | null;
            heureDepart: string | null;
            nbSeancesVisitees: number;
            incidents: string | null;
            observations: string | null;
            recommandations: string | null;
            satisfaction: number | null;
            rotationId: string;
        } | null;
        responsable: {
            id: string;
            createdAt: Date;
            name: string | null;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            updatedAt: Date;
        };
        substitut: {
            id: string;
            createdAt: Date;
            name: string | null;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            updatedAt: Date;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StatutRotation;
        dateDebut: Date;
        dateFin: Date;
        semaineNumero: number;
        annee: number;
        responsableId: string;
        substitutId: string | null;
        nbSeancesTotal: number;
        nbSeancesRealisees: number;
        commentaire: string | null;
        estAbsence: boolean;
        notificationEnvoyee: boolean;
        rappelEnvoye: boolean;
        createdBy: string | null;
    }>;
    generateRotations(nbSemaines?: number, dateDebut?: string, user?: AuthenticatedUser): Promise<{
        rotations: any[];
        total: number;
    }>;
    declareAbsence(id: string, raison: string, user: AuthenticatedUser): Promise<{
        responsable: {
            id: string;
            createdAt: Date;
            name: string | null;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            updatedAt: Date;
        };
        substitut: {
            id: string;
            createdAt: Date;
            name: string | null;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            updatedAt: Date;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StatutRotation;
        dateDebut: Date;
        dateFin: Date;
        semaineNumero: number;
        annee: number;
        responsableId: string;
        substitutId: string | null;
        nbSeancesTotal: number;
        nbSeancesRealisees: number;
        commentaire: string | null;
        estAbsence: boolean;
        notificationEnvoyee: boolean;
        rappelEnvoye: boolean;
        createdBy: string | null;
    }>;
    terminerRotation(id: string, rapportData?: any, user?: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StatutRotation;
        dateDebut: Date;
        dateFin: Date;
        semaineNumero: number;
        annee: number;
        responsableId: string;
        substitutId: string | null;
        nbSeancesTotal: number;
        nbSeancesRealisees: number;
        commentaire: string | null;
        estAbsence: boolean;
        notificationEnvoyee: boolean;
        rappelEnvoye: boolean;
        createdBy: string | null;
    }>;
}
