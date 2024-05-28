import { Module } from '@nestjs/common';
import { PicturesModule } from './pictures.module';
import { TelegramService } from '../services/telegram.service';

@Module({
  imports: [PicturesModule],
  providers: [TelegramService],
})
export class TelegramModule {}
