import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsArray, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { ScheduleItem } from './schedule-item.dto';

export class CreateGroupDto {
  @ApiProperty({ example: 'G15' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'B1' })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiProperty({ example: 'GROUP', enum: ['PAIR', 'INDIVIDUAL', 'GROUP'] })
  @IsEnum(['PAIR', 'INDIVIDUAL', 'GROUP'])
  groupType: string;

  @ApiProperty({ example: 'CHILDREN', enum: ['CHILDREN', 'ADULTS', 'BUSINESS'] })
  @IsEnum(['CHILDREN', 'ADULTS', 'BUSINESS'])
  courseType: string;

  @ApiProperty({
    example: ['6641a3b0e1c4ae7f12abcde1'],
    description: 'Array of student ObjectIds',
  })
  @IsArray()
  students: Types.ObjectId[];

  @ApiProperty({
    example: ['6641a3b0e1c4ae7f12abcde2'],
    description: 'Array of instructor ObjectIds',
  })
  @IsArray()
  instructors: Types.ObjectId[];

  @ApiProperty({ example: 'https://meet.example.com/g15' })
  @IsString()
  meetingLink: string;

  @ApiProperty({
    type: [ScheduleItem],
    example: [
      { day: 'Monday', time: '15:30' },
      { day: 'Wednesday', time: '10:00' },
    ],
  })
  @IsArray()
  schedule: ScheduleItem[];
}