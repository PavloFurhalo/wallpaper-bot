import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Picture, PictureSchema } from '../schemas/picture.schema';
import { PicturesService } from '../services/pictures.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Picture.name, schema: PictureSchema }])],
  providers: [PicturesService],
  exports: [PicturesService],
})
export class PicturesModule {}
