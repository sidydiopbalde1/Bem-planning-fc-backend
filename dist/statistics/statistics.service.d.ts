import { PrismaService } from '../prisma/prisma.service';
export declare class StatisticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getGlobalStatistics(userId: string, role: string): Promise<{
        type: string;
        statistics: {
            totaux: {
                programmes: number;
                modules: number;
                intervenants: number;
                seances: number;
            };
            activite: {
                programmesEnCours: number;
                seancesTerminees: number;
                tauxCompletion: number;
            };
            heures: {
                totalPlanifie: number;
                totalRealise: number;
            };
            qualite: {
                conflitsEnAttente: number;
                progressionMoyenne: number;
            };
            intervenants: {
                total: number;
                disponibles: number;
                tauxDisponibilite: number;
            };
            nouveauxCeMois: {
                programmes: number;
                modules: number;
                intervenants: number;
                seances: number;
            };
        };
        generatedAt: string;
    }>;
    getIntervenantsStatistics(userId: string, role: string, startDate?: string, endDate?: string): Promise<{
        type: string;
        statistics: {
            intervenants: {
                id: string;
                nom: string;
                email: string;
                grade: string | null;
                specialite: string | null;
                disponible: boolean;
                statistiques: {
                    modulesAssignes: number;
                    totalSeances: number;
                    seancesTerminees: number;
                    totalHeures: number;
                    tauxRealisation: number;
                    chargeHebdomadaireMoyenne: number;
                    repartitionTypes: Record<string, number>;
                };
                indicateurs: {
                    surcharge: boolean;
                    sousUtilise: boolean;
                    efficacite: number;
                };
            }[];
            resume: {
                totalIntervenants: number;
                disponibles: number;
                enSurcharge: number;
                sousUtilises: number;
                chargeGlobaleMoyenne: number;
            };
        };
        generatedAt: string;
    }>;
    getProgrammesStatistics(userId: string, role: string): Promise<{
        type: string;
        statistics: {
            programmes: {
                id: string;
                nom: string;
                code: string;
                niveau: string;
                semestre: import(".prisma/client").$Enums.Semestre;
                status: import(".prisma/client").$Enums.StatusProgramme;
                progression: number;
                dates: {
                    debut: Date;
                    fin: Date;
                    enRetard: boolean;
                };
                statistiques: {
                    modules: {
                        total: number;
                        termines: number;
                        tauxCompletion: number;
                    };
                    seances: {
                        total: number;
                        terminees: number;
                        tauxRealisation: number;
                    };
                    heures: {
                        planifiees: number;
                        realisees: number;
                        restantes: number;
                    };
                    intervenants: number;
                };
                intervenantsAssignes: string[];
            }[];
            resume: {
                totalProgrammes: number;
                parStatus: Record<string, number>;
                enRetard: number;
                progressionMoyenne: number;
            };
        };
        generatedAt: string;
    }>;
    getPlanningStatistics(userId: string, role: string, startDate?: string, endDate?: string): Promise<{
        type: string;
        statistics: {
            periode: {
                debut: Date;
                fin: Date;
            };
            totalSeances: number;
            distributions: {
                parJourSemaine: {
                    jour: string;
                    nombreSeances: number;
                    pourcentage: number;
                }[];
                parType: Record<string, number>;
                parStatus: Record<string, number>;
                parSemaine: {
                    heures: number;
                    seances: number;
                    semaine: string;
                }[];
            };
            moyennes: {
                seancesParJour: number;
                heuresParSemaine: number;
            };
        };
        generatedAt: string;
    }>;
    getPerformanceIndicators(userId: string, role: string): Promise<{
        type: string;
        statistics: {
            periode: {
                mois: string;
                semaineCourante: string;
            };
            kpi: {
                tauxRealisation: number;
                seancesRealiseesMois: number;
                seancesRealiseesSemaine: number;
                heuresRealiseesMois: number;
                conflitsGeneres: number;
                programmesActifs: number;
            };
            tendances: {
                rythmeHebdomadaire: number;
                objectifMensuel: number;
                progressionObjectif: number;
            };
            alertes: {
                type: string;
                message: string;
                suggestion: string;
            }[];
        };
        generatedAt: string;
    }>;
    private calculateWeeklyLoad;
    private calculateWorkingDays;
    private getWeekKey;
    private getStartOfWeek;
    private generatePerformanceAlerts;
}
