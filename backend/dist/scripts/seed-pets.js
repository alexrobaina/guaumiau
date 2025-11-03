"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const OWNER_ID = 'd4b1c5d0-b1f2-4db4-ab0a-6dfa0d5e7e9a';
const pets = [
    {
        name: 'Max',
        type: client_1.PetType.DOG,
        breed: 'Golden Retriever',
        size: client_1.PetSize.LARGE,
        weight: 32.5,
        age: 4,
        gender: client_1.PetGender.MALE,
        photos: ['https://images.unsplash.com/photo-1633722715463-d30f4f325e24'],
        isVaccinated: true,
        vaccinationRecords: {
            vaccines: [
                { name: 'Rabies', date: '2024-01-15', nextDue: '2025-01-15' },
                { name: 'DHPP', date: '2024-02-10', nextDue: '2025-02-10' },
            ],
        },
        isNeutered: true,
        microchipId: '123456789012345',
        energyLevel: client_1.EnergyLevel.HIGH,
        isFriendlyWithDogs: true,
        isFriendlyWithCats: true,
        isFriendlyWithKids: true,
        trainingLevel: 'Advanced',
        favoriteActivities: 'Swimming, fetch, running',
        preferredWalkDuration: 60,
        preferredWalkFrequency: 'Twice daily',
        specialInstructions: 'Loves treats and belly rubs',
    },
    {
        name: 'Luna',
        type: client_1.PetType.DOG,
        breed: 'French Bulldog',
        size: client_1.PetSize.SMALL,
        weight: 11.0,
        age: 2,
        gender: client_1.PetGender.FEMALE,
        photos: ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e'],
        isVaccinated: true,
        vaccinationRecords: {
            vaccines: [
                { name: 'Rabies', date: '2024-03-20', nextDue: '2025-03-20' },
                { name: 'DHPP', date: '2024-03-20', nextDue: '2025-03-20' },
            ],
        },
        isNeutered: false,
        energyLevel: client_1.EnergyLevel.MODERATE,
        isFriendlyWithDogs: true,
        isFriendlyWithCats: false,
        isFriendlyWithKids: true,
        trainingLevel: 'Basic',
        favoriteActivities: 'Short walks, napping, playing with toys',
        preferredWalkDuration: 30,
        preferredWalkFrequency: 'Once daily',
        specialInstructions: 'Sensitive to heat, keep walks short in summer',
    },
    {
        name: 'Whiskers',
        type: client_1.PetType.CAT,
        breed: 'Persian',
        size: client_1.PetSize.SMALL,
        weight: 4.5,
        age: 3,
        gender: client_1.PetGender.MALE,
        photos: ['https://images.unsplash.com/photo-1455103493930-a116f655b6c5'],
        isVaccinated: true,
        vaccinationRecords: {
            vaccines: [
                { name: 'FVRCP', date: '2024-01-10', nextDue: '2025-01-10' },
                { name: 'Rabies', date: '2024-01-10', nextDue: '2025-01-10' },
            ],
        },
        isNeutered: true,
        microchipId: '987654321098765',
        energyLevel: client_1.EnergyLevel.LOW,
        isFriendlyWithDogs: false,
        isFriendlyWithCats: true,
        isFriendlyWithKids: false,
        trainingLevel: 'None',
        favoriteActivities: 'Lounging, grooming, watching birds',
        specialInstructions: 'Needs daily brushing, indoor only',
    },
    {
        name: 'Rocky',
        type: client_1.PetType.DOG,
        breed: 'German Shepherd',
        size: client_1.PetSize.LARGE,
        weight: 38.0,
        age: 5,
        gender: client_1.PetGender.MALE,
        photos: ['https://images.unsplash.com/photo-1568572933382-74d440642117'],
        isVaccinated: true,
        vaccinationRecords: {
            vaccines: [
                { name: 'Rabies', date: '2023-12-05', nextDue: '2024-12-05' },
                { name: 'DHPP', date: '2023-12-05', nextDue: '2024-12-05' },
                { name: 'Leptospirosis', date: '2024-06-01', nextDue: '2025-06-01' },
            ],
        },
        isNeutered: true,
        microchipId: '456789123456789',
        allergies: 'Chicken',
        energyLevel: client_1.EnergyLevel.VERY_HIGH,
        isFriendlyWithDogs: true,
        isFriendlyWithCats: false,
        isFriendlyWithKids: true,
        trainingLevel: 'Advanced',
        favoriteActivities: 'Running, agility training, hiking',
        preferredWalkDuration: 90,
        preferredWalkFrequency: 'Twice daily',
        specialInstructions: 'Very energetic, needs lots of exercise',
        vetName: 'Dr. Martinez',
        vetPhone: '+54 11 4567-8901',
        vetAddress: 'Av. Corrientes 1234, Buenos Aires',
    },
    {
        name: 'Bella',
        type: client_1.PetType.DOG,
        breed: 'Beagle',
        size: client_1.PetSize.MEDIUM,
        weight: 13.5,
        age: 6,
        gender: client_1.PetGender.FEMALE,
        photos: ['https://images.unsplash.com/photo-1505628346881-b72b27e84530'],
        isVaccinated: true,
        vaccinationRecords: {
            vaccines: [
                { name: 'Rabies', date: '2024-04-15', nextDue: '2025-04-15' },
                { name: 'DHPP', date: '2024-04-15', nextDue: '2025-04-15' },
            ],
        },
        isNeutered: true,
        medications: 'Joint supplement daily',
        energyLevel: client_1.EnergyLevel.MODERATE,
        isFriendlyWithDogs: true,
        isFriendlyWithCats: true,
        isFriendlyWithKids: true,
        trainingLevel: 'Basic',
        favoriteActivities: 'Sniffing walks, food puzzles',
        preferredWalkDuration: 45,
        preferredWalkFrequency: 'Twice daily',
        specialInstructions: 'Food motivated, keep on leash (strong nose!)',
    },
    {
        name: 'Milo',
        type: client_1.PetType.CAT,
        breed: 'Siamese',
        size: client_1.PetSize.SMALL,
        weight: 5.2,
        age: 1,
        gender: client_1.PetGender.MALE,
        photos: ['https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8'],
        isVaccinated: true,
        vaccinationRecords: {
            vaccines: [
                { name: 'FVRCP', date: '2024-06-20', nextDue: '2025-06-20' },
                { name: 'Rabies', date: '2024-06-20', nextDue: '2025-06-20' },
            ],
        },
        isNeutered: false,
        energyLevel: client_1.EnergyLevel.HIGH,
        isFriendlyWithDogs: true,
        isFriendlyWithCats: true,
        isFriendlyWithKids: true,
        trainingLevel: 'Basic',
        favoriteActivities: 'Playing with feather toys, climbing',
        specialInstructions: 'Very vocal, likes attention',
    },
    {
        name: 'Charlie',
        type: client_1.PetType.DOG,
        breed: 'Labrador Retriever',
        size: client_1.PetSize.LARGE,
        weight: 30.0,
        age: 7,
        gender: client_1.PetGender.MALE,
        photos: ['https://images.unsplash.com/photo-1579178615131-6a5b8e194e27'],
        isVaccinated: true,
        vaccinationRecords: {
            vaccines: [
                { name: 'Rabies', date: '2024-02-28', nextDue: '2025-02-28' },
                { name: 'DHPP', date: '2024-02-28', nextDue: '2025-02-28' },
            ],
        },
        isNeutered: true,
        microchipId: '789123456789123',
        specialNeeds: 'Senior dog, gentle exercise needed',
        energyLevel: client_1.EnergyLevel.LOW,
        isFriendlyWithDogs: true,
        isFriendlyWithCats: true,
        isFriendlyWithKids: true,
        trainingLevel: 'Advanced',
        favoriteActivities: 'Gentle walks, swimming (low impact)',
        preferredWalkDuration: 30,
        preferredWalkFrequency: 'Twice daily',
        specialInstructions: 'Senior dog, take it easy on walks',
        vetName: 'Dr. Garcia',
        vetPhone: '+54 11 5678-9012',
        vetAddress: 'Av. Santa Fe 2345, Buenos Aires',
    },
];
async function seedPets() {
    console.log('🐕 Starting pet seeding...\n');
    try {
        const owner = await prisma.user.findUnique({
            where: { id: OWNER_ID },
            select: { id: true, email: true, firstName: true, lastName: true },
        });
        if (!owner) {
            console.error(`❌ Error: Owner with ID ${OWNER_ID} not found!`);
            console.log('Please make sure the user exists in the database.');
            return;
        }
        console.log(`✅ Found owner: ${owner.firstName} ${owner.lastName} (${owner.email})\n`);
        const existingPets = await prisma.pet.findMany({
            where: { ownerId: OWNER_ID },
            select: { id: true, name: true },
        });
        if (existingPets.length > 0) {
            console.log(`🗑️  Deleting ${existingPets.length} existing pets...`);
            await prisma.pet.deleteMany({
                where: { ownerId: OWNER_ID },
            });
            console.log('✅ Existing pets deleted\n');
        }
        console.log(`🐾 Creating ${pets.length} pets...\n`);
        for (const petData of pets) {
            const pet = await prisma.pet.create({
                data: {
                    ...petData,
                    ownerId: OWNER_ID,
                },
            });
            console.log(`✅ Created: ${pet.name} (${pet.type}, ${pet.breed || 'Mixed'}, ${pet.size}, ${pet.age} years)`);
        }
        console.log(`\n🎉 Successfully created ${pets.length} pets!`);
        const allPets = await prisma.pet.findMany({
            where: { ownerId: OWNER_ID },
            select: {
                name: true,
                type: true,
                breed: true,
                age: true,
                size: true,
                energyLevel: true,
            },
            orderBy: { name: 'asc' },
        });
        console.log('\n📋 Pet Summary:');
        console.log('─'.repeat(80));
        allPets.forEach((pet) => {
            console.log(`${pet.name.padEnd(12)} | ${pet.type.padEnd(6)} | ${(pet.breed || 'Mixed').padEnd(20)} | ${pet.age}y | ${pet.size.padEnd(12)} | ${pet.energyLevel || 'N/A'}`);
        });
        console.log('─'.repeat(80));
    }
    catch (error) {
        console.error('❌ Error seeding pets:', error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
}
seedPets()
    .then(() => {
    console.log('\n✅ Seeding completed successfully!');
    process.exit(0);
})
    .catch((error) => {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
});
//# sourceMappingURL=seed-pets.js.map