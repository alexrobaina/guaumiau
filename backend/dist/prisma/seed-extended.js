"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
const buenosAiresNeighborhoods = [
    { name: 'Palermo', lat: -34.5875, lng: -58.4280 },
    { name: 'Recoleta', lat: -34.5889, lng: -58.3931 },
    { name: 'Belgrano', lat: -34.5631, lng: -58.4578 },
    { name: 'Núñez', lat: -34.5447, lng: -58.4631 },
    { name: 'Caballito', lat: -34.6177, lng: -58.4397 },
    { name: 'Villa Crespo', lat: -34.6000, lng: -58.4392 },
    { name: 'Colegiales', lat: -34.5739, lng: -58.4478 },
    { name: 'Villa Urquiza', lat: -34.5722, lng: -58.4883 },
    { name: 'San Telmo', lat: -34.6213, lng: -58.3724 },
    { name: 'Puerto Madero', lat: -34.6118, lng: -58.3632 },
    { name: 'Almagro', lat: -34.6097, lng: -58.4175 },
    { name: 'Flores', lat: -34.6283, lng: -58.4652 },
];
const firstNames = ['Juan', 'María', 'Carlos', 'Laura', 'Diego', 'Ana', 'Pablo', 'Sofía', 'Martín', 'Lucía', 'Fernando', 'Valentina', 'Sebastián', 'Camila', 'Mateo', 'Florencia', 'Nicolás', 'Agustina', 'Lucas', 'Victoria'];
const lastNames = ['González', 'Rodríguez', 'Fernández', 'López', 'Martínez', 'García', 'Pérez', 'Sánchez', 'Romero', 'Silva', 'Torres', 'Díaz', 'Moreno', 'Álvarez', 'Castro', 'Herrera', 'Molina', 'Vargas'];
const dogNames = ['Max', 'Luna', 'Rocky', 'Bella', 'Toby', 'Lola', 'Bruno', 'Mia', 'Charlie', 'Coco', 'Thor', 'Nina', 'Simba', 'Nala', 'Bobby'];
const catNames = ['Michi', 'Garfield', 'Felix', 'Pelusa', 'Salem', 'Mittens', 'Whiskers', 'Luna', 'Simba', 'Oliver', 'Leo', 'Chloe', 'Nala', 'Tigger', 'Shadow'];
const dogBreeds = ['Labrador', 'Golden Retriever', 'Border Collie', 'Beagle', 'Bulldog Francés', 'Pastor Alemán', 'Caniche', 'Chihuahua', 'Dálmata', 'Mestizo', 'Schnauzer', 'Cocker Spaniel'];
const catBreeds = ['Siamés', 'Persa', 'Maine Coon', 'Bengalí', 'Ragdoll', 'British Shorthair', 'Mestizo', 'Gato Común Europeo'];
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}
async function main() {
    console.log('🌱 Starting extended seed for Buenos Aires...');
    console.log('='.repeat(60));
    console.log('\n👤 Creating test user in Palermo...');
    const testUserPassword = 'TestPalermo2024!';
    const hashedTestPassword = await bcrypt.hash(testUserPassword, 10);
    const palermo = buenosAiresNeighborhoods[0];
    const testUser = await prisma.user.create({
        data: {
            email: 'test@palermo.com',
            username: 'test_palermo',
            password: hashedTestPassword,
            firstName: 'Usuario',
            lastName: 'Prueba',
            phone: '+541155550001',
            roles: [client_1.UserRole.PET_OWNER],
            address: 'Av. Santa Fe 3500, Palermo',
            city: 'Buenos Aires',
            state: 'CABA',
            postalCode: '1425',
            country: 'AR',
            latitude: palermo.lat,
            longitude: palermo.lng,
            isEmailVerified: true,
            isActive: true,
            termsAccepted: true,
            termsAcceptedAt: new Date(),
            avatar: 'https://i.pravatar.cc/150?img=50',
        },
    });
    console.log(`✅ Test user created!`);
    console.log(`   📧 Email: ${testUser.email}`);
    console.log(`   👤 Username: ${testUser.username}`);
    console.log(`   🔑 Password: ${testUserPassword}`);
    console.log(`   📍 Location: Palermo, Buenos Aires`);
    console.log('\n🐕 Creating pets for test user...');
    const testUserPets = [];
    const dog1 = await prisma.pet.create({
        data: {
            ownerId: testUser.id,
            name: 'Max',
            type: client_1.PetType.DOG,
            breed: 'Labrador Retriever',
            size: client_1.PetSize.LARGE,
            weight: 32,
            age: 4,
            gender: client_1.PetGender.MALE,
            photos: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop'],
            isVaccinated: true,
            vaccinationRecords: [
                { name: 'Rabia', date: '2024-03-15', nextDue: '2025-03-15' },
                { name: 'Séxtuple', date: '2024-03-15', nextDue: '2025-03-15' },
            ],
            isNeutered: true,
            energyLevel: client_1.EnergyLevel.HIGH,
            isFriendlyWithDogs: true,
            isFriendlyWithCats: true,
            isFriendlyWithKids: true,
            trainingLevel: 'Avanzado',
            favoriteActivities: 'Correr, jugar a la pelota, nadar en lagos',
            preferredWalkDuration: 60,
            preferredWalkFrequency: 'Dos veces al día',
            specialInstructions: 'Le encanta el agua. Usar arnés, no collar.',
        },
    });
    testUserPets.push(dog1);
    const dog2 = await prisma.pet.create({
        data: {
            ownerId: testUser.id,
            name: 'Luna',
            type: client_1.PetType.DOG,
            breed: 'Golden Retriever',
            size: client_1.PetSize.LARGE,
            weight: 28,
            age: 2,
            gender: client_1.PetGender.FEMALE,
            photos: ['https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400&h=400&fit=crop'],
            isVaccinated: true,
            isNeutered: false,
            energyLevel: client_1.EnergyLevel.VERY_HIGH,
            isFriendlyWithDogs: true,
            isFriendlyWithCats: false,
            isFriendlyWithKids: true,
            trainingLevel: 'Básico',
            favoriteActivities: 'Jugar con otros perros, explorar parques',
            preferredWalkDuration: 45,
            preferredWalkFrequency: 'Dos veces al día',
            specialInstructions: 'Muy energética. Necesita correr todos los días.',
        },
    });
    testUserPets.push(dog2);
    console.log(`✅ Created ${testUserPets.length} pets for test user`);
    console.log(`   🐕 Max (Labrador, 4 años)`);
    console.log(`   🐕 Luna (Golden Retriever, 2 años)`);
    console.log('\n🚶 Creating service providers in Buenos Aires...');
    const providers = [];
    for (let i = 0; i < 20; i++) {
        const neighborhood = getRandomElement(buenosAiresNeighborhoods);
        const firstName = getRandomElement(firstNames);
        const lastName = getRandomElement(lastNames);
        const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${i}`;
        const latVariation = getRandomFloat(-0.015, 0.015);
        const lngVariation = getRandomFloat(-0.015, 0.015);
        const password = await bcrypt.hash(`Provider${i}Pass!`, 10);
        const servicesOffered = [];
        const serviceDescription = [];
        if (i % 4 === 0) {
            servicesOffered.push(client_1.ServiceType.DOG_WALKING, client_1.ServiceType.DOG_RUNNING);
            serviceDescription.push('Paseador de perros');
        }
        else if (i % 4 === 1) {
            servicesOffered.push(client_1.ServiceType.CAT_SITTING, client_1.ServiceType.HOME_VISITS, client_1.ServiceType.CAT_BOARDING);
            serviceDescription.push('Cuidador de gatos');
        }
        else if (i % 4 === 2) {
            servicesOffered.push(client_1.ServiceType.DOG_WALKING, client_1.ServiceType.DOG_SITTING, client_1.ServiceType.DOG_BOARDING);
            serviceDescription.push('Paseador y cuidador de perros');
        }
        else {
            servicesOffered.push(client_1.ServiceType.DOG_WALKING, client_1.ServiceType.CAT_SITTING, client_1.ServiceType.PET_SITTING, client_1.ServiceType.HOME_VISITS);
            serviceDescription.push('Cuidador de mascotas');
        }
        const user = await prisma.user.create({
            data: {
                email: `${username}@guaumiau.com`,
                username: username,
                password: password,
                firstName: firstName,
                lastName: lastName,
                phone: `+5491155${getRandomInt(100000, 999999)}`,
                roles: [client_1.UserRole.SERVICE_PROVIDER],
                address: `${neighborhood.name}, Buenos Aires`,
                city: 'Buenos Aires',
                state: 'CABA',
                postalCode: `${getRandomInt(1400, 1499)}`,
                country: 'AR',
                latitude: neighborhood.lat + latVariation,
                longitude: neighborhood.lng + lngVariation,
                isEmailVerified: true,
                isActive: true,
                termsAccepted: true,
                termsAcceptedAt: new Date(),
                avatar: `https://i.pravatar.cc/150?img=${i + 10}`,
            },
        });
        const providerProfile = await prisma.serviceProviderProfile.create({
            data: {
                userId: user.id,
                bio: `${serviceDescription[0]} con ${getRandomInt(2, 10)} años de experiencia en ${neighborhood.name}. Amante de los animales y dedicado al mejor cuidado de tu mascota.`,
                experience: `${getRandomInt(2, 10)} años`,
                servicesOffered: servicesOffered,
                isAvailable: true,
                maxPetsPerBooking: getRandomInt(1, 4),
                acceptedPetTypes: servicesOffered.some(s => s.includes('DOG'))
                    ? servicesOffered.some(s => s.includes('CAT'))
                        ? [client_1.PetType.DOG, client_1.PetType.CAT]
                        : [client_1.PetType.DOG]
                    : [client_1.PetType.CAT],
                acceptedPetSizes: [client_1.PetSize.SMALL, client_1.PetSize.MEDIUM, client_1.PetSize.LARGE, client_1.PetSize.EXTRA_LARGE],
                coverageRadiusKm: getRandomFloat(3, 10),
                hasHomeSpace: i % 3 === 0,
                homeSpaceDescription: i % 3 === 0 ? 'Casa con patio/jardín grande y seguro' : null,
                currency: 'ARS',
                isVerified: i % 2 === 0,
                isBackgroundChecked: i % 2 === 0,
                hasInsurance: i % 3 === 0,
                totalBookings: getRandomInt(10, 150),
                completedBookings: getRandomInt(5, 140),
                cancelledBookings: getRandomInt(0, 5),
                averageRating: getRandomFloat(4.2, 5.0),
                totalReviews: getRandomInt(5, 70),
                responseRate: getRandomFloat(85, 100),
                avgResponseTimeMin: getRandomInt(5, 60),
                level: getRandomInt(1, 10),
                points: getRandomInt(100, 6000),
                streak: getRandomInt(0, 45),
            },
        });
        for (const serviceType of servicesOffered) {
            let basePrice = 0;
            let pricingUnit = client_1.PricingUnit.PER_HOUR;
            let duration;
            switch (serviceType) {
                case client_1.ServiceType.DOG_WALKING:
                    basePrice = getRandomInt(700, 1500);
                    pricingUnit = client_1.PricingUnit.PER_WALK;
                    duration = getRandomInt(30, 60);
                    break;
                case client_1.ServiceType.DOG_RUNNING:
                    basePrice = getRandomInt(1000, 2000);
                    pricingUnit = client_1.PricingUnit.PER_HOUR;
                    duration = 60;
                    break;
                case client_1.ServiceType.CAT_SITTING:
                    basePrice = getRandomInt(600, 1400);
                    pricingUnit = client_1.PricingUnit.PER_VISIT;
                    duration = getRandomInt(20, 40);
                    break;
                case client_1.ServiceType.DOG_SITTING:
                    basePrice = getRandomInt(1500, 3500);
                    pricingUnit = client_1.PricingUnit.PER_DAY;
                    break;
                case client_1.ServiceType.CAT_BOARDING:
                    basePrice = getRandomInt(1000, 2000);
                    pricingUnit = client_1.PricingUnit.PER_NIGHT;
                    break;
                case client_1.ServiceType.DOG_BOARDING:
                    basePrice = getRandomInt(2000, 4000);
                    pricingUnit = client_1.PricingUnit.PER_NIGHT;
                    break;
                case client_1.ServiceType.PET_SITTING:
                    basePrice = getRandomInt(1200, 3000);
                    pricingUnit = client_1.PricingUnit.PER_DAY;
                    break;
                case client_1.ServiceType.HOME_VISITS:
                    basePrice = getRandomInt(500, 1200);
                    pricingUnit = client_1.PricingUnit.PER_VISIT;
                    duration = getRandomInt(20, 40);
                    break;
                default:
                    basePrice = 1000;
            }
            await prisma.service.create({
                data: {
                    providerId: providerProfile.id,
                    serviceType: serviceType,
                    basePrice: basePrice,
                    pricingUnit: pricingUnit,
                    description: `Servicio profesional de ${serviceType.toLowerCase().replace(/_/g, ' ')} en ${neighborhood.name}`,
                    duration: duration,
                    maxPets: getRandomInt(1, 3),
                    acceptedPetTypes: serviceType.includes('DOG')
                        ? [client_1.PetType.DOG]
                        : serviceType.includes('CAT')
                            ? [client_1.PetType.CAT]
                            : [client_1.PetType.DOG, client_1.PetType.CAT],
                    acceptedPetSizes: [client_1.PetSize.SMALL, client_1.PetSize.MEDIUM, client_1.PetSize.LARGE],
                    isActive: true,
                    extraPetFee: Math.round(basePrice * 0.3),
                    weekendSurcharge: getRandomInt(15, 25),
                    holidaySurcharge: getRandomInt(25, 40),
                },
            });
        }
        const workDays = [client_1.DayOfWeek.MONDAY, client_1.DayOfWeek.TUESDAY, client_1.DayOfWeek.WEDNESDAY, client_1.DayOfWeek.THURSDAY, client_1.DayOfWeek.FRIDAY];
        const weekendDays = [client_1.DayOfWeek.SATURDAY, client_1.DayOfWeek.SUNDAY];
        for (const day of workDays) {
            await prisma.availability.create({
                data: {
                    providerId: providerProfile.id,
                    dayOfWeek: day,
                    startTime: i % 3 === 0 ? '07:00' : '08:00',
                    endTime: i % 3 === 0 ? '21:00' : '19:00',
                    isActive: true,
                },
            });
        }
        if (i % 10 < 7) {
            for (const day of weekendDays) {
                await prisma.availability.create({
                    data: {
                        providerId: providerProfile.id,
                        dayOfWeek: day,
                        startTime: '09:00',
                        endTime: '18:00',
                        isActive: true,
                    },
                });
            }
        }
        providers.push({ user, providerProfile, neighborhood: neighborhood.name, services: serviceDescription[0] });
        if ((i + 1) % 5 === 0) {
            console.log(`   ✅ Created ${i + 1}/20 providers...`);
        }
    }
    console.log(`\n✅ Created ${providers.length} service providers!`);
    console.log('\n📍 Sample providers by neighborhood:');
    const grouped = providers.reduce((acc, p) => {
        if (!acc[p.neighborhood])
            acc[p.neighborhood] = [];
        acc[p.neighborhood].push(p);
        return acc;
    }, {});
    Object.keys(grouped).slice(0, 5).forEach(neighborhood => {
        const count = grouped[neighborhood].length;
        console.log(`   ${neighborhood}: ${count} provider(s)`);
    });
    console.log('\n' + '='.repeat(60));
    console.log('🎉 Extended seed completed successfully!');
    console.log('='.repeat(60));
    console.log('\n📋 RESUMEN:');
    console.log(`   • ${providers.length} paseadores/cuidadores en Buenos Aires`);
    console.log(`   • 1 usuario de prueba en Palermo`);
    console.log(`   • 2 mascotas para el usuario de prueba`);
    console.log(`   • ${providers.filter(p => p.services.includes('perros')).length} paseadores de perros`);
    console.log(`   • ${providers.filter(p => p.services.includes('gatos')).length} cuidadores de gatos`);
    console.log('\n🔑 CREDENCIALES DEL USUARIO DE PRUEBA EN PALERMO:');
    console.log(`   📧 Email:    ${testUser.email}`);
    console.log(`   👤 Username: ${testUser.username}`);
    console.log(`   🔑 Password: ${testUserPassword}`);
    console.log(`   📍 Location: ${testUser.address}`);
    console.log(`   🐕 Mascotas: Max (Labrador, 4 años), Luna (Golden Retriever, 2 años)`);
    console.log('\n💡 TIP: Usa estas credenciales para probar la app desde Palermo!');
    console.log('='.repeat(60) + '\n');
}
main()
    .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-extended.js.map