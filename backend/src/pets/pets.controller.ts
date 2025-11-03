import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetResponseDto } from './dto/pet-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('pets')
@Controller('pets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new pet' })
  @ApiResponse({
    status: 201,
    description: 'Pet successfully created',
    type: PetResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Req() request: Request,
    @Body() createPetDto: CreatePetDto,
  ): Promise<PetResponseDto> {
    const user = (request as any).user;
    return this.petsService.create(user.id, createPetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all pets for current user' })
  @ApiResponse({
    status: 200,
    description: 'List of pets',
    type: [PetResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Req() request: Request): Promise<PetResponseDto[]> {
    const user = (request as any).user;
    return this.petsService.findAllByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific pet by ID' })
  @ApiResponse({
    status: 200,
    description: 'Pet details',
    type: PetResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Pet not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your pet' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(
    @Req() request: Request,
    @Param('id') id: string,
  ): Promise<PetResponseDto> {
    const user = (request as any).user;
    return this.petsService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a pet' })
  @ApiResponse({
    status: 200,
    description: 'Pet successfully updated',
    type: PetResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 404, description: 'Pet not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your pet' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updatePetDto: UpdatePetDto,
  ): Promise<PetResponseDto> {
    const user = (request as any).user;
    return this.petsService.update(id, user.id, updatePetDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a pet' })
  @ApiResponse({ status: 200, description: 'Pet successfully deleted' })
  @ApiResponse({ status: 404, description: 'Pet not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your pet' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async remove(@Req() request: Request, @Param('id') id: string) {
    const user = (request as any).user;
    return this.petsService.remove(id, user.id);
  }

  @Post(':id/photos')
  @ApiOperation({ summary: 'Add a photo to a pet' })
  @ApiResponse({
    status: 200,
    description: 'Photo added successfully',
    type: PetResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Pet not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your pet' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async addPhoto(
    @Req() request: Request,
    @Param('id') id: string,
    @Body('photoUrl') photoUrl: string,
  ): Promise<PetResponseDto> {
    const user = (request as any).user;
    return this.petsService.addPhoto(id, user.id, photoUrl);
  }

  @Delete(':id/photos')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a photo from a pet' })
  @ApiResponse({
    status: 200,
    description: 'Photo removed successfully',
    type: PetResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Pet not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your pet' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async removePhoto(
    @Req() request: Request,
    @Param('id') id: string,
    @Body('photoUrl') photoUrl: string,
  ): Promise<PetResponseDto> {
    const user = (request as any).user;
    return this.petsService.removePhoto(id, user.id, photoUrl);
  }

  @Patch(':id/medical')
  @ApiOperation({ summary: 'Update pet medical information' })
  @ApiResponse({
    status: 200,
    description: 'Medical information updated successfully',
    type: PetResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Pet not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your pet' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateMedicalInfo(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() medicalInfo: any,
  ): Promise<PetResponseDto> {
    const user = (request as any).user;
    return this.petsService.updateMedicalInfo(id, user.id, medicalInfo);
  }

  @Patch(':id/behavior')
  @ApiOperation({ summary: 'Update pet behavior information' })
  @ApiResponse({
    status: 200,
    description: 'Behavior information updated successfully',
    type: PetResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Pet not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your pet' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateBehaviorInfo(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() behaviorInfo: any,
  ): Promise<PetResponseDto> {
    const user = (request as any).user;
    return this.petsService.updateBehaviorInfo(id, user.id, behaviorInfo);
  }
}
