
import { IsBoolean, IsDateString, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLessonDto {
  @IsMongoId()
  teacherId: string;

  @IsDateString()
  timestamp: string;

  @IsMongoId()
  groupId: string;

  @IsString()
  description: string;

  @IsBoolean()
  isChangable: boolean;

  @IsBoolean()
  paid: boolean;

  @IsNumber()
  price: number;
}
