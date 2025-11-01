import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new pet for a user
   */
  async create(userId: string, createPetDto: CreatePetDto) {
    try {
      const pet = await this.prisma.pet.create({
        data: {
          ...createPetDto,
          ownerId: userId,
          photos: createPetDto.photos || [],
          vaccinationRecords: createPetDto.vaccinationRecords
            ? (createPetDto.vaccinationRecords as any)
            : [],
        },
      });

      return pet;
    } catch (error) {
      throw new BadRequestException('Failed to create pet');
    }
  }

  /**
   * Get all pets for a user
   */
  async findAllByUser(userId: string) {
    const pets = await this.prisma.pet.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return pets;
  }

  /**
   * Get a single pet by ID
   */
  async findOne(id: string, userId: string) {
    const pet = await this.prisma.pet.findUnique({
      where: { id },
    });

    if (!pet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }

    // Ensure user owns this pet
    if (pet.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this pet');
    }

    return pet;
  }

  /**
   * Update a pet
   */
  async update(id: string, userId: string, updatePetDto: UpdatePetDto) {
    // Verify ownership
    await this.findOne(id, userId);

    try {
      const dataToUpdate: any = { ...updatePetDto };

      // Handle vaccinationRecords as JSON
      if (updatePetDto.vaccinationRecords) {
        dataToUpdate.vaccinationRecords = updatePetDto.vaccinationRecords as any;
      }

      const updatedPet = await this.prisma.pet.update({
        where: { id },
        data: dataToUpdate,
      });

      return updatedPet;
    } catch (error) {
      throw new BadRequestException('Failed to update pet');
    }
  }

  /**
   * Delete a pet
   */
  async remove(id: string, userId: string) {
    // Verify ownership
    await this.findOne(id, userId);

    try {
      await this.prisma.pet.delete({
        where: { id },
      });

      return { message: 'Pet deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to delete pet');
    }
  }

  /**
   * Add photo to pet
   */
  async addPhoto(id: string, userId: string, photoUrl: string) {
    const pet = await this.findOne(id, userId);

    const updatedPet = await this.prisma.pet.update({
      where: { id },
      data: {
        photos: {
          push: photoUrl,
        },
      },
    });

    return updatedPet;
  }

  /**
   * Remove photo from pet
   */
  async removePhoto(id: string, userId: string, photoUrl: string) {
    const pet = await this.findOne(id, userId);

    const updatedPhotos = pet.photos.filter((photo) => photo !== photoUrl);

    const updatedPet = await this.prisma.pet.update({
      where: { id },
      data: {
        photos: updatedPhotos,
      },
    });

    return updatedPet;
  }

  /**
   * Update medical information
   */
  async updateMedicalInfo(
    id: string,
    userId: string,
    medicalInfo: {
      isVaccinated?: boolean;
      vaccinationRecords?: any;
      isNeutered?: boolean;
      microchipId?: string;
      allergies?: string;
      medications?: string;
      specialNeeds?: string;
      vetName?: string;
      vetPhone?: string;
      vetAddress?: string;
    },
  ) {
    await this.findOne(id, userId);

    const updatedPet = await this.prisma.pet.update({
      where: { id },
      data: medicalInfo,
    });

    return updatedPet;
  }

  /**
   * Update behavior information
   */
  async updateBehaviorInfo(
    id: string,
    userId: string,
    behaviorInfo: {
      energyLevel?: any;
      isFriendlyWithDogs?: boolean;
      isFriendlyWithCats?: boolean;
      isFriendlyWithKids?: boolean;
      trainingLevel?: string;
      favoriteActivities?: string;
      preferredWalkDuration?: number;
      preferredWalkFrequency?: string;
      specialInstructions?: string;
    },
  ) {
    await this.findOne(id, userId);

    const updatedPet = await this.prisma.pet.update({
      where: { id },
      data: behaviorInfo,
    });

    return updatedPet;
  }

  /**
   * Get multiple pets by IDs (for booking selection)
   */
  async findMultiple(petIds: string[], userId: string) {
    const pets = await this.prisma.pet.findMany({
      where: {
        id: { in: petIds },
        ownerId: userId,
      },
    });

    if (pets.length !== petIds.length) {
      throw new BadRequestException('Some pets not found or not owned by user');
    }

    return pets;
  }
}
