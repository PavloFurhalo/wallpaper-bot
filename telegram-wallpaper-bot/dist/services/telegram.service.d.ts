import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PicturesService } from './pictures.service';
export declare class TelegramService implements OnModuleInit {
    private readonly picturesService;
    private readonly configService;
    private bot;
    constructor(picturesService: PicturesService, configService: ConfigService);
    private sendMainMenu;
    onModuleInit(): void;
}
