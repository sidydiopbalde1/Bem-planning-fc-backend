import { StatutCampagne } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JournalService } from '../journal/journal.service';
import { PaginationDto } from '../common/dto';
export interface EvaluationFilters {
    moduleId?: string;
    statut?: StatutCampagne;
}
export declare class CreateEvaluationDto {
    moduleId: string;
    intervenantId: string;
    dateDebut: string;
    dateFin: string;
    nombreInvitations?: number;
}
export declare class UpdateEvaluationDto {
    moduleId?: string;
    intervenantId?: string;
    dateDebut?: string;
    dateFin?: string;
    nombreInvitations?: number;
    statut?: StatutCampagne;
}
export declare class SubmitResponseDto {
    noteQualiteCours?: number;
    noteQualitePedagogie?: number;
    noteDisponibilite?: number;
    commentaires?: string;
}
export declare class EvaluationsService {
    private prisma;
    private journalService;
    constructor(prisma: PrismaService, journalService: JournalService);
    findAll(pagination: PaginationDto, filters: EvaluationFilters): Promise<{
        data: ({
            intervenant: {
                id: string;
                prenom: string;
                nom: string;
                civilite: string;
            };
            module: {
                programme: {
                    id: string;
                    name: string;
                    code: string;
                };
            } & {
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
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            dateDebut: Date | null;
            dateFin: Date | null;
            intervenantId: string;
            moduleId: string;
            dateEnvoi: Date | null;
            lienEvaluation: string | null;
            noteQualiteCours: number | null;
            noteQualitePedagogie: number | null;
            noteDisponibilite: number | null;
            noteMoyenne: number | null;
            nombreReponses: number;
            nombreInvitations: number;
            tauxParticipation: number | null;
            commentaires: string | null;
            statut: import(".prisma/client").$Enums.StatutCampagne;
        })[];
        pagination: {
            page: number | undefined;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findOne(id: string): Promise<{
        intervenant: {
            id: string;
            createdAt: Date;
            email: string;
            updatedAt: Date;
            prenom: string;
            nom: string;
            civilite: string;
            telephone: string | null;
            grade: string | null;
            specialite: string | null;
            etablissement: string | null;
            disponible: boolean;
            creneauxPreferences: string | null;
            heuresMaxJour: number;
            heuresMaxSemaine: number;
            joursPreferences: string | null;
        };
        module: {
            programme: {
                description: string | null;
                userId: string;
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                code: string;
                status: import(".prisma/client").$Enums.StatusProgramme;
                progression: number;
                dateDebut: Date;
                dateFin: Date;
                semestre: import(".prisma/client").$Enums.Semestre;
                niveau: string;
                totalVHT: number;
            };
        } & {
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dateDebut: Date | null;
        dateFin: Date | null;
        intervenantId: string;
        moduleId: string;
        dateEnvoi: Date | null;
        lienEvaluation: string | null;
        noteQualiteCours: number | null;
        noteQualitePedagogie: number | null;
        noteDisponibilite: number | null;
        noteMoyenne: number | null;
        nombreReponses: number;
        nombreInvitations: number;
        tauxParticipation: number | null;
        commentaires: string | null;
        statut: import(".prisma/client").$Enums.StatutCampagne;
    }>;
    findByLien(lienEvaluation: string): Promise<{
        intervenant: {
            prenom: string;
            nom: string;
            civilite: string;
        };
        module: {
            programme: {
                description: string | null;
                userId: string;
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                code: string;
                status: import(".prisma/client").$Enums.StatusProgramme;
                progression: number;
                dateDebut: Date;
                dateFin: Date;
                semestre: import(".prisma/client").$Enums.Semestre;
                niveau: string;
                totalVHT: number;
            };
        } & {
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dateDebut: Date | null;
        dateFin: Date | null;
        intervenantId: string;
        moduleId: string;
        dateEnvoi: Date | null;
        lienEvaluation: string | null;
        noteQualiteCours: number | null;
        noteQualitePedagogie: number | null;
        noteDisponibilite: number | null;
        noteMoyenne: number | null;
        nombreReponses: number;
        nombreInvitations: number;
        tauxParticipation: number | null;
        commentaires: string | null;
        statut: import(".prisma/client").$Enums.StatutCampagne;
    }>;
    create(data: CreateEvaluationDto, currentUserId?: string, currentUserName?: string): Promise<{
        intervenant: {
            id: string;
            createdAt: Date;
            email: string;
            updatedAt: Date;
            prenom: string;
            nom: string;
            civilite: string;
            telephone: string | null;
            grade: string | null;
            specialite: string | null;
            etablissement: string | null;
            disponible: boolean;
            creneauxPreferences: string | null;
            heuresMaxJour: number;
            heuresMaxSemaine: number;
            joursPreferences: string | null;
        };
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dateDebut: Date | null;
        dateFin: Date | null;
        intervenantId: string;
        moduleId: string;
        dateEnvoi: Date | null;
        lienEvaluation: string | null;
        noteQualiteCours: number | null;
        noteQualitePedagogie: number | null;
        noteDisponibilite: number | null;
        noteMoyenne: number | null;
        nombreReponses: number;
        nombreInvitations: number;
        tauxParticipation: number | null;
        commentaires: string | null;
        statut: import(".prisma/client").$Enums.StatutCampagne;
    }>;
    update(id: string, data: UpdateEvaluationDto, currentUserId?: string, currentUserName?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dateDebut: Date | null;
        dateFin: Date | null;
        intervenantId: string;
        moduleId: string;
        dateEnvoi: Date | null;
        lienEvaluation: string | null;
        noteQualiteCours: number | null;
        noteQualitePedagogie: number | null;
        noteDisponibilite: number | null;
        noteMoyenne: number | null;
        nombreReponses: number;
        nombreInvitations: number;
        tauxParticipation: number | null;
        commentaires: string | null;
        statut: import(".prisma/client").$Enums.StatutCampagne;
    }>;
    submitResponse(lienEvaluation: string, responses: SubmitResponseDto): Promise<{
        message: string;
        evaluation: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            dateDebut: Date | null;
            dateFin: Date | null;
            intervenantId: string;
            moduleId: string;
            dateEnvoi: Date | null;
            lienEvaluation: string | null;
            noteQualiteCours: number | null;
            noteQualitePedagogie: number | null;
            noteDisponibilite: number | null;
            noteMoyenne: number | null;
            nombreReponses: number;
            nombreInvitations: number;
            tauxParticipation: number | null;
            commentaires: string | null;
            statut: import(".prisma/client").$Enums.StatutCampagne;
        };
    }>;
    remove(id: string, currentUserId?: string, currentUserName?: string): Promise<{
        message: string;
    }>;
}
