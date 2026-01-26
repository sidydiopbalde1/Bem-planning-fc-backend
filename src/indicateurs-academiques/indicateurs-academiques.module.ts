import { Module } from '@nestjs/common';
import { IndicateursAcademiquesController } from './indicateurs-academiques.controller';
import { IndicateursAcademiquesService } from './indicateurs-academiques.service';

@Module({
  controllers: [IndicateursAcademiquesController],
  providers: [IndicateursAcademiquesService],
  exports: [IndicateursAcademiquesService],
})
export class IndicateursAcademiquesModule {}
