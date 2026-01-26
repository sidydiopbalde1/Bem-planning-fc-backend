import { Module } from '@nestjs/common';
import { ActivitesAcademiquesController } from './activites-academiques.controller';
import { ActivitesAcademiquesService } from './activites-academiques.service';

@Module({
  controllers: [ActivitesAcademiquesController],
  providers: [ActivitesAcademiquesService],
  exports: [ActivitesAcademiquesService],
})
export class ActivitesAcademiquesModule {}
