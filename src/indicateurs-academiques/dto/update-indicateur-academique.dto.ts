import { PartialType } from '@nestjs/swagger';
import { CreateIndicateurAcademiqueDto } from './create-indicateur-academique.dto';

export class UpdateIndicateurAcademiqueDto extends PartialType(CreateIndicateurAcademiqueDto) {}
