import { JournalService } from './journal.service';
import { QueryJournalDto } from './dto';
export declare class JournalController {
    private readonly journalService;
    constructor(journalService: JournalService);
    findAll(query: QueryJournalDto): Promise<{
        logs: {
            description: string;
            action: import(".prisma/client").$Enums.ActionType;
            entite: string;
            entiteId: string;
            userId: string;
            userName: string | null;
            id: string;
            ancienneValeur: string | null;
            nouvelleValeur: string | null;
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
            description: string;
            action: import(".prisma/client").$Enums.ActionType;
            entite: string;
            userName: string | null;
            id: string;
            createdAt: Date;
        }[];
    }>;
    getEntites(): Promise<string[]>;
    getLogsByEntite(entite: string, entiteId: string): Promise<{
        description: string;
        action: import(".prisma/client").$Enums.ActionType;
        entite: string;
        entiteId: string;
        userId: string;
        userName: string | null;
        id: string;
        ancienneValeur: string | null;
        nouvelleValeur: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        description: string;
        action: import(".prisma/client").$Enums.ActionType;
        entite: string;
        entiteId: string;
        userId: string;
        userName: string | null;
        id: string;
        ancienneValeur: string | null;
        nouvelleValeur: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        createdAt: Date;
    }>;
    deleteOldLogs(daysToKeep?: number): Promise<{
        deletedCount: number;
        cutoffDate: Date;
    }>;
}
