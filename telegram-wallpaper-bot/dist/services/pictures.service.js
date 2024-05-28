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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PicturesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const picture_schema_1 = require("../schemas/picture.schema");
let PicturesService = class PicturesService {
    constructor(pictureModel) {
        this.pictureModel = pictureModel;
    }
    async getRandomPicture() {
        const randomImageUrl = `https://picsum.photos/1920/1080?random=${Math.random()}`;
        return randomImageUrl;
    }
    async likePicture(url, chatId) {
        const existingPicture = await this.pictureModel.findOne({ url, chatId });
        if (existingPicture) {
            throw new Error('Picture already liked');
        }
        const newPicture = new this.pictureModel({ url, chatId });
        return newPicture.save();
    }
    async getLikedPictures(chatId) {
        return this.pictureModel.find({ chatId }).exec();
    }
    async removeLikedPicture(id, chatId) {
        const existingPicture = await this.pictureModel.findOne({ _id: id, chatId });
        if (!existingPicture) {
            throw new Error('Picture not found');
        }
        return this.pictureModel.findByIdAndDelete(id).exec();
    }
};
exports.PicturesService = PicturesService;
exports.PicturesService = PicturesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(picture_schema_1.Picture.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PicturesService);
//# sourceMappingURL=pictures.service.js.map