import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findByUser(userId: string, page?: number, limit?: number, lu?: boolean): Promise<{
        notifications: {
            type: import(".prisma/client").$Enums.TypeNotification;
            entite: string | null;
            entiteId: string | null;
            id: string;
            createdAt: Date;
            message: string;
            updatedAt: Date;
            titre: string;
            priorite: import(".prisma/client").$Enums.PrioriteNotification;
            lu: boolean;
            destinataireId: string;
            lienAction: string | null;
        }[];
        unread: number;
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
        stats: {
            total: number;
            unread: number;
        };
    }>;
    create(data: {
        titre: string;
        message: string;
        type: string;
        priorite?: string;
        destinataireId: string;
        lienAction?: string;
    }): Promise<{
        type: import(".prisma/client").$Enums.TypeNotification;
        entite: string | null;
        entiteId: string | null;
        id: string;
        createdAt: Date;
        message: string;
        updatedAt: Date;
        titre: string;
        priorite: import(".prisma/client").$Enums.PrioriteNotification;
        lu: boolean;
        destinataireId: string;
        lienAction: string | null;
    }>;
    markAsRead(ids: string[], userId: string): Promise<{
        count: number;
    }>;
    markAllAsRead(userId: string): Promise<{
        count: number;
    }>;
    delete(id: string, userId: string): Promise<{
        message: string;
    }>;
}
