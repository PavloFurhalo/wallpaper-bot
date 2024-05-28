import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PicturesService } from './pictures.service';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;

  constructor(
    private readonly picturesService: PicturesService,
    private readonly configService: ConfigService
  ) {
    const token = this.configService.get('TELEGRAM_BOT_TOKEN');
    this.bot = new TelegramBot(token, { polling: true });
  }

  private sendMainMenu(chatId: number): void {
    const opts: TelegramBot.SendMessageOptions = {
      reply_markup: {
        keyboard: [
          [{ text: '/random' }],
          [{ text: '/list' }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    };
    this.bot.sendMessage(chatId.toString(), 'Choose an option:', opts);
  }

  onModuleInit() {
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      this.sendMainMenu(chatId);
    });

    this.bot.onText(/\/random/, async (msg) => {
      const chatId = msg.chat.id;
      const url = await this.picturesService.getRandomPicture();
      this.bot.sendPhoto(chatId.toString(), url, {
        reply_markup: {
          inline_keyboard: [[{ text: 'Like', callback_data: `like_${url}` }]],
        },
      });
    });

    this.bot.onText(/\/list/, async (msg) => {
      const chatId = msg.chat.id;
      const likedPictures = await this.picturesService.getLikedPictures(chatId.toString());
      if (likedPictures.length === 0) {
        this.bot.sendMessage(chatId.toString(), 'You have no liked pictures.');
        return;
      }
      likedPictures.forEach((pic) => {
        this.bot.sendPhoto(chatId.toString(), pic.url, {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Remove', callback_data: `remove_${pic._id}` }],
            ],
          },
        });
      });
    });

    this.bot.on('callback_query', async (callbackQuery) => {
      const data = callbackQuery.data;
      const chatId = callbackQuery.message.chat.id;

      if (data.startsWith('like_')) {
        const url = data.split('_')[1];
        try {
          await this.picturesService.likePicture(url, chatId.toString());
          this.bot.sendMessage(chatId.toString(), 'Liked!');
        } catch (error) {
          this.bot.sendMessage(chatId.toString(), error.message);
        }
      }

      if (data.startsWith('remove_')) {
        const id = data.split('_')[1];
        try {
          await this.picturesService.removeLikedPicture(id, chatId.toString());
          this.bot.sendMessage(chatId.toString(), 'Removed!');
        } catch (error) {
          this.bot.sendMessage(chatId.toString(), error.message);
        }
      }
    });
  }
}
