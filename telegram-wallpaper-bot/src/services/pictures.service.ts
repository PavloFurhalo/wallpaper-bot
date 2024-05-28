import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Picture } from '../schemas/picture.schema';

@Injectable()
export class PicturesService {
  constructor(@InjectModel(Picture.name) private pictureModel: Model<Picture>) {}

  async getRandomPicture() {
    const randomImageUrl = `https://picsum.photos/1920/1080?random=${Math.random()}`;
    return randomImageUrl;
  }

  async likePicture(url: string, chatId: string) {
    const existingPicture = await this.pictureModel.findOne({ url, chatId });
    if (existingPicture) {
      throw new Error('Picture already liked');
    }
    const newPicture = new this.pictureModel({ url, chatId });
    return newPicture.save();
  }

  async getLikedPictures(chatId: string) {
    return this.pictureModel.find({ chatId }).exec();
  }

  async removeLikedPicture(id: string, chatId: string) {
    const existingPicture = await this.pictureModel.findOne({ _id: id, chatId });
    if (!existingPicture) {
      throw new Error('Picture not found');
    }
    return this.pictureModel.findByIdAndDelete(id).exec();
  }
}
