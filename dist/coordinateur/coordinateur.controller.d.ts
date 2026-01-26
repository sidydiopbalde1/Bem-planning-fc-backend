import { CoordinateurService } from './coordinateur.service';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';
export declare class CoordinateurController {
    private readonly coordinateurService;
    constructor(coordinateurService: CoordinateurService);
    getProgrammes(user: AuthenticatedUser, search?: string, status?: string, semestre?: string): Promise<{
        programmes: ({
            user: {
                id: string;
                name: string | null;
                email: string;
            };
            _count: {
                indicateursAcademiques: number;
                modules: number;
                activitesAcademiques: number;
            };
        } & {
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
        })[];
        stats: {
            total: number;
            parStatut: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ProgrammeGroupByOutputType, "status"[]> & {
                _count: {
                    status: number;
                };
            })[];
            progressionMoyenne: number;
            enRetard: number;
        };
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getModules(user: AuthenticatedUser, search?: string, status?: string, programmeId?: string): Promise<{
        modules: ({
            programme: {
                id: string;
                name: string;
                code: string;
            };
            intervenant: {
                id: string;
                email: string;
                prenom: string;
                nom: string;
            } | null;
            _count: {
                seances: number;
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getDashboard(user: AuthenticatedUser): Promise<{
        programmesStats: {
            total: number;
            enCours: number;
            termines: number;
            planifies: number;
            progressionMoyenne: number;
        };
        modulesStats: {
            total: number;
            enCours: number;
            termines: number;
            avecIntervenant: number;
            sansIntervenant: number;
            totalVHT: number;
        };
        programmesEnRetard: {
            id: string;
            code: string;
            name: string;
            progression: number;
            dateFin: Date;
        }[];
        modulesSansIntervenant: {
            id: string;
            code: string;
            name: string;
            vht: number;
            status: import(".prisma/client").$Enums.StatusModule;
        }[];
        recentActivity: {
            description: string;
            action: import(".prisma/client").$Enums.ActionType;
            entite: string;
            entiteId: string;
            userId: string;
            userName: string | null;
            id: string;
            ancienneValeur: string | null;
            nouvelleValeur: string | null;
            ipAddress: string | null;
            userAgent: string | null;
            createdAt: Date;
        }[];
    }>;
    checkAlerts(user: AuthenticatedUser): Promise<{
        programmesEnRetard: {
            count: number;
            items: {
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
            }[];
        };
        modulesSansIntervenant: {
            count: number;
            items: ({
                programme: {
                    name: string;
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
            })[];
        };
        modulesProchains: {
            count: number;
            items: ({
                programme: {
                    name: string;
                };
                intervenant: {
                    prenom: string;
                    nom: string;
                } | null;
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
            })[];
        };
        totalAlerts: number;
    }>;
    triggerAlertCheck(user: AuthenticatedUser): Promise<{
        programmesEnRetard: {
            count: number;
            items: {
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
            }[];
        };
        modulesSansIntervenant: {
            count: number;
            items: ({
                programme: {
                    name: string;
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
            })[];
        };
        modulesProchains: {
            count: number;
            items: ({
                programme: {
                    name: string;
                };
                intervenant: {
                    prenom: string;
                    nom: string;
                } | null;
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
            })[];
        };
        totalAlerts: number;
    }>;
}
