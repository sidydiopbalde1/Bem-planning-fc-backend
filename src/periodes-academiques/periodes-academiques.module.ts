import { Module } from '@nestjs/common';
import { PeriodesAcademiquesController } from './periodes-academiques.controller';
import { PeriodesAcademiquesService } from './periodes-academiques.service';
import { JournalModule } from '../journal/journal.module';

@Module({
  imports: [JournalModule],
  controllers: [PeriodesAcademiquesController],
  providers: [PeriodesAcademiquesService],
  exports: [PeriodesAcademiquesService],
})
export class PeriodesAcademiquesModule {}
