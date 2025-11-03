import { Request } from 'express';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetResponseDto } from './dto/pet-response.dto';
export declare class PetsController {
    private readonly petsService;
    constructor(petsService: PetsService);
    create(request: Request, createPetDto: CreatePetDto): Promise<PetResponseDto>;
    findAll(request: Request): Promise<PetResponseDto[]>;
    findOne(request: Request, id: string): Promise<PetResponseDto>;
    update(request: Request, id: string, updatePetDto: UpdatePetDto): Promise<PetResponseDto>;
    remove(request: Request, id: string): Promise<{
        message: string;
    }>;
    addPhoto(request: Request, id: string, photoUrl: string): Promise<PetResponseDto>;
    removePhoto(request: Request, id: string, photoUrl: string): Promise<PetResponseDto>;
    updateMedicalInfo(request: Request, id: string, medicalInfo: any): Promise<PetResponseDto>;
    updateBehaviorInfo(request: Request, id: string, behaviorInfo: any): Promise<PetResponseDto>;
}
