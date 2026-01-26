import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum ActionType {
  CREATION = 'CREATION',
  MODIFICATION = 'MODIFICATION',
  SUPPRESSION = 'SUPPRESSION',
  CONNEXION = 'CONNEXION',
  DECONNEXION = 'DECONNEXION',
  PLANIFICATION_AUTO = 'PLANIFICATION_AUTO',
  RESOLUTION_CONFLIT = 'RESOLUTION_CONFLIT',
  EXPORT_DONNEES = 'EXPORT_DONNEES',
  ALERTE = 'ALERTE',
}

export class QueryJournalDto {
  @ApiPropertyOptional({ enum: ActionType, description: 'Type d\'action à filtrer' })
  @IsOptional()
  @IsEnum(ActionType)
  action?: ActionType;

  @ApiPropertyOptional({ description: 'Entité concernée (ex: User, Professeur, Cours)' })
  @IsOptional()
  @IsString()
  entite?: string;

  @ApiPropertyOptional({ description: 'ID de l\'entité concernée' })
  @IsOptional()
  @IsString()
  entiteId?: string;

  @ApiPropertyOptional({ description: 'ID de l\'utilisateur ayant effectué l\'action' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: 'Nom de l\'utilisateur' })
  @IsOptional()
  @IsString()
  userName?: string;

  @ApiPropertyOptional({ description: 'Date de début (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Date de fin (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Recherche textuelle dans la description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 50, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 50;
}
