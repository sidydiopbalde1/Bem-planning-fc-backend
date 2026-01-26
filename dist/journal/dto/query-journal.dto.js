"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryJournalDto = exports.ActionType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var ActionType;
(function (ActionType) {
    ActionType["CREATION"] = "CREATION";
    ActionType["MODIFICATION"] = "MODIFICATION";
    ActionType["SUPPRESSION"] = "SUPPRESSION";
    ActionType["CONNEXION"] = "CONNEXION";
    ActionType["DECONNEXION"] = "DECONNEXION";
    ActionType["PLANIFICATION_AUTO"] = "PLANIFICATION_AUTO";
    ActionType["RESOLUTION_CONFLIT"] = "RESOLUTION_CONFLIT";
    ActionType["EXPORT_DONNEES"] = "EXPORT_DONNEES";
    ActionType["ALERTE"] = "ALERTE";
})(ActionType || (exports.ActionType = ActionType = {}));
class QueryJournalDto {
    action;
    entite;
    entiteId;
    userId;
    userName;
    startDate;
    endDate;
    search;
    page = 1;
    limit = 50;
}
exports.QueryJournalDto = QueryJournalDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ActionType, description: 'Type d\'action à filtrer' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ActionType),
    __metadata("design:type", String)
], QueryJournalDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Entité concernée (ex: User, Professeur, Cours)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryJournalDto.prototype, "entite", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID de l\'entité concernée' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryJournalDto.prototype, "entiteId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID de l\'utilisateur ayant effectué l\'action' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryJournalDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nom de l\'utilisateur' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryJournalDto.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date de début (ISO 8601)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QueryJournalDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date de fin (ISO 8601)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QueryJournalDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Recherche textuelle dans la description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryJournalDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1, minimum: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], QueryJournalDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 50, minimum: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], QueryJournalDto.prototype, "limit", void 0);
//# sourceMappingURL=query-journal.dto.js.map