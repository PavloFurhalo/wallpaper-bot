"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PicturesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const picture_schema_1 = require("../schemas/picture.schema");
const pictures_service_1 = require("../services/pictures.service");
let PicturesModule = class PicturesModule {
};
exports.PicturesModule = PicturesModule;
exports.PicturesModule = PicturesModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: picture_schema_1.Picture.name, schema: picture_schema_1.PictureSchema }])],
        providers: [pictures_service_1.PicturesService],
        exports: [pictures_service_1.PicturesService],
    })
], PicturesModule);
//# sourceMappingURL=pictures.module.js.map