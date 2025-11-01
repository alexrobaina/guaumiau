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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetResponseDto } from './dto/pet-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

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
    @CurrentUser() user: any,
    @Body() createPetDto: CreatePetDto,
  ): Promise<PetResponseDto> {
    return this.petsService.create(user.userId, createPetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all pets for current user' })
  @ApiResponse({
    status: 200,
    description: 'List of pets',
    type: [PetResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@CurrentUser() user: any): Promise<PetResponseDto[]> {
    return this.petsService.findAllByUser(user.userId);
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
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<PetResponseDto> {
    return this.petsService.findOne(id, user.userId);
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
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updatePetDto: UpdatePetDto,
  ): Promise<PetResponseDto> {
    return this.petsService.update(id, user.userId, updatePetDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a pet' })
  @ApiResponse({ status: 200, description: 'Pet successfully deleted' })
  @ApiResponse({ status: 404, description: 'Pet not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your pet' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.petsService.remove(id, user.userId);
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
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body('photoUrl') photoUrl: string,
  ): Promise<PetResponseDto> {
    return this.petsService.addPhoto(id, user.userId, photoUrl);
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
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body('photoUrl') photoUrl: string,
  ): Promise<PetResponseDto> {
    return this.petsService.removePhoto(id, user.userId, photoUrl);
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
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() medicalInfo: any,
  ): Promise<PetResponseDto> {
    return this.petsService.updateMedicalInfo(id, user.userId, medicalInfo);
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
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() behaviorInfo: any,
  ): Promise<PetResponseDto> {
    return this.petsService.updateBehaviorInfo(id, user.userId, behaviorInfo);
  }
}
