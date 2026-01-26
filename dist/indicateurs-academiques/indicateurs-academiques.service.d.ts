import { PrismaService } from '../prisma/prisma.service';
import { CreateIndicateurAcademiqueDto } from './dto/create-indicateur-academique.dto';
import { UpdateIndicateurAcademiqueDto } from './dto/update-indicateur-academique.dto';
export declare class IndicateursAcademiquesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(programmeId?: string, periodeId?: string): Promise<({
        programme: {
            id: string;
            name: string;
            code: string;
        };
        responsable: {
            id: string;
            name: string | null;
            email: string;
        } | null;
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
        responsableId: string | null;
        periodeId: string;
        valeurCible: number | null;
        valeurReelle: number | null;
        periodicite: string;
        methodeCalcul: string | null;
        unite: string;
        dateCollecte: Date | null;
    })[]>;
    findOne(id: string): Promise<{
        programme: {
            id: string;
            name: string;
            code: string;
        };
        responsable: {
            id: string;
            name: string | null;
            email: string;
        } | null;
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
        responsableId: string | null;
        periodeId: string;
        valeurCible: number | null;
        valeurReelle: number | null;
        periodicite: string;
        methodeCalcul: string | null;
        unite: string;
        dateCollecte: Date | null;
    }>;
    create(data: CreateIndicateurAcademiqueDto): Promise<{
        programme: {
            id: string;
            name: string;
            code: string;
        };
        responsable: {
            id: string;
            name: string | null;
            email: string;
        } | null;
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
        responsableId: string | null;
        periodeId: string;
        valeurCible: number | null;
        valeurReelle: number | null;
        periodicite: string;
        methodeCalcul: string | null;
        unite: string;
        dateCollecte: Date | null;
    }>;
    update(id: string, data: UpdateIndicateurAcademiqueDto): Promise<{
        programme: {
            id: string;
            name: string;
            code: string;
        };
        responsable: {
            id: string;
            name: string | null;
            email: string;
        } | null;
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
        responsableId: string | null;
        periodeId: string;
        valeurCible: number | null;
        valeurReelle: number | null;
        periodicite: string;
        methodeCalcul: string | null;
        unite: string;
        dateCollecte: Date | null;
    }>;
    remove(id: string): Promise<{
        type: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        programmeId: string;
        responsableId: string | null;
        periodeId: string;
        valeurCible: number | null;
        valeurReelle: number | null;
        periodicite: string;
        methodeCalcul: string | null;
        unite: string;
        dateCollecte: Date | null;
    }>;
}
