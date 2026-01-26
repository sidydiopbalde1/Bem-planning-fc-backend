import { PrismaService } from '../prisma/prisma.service';
export declare class ActivitiesService {
    private prisma;
    constructor(prisma: PrismaService);
    private formatRelativeTime;
    getRecentActivities(limit?: number): Promise<{
        activities: {
            id: string;
            color: string;
            text: string;
            time: string;
            user: string | null;
            action: import(".prisma/client").$Enums.ActionType;
            entite: string;
            createdAt: Date;
        }[];
        total: number;
    }>;
}
