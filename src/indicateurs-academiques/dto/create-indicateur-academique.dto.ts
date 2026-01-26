import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateIndicateurAcademiqueDto {
  @ApiProperty({ description: 'Nom de l\'indicateur' })
  @IsString()
  nom: string;

  @ApiPropertyOptional({ description: 'Description de l\'indicateur' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Valeur cible' })
  @IsOptional()
  @IsNumber()
  valeurCible?: number;

  @ApiPropertyOptional({ description: 'Valeur réelle' })
  @IsOptional()
  @IsNumber()
  valeurReelle?: number;

  @ApiProperty({ description: 'Périodicité (mensuelle, trimestrielle, etc.)' })
  @IsString()
  periodicite: string;

  @ApiPropertyOptional({ description: 'Méthode de calcul' })
  @IsOptional()
  @IsString()
  methodeCalcul?: string;

  @ApiPropertyOptional({ description: 'Unité de mesure', default: '%' })
  @IsOptional()
  @IsString()
  unite?: string;

  @ApiProperty({ description: 'Type d\'indicateur' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'ID du programme' })
  @IsString()
  programmeId: string;

  @ApiProperty({ description: 'ID de la période académique' })
  @IsString()
  periodeId: string;

  @ApiPropertyOptional({ description: 'ID du responsable' })
  @IsOptional()
  @IsString()
  responsableId?: string;

  @ApiPropertyOptional({ description: 'Date de collecte' })
  @IsOptional()
  @IsDateString()
  dateCollecte?: string;
}
