import { Module } from '@nestjs/common';
import { ProgrammesService } from './programmes.service';
import { ProgrammesController } from './programmes.controller';
import { JournalModule } from '../journal/journal.module';

@Module({
  imports: [JournalModule],
  controllers: [ProgrammesController],
  providers: [ProgrammesService],
  exports: [ProgrammesService],
})
export class ProgrammesModule {}
