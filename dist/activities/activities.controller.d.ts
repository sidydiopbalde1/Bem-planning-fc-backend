import { ActivitiesService } from './activities.service';
export declare class ActivitiesController {
    private readonly activitiesService;
    constructor(activitiesService: ActivitiesService);
    getRecentActivities(limit?: string): Promise<{
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
