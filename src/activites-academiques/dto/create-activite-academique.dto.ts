import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateActiviteAcademiqueDto {
  @ApiProperty({ description: 'Nom de l\'activité académique' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiPropertyOptional({ description: 'Description de l\'activité' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Date prévue de l\'activité' })
  @IsDateString()
  @IsOptional()
  datePrevue?: string;

  @ApiPropertyOptional({ description: 'Date réelle de l\'activité' })
  @IsDateString()
  @IsOptional()
  dateReelle?: string;

  @ApiProperty({ description: 'Type de l\'activité (DEMARRAGE_COURS, ARRET_COURS, EXAMEN, etc.)' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'ID du programme associé' })
  @IsString()
  @IsNotEmpty()
  programmeId: string;

  @ApiProperty({ description: 'ID de la période académique associée' })
  @IsString()
  @IsNotEmpty()
  periodeId: string;
}
