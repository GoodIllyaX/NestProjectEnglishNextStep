import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Price, PriceDocument } from './schemas/price.schema';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';

@Injectable()
export class PricesService {
  constructor(@InjectModel(Price.name) private priceModel: Model<PriceDocument>) {}

  create(createPriceDto: CreatePriceDto) {
    return this.priceModel.create(createPriceDto);
  }

  findAll(type?: string) {
    return type ? this.priceModel.find({ type }).exec() : this.priceModel.find().exec();
  }

  update(id: string, updatePriceDto: UpdatePriceDto) {
    return this.priceModel.findByIdAndUpdate(id, updatePriceDto, { new: true }).exec();
  }
}