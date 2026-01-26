import { PartialType } from '@nestjs/swagger';
import { CreateActiviteAcademiqueDto } from './create-activite-academique.dto';

export class UpdateActiviteAcademiqueDto extends PartialType(CreateActiviteAcademiqueDto) {}
