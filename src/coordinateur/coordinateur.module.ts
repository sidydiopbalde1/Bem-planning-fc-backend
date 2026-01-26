import { Module } from '@nestjs/common';
import { CoordinateurService } from './coordinateur.service';
import { CoordinateurController } from './coordinateur.controller';

@Module({
  controllers: [CoordinateurController],
  providers: [CoordinateurService],
  exports: [CoordinateurService],
})
export class CoordinateurModule {}
