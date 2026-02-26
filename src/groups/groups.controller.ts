import { Body, Controller, Get, Param, Post, Delete, Patch, Query, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './schemas/group.schema';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@ApiTags('Groups')
@UseGuards(AuthGuard, RolesGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({
    status: 201,
    description: 'Group successfully created',
    type: Group,
  })
  @ApiBody({ type: CreateGroupDto })
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.USER)
  @ApiOperation({ summary: 'Get all groups or filter by teacher ID' })
  @ApiQuery({
    name: 'teacherId',
    required: false,
    description: "Optional: Filter groups by instructor's ObjectId (exact match)",
  })
  @ApiResponse({
    status: 200,
    description: 'List of groups returned successfully',
    type: [Group],
  })
  async find(@Query('teacherId') teacherId?: string) {
    const cleanId = typeof teacherId === 'string' && teacherId.trim();
    if (cleanId) {
      return this.groupsService.findByTeacherId(cleanId);
    }
    return this.groupsService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.USER)
  @ApiOperation({ summary: 'Get a single group by ID' })
  @ApiParam({ name: 'id', description: 'Group ObjectId' })
  @ApiResponse({ status: 200, description: 'Group found', type: Group })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a group by its ID' })
  @ApiParam({
    name: 'id',
    description: 'The ObjectId of the group to update',
    example: '6641a3b0e1c4ae7f12abcde1',
  })
  @ApiResponse({
    status: 200,
    description: 'Group updated successfully',
    type: Group,
  })
  @ApiResponse({ status: 404, description: 'Group not found' })
  @ApiBody({ type: UpdateGroupDto })
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    const updated = await this.groupsService.update(id, updateGroupDto);
    if (!updated) throw new NotFoundException('Group not found');
    return updated;
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a group by ID' })
  @ApiParam({ name: 'id', description: 'The ObjectId of the group to delete' })
  @ApiResponse({ status: 200, description: 'Group deleted successfully' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async remove(@Param('id') id: string) {
    await this.groupsService.remove(id);
    return { message: 'Group deleted successfully' };
  }
}
