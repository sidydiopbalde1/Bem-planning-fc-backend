import { Module } from '@nestjs/common';
import { RotationsWeekendService } from './rotations-weekend.service';
import { RotationsWeekendController } from './rotations-weekend.controller';
import { JournalModule } from '../journal/journal.module';

@Module({
  imports: [JournalModule],
  controllers: [RotationsWeekendController],
  providers: [RotationsWeekendService],
  exports: [RotationsWeekendService],
})
export class RotationsWeekendModule {}
