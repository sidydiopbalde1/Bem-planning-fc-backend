import { Module } from '@nestjs/common';
import { SallesService } from './salles.service';
import { SallesController } from './salles.controller';
import { JournalModule } from '../journal/journal.module';

@Module({
  imports: [JournalModule],
  controllers: [SallesController],
  providers: [SallesService],
  exports: [SallesService],
})
export class SallesModule {}
