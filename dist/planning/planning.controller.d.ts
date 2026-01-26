import { PlanningService } from './planning.service';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';
export declare class PlanningController {
    private readonly planningService;
    constructor(planningService: PlanningService);
    getSuggestedSlots(moduleId?: string, intervenantId?: string, startDate?: string, endDate?: string, duree?: number, limit?: number): Promise<{
        suggestions: import("./planning.service").SlotSuggestion[];
        metadata: {
            moduleId: string | undefined;
            intervenantId: string | undefined;
            periode: {
                start: string;
                end: string;
            };
            totalSuggestions: number;
        };
    }>;
    generateAutoPlanning(data: any, user: AuthenticatedUser): Promise<{
        module: {
            description: string | null;
            userId: string;
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            code: string;
            cm: number;
            td: number;
            tp: number;
            tpe: number;
            vht: number;
            coefficient: number;
            credits: number;
            status: import(".prisma/client").$Enums.StatusModule;
            progression: number;
            dateDebut: Date | null;
            dateFin: Date | null;
            programmeId: string;
            intervenantId: string | null;
        };
        heuresRestantes: number;
        suggestions: import("./planning.service").SlotSuggestion[];
        seancesProposees: number;
    }>;
}
