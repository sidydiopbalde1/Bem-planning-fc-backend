import { ActivitesAcademiquesService } from './activites-academiques.service';
import { CreateActiviteAcademiqueDto } from './dto/create-activite-academique.dto';
import { UpdateActiviteAcademiqueDto } from './dto/update-activite-academique.dto';
export declare class ActivitesAcademiquesController {
    private readonly activitesService;
    constructor(activitesService: ActivitesAcademiquesService);
    findAll(programmeId?: string, periodeId?: string): Promise<({
        programme: {
            id: string;
            name: string;
            code: string;
        };
        periode: {
            id: string;
            nom: string;
            annee: string;
        };
    } & {
        type: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        programmeId: string;
        datePrevue: Date | null;
        dateReelle: Date | null;
        periodeId: string;
    })[]>;
    findOne(id: string): Promise<{
        programme: {
            id: string;
            name: string;
            code: string;
        };
        periode: {
            id: string;
            nom: string;
            annee: string;
        };
    } & {
        type: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        programmeId: string;
        datePrevue: Date | null;
        dateReelle: Date | null;
        periodeId: string;
    }>;
    create(data: CreateActiviteAcademiqueDto): Promise<{
        programme: {
            id: string;
            name: string;
            code: string;
        };
        periode: {
            id: string;
            nom: string;
            annee: string;
        };
    } & {
        type: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        programmeId: string;
        datePrevue: Date | null;
        dateReelle: Date | null;
        periodeId: string;
    }>;
    update(id: string, data: UpdateActiviteAcademiqueDto): Promise<{
        programme: {
            id: string;
            name: string;
            code: string;
        };
        periode: {
            id: string;
            nom: string;
            annee: string;
        };
    } & {
        type: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        programmeId: string;
        datePrevue: Date | null;
        dateReelle: Date | null;
        periodeId: string;
    }>;
    partialUpdate(id: string, data: UpdateActiviteAcademiqueDto): Promise<{
        programme: {
            id: string;
            name: string;
            code: string;
        };
        periode: {
            id: string;
            nom: string;
            annee: string;
        };
    } & {
        type: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        programmeId: string;
        datePrevue: Date | null;
        dateReelle: Date | null;
        periodeId: string;
    }>;
    remove(id: string): Promise<{
        type: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        programmeId: string;
        datePrevue: Date | null;
        dateReelle: Date | null;
        periodeId: string;
    }>;
}
