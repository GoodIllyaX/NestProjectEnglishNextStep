import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { UserRole, UserStatus } from './schemas/user.schema';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  fullName: string;

  @IsEmail()
  @ApiProperty({ example: 'john.doe@example.com', description: 'Unique email address' })
  email: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: '+380501112233', description: 'Phone number of the user' })
  phone?: string;

  @IsString()
  @ApiProperty({ example: 'strongPassword123', description: 'User password' })
  password: string;

  @IsEnum(UserRole)
  @ApiProperty({ enum: UserRole, example: UserRole.USER, description: 'User role' })
  role: UserRole;

  @IsEnum(UserStatus)
  @ApiProperty({ enum: UserStatus, example: UserStatus.PENDING, description: 'Initial status of the user' })
  status: UserStatus;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Updated course' })
  course?: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ example: 12000, description: 'Salary amount (for admin or teacher)' })
  salary?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ example: 3, description: 'Number of paid lessons' })
  paidLessons?: number;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Updated Name', description: 'Updated full name' })
  fullName?: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({ example: 'new.email@example.com', description: 'Updated email address' })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: '+380500000000', description: 'Updated phone number' })
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'strongPassword123', description: 'User password' })
  password?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  @ApiPropertyOptional({ enum: UserStatus, example: UserStatus.ACTIVE, description: 'Updated user status' })
  status?: UserStatus;

  @IsOptional()
  @IsEnum(UserRole)
  @ApiPropertyOptional({ enum: UserRole, example: UserRole.ADMIN, description: 'Updated user role' })
  role?: UserRole;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ example: 15000, description: 'Updated salary' })
  salary?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Updated course' })
  course?: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ example: 5, description: 'Updated paid lessons count' })
  paidLessons?: number;
}