import { PrismaService } from '../prisma/prisma.service';
import { QueryJournalDto } from './dto';
export declare class JournalService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(id: string): Promise<{
        id: string;
        action: import(".prisma/client").$Enums.ActionType;
        entite: string;
        entiteId: string;
        description: string;
        ancienneValeur: string | null;
        nouvelleValeur: string | null;
        userId: string;
        userName: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        createdAt: Date;
    }>;
    log(data: {
        action: string;
        entite: string;
        entiteId?: string;
        description: string;
        ancienneValeur?: any;
        nouvelleValeur?: any;
        userId?: string;
        userName?: string;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<{
        id: string;
        action: import(".prisma/client").$Enums.ActionType;
        entite: string;
        entiteId: string;
        description: string;
        ancienneValeur: string | null;
        nouvelleValeur: string | null;
        userId: string;
        userName: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        createdAt: Date;
    } | undefined>;
    findAll(filters: QueryJournalDto): Promise<{
        logs: {
            id: string;
            action: import(".prisma/client").$Enums.ActionType;
            entite: string;
            entiteId: string;
            description: string;
            ancienneValeur: string | null;
            nouvelleValeur: string | null;
            userId: string;
            userName: string | null;
            ipAddress: string | null;
            userAgent: string | null;
            createdAt: Date;
        }[];
        stats: {
            total: number;
            last24h: number;
            actifusers: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.JournalActiviteGroupByOutputType, "userId"[]> & {
                _count: {
                    userId: number;
                };
            })[];
            typesActions: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.JournalActiviteGroupByOutputType, "action"[]> & {
                _count: {
                    action: number;
                };
            })[];
            byEntities: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.JournalActiviteGroupByOutputType, "entite"[]> & {
                _count: {
                    entite: number;
                };
            })[];
        };
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getStats(startDate?: string, endDate?: string): Promise<{
        totalLogs: number;
        parAction: {
            action: import(".prisma/client").$Enums.ActionType;
            count: number;
        }[];
        parEntite: {
            entite: string;
            count: number;
        }[];
        activiteRecente: {
            id: string;
            action: import(".prisma/client").$Enums.ActionType;
            entite: string;
            description: string;
            userName: string | null;
            createdAt: Date;
        }[];
    }>;
    getEntites(): Promise<string[]>;
    getLogsByEntite(entite: string, entiteId: string): Promise<{
        id: string;
        action: import(".prisma/client").$Enums.ActionType;
        entite: string;
        entiteId: string;
        description: string;
        ancienneValeur: string | null;
        nouvelleValeur: string | null;
        userId: string;
        userName: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        createdAt: Date;
    }[]>;
    deleteOldLogs(daysToKeep?: number): Promise<{
        deletedCount: number;
        cutoffDate: Date;
    }>;
}
