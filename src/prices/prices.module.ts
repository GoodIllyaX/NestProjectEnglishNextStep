import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';
import { Price, PriceSchema } from './schemas/price.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Price.name, schema: PriceSchema }]), AuthModule],
  controllers: [PricesController],
  providers: [PricesService],
})
export class PricesModule {}