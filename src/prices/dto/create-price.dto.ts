import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePriceDto {
  @ApiProperty({
    description: 'Name of the pricing option (e.g., Individual, Group)',
    example: 'Individual',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Unique course identifier that this pricing applies to',
    example: 'Children-Individual',
  })
  @IsString()
  course: string;

  @ApiProperty({
    description: 'Price of the course in UAH',
    example: 600,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Target audience type: CHILDREN or ADULTS',
    example: 'CHILDREN',
  })
  @IsString()
  type: string;
}