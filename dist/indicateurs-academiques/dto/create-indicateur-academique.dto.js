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
exports.CreateIndicateurAcademiqueDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateIndicateurAcademiqueDto {
    nom;
    description;
    valeurCible;
    valeurReelle;
    periodicite;
    methodeCalcul;
    unite;
    type;
    programmeId;
    periodeId;
    responsableId;
    dateCollecte;
}
exports.CreateIndicateurAcademiqueDto = CreateIndicateurAcademiqueDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nom de l\'indicateur' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIndicateurAcademiqueDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Description de l\'indicateur' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIndicateurAcademiqueDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Valeur cible' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateIndicateurAcademiqueDto.prototype, "valeurCible", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Valeur réelle' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateIndicateurAcademiqueDto.prototype, "valeurReelle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Périodicité (mensuelle, trimestrielle, etc.)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIndicateurAcademiqueDto.prototype, "periodicite", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Méthode de calcul' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIndicateurAcademiqueDto.prototype, "methodeCalcul", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Unité de mesure', default: '%' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIndicateurAcademiqueDto.prototype, "unite", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type d\'indicateur' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIndicateurAcademiqueDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID du programme' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIndicateurAcademiqueDto.prototype, "programmeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la période académique' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIndicateurAcademiqueDto.prototype, "periodeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID du responsable' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIndicateurAcademiqueDto.prototype, "responsableId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date de collecte' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateIndicateurAcademiqueDto.prototype, "dateCollecte", void 0);
//# sourceMappingURL=create-indicateur-academique.dto.js.map