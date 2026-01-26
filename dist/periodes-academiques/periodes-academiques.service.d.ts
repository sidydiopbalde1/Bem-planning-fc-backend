import { PrismaService } from '../prisma/prisma.service';
import { JournalService } from '../journal/journal.service';
import { PaginationDto } from '../common/dto';
export declare class PeriodesAcademiquesService {
    private readonly prisma;
    private readonly journalService;
    constructor(prisma: PrismaService, journalService: JournalService);
    findAll(pagination: PaginationDto, activeOnly?: boolean): Promise<{
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
    create(data: any, currentUserId?: string, currentUserName?: string): Promise<{
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
    update(id: string, data: any, currentUserId?: string, currentUserName?: string): Promise<{
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
    remove(id: string, currentUserId?: string, currentUserName?: string): Promise<{
        message: string;
    }>;
}
