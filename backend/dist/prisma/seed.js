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
async function main() {
    console.log('🌱 Starting seed...');
    const hashPassword = async (password) => {
        return bcrypt.hash(password, 10);
    };
    console.log('Creating badges...');
    const badges = await Promise.all([
        prisma.badge.create({
            data: {
                name: 'Super Walker',
                description: 'Completed 50+ dog walks',
                category: 'walker',
                requirements: { completedBookings: 50, serviceType: 'DOG_WALKING' },
            },
        }),
        prisma.badge.create({
            data: {
                name: 'Five Star Provider',
                description: 'Maintained 5.0 rating with 20+ reviews',
                category: 'walker',
                requirements: { avgRating: 5.0, totalReviews: 20 },
            },
        }),
        prisma.badge.create({
            data: {
                name: 'Early Riser',
                description: 'Completed 10+ morning walks (before 7am)',
                category: 'achievement',
            },
        }),
        prisma.badge.create({
            data: {
                name: 'Pet Whisperer',
                description: 'Successfully handled 5+ different pet types',
                category: 'achievement',
            },
        }),
    ]);
    console.log('Creating users...');
    const admin = await prisma.user.create({
        data: {
            email: 'admin@guaumiau.com',
            username: 'admin',
            password: await hashPassword('Admin123!'),
            firstName: 'Admin',
            lastName: 'GuauMiau',
            roles: ['ADMIN'],
            phone: '+541112345678',
            isEmailVerified: true,
            isPhoneVerified: true,
            city: 'Buenos Aires',
            country: 'AR',
        },
    });
    const owner1 = await prisma.user.create({
        data: {
            email: 'maria.garcia@example.com',
            username: 'maria_garcia',
            password: await hashPassword('Password123!'),
            firstName: 'María',
            lastName: 'García',
            roles: ['PET_OWNER'],
            phone: '+541112345679',
            avatar: 'https://i.pravatar.cc/150?img=1',
            address: 'Av. Santa Fe 1234',
            city: 'Buenos Aires',
            state: 'CABA',
            postalCode: 'C1059',
            country: 'AR',
            latitude: -34.59539,
            longitude: -58.37331,
            isEmailVerified: true,
            emergencyContactName: 'Juan García',
            emergencyContactPhone: '+541112345680',
            notificationSettings: {
                email: true,
                push: true,
                sms: false,
                bookingReminders: true,
            },
        },
    });
    const owner2 = await prisma.user.create({
        data: {
            email: 'carlos.lopez@example.com',
            username: 'carlos_lopez',
            password: await hashPassword('Password123!'),
            firstName: 'Carlos',
            lastName: 'López',
            roles: ['PET_OWNER'],
            phone: '+541112345681',
            avatar: 'https://i.pravatar.cc/150?img=12',
            address: 'Av. Cabildo 2500',
            city: 'Buenos Aires',
            state: 'CABA',
            postalCode: 'C1428',
            country: 'AR',
            latitude: -34.56207,
            longitude: -58.45828,
            isEmailVerified: true,
        },
    });
    const provider1 = await prisma.user.create({
        data: {
            email: 'ana.martinez@example.com',
            username: 'ana_walker',
            password: await hashPassword('Password123!'),
            firstName: 'Ana',
            lastName: 'Martínez',
            roles: ['SERVICE_PROVIDER', 'PET_OWNER'],
            phone: '+541112345682',
            avatar: 'https://i.pravatar.cc/150?img=5',
            address: 'Av. Corrientes 3000',
            city: 'Buenos Aires',
            state: 'CABA',
            postalCode: 'C1193',
            country: 'AR',
            latitude: -34.60391,
            longitude: -58.41156,
            isEmailVerified: true,
            isPhoneVerified: true,
            serviceProvider: {
                create: {
                    bio: 'Amante de los animales con 5 años de experiencia cuidando perros de todos los tamaños. Tengo un jardín grande y seguro.',
                    experience: '5 años como paseadora profesional',
                    servicesOffered: ['DOG_WALKING', 'DOG_SITTING', 'DOG_BOARDING'],
                    isAvailable: true,
                    maxPetsPerBooking: 3,
                    acceptedPetTypes: ['DOG'],
                    acceptedPetSizes: ['SMALL', 'MEDIUM', 'LARGE'],
                    coverageRadiusKm: 5,
                    hasHomeSpace: true,
                    homeSpaceDescription: 'Casa con jardín cerrado de 100m², ideal para perros activos',
                    currency: 'ARS',
                    isVerified: true,
                    isBackgroundChecked: true,
                    hasInsurance: true,
                    insuranceExpiryDate: new Date('2025-12-31'),
                    verifiedAt: new Date('2024-01-15'),
                    totalBookings: 127,
                    completedBookings: 120,
                    cancelledBookings: 2,
                    averageRating: 4.8,
                    totalReviews: 45,
                    responseRate: 95.5,
                    avgResponseTimeMin: 15,
                    level: 5,
                    points: 2500,
                    streak: 30,
                    subscriptionType: 'PREMIUM_MONTHLY',
                    subscriptionExpiry: new Date('2025-12-01'),
                },
            },
        },
    });
    const provider2 = await prisma.user.create({
        data: {
            email: 'lucia.fernandez@example.com',
            username: 'lucia_cats',
            password: await hashPassword('Password123!'),
            firstName: 'Lucía',
            lastName: 'Fernández',
            roles: ['SERVICE_PROVIDER'],
            phone: '+541112345683',
            avatar: 'https://i.pravatar.cc/150?img=9',
            address: 'Av. Libertador 5000',
            city: 'Buenos Aires',
            state: 'CABA',
            postalCode: 'C1426',
            country: 'AR',
            latitude: -34.55445,
            longitude: -58.44962,
            isEmailVerified: true,
            isPhoneVerified: true,
            serviceProvider: {
                create: {
                    bio: 'Especialista en cuidado de gatos. Tengo 3 gatos propios y amo cuidar a estos hermosos animales.',
                    experience: '3 años cuidando gatos',
                    servicesOffered: ['CAT_SITTING', 'CAT_BOARDING', 'HOME_VISITS'],
                    isAvailable: true,
                    maxPetsPerBooking: 4,
                    acceptedPetTypes: ['CAT'],
                    acceptedPetSizes: ['EXTRA_SMALL', 'SMALL', 'MEDIUM'],
                    hasHomeSpace: true,
                    homeSpaceDescription: 'Departamento tranquilo con espacios separados para cada gato',
                    currency: 'ARS',
                    isVerified: true,
                    isBackgroundChecked: true,
                    verifiedAt: new Date('2024-06-01'),
                    totalBookings: 58,
                    completedBookings: 56,
                    cancelledBookings: 0,
                    averageRating: 4.9,
                    totalReviews: 23,
                    responseRate: 98.0,
                    avgResponseTimeMin: 10,
                    level: 3,
                    points: 1200,
                    streak: 15,
                },
            },
        },
    });
    const provider3 = await prisma.user.create({
        data: {
            email: 'diego.rodriguez@example.com',
            username: 'diego_pets',
            password: await hashPassword('Password123!'),
            firstName: 'Diego',
            lastName: 'Rodríguez',
            roles: ['SERVICE_PROVIDER', 'PET_OWNER'],
            phone: '+541112345684',
            avatar: 'https://i.pravatar.cc/150?img=14',
            address: 'Av. del Libertador 1500',
            city: 'Buenos Aires',
            state: 'CABA',
            postalCode: 'C1112',
            country: 'AR',
            latitude: -34.58851,
            longitude: -58.39457,
            isEmailVerified: true,
            serviceProvider: {
                create: {
                    bio: 'Cuidador profesional de todo tipo de mascotas. Veterinario de formación.',
                    experience: '10 años como veterinario, 5 años como cuidador',
                    servicesOffered: [
                        'DOG_WALKING',
                        'DOG_SITTING',
                        'CAT_SITTING',
                        'PET_SITTING',
                        'HOME_VISITS',
                    ],
                    isAvailable: true,
                    maxPetsPerBooking: 5,
                    acceptedPetTypes: ['DOG', 'CAT', 'BIRD', 'RABBIT'],
                    acceptedPetSizes: ['EXTRA_SMALL', 'SMALL', 'MEDIUM', 'LARGE'],
                    coverageRadiusKm: 10,
                    hasHomeSpace: false,
                    currency: 'ARS',
                    isVerified: true,
                    isBackgroundChecked: true,
                    hasInsurance: true,
                    insuranceExpiryDate: new Date('2026-03-31'),
                    verifiedAt: new Date('2023-10-01'),
                    totalBookings: 234,
                    completedBookings: 225,
                    cancelledBookings: 3,
                    averageRating: 4.95,
                    totalReviews: 89,
                    responseRate: 99.0,
                    avgResponseTimeMin: 8,
                    level: 8,
                    points: 5000,
                    streak: 60,
                    subscriptionType: 'PREMIUM_YEARLY',
                    subscriptionExpiry: new Date('2025-10-15'),
                },
            },
        },
    });
    const provider1Profile = await prisma.serviceProviderProfile.findUnique({
        where: { userId: provider1.id },
    });
    const provider2Profile = await prisma.serviceProviderProfile.findUnique({
        where: { userId: provider2.id },
    });
    const provider3Profile = await prisma.serviceProviderProfile.findUnique({
        where: { userId: provider3.id },
    });
    console.log('Creating services...');
    await prisma.service.createMany({
        data: [
            {
                providerId: provider1Profile.id,
                serviceType: 'DOG_WALKING',
                basePrice: 800,
                pricingUnit: 'PER_WALK',
                description: 'Paseo de 30-45 minutos por el barrio o parque',
                duration: 40,
                maxPets: 3,
                acceptedPetTypes: ['DOG'],
                acceptedPetSizes: ['SMALL', 'MEDIUM', 'LARGE'],
                extraPetFee: 200,
                weekendSurcharge: 20,
            },
            {
                providerId: provider1Profile.id,
                serviceType: 'DOG_SITTING',
                basePrice: 1500,
                pricingUnit: 'PER_DAY',
                description: 'Cuidado en tu casa mientras estás fuera',
                maxPets: 2,
                acceptedPetTypes: ['DOG'],
                acceptedPetSizes: ['SMALL', 'MEDIUM', 'LARGE'],
                extraPetFee: 500,
            },
            {
                providerId: provider1Profile.id,
                serviceType: 'DOG_BOARDING',
                basePrice: 2000,
                pricingUnit: 'PER_NIGHT',
                description: 'Tu perro se queda en mi casa con jardín',
                maxPets: 2,
                acceptedPetTypes: ['DOG'],
                acceptedPetSizes: ['SMALL', 'MEDIUM', 'LARGE'],
                extraPetFee: 800,
                holidaySurcharge: 30,
            },
        ],
    });
    await prisma.service.createMany({
        data: [
            {
                providerId: provider2Profile.id,
                serviceType: 'CAT_SITTING',
                basePrice: 1200,
                pricingUnit: 'PER_DAY',
                description: 'Cuidado especializado de gatos en tu casa',
                maxPets: 3,
                acceptedPetTypes: ['CAT'],
                acceptedPetSizes: ['EXTRA_SMALL', 'SMALL', 'MEDIUM'],
                extraPetFee: 300,
            },
            {
                providerId: provider2Profile.id,
                serviceType: 'CAT_BOARDING',
                basePrice: 1500,
                pricingUnit: 'PER_NIGHT',
                description: 'Hospedaje en mi casa para gatos',
                maxPets: 4,
                acceptedPetTypes: ['CAT'],
                acceptedPetSizes: ['EXTRA_SMALL', 'SMALL', 'MEDIUM'],
                extraPetFee: 400,
            },
            {
                providerId: provider2Profile.id,
                serviceType: 'HOME_VISITS',
                basePrice: 600,
                pricingUnit: 'PER_VISIT',
                description: 'Visita de 20-30 minutos para alimentar y jugar',
                duration: 25,
                maxPets: 5,
                acceptedPetTypes: ['CAT'],
                acceptedPetSizes: ['EXTRA_SMALL', 'SMALL', 'MEDIUM'],
            },
        ],
    });
    await prisma.service.createMany({
        data: [
            {
                providerId: provider3Profile.id,
                serviceType: 'DOG_WALKING',
                basePrice: 1000,
                pricingUnit: 'PER_HOUR',
                description: 'Paseo profesional con seguimiento GPS',
                duration: 60,
                maxPets: 3,
                acceptedPetTypes: ['DOG'],
                acceptedPetSizes: ['EXTRA_SMALL', 'SMALL', 'MEDIUM', 'LARGE'],
                extraPetFee: 300,
            },
            {
                providerId: provider3Profile.id,
                serviceType: 'PET_SITTING',
                basePrice: 2000,
                pricingUnit: 'PER_DAY',
                description: 'Cuidado profesional con conocimientos veterinarios',
                maxPets: 5,
                acceptedPetTypes: ['DOG', 'CAT', 'BIRD', 'RABBIT'],
                acceptedPetSizes: ['EXTRA_SMALL', 'SMALL', 'MEDIUM', 'LARGE'],
                extraPetFee: 600,
            },
        ],
    });
    console.log('Creating availability schedules...');
    await prisma.availability.createMany({
        data: [
            {
                providerId: provider1Profile.id,
                dayOfWeek: 'MONDAY',
                startTime: '09:00',
                endTime: '18:00',
            },
            {
                providerId: provider1Profile.id,
                dayOfWeek: 'TUESDAY',
                startTime: '09:00',
                endTime: '18:00',
            },
            {
                providerId: provider1Profile.id,
                dayOfWeek: 'WEDNESDAY',
                startTime: '09:00',
                endTime: '18:00',
            },
            {
                providerId: provider1Profile.id,
                dayOfWeek: 'THURSDAY',
                startTime: '09:00',
                endTime: '18:00',
            },
            {
                providerId: provider1Profile.id,
                dayOfWeek: 'FRIDAY',
                startTime: '09:00',
                endTime: '18:00',
            },
            {
                providerId: provider1Profile.id,
                dayOfWeek: 'SATURDAY',
                startTime: '10:00',
                endTime: '14:00',
            },
        ],
    });
    await prisma.availability.createMany({
        data: [
            'MONDAY',
            'TUESDAY',
            'WEDNESDAY',
            'THURSDAY',
            'FRIDAY',
            'SATURDAY',
            'SUNDAY',
        ].map((day) => ({
            providerId: provider2Profile.id,
            dayOfWeek: day,
            startTime: '08:00',
            endTime: '20:00',
        })),
    });
    console.log('Creating pets...');
    const pet1 = await prisma.pet.create({
        data: {
            ownerId: owner1.id,
            name: 'Max',
            type: 'DOG',
            breed: 'Golden Retriever',
            size: 'LARGE',
            weight: 32.5,
            age: 4,
            gender: 'MALE',
            photos: [
                'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400',
                'https://images.unsplash.com/photo-1612536893047-4a8d6b7b8ac0?w=400',
            ],
            isVaccinated: true,
            vaccinationRecords: [
                {
                    name: 'Rabia',
                    date: '2024-03-15',
                    nextDue: '2025-03-15',
                },
                {
                    name: 'Séxtuple',
                    date: '2024-03-15',
                    nextDue: '2025-03-15',
                },
            ],
            isNeutered: true,
            microchipId: 'AR-982000123456789',
            energyLevel: 'HIGH',
            isFriendlyWithDogs: true,
            isFriendlyWithCats: false,
            isFriendlyWithKids: true,
            trainingLevel: 'Advanced',
            favoriteActivities: 'Jugar a la pelota, nadar, correr en el parque',
            preferredWalkDuration: 45,
            preferredWalkFrequency: 'Twice daily',
            vetName: 'Dr. Martín Pérez',
            vetPhone: '+541145678901',
            specialInstructions: 'Le encanta el agua. Usar arnés, no collar.',
        },
    });
    const pet2 = await prisma.pet.create({
        data: {
            ownerId: owner1.id,
            name: 'Luna',
            type: 'DOG',
            breed: 'Beagle',
            size: 'MEDIUM',
            weight: 12.0,
            age: 2,
            gender: 'FEMALE',
            photos: ['https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400'],
            isVaccinated: true,
            isNeutered: false,
            energyLevel: 'VERY_HIGH',
            isFriendlyWithDogs: true,
            isFriendlyWithCats: true,
            isFriendlyWithKids: true,
            trainingLevel: 'Basic',
            favoriteActivities: 'Seguir rastros, explorar',
            preferredWalkDuration: 30,
            preferredWalkFrequency: 'Once daily',
            specialInstructions: 'Muy curiosa, mantener correa siempre puesta.',
        },
    });
    const pet3 = await prisma.pet.create({
        data: {
            ownerId: owner2.id,
            name: 'Michi',
            type: 'CAT',
            breed: 'Siamese',
            size: 'SMALL',
            weight: 4.5,
            age: 3,
            gender: 'MALE',
            photos: ['https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400'],
            isVaccinated: true,
            vaccinationRecords: [
                {
                    name: 'Triple Felina',
                    date: '2024-01-10',
                    nextDue: '2025-01-10',
                },
            ],
            isNeutered: true,
            energyLevel: 'MODERATE',
            isFriendlyWithDogs: false,
            isFriendlyWithCats: true,
            isFriendlyWithKids: true,
            trainingLevel: 'None',
            favoriteActivities: 'Dormir al sol, jugar con plumas',
            vetName: 'Dra. Sofia González',
            vetPhone: '+541145678902',
            specialInstructions: 'Solo comida húmeda premium. Muy vocal.',
        },
    });
    const pet4 = await prisma.pet.create({
        data: {
            ownerId: owner2.id,
            name: 'Coco',
            type: 'CAT',
            breed: 'Domestic Shorthair',
            size: 'MEDIUM',
            weight: 5.2,
            age: 1,
            gender: 'FEMALE',
            photos: ['https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400'],
            isVaccinated: true,
            isNeutered: false,
            energyLevel: 'HIGH',
            isFriendlyWithDogs: true,
            isFriendlyWithCats: true,
            isFriendlyWithKids: true,
            trainingLevel: 'Basic',
            favoriteActivities: 'Trepar, cazar juguetes',
            specialInstructions: 'Muy juguetona y sociable.',
        },
    });
    const pet5 = await prisma.pet.create({
        data: {
            ownerId: provider1.id,
            name: 'Rocky',
            type: 'DOG',
            breed: 'Bulldog Francés',
            size: 'SMALL',
            weight: 11.0,
            age: 5,
            gender: 'MALE',
            photos: ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400'],
            isVaccinated: true,
            isNeutered: true,
            microchipId: 'AR-982000987654321',
            energyLevel: 'LOW',
            isFriendlyWithDogs: true,
            isFriendlyWithCats: true,
            isFriendlyWithKids: true,
            trainingLevel: 'Advanced',
            allergies: 'Polen',
            preferredWalkDuration: 20,
            preferredWalkFrequency: 'Once daily',
            specialInstructions: 'Problemas respiratorios. Evitar ejercicio intenso en días calurosos.',
        },
    });
    const pet6 = await prisma.pet.create({
        data: {
            ownerId: provider3.id,
            name: 'Toby',
            type: 'DOG',
            breed: 'Border Collie',
            size: 'MEDIUM',
            weight: 18.0,
            age: 3,
            gender: 'MALE',
            photos: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400'],
            isVaccinated: true,
            isNeutered: true,
            energyLevel: 'VERY_HIGH',
            isFriendlyWithDogs: true,
            isFriendlyWithCats: false,
            isFriendlyWithKids: true,
            trainingLevel: 'Advanced',
            favoriteActivities: 'Frisbee, agility, pastoreo',
            preferredWalkDuration: 60,
            preferredWalkFrequency: 'Twice daily',
            specialInstructions: 'Muy inteligente y activo. Necesita estimulación mental.',
        },
    });
    console.log('Creating bookings...');
    const booking1 = await prisma.booking.create({
        data: {
            clientId: owner1.id,
            providerId: provider1.id,
            serviceType: 'DOG_WALKING',
            status: 'COMPLETED',
            startDate: new Date('2024-10-15T10:00:00'),
            endDate: new Date('2024-10-15T10:45:00'),
            duration: 45,
            pickupAddress: owner1.address,
            pickupLatitude: owner1.latitude,
            pickupLongitude: owner1.longitude,
            basePrice: 800,
            extraPetFee: 0,
            additionalFees: 0,
            platformCommission: 120,
            totalPrice: 800,
            currency: 'ARS',
            paymentMethod: 'CREDIT_CARD',
            paymentStatus: 'COMPLETED',
            paymentTransactionId: 'txn_123456789',
            specialInstructions: 'Max loves the park on Av. Santa Fe',
            confirmedAt: new Date('2024-10-14T15:30:00'),
            startedAt: new Date('2024-10-15T10:00:00'),
            completedAt: new Date('2024-10-15T10:45:00'),
        },
    });
    await prisma.bookingPet.create({
        data: {
            bookingId: booking1.id,
            petId: pet1.id,
        },
    });
    const booking2 = await prisma.booking.create({
        data: {
            clientId: owner2.id,
            providerId: provider2.id,
            serviceType: 'CAT_SITTING',
            status: 'IN_PROGRESS',
            startDate: new Date('2024-10-20T08:00:00'),
            endDate: new Date('2024-10-22T18:00:00'),
            duration: 2,
            pickupAddress: owner2.address,
            pickupLatitude: owner2.latitude,
            pickupLongitude: owner2.longitude,
            basePrice: 1200,
            extraPetFee: 300,
            additionalFees: 0,
            platformCommission: 225,
            totalPrice: 1500,
            currency: 'ARS',
            paymentMethod: 'DEBIT_CARD',
            paymentStatus: 'COMPLETED',
            specialInstructions: 'Both cats together. Michi needs wet food only.',
            confirmedAt: new Date('2024-10-18T12:00:00'),
            startedAt: new Date('2024-10-20T08:00:00'),
        },
    });
    await prisma.bookingPet.createMany({
        data: [
            { bookingId: booking2.id, petId: pet3.id },
            { bookingId: booking2.id, petId: pet4.id },
        ],
    });
    const booking3 = await prisma.booking.create({
        data: {
            clientId: owner1.id,
            providerId: provider3.id,
            serviceType: 'DOG_WALKING',
            status: 'CONFIRMED',
            startDate: new Date('2024-10-23T16:00:00'),
            endDate: new Date('2024-10-23T17:00:00'),
            duration: 60,
            pickupAddress: owner1.address,
            pickupLatitude: owner1.latitude,
            pickupLongitude: owner1.longitude,
            basePrice: 1000,
            extraPetFee: 300,
            additionalFees: 0,
            platformCommission: 195,
            totalPrice: 1300,
            currency: 'ARS',
            paymentMethod: 'MERCADO_PAGO',
            paymentStatus: 'PENDING',
            specialInstructions: 'Both dogs together. Luna pulls on leash.',
            confirmedAt: new Date('2024-10-21T09:00:00'),
        },
    });
    await prisma.bookingPet.createMany({
        data: [
            { bookingId: booking3.id, petId: pet1.id },
            { bookingId: booking3.id, petId: pet2.id },
        ],
    });
    const booking4 = await prisma.booking.create({
        data: {
            clientId: owner2.id,
            providerId: provider1.id,
            serviceType: 'DOG_BOARDING',
            status: 'CANCELLED',
            startDate: new Date('2024-10-18T18:00:00'),
            endDate: new Date('2024-10-20T10:00:00'),
            duration: 2,
            pickupAddress: owner2.address,
            basePrice: 2000,
            extraPetFee: 0,
            additionalFees: 0,
            platformCommission: 0,
            totalPrice: 2000,
            currency: 'ARS',
            paymentStatus: 'REFUNDED',
            cancelledAt: new Date('2024-10-17T14:00:00'),
            cancellationReason: 'Client changed travel plans',
            cancelledBy: owner2.id,
        },
    });
    console.log('Creating GPS tracking data...');
    const trackingPoints = [
        { lat: -34.59539, lng: -58.37331, event: 'start', time: 0 },
        { lat: -34.59629, lng: -58.37421, event: 'checkpoint', time: 5 },
        { lat: -34.59719, lng: -58.37511, event: 'checkpoint', time: 10 },
        { lat: -34.59809, lng: -58.37601, event: 'checkpoint', time: 15 },
        { lat: -34.59899, lng: -58.37691, event: 'pause', time: 20 },
        { lat: -34.59899, lng: -58.37691, event: 'resume', time: 25 },
        { lat: -34.59809, lng: -58.37601, event: 'checkpoint', time: 30 },
        { lat: -34.59719, lng: -58.37511, event: 'checkpoint', time: 35 },
        { lat: -34.59629, lng: -58.37421, event: 'checkpoint', time: 40 },
        { lat: -34.59539, lng: -58.37331, event: 'end', time: 45 },
    ];
    await prisma.tracking.createMany({
        data: trackingPoints.map((point, index) => ({
            bookingId: booking1.id,
            latitude: point.lat,
            longitude: point.lng,
            accuracy: 5.0 + Math.random() * 3,
            speed: point.event === 'pause' ? 0 : 3.5 + Math.random() * 1.5,
            eventType: point.event,
            notes: point.event === 'pause' ? 'Water break at the park' : undefined,
            recordedAt: new Date(new Date('2024-10-15T10:00:00').getTime() + point.time * 60 * 1000),
        })),
    });
    console.log('Creating reviews...');
    await prisma.review.create({
        data: {
            bookingId: booking1.id,
            authorId: owner1.id,
            targetId: provider1.id,
            overallRating: 5.0,
            punctualityRating: 5.0,
            communicationRating: 5.0,
            careQualityRating: 5.0,
            trustworthinessRating: 5.0,
            comment: 'Ana es increíble! Max llegó super feliz y cansado. Recibí fotos durante el paseo y se nota que lo trató con mucho amor. Súper recomendada!',
            photos: [],
            badgesAwarded: ['Super Walker', 'Great Communicator'],
            isPublic: true,
            response: 'Muchas gracias María! Max es un amor, fue un placer pasearlo. Siempre bienvenidos!',
            respondedAt: new Date('2024-10-15T20:00:00'),
        },
    });
    await prisma.review.create({
        data: {
            bookingId: booking1.id,
            authorId: provider1.id,
            targetId: owner1.id,
            overallRating: 5.0,
            communicationRating: 5.0,
            trustworthinessRating: 5.0,
            comment: 'María es una excelente dueña. Max está muy bien cuidado y educado. Comunicación perfecta!',
            isPublic: true,
        },
    });
    const oldBooking = await prisma.booking.create({
        data: {
            clientId: owner2.id,
            providerId: provider2.id,
            serviceType: 'CAT_SITTING',
            status: 'COMPLETED',
            startDate: new Date('2024-09-01T08:00:00'),
            endDate: new Date('2024-09-05T18:00:00'),
            duration: 4,
            pickupAddress: owner2.address,
            basePrice: 1200,
            extraPetFee: 300,
            platformCommission: 225,
            totalPrice: 1500,
            paymentMethod: 'CASH',
            paymentStatus: 'COMPLETED',
            completedAt: new Date('2024-09-05T18:00:00'),
        },
    });
    await prisma.review.create({
        data: {
            bookingId: oldBooking.id,
            authorId: owner2.id,
            targetId: provider2.id,
            overallRating: 4.8,
            punctualityRating: 5.0,
            communicationRating: 4.5,
            careQualityRating: 5.0,
            trustworthinessRating: 5.0,
            comment: 'Lucía cuidó a mis gatos de manera excelente. Me mandó videos todos los días. Solo una pequeña demora en responder mensajes, pero todo perfecto!',
            badgesAwarded: ['Pet Whisperer'],
            isPublic: true,
        },
    });
    console.log('Creating transactions...');
    await prisma.transaction.create({
        data: {
            bookingId: booking1.id,
            type: 'PAYMENT',
            amount: 800,
            currency: 'ARS',
            serviceFee: 680,
            platformCommission: 120,
            processingFee: 0,
            paymentProvider: 'stripe',
            externalTransactionId: 'pi_123456789',
            status: 'COMPLETED',
            description: 'Payment for dog walking service',
            completedAt: new Date('2024-10-15T10:00:00'),
            metadata: {
                stripeCustomerId: 'cus_123456',
                cardLast4: '4242',
                cardBrand: 'visa',
            },
        },
    });
    await prisma.transaction.create({
        data: {
            bookingId: booking2.id,
            type: 'PAYMENT',
            amount: 1500,
            currency: 'ARS',
            serviceFee: 1275,
            platformCommission: 225,
            processingFee: 0,
            paymentProvider: 'mercadopago',
            externalTransactionId: 'mp_987654321',
            status: 'COMPLETED',
            description: 'Payment for cat sitting service',
            completedAt: new Date('2024-10-20T08:00:00'),
        },
    });
    console.log('Creating conversations and messages...');
    const conversation1 = await prisma.conversation.create({
        data: {
            user1Id: owner1.id,
            user2Id: provider1.id,
            lastMessageAt: new Date('2024-10-14T16:00:00'),
            lastMessagePreview: 'Perfecto! Nos vemos mañana entonces.',
            unreadCountUser1: 0,
            unreadCountUser2: 0,
        },
    });
    await prisma.message.createMany({
        data: [
            {
                conversationId: conversation1.id,
                senderId: owner1.id,
                messageType: 'TEXT',
                content: 'Hola Ana! Quería confirmar el paseo de mañana para Max.',
                isRead: true,
                readAt: new Date('2024-10-14T15:31:00'),
                createdAt: new Date('2024-10-14T15:30:00'),
            },
            {
                conversationId: conversation1.id,
                senderId: provider1.id,
                messageType: 'TEXT',
                content: 'Hola María! Sí, confirmado para las 10am. Lo paso a buscar por tu casa?',
                isRead: true,
                readAt: new Date('2024-10-14T15:45:00'),
                createdAt: new Date('2024-10-14T15:35:00'),
            },
            {
                conversationId: conversation1.id,
                senderId: owner1.id,
                messageType: 'TEXT',
                content: 'Sí perfecto! Te espero a las 10.',
                isRead: true,
                readAt: new Date('2024-10-14T15:50:00'),
                createdAt: new Date('2024-10-14T15:48:00'),
            },
            {
                conversationId: conversation1.id,
                senderId: provider1.id,
                messageType: 'TEXT',
                content: 'Perfecto! Nos vemos mañana entonces.',
                isRead: true,
                readAt: new Date('2024-10-14T16:05:00'),
                createdAt: new Date('2024-10-14T16:00:00'),
            },
        ],
    });
    const conversation2 = await prisma.conversation.create({
        data: {
            user1Id: owner2.id,
            user2Id: provider2.id,
            lastMessageAt: new Date('2024-10-20T09:30:00'),
            lastMessagePreview: 'Todo muy bien! Están durmiendo ahora 😸',
            unreadCountUser1: 0,
            unreadCountUser2: 0,
        },
    });
    await prisma.message.createMany({
        data: [
            {
                conversationId: conversation2.id,
                senderId: owner2.id,
                messageType: 'TEXT',
                content: 'Hola Lucía! Cómo están Michi y Coco?',
                isRead: true,
                readAt: new Date('2024-10-20T09:15:00'),
                createdAt: new Date('2024-10-20T09:00:00'),
            },
            {
                conversationId: conversation2.id,
                senderId: provider2.id,
                messageType: 'TEXT',
                content: 'Hola Carlos! Están super bien. Comieron todo el desayuno y jugaron un rato.',
                isRead: true,
                readAt: new Date('2024-10-20T09:25:00'),
                createdAt: new Date('2024-10-20T09:20:00'),
            },
            {
                conversationId: conversation2.id,
                senderId: provider2.id,
                messageType: 'TEXT',
                content: 'Todo muy bien! Están durmiendo ahora 😸',
                isRead: true,
                readAt: new Date('2024-10-20T09:35:00'),
                createdAt: new Date('2024-10-20T09:30:00'),
            },
        ],
    });
    console.log('Creating notifications...');
    await prisma.notification.createMany({
        data: [
            {
                userId: owner1.id,
                type: 'BOOKING_CONFIRMED',
                channel: 'PUSH',
                title: 'Reserva confirmada',
                message: 'Ana confirmó tu reserva para pasear a Max mañana a las 10am',
                data: { bookingId: booking1.id },
                isRead: true,
                readAt: new Date('2024-10-14T15:35:00'),
                isSent: true,
                sentAt: new Date('2024-10-14T15:30:00'),
                createdAt: new Date('2024-10-14T15:30:00'),
            },
            {
                userId: owner1.id,
                type: 'NEW_MESSAGE',
                channel: 'PUSH',
                title: 'Nuevo mensaje de Ana',
                message: 'Perfecto! Nos vemos mañana entonces.',
                data: { conversationId: conversation1.id },
                isRead: true,
                readAt: new Date('2024-10-14T16:05:00'),
                isSent: true,
                sentAt: new Date('2024-10-14T16:00:00'),
                createdAt: new Date('2024-10-14T16:00:00'),
            },
            {
                userId: provider1.id,
                type: 'NEW_REVIEW',
                channel: 'PUSH',
                title: 'Nueva reseña recibida',
                message: 'María te dejó una reseña de 5 estrellas!',
                data: { bookingId: booking1.id },
                isRead: false,
                isSent: true,
                sentAt: new Date('2024-10-15T18:00:00'),
                createdAt: new Date('2024-10-15T18:00:00'),
            },
            {
                userId: owner2.id,
                type: 'BOOKING_REMINDER',
                channel: 'EMAIL',
                title: 'Recordatorio de reserva',
                message: 'Tu reserva con Lucía comienza mañana a las 8am. No olvides preparar todo para tus gatos.',
                data: { bookingId: booking2.id },
                isRead: true,
                isSent: true,
                sentAt: new Date('2024-10-19T10:00:00'),
                createdAt: new Date('2024-10-19T10:00:00'),
            },
        ],
    });
    console.log('Assigning badges to providers...');
    await prisma.userBadge.createMany({
        data: [
            {
                providerId: provider1Profile.id,
                badgeId: badges[0].id,
            },
            {
                providerId: provider1Profile.id,
                badgeId: badges[2].id,
            },
            {
                providerId: provider2Profile.id,
                badgeId: badges[3].id,
            },
            {
                providerId: provider3Profile.id,
                badgeId: badges[0].id,
            },
            {
                providerId: provider3Profile.id,
                badgeId: badges[1].id,
            },
            {
                providerId: provider3Profile.id,
                badgeId: badges[3].id,
            },
        ],
    });
    console.log('Creating verification documents...');
    await prisma.document.createMany({
        data: [
            {
                providerId: provider1Profile.id,
                type: 'NATIONAL_ID',
                fileUrl: 'https://storage.guaumiau.com/docs/ana_dni.pdf',
                fileName: 'DNI - Ana Martinez.pdf',
                status: 'APPROVED',
                reviewedAt: new Date('2024-01-16'),
                reviewedBy: admin.id,
            },
            {
                providerId: provider1Profile.id,
                type: 'INSURANCE_CERTIFICATE',
                fileUrl: 'https://storage.guaumiau.com/docs/ana_insurance.pdf',
                fileName: 'Seguro - Ana Martinez.pdf',
                status: 'APPROVED',
                reviewedAt: new Date('2024-01-16'),
                reviewedBy: admin.id,
                expiresAt: new Date('2025-12-31'),
            },
            {
                providerId: provider2Profile.id,
                type: 'NATIONAL_ID',
                fileUrl: 'https://storage.guaumiau.com/docs/lucia_dni.pdf',
                fileName: 'DNI - Lucia Fernandez.pdf',
                status: 'APPROVED',
                reviewedAt: new Date('2024-06-02'),
                reviewedBy: admin.id,
            },
            {
                providerId: provider3Profile.id,
                type: 'VETERINARY_CERTIFICATE',
                fileUrl: 'https://storage.guaumiau.com/docs/diego_vet_cert.pdf',
                fileName: 'Matricula Veterinaria - Diego Rodriguez.pdf',
                status: 'APPROVED',
                reviewedAt: new Date('2023-10-02'),
                reviewedBy: admin.id,
            },
        ],
    });
    console.log('Creating saved providers...');
    await prisma.savedProvider.createMany({
        data: [
            {
                userId: owner1.id,
                providerId: provider1Profile.id,
            },
            {
                userId: owner1.id,
                providerId: provider3Profile.id,
            },
            {
                userId: owner2.id,
                providerId: provider2Profile.id,
            },
        ],
    });
    console.log('✅ Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log('- 6 Users (1 admin, 2 pet owners, 3 service providers)');
    console.log('- 3 Service Provider Profiles');
    console.log('- 6 Pets (4 dogs, 2 cats)');
    console.log('- 8 Services (different types with pricing)');
    console.log('- 4 Bookings (completed, in-progress, confirmed, cancelled)');
    console.log('- 10 GPS Tracking points');
    console.log('- 3 Reviews (with responses)');
    console.log('- 2 Conversations with messages');
    console.log('- 2 Transactions');
    console.log('- 4 Notifications');
    console.log('- 4 Badges');
    console.log('- 6 User Badges assigned');
    console.log('- 4 Verification documents');
    console.log('- 3 Saved providers');
    console.log('\n🔐 Test Credentials:');
    console.log('Admin: admin@guaumiau.com / Admin123!');
    console.log('Pet Owner 1: maria.garcia@example.com / Password123!');
    console.log('Pet Owner 2: carlos.lopez@example.com / Password123!');
    console.log('Provider 1: ana.martinez@example.com / Password123!');
    console.log('Provider 2: lucia.fernandez@example.com / Password123!');
    console.log('Provider 3: diego.rodriguez@example.com / Password123!');
}
main()
    .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map