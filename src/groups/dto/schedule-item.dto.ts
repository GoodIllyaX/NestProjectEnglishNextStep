import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ScheduleItem {
  @ApiPropertyOptional({ example: 'Monday' })
  @IsOptional()
  @IsString()
  day?: string;

  @ApiPropertyOptional({ example: '15:30' })
  @IsOptional()
  @IsString()
  time?: string;
}