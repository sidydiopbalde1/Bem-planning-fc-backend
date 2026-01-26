import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        counts: {
            users: number;
            programmes: number;
            modules: number;
            seances: number;
            intervenants: number;
        };
        programmesByStatus: {};
        seancesByStatus: {};
        avgProgression: number;
    }>;
    getIntervenantsStats(): Promise<{
        total: number;
        disponibles: number;
        indisponibles: number;
        avecModules: number;
        sansModules: number;
        details: {
            id: string;
            nom: string;
            disponible: boolean;
            modulesCount: number;
            seancesCount: number;
        }[];
    }>;
}
