import { PrismaService } from '../prisma/prisma.service';
import { JournalService } from '../journal/journal.service';
export interface SlotSuggestion {
    date: string;
    jourSemaine: string;
    heureDebut: string;
    heureFin: string;
    duree: number;
    periode: string;
    score: number;
    recommandation: string;
}
export declare class PlanningService {
    private prisma;
    private journalService;
    private readonly creneaux;
    constructor(prisma: PrismaService, journalService: JournalService);
    getSuggestedSlots(filters: {
        moduleId?: string;
        intervenantId?: string;
        startDate: string;
        endDate?: string;
        duree?: number;
        limit?: number;
    }): Promise<{
        suggestions: SlotSuggestion[];
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
    generateAutoPlanning(data: {
        moduleId: string;
        intervenantId: string;
        startDate: string;
        endDate?: string;
    }, currentUserId?: string, currentUserName?: string): Promise<{
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
        suggestions: SlotSuggestion[];
        seancesProposees: number;
    }>;
    private isIntervenantOccupe;
    private calculateScore;
    private getJourSemaine;
}
