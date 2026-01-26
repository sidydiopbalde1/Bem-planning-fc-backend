export declare enum ActionType {
    CREATION = "CREATION",
    MODIFICATION = "MODIFICATION",
    SUPPRESSION = "SUPPRESSION",
    CONNEXION = "CONNEXION",
    DECONNEXION = "DECONNEXION",
    PLANIFICATION_AUTO = "PLANIFICATION_AUTO",
    RESOLUTION_CONFLIT = "RESOLUTION_CONFLIT",
    EXPORT_DONNEES = "EXPORT_DONNEES",
    ALERTE = "ALERTE"
}
export declare class QueryJournalDto {
    action?: ActionType;
    entite?: string;
    entiteId?: string;
    userId?: string;
    userName?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    page?: number;
    limit?: number;
}
