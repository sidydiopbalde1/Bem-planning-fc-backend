import { Module } from '@nestjs/common';
import { SeancesService } from './seances.service';
import { SeancesController } from './seances.controller';
import { JournalModule } from '../journal/journal.module';

@Module({
  imports: [JournalModule],
  controllers: [SeancesController],
  providers: [SeancesService],
  exports: [SeancesService],
})
export class SeancesModule {}
