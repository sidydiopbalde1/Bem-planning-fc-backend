import { Module } from '@nestjs/common';
import { IntervenantsService } from './intervenants.service';
import { IntervenantsController } from './intervenants.controller';
import { JournalModule } from '../journal/journal.module';

@Module({
  imports: [JournalModule],
  controllers: [IntervenantsController],
  providers: [IntervenantsService],
  exports: [IntervenantsService],
})
export class IntervenantsModule {}
