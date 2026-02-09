import { PrismaService } from '../prisma/prisma.service';
import { JournalService } from '../journal/journal.service';
import { PaginationDto } from '../common/dto';
export declare class IntervenantsService {
    private prisma;
    private journalService;
    constructor(prisma: PrismaService, journalService: JournalService);
    findAll(pagination: PaginationDto): Promise<{
        data: ({
            _count: {
                seances: number;
            };
            modules: {
                id: string;
                name: string;
                code: string;
                status: import(".prisma/client").$Enums.StatusModule;
            }[];
        } & {
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
        })[];
        pagination: {
            page: number | undefined;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    create(data: any, currentUserId?: string, currentUserName?: string): Promise<{
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
    }>;
    findOne(id: string): Promise<{
        modules: ({
            programme: {
                id: string;
                name: string;
                code: string;
            };
        } & {
            id: string;
            description: string | null;
            userId: string;
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
        })[];
        disponibilites: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.TypeDisponibilite;
            dateDebut: Date | null;
            dateFin: Date | null;
            intervenantId: string;
            heureDebut: string;
            heureFin: string;
            jourSemaine: number;
            recurrent: boolean;
        }[];
        seances: ({
            module: {
                id: string;
                name: string;
                code: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.StatusSeance;
            intervenantId: string;
            dateSeance: Date;
            heureDebut: string;
            heureFin: string;
            duree: number;
            typeSeance: import(".prisma/client").$Enums.TypeSeance;
            salle: string | null;
            batiment: string | null;
            moduleId: string;
            notes: string | null;
            objectifs: string | null;
        })[];
    } & {
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
    }>;
    update(id: string, data: any, currentUserId?: string, currentUserName?: string): Promise<{
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
    }>;
    remove(id: string, currentUserId?: string, currentUserName?: string): Promise<{
        message: string;
    }>;
    updateDisponibilite(id: string, disponible: boolean, currentUserId?: string, currentUserName?: string): Promise<{
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
    }>;
    getMesSeances(email: string, filters: any): Promise<{
        seances: ({
            module: {
                programme: {
                    id: string;
                    name: string;
                    code: string;
                };
            } & {
                id: string;
                description: string | null;
                userId: string;
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
            status: import(".prisma/client").$Enums.StatusSeance;
            intervenantId: string;
            dateSeance: Date;
            heureDebut: string;
            heureFin: string;
            duree: number;
            typeSeance: import(".prisma/client").$Enums.TypeSeance;
            salle: string | null;
            batiment: string | null;
            moduleId: string;
            notes: string | null;
            objectifs: string | null;
        })[];
        stats: {
            total: number;
            terminees: number;
            enCours: number;
            planifiees: number;
        };
    }>;
}
