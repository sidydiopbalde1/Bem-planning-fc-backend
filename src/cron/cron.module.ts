import { Module } from '@nestjs/common';
import { DailyAlertsCron } from './daily-alerts.cron';
import { EmailModule } from '../email/email.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [EmailModule, NotificationsModule],
  providers: [DailyAlertsCron],
})
export class CronModule {}
