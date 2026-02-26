import { Controller, Get, Post, Body, Param, Delete, Query, Patch, NotFoundException, UseGuards  } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { User, UserRole, UserStatus } from './schemas/user.schema';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBody, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';

import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({
    description: 'User login credentials',
    required: true,
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'securepassword123' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Invalid email or password',
  })
  async loginUser(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<{ token: string }> {
    const user = await this.usersService.login(email, password);
    if (!user) {
      throw new NotFoundException('Invalid email or password');
    }
    const token = this.authService.generateJwtToken({
      username: user.username,
      id: user.id,
      role: user.role,
    });

    return { token };
  }

@Post('sign-up-for-lesson')
@ApiOperation({ summary: 'Sign up for a lesson' })
async signUpForLesson(@Body() createUserSignupDto: CreateUserDto): Promise<{ user: User; password: string }> {
  createUserSignupDto.paidLessons = (createUserSignupDto.paidLessons || 0) + 1;

  const { user, plainPassword } = await this.usersService.createWithPlainPassword({
    ...createUserSignupDto,
    status: UserStatus.PENDING,
    role: UserRole.USER,
    paidLessons: 0,
    salary: 0,
  });

  return { user, password: plainPassword };
}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users or filter by role and/or status' })
  @ApiQuery({ name: 'role', enum: UserRole, required: false })
  @ApiQuery({ name: 'status', enum: UserStatus, required: false })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)  
  getAll(
    @Query('role') role?: UserRole,
    @Query('status') status?: UserStatus,
  ): Promise<User[]> {
    if (role && status) {
      return this.usersService.findByRoleAndStatus(role, status);
    }
    if (role) {
      return this.usersService.findByRole(role);
    }
    if (status) {
      return this.usersService.findByStatus(status);
    }
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  getById(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create user' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async createUser(@Body() createUserSignupDto: CreateUserDto): Promise<{ user: User; password: string }> {

    const { user, plainPassword } = await this.usersService.createWithPlainPassword({
      ...createUserSignupDto,
      status: UserStatus.ACTIVE,
    });

    return { user, password: plainPassword };
  }

  @Post(':id/regenerate-password')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Regenerate and return new password for user (Super Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns user ID and new password',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '60a...' },
        plainPassword: { type: 'string', example: 'newpassword123' },
      },
    },
  })
  async regeneratePassword(@Param('id') id: string): Promise<{ id: string; plainPassword: string }> {
    return this.usersService.regeneratePassword(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user info' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user by ID' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  delete(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update user status' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ schema: { type: 'object', properties: { status: { enum: Object.values(UserStatus), example: 'ACTIVE' } } } })
  updateStatus(@Param('id') id: string, @Body('status') status: UserStatus): Promise<User> {
    return this.usersService.updateStatus(id, status);
  }

  @Patch(':id/role')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update user role' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ schema: { type: 'object', properties: { role: { enum: Object.values(UserRole), example: 'ADMIN' } } } })
  updateRole(@Param('id') id: string, @Body('role') role: UserRole): Promise<User> {
    return this.usersService.updateRole(id, role);
  }
}