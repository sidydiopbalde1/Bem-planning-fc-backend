import { PrismaService } from '../prisma/prisma.service';
import { JournalService } from '../journal/journal.service';
import { PaginationDto } from '../common/dto';
export declare class SallesService {
    private prisma;
    private journalService;
    constructor(prisma: PrismaService, journalService: JournalService);
    findAll(pagination: PaginationDto, batiment?: string): Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nom: string;
            disponible: boolean;
            batiment: string;
            capacite: number;
            equipements: string | null;
        }[];
        pagination: {
            page: number | undefined;
            limit: number;
            total: number;
            pages: number;
        };
        stats: {
            total: number;
            disponibles: number;
            parBatiment: {};
        };
    }>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        disponible: boolean;
        batiment: string;
        capacite: number;
        equipements: string | null;
    }>;
    create(data: any, currentUserId?: string, currentUserName?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        disponible: boolean;
        batiment: string;
        capacite: number;
        equipements: string | null;
    }>;
    update(id: string, data: any, currentUserId?: string, currentUserName?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        disponible: boolean;
        batiment: string;
        capacite: number;
        equipements: string | null;
    }>;
    remove(id: string, currentUserId?: string, currentUserName?: string): Promise<{
        message: string;
    }>;
}
