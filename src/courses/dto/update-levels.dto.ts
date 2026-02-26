import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LessonDto {
  @ApiPropertyOptional({ description: 'Lesson ID (number)', example: 101 })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({ description: 'Lesson name', example: 'Lesson 1' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Document URL for the lesson', example: 'https://example.com/doc.pdf' })
  @IsOptional()
  @IsString()
  docUrl?: string;
}

export class LevelDto {
  @ApiPropertyOptional({ description: 'Level ID (string)', example: '6649a1bc...' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ description: 'Level name', example: 'Beginner' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Document URL for the level', example: 'https://example.com/level.pdf' })
  @IsOptional()
  @IsString()
  docUrl?: string;

  @ApiPropertyOptional({ type: [LessonDto], description: 'List of lessons' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LessonDto)
  children?: LessonDto[];
}

export class UpdateLevelsDto {
  @ApiPropertyOptional({ type: [LevelDto], description: 'Business course levels' })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LevelDto)
  business?: LevelDto[];

  @ApiPropertyOptional({ type: [LevelDto], description: 'School course levels' })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LevelDto)
  school?: LevelDto[];

  @ApiPropertyOptional({ type: [LevelDto], description: 'General course levels' })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LevelDto)
  general?: LevelDto[];
}