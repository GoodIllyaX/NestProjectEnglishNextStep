import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';

import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@ApiTags('Lessons')
@UseGuards(AuthGuard, RolesGuard)
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new lesson' })
  @ApiBody({ type: CreateLessonDto })
  @ApiResponse({ status: 201, description: 'Lesson created successfully' })
  create(@Body() dto: CreateLessonDto) {
    return this.lessonsService.create(dto);
  }

  @Get()
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.USER)
  @ApiOperation({ summary: 'Get all lessons or filter by teacherId' })
  @ApiQuery({ name: 'teacherId', required: false, description: 'Filter lessons by instructor ID' })
  @ApiResponse({ status: 200, description: 'List of lessons returned successfully' })
  find(@Query('teacherId') teacherId?: string) {
    if (teacherId) return this.lessonsService.findByTeacher(teacherId);
    return this.lessonsService.findAll();
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update an existing lesson by ID' })
  @ApiParam({ name: 'id', description: 'Lesson ObjectId to update' })
  @ApiBody({ type: CreateLessonDto })
  @ApiResponse({ status: 200, description: 'Lesson updated successfully' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateLessonDto>) {
    return this.lessonsService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a lesson by ID' })
  @ApiParam({ name: 'id', description: 'Lesson ObjectId to delete' })
  @ApiResponse({ status: 200, description: 'Lesson deleted successfully' })
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }
}