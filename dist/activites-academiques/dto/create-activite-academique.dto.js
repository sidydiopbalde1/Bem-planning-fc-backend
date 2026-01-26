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
exports.CreateActiviteAcademiqueDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateActiviteAcademiqueDto {
    nom;
    description;
    datePrevue;
    dateReelle;
    type;
    programmeId;
    periodeId;
}
exports.CreateActiviteAcademiqueDto = CreateActiviteAcademiqueDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nom de l\'activité académique' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateActiviteAcademiqueDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Description de l\'activité' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateActiviteAcademiqueDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date prévue de l\'activité' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateActiviteAcademiqueDto.prototype, "datePrevue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date réelle de l\'activité' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateActiviteAcademiqueDto.prototype, "dateReelle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type de l\'activité (DEMARRAGE_COURS, ARRET_COURS, EXAMEN, etc.)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateActiviteAcademiqueDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID du programme associé' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateActiviteAcademiqueDto.prototype, "programmeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la période académique associée' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateActiviteAcademiqueDto.prototype, "periodeId", void 0);
//# sourceMappingURL=create-activite-academique.dto.js.map