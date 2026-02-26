import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupDto } from './create-group.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsArray } from 'class-validator';
import { Types } from 'mongoose';
import { ScheduleItem } from './schedule-item.dto';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
  @ApiPropertyOptional({ example: 'G15' })
  name?: string;

  @ApiPropertyOptional({ example: 'B1' })
  level?: string;

  @ApiPropertyOptional({ example: 'GROUP', enum: ['PAIR', 'INDIVIDUAL', 'GROUP'] })
  groupType?: string;

  @ApiPropertyOptional({ example: 'CHILDREN', enum: ['CHILDREN', 'ADULTS', 'BUSINESS'] })
  courseType?: string;

  @ApiPropertyOptional({
    example: ['6641a3b0e1c4ae7f12abcde1'],
    description: 'Array of student ObjectIds',
  })
  @IsOptional()
  @IsArray()
  students?: Types.ObjectId[];

  @ApiPropertyOptional({
    example: ['6641a3b0e1c4ae7f12abcde2'],
    description: 'Array of instructor ObjectIds',
  })
  @IsOptional()
  @IsArray()
  instructors?: Types.ObjectId[];

  @ApiPropertyOptional({ example: 'https://meet.example.com/g15' })
  meetingLink?: string;

  @ApiPropertyOptional({
    type: [ScheduleItem],
    example: [
      { day: 'Monday', time: '15:30' },
      { day: 'Wednesday', time: '10:00' },
    ],
  })
  @IsOptional()
  @IsArray()
  schedule?: ScheduleItem[];
}