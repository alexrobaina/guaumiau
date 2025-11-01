import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetResponseDto } from './dto/pet-response.dto';
export declare class PetsController {
    private readonly petsService;
    constructor(petsService: PetsService);
    create(user: any, createPetDto: CreatePetDto): Promise<PetResponseDto>;
    findAll(user: any): Promise<PetResponseDto[]>;
    findOne(id: string, user: any): Promise<PetResponseDto>;
    update(id: string, user: any, updatePetDto: UpdatePetDto): Promise<PetResponseDto>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
    addPhoto(id: string, user: any, photoUrl: string): Promise<PetResponseDto>;
    removePhoto(id: string, user: any, photoUrl: string): Promise<PetResponseDto>;
    updateMedicalInfo(id: string, user: any, medicalInfo: any): Promise<PetResponseDto>;
    updateBehaviorInfo(id: string, user: any, behaviorInfo: any): Promise<PetResponseDto>;
}
