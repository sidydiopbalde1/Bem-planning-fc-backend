import { NotificationsService } from './notifications.service';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(user: AuthenticatedUser, page?: number, limit?: number): Promise<{
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
    markAsRead(user: AuthenticatedUser, ids: string[]): Promise<{
        count: number;
    }>;
    markAllAsRead(user: AuthenticatedUser): Promise<{
        count: number;
    }>;
    delete(user: AuthenticatedUser, id: string): Promise<{
        message: string;
    }>;
}
