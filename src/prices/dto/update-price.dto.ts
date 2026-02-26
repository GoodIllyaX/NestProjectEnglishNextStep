import { PartialType } from '@nestjs/mapped-types';
import { CreatePriceDto } from './create-price.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePriceDto extends PartialType(CreatePriceDto) {
  @ApiPropertyOptional({ description: 'Name of the pricing option' })
  name?: string;

  @ApiPropertyOptional({ description: 'Unique course identifier' })
  course?: string;

  @ApiPropertyOptional({ description: 'Updated price in UAH' })
  price?: number;

  @ApiPropertyOptional({ description: 'Target audience type' })
  type?: string;
}