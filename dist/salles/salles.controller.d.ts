import { SallesService } from './salles.service';
import { PaginationDto } from '../common/dto';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';
export declare class SallesController {
    private readonly sallesService;
    constructor(sallesService: SallesService);
    findAll(pagination: PaginationDto): Promise<{
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
    create(data: any, user: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        disponible: boolean;
        batiment: string;
        capacite: number;
        equipements: string | null;
    }>;
    update(id: string, data: any, user: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        disponible: boolean;
        batiment: string;
        capacite: number;
        equipements: string | null;
    }>;
    remove(id: string, user: AuthenticatedUser): Promise<{
        message: string;
    }>;
}
