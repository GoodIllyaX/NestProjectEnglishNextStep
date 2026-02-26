import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PricesService } from './prices.service';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';

import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@ApiTags('Prices')
@UseGuards(AuthGuard, RolesGuard)
@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new pricing entry' })
  @ApiResponse({ status: 201, description: 'Price created successfully' })
  create(@Body() createPriceDto: CreatePriceDto) {
    return this.pricesService.create(createPriceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all prices or filter by type' })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter by audience type (CHILDREN or ADULTS)',
    example: 'CHILDREN',
  })
  @ApiResponse({ status: 200, description: 'List of prices returned successfully' })
  findAll(@Query('type') type?: string) {
    return this.pricesService.findAll(type);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update an existing pricing entry by ID' })
  @ApiParam({ name: 'id', description: 'MongoDB document ID of the price entry' })
  @ApiResponse({ status: 200, description: 'Price updated successfully' })
  update(@Param('id') id: string, @Body() updatePriceDto: UpdatePriceDto) {
    return this.pricesService.update(id, updatePriceDto);
  }
}