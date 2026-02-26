import { Controller, Get, Put, Query, Body, UseGuards  } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { UpdateLevelsDto } from './dto/update-levels.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiBody, ApiResponse } from '@nestjs/swagger';

import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@ApiTags('Courses')
@UseGuards(AuthGuard, RolesGuard)
@Controller()
export class CoursesController {
  constructor(private readonly service: CoursesService) {}

  @Get('levels-lessons')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.USER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all course levels and lessons grouped by course type',
  })
  @ApiResponse({
    status: 200,
    description: 'Grouped course levels and their lessons returned successfully',
    schema: {
      example: {
        business: [
          {
            id: 1,
            name: 'Business Beginner',
            docUrl: 'https://example.com/business1.pdf',
            children: [
              { id: 101, name: 'Lesson 1', docUrl: 'https://...' },
              { id: 102, name: 'Lesson 2', docUrl: 'https://...' },
            ],
          },
        ],
        school: [],
        general: [],
      },
    },
  })
  async getAll() {
    return this.service.getAllGrouped();
  }

  @Put('levels-lessons')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Replace levels and lessons by course type',
    description:
      'This replaces all existing levels and lessons grouped by course. Be careful — old data will be removed.',
  })
  @ApiBody({ type: UpdateLevelsDto })
  @ApiResponse({ status: 200, description: 'Levels successfully replaced' })
  async replace(@Body() dto: UpdateLevelsDto) {
    return this.service.replaceLevels(dto);
  }

  @Get('levels')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.USER)
  @ApiOperation({ summary: 'Get levels by course type' })
  @ApiQuery({
    name: 'course',
    required: true,
    enum: ['business', 'school', 'general'],
    description: 'Course type to fetch levels for',
  })
  @ApiResponse({
    status: 200,
    description: 'Levels returned successfully for selected course type',
  })
  async getGroups(@Query('course') course: 'business' | 'school' | 'general') {
    return this.service.getCourseGroups(course);
  }
}