import { PeriodesAcademiquesService } from './periodes-academiques.service';
import { PaginationDto } from '../common/dto';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';
export declare class PeriodesAcademiquesController {
    private readonly periodesService;
    constructor(periodesService: PeriodesAcademiquesService);
    findAll(pagination: PaginationDto, active?: string): Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nom: string;
            annee: string;
            active: boolean;
            debutS1: Date;
            finS1: Date;
            debutS2: Date;
            finS2: Date;
            vacancesNoel: Date;
            finVacancesNoel: Date;
            vacancesPaques: Date | null;
            finVacancesPaques: Date | null;
        }[];
        pagination: {
            page: number | undefined;
            limit: number;
            total: number;
            pages: number;
        };
        stats: {
            total: number;
            actives: number;
            inactives: number;
            periodeCourante: string | null;
        };
    }>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        annee: string;
        active: boolean;
        debutS1: Date;
        finS1: Date;
        debutS2: Date;
        finS2: Date;
        vacancesNoel: Date;
        finVacancesNoel: Date;
        vacancesPaques: Date | null;
        finVacancesPaques: Date | null;
    }>;
    create(data: any, user: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        annee: string;
        active: boolean;
        debutS1: Date;
        finS1: Date;
        debutS2: Date;
        finS2: Date;
        vacancesNoel: Date;
        finVacancesNoel: Date;
        vacancesPaques: Date | null;
        finVacancesPaques: Date | null;
    }>;
    update(id: string, data: any, user: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        annee: string;
        active: boolean;
        debutS1: Date;
        finS1: Date;
        debutS2: Date;
        finS2: Date;
        vacancesNoel: Date;
        finVacancesNoel: Date;
        vacancesPaques: Date | null;
        finVacancesPaques: Date | null;
    }>;
    remove(id: string, user: AuthenticatedUser): Promise<{
        message: string;
    }>;
}
