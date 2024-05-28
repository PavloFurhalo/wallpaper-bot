"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const pictures_service_1 = require("./pictures.service");
const TelegramBot = require("node-telegram-bot-api");
let TelegramService = class TelegramService {
    constructor(picturesService, configService) {
        this.picturesService = picturesService;
        this.configService = configService;
        const token = this.configService.get('TELEGRAM_BOT_TOKEN');
        this.bot = new TelegramBot(token, { polling: true });
    }
    sendMainMenu(chatId) {
        const opts = {
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
                }
                catch (error) {
                    this.bot.sendMessage(chatId.toString(), error.message);
                }
            }
            if (data.startsWith('remove_')) {
                const id = data.split('_')[1];
                try {
                    await this.picturesService.removeLikedPicture(id, chatId.toString());
                    this.bot.sendMessage(chatId.toString(), 'Removed!');
                }
                catch (error) {
                    this.bot.sendMessage(chatId.toString(), error.message);
                }
            }
        });
    }
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [pictures_service_1.PicturesService,
        config_1.ConfigService])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map