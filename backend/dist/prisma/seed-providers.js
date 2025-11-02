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
const PROVIDERS_DATA = [
    {
        email: 'sarah.johnson@example.com',
        username: 'sarahjohnson',
        password: 'Password123!',
        firstName: 'Sarah',
        lastName: 'Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
        city: 'San Francisco',
        country: 'US',
        latitude: 37.7749,
        longitude: -122.4194,
        phone: '+14155551001',
        roles: ['SERVICE_PROVIDER'],
        profile: {
            bio: 'Amante de los animales con más de 5 años de experiencia cuidando mascotas. Me encanta pasear perros y brindarles el mejor cuidado.',
            experience: '5 años de experiencia profesional en cuidado de mascotas',
            isAvailable: true,
            isVerified: true,
            isBackgroundChecked: true,
            hasInsurance: true,
            averageRating: 4.9,
            totalReviews: 127,
            completedBookings: 145,
            servicesOffered: ['DOG_WALKING', 'PET_SITTING', 'HOME_VISITS'],
            acceptedPetTypes: ['DOG', 'CAT'],
            acceptedPetSizes: ['SMALL', 'MEDIUM', 'LARGE'],
            maxPetsPerBooking: 3,
            coverageRadiusKm: 5,
            hasHomeSpace: true,
            homeSpaceDescription: 'Casa con jardín amplio y cercado',
        },
        services: [
            {
                serviceType: 'DOG_WALKING',
                basePrice: 25,
                pricingUnit: 'PER_HOUR',
                description: 'Paseos personalizados para tu perro',
                duration: 60,
                maxPets: 2,
                acceptedPetTypes: ['DOG'],
                acceptedPetSizes: ['SMALL', 'MEDIUM', 'LARGE'],
            },
            {
                serviceType: 'PET_SITTING',
                basePrice: 40,
                pricingUnit: 'PER_DAY',
                description: 'Cuidado de mascotas en mi hogar',
                maxPets: 3,
                acceptedPetTypes: ['DOG', 'CAT'],
                acceptedPetSizes: ['SMALL', 'MEDIUM'],
            },
        ],
    },
    {
        email: 'mike.chen@example.com',
        username: 'mikechen',
        password: 'Password123!',
        firstName: 'Mike',
        lastName: 'Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        city: 'San Francisco',
        country: 'US',
        latitude: 37.7849,
        longitude: -122.4094,
        phone: '+14155551002',
        roles: ['SERVICE_PROVIDER'],
        profile: {
            bio: 'Paseador profesional de perros. Activo y energético, perfecto para perros que necesitan ejercicio.',
            experience: '3 años de experiencia',
            isAvailable: true,
            isVerified: true,
            isBackgroundChecked: true,
            hasInsurance: false,
            averageRating: 4.8,
            totalReviews: 94,
            completedBookings: 108,
            servicesOffered: ['DOG_WALKING', 'DOG_RUNNING'],
            acceptedPetTypes: ['DOG'],
            acceptedPetSizes: ['SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE'],
            maxPetsPerBooking: 2,
            coverageRadiusKm: 8,
            hasHomeSpace: false,
        },
        services: [
            {
                serviceType: 'DOG_WALKING',
                basePrice: 22,
                pricingUnit: 'PER_HOUR',
                description: 'Paseos diarios para perros de todas las razas',
                duration: 45,
                maxPets: 2,
                acceptedPetTypes: ['DOG'],
                acceptedPetSizes: ['SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE'],
            },
            {
                serviceType: 'DOG_RUNNING',
                basePrice: 30,
                pricingUnit: 'PER_HOUR',
                description: 'Sesiones de running para perros activos',
                duration: 60,
                maxPets: 1,
                acceptedPetTypes: ['DOG'],
                acceptedPetSizes: ['MEDIUM', 'LARGE', 'EXTRA_LARGE'],
            },
        ],
    },
    {
        email: 'emma.wilson@example.com',
        username: 'emmawilson',
        password: 'Password123!',
        firstName: 'Emma',
        lastName: 'Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
        city: 'San Francisco',
        country: 'US',
        latitude: 37.7649,
        longitude: -122.4294,
        phone: '+14155551003',
        roles: ['SERVICE_PROVIDER'],
        profile: {
            bio: 'Especialista en cuidado de mascotas con certificación veterinaria. Atención premium para tu mascota.',
            experience: '8 años de experiencia, certificada en primeros auxilios para mascotas',
            isAvailable: true,
            isVerified: true,
            isBackgroundChecked: true,
            hasInsurance: true,
            averageRating: 5.0,
            totalReviews: 156,
            completedBookings: 180,
            servicesOffered: ['DOG_WALKING', 'PET_SITTING', 'CAT_SITTING', 'HOME_VISITS', 'PET_BOARDING'],
            acceptedPetTypes: ['DOG', 'CAT', 'RABBIT', 'BIRD'],
            acceptedPetSizes: ['EXTRA_SMALL', 'SMALL', 'MEDIUM', 'LARGE'],
            maxPetsPerBooking: 4,
            coverageRadiusKm: 10,
            hasHomeSpace: true,
            homeSpaceDescription: 'Casa grande con jardín y área especial para mascotas',
        },
        services: [
            {
                serviceType: 'DOG_WALKING',
                basePrice: 30,
                pricingUnit: 'PER_HOUR',
                description: 'Paseos profesionales con atención personalizada',
                duration: 60,
                maxPets: 2,
                acceptedPetTypes: ['DOG'],
                acceptedPetSizes: ['SMALL', 'MEDIUM', 'LARGE'],
            },
            {
                serviceType: 'PET_SITTING',
                basePrice: 50,
                pricingUnit: 'PER_DAY',
                description: 'Cuidado premium en casa del cliente',
                maxPets: 3,
                acceptedPetTypes: ['DOG', 'CAT'],
                acceptedPetSizes: ['EXTRA_SMALL', 'SMALL', 'MEDIUM', 'LARGE'],
            },
            {
                serviceType: 'PET_BOARDING',
                basePrice: 45,
                pricingUnit: 'PER_DAY',
                description: 'Hospedaje para mascotas en mi hogar',
                maxPets: 4,
                acceptedPetTypes: ['DOG', 'CAT', 'RABBIT'],
                acceptedPetSizes: ['EXTRA_SMALL', 'SMALL', 'MEDIUM'],
            },
        ],
    },
    {
        email: 'carlos.rodriguez@example.com',
        username: 'carlosr',
        password: 'Password123!',
        firstName: 'Carlos',
        lastName: 'Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
        city: 'San Francisco',
        country: 'US',
        latitude: 37.7549,
        longitude: -122.4394,
        phone: '+14155551004',
        roles: ['SERVICE_PROVIDER'],
        profile: {
            bio: 'Entrenador canino certificado. Ofrezco paseos con entrenamiento básico incluido.',
            experience: '6 años como entrenador y paseador profesional',
            isAvailable: true,
            isVerified: true,
            isBackgroundChecked: true,
            hasInsurance: true,
            averageRating: 4.7,
            totalReviews: 83,
            completedBookings: 95,
            servicesOffered: ['DOG_WALKING', 'DOG_DAYCARE'],
            acceptedPetTypes: ['DOG'],
            acceptedPetSizes: ['SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE'],
            maxPetsPerBooking: 3,
            coverageRadiusKm: 7,
            hasHomeSpace: true,
            homeSpaceDescription: 'Espacio amplio para actividades y entrenamiento',
        },
        services: [
            {
                serviceType: 'DOG_WALKING',
                basePrice: 28,
                pricingUnit: 'PER_HOUR',
                description: 'Paseos con entrenamiento básico incluido',
                duration: 60,
                maxPets: 2,
                acceptedPetTypes: ['DOG'],
                acceptedPetSizes: ['SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE'],
            },
            {
                serviceType: 'DOG_DAYCARE',
                basePrice: 35,
                pricingUnit: 'PER_DAY',
                description: 'Guardería canina con socialización y juegos',
                maxPets: 5,
                acceptedPetTypes: ['DOG'],
                acceptedPetSizes: ['SMALL', 'MEDIUM', 'LARGE'],
            },
        ],
    },
    {
        email: 'lisa.martinez@example.com',
        username: 'lisamartinez',
        password: 'Password123!',
        firstName: 'Lisa',
        lastName: 'Martinez',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
        city: 'San Francisco',
        country: 'US',
        latitude: 37.7449,
        longitude: -122.4494,
        phone: '+14155551005',
        roles: ['SERVICE_PROVIDER'],
        profile: {
            bio: 'Especialista en gatos y mascotas pequeñas. Cuidado amoroso y profesional.',
            experience: '4 años especializados en felinos',
            isAvailable: true,
            isVerified: true,
            isBackgroundChecked: true,
            hasInsurance: false,
            averageRating: 4.9,
            totalReviews: 72,
            completedBookings: 85,
            servicesOffered: ['CAT_SITTING', 'PET_SITTING', 'HOME_VISITS'],
            acceptedPetTypes: ['CAT', 'RABBIT', 'HAMSTER', 'BIRD'],
            acceptedPetSizes: ['EXTRA_SMALL', 'SMALL', 'MEDIUM'],
            maxPetsPerBooking: 3,
            coverageRadiusKm: 6,
            hasHomeSpace: true,
            homeSpaceDescription: 'Ambiente tranquilo perfecto para gatos',
        },
        services: [
            {
                serviceType: 'CAT_SITTING',
                basePrice: 35,
                pricingUnit: 'PER_DAY',
                description: 'Cuidado especializado para gatos',
                maxPets: 3,
                acceptedPetTypes: ['CAT'],
                acceptedPetSizes: ['EXTRA_SMALL', 'SMALL', 'MEDIUM'],
            },
            {
                serviceType: 'HOME_VISITS',
                basePrice: 20,
                pricingUnit: 'PER_VISIT',
                description: 'Visitas a domicilio para alimentación y cuidado',
                duration: 30,
                maxPets: 4,
                acceptedPetTypes: ['CAT', 'RABBIT', 'HAMSTER', 'BIRD'],
                acceptedPetSizes: ['EXTRA_SMALL', 'SMALL'],
            },
        ],
    },
];
async function main() {
    console.log('Starting seed...');
    for (const providerData of PROVIDERS_DATA) {
        console.log(`Creating provider: ${providerData.email}`);
        const existingUser = await prisma.user.findUnique({
            where: { email: providerData.email },
        });
        if (existingUser) {
            console.log(`User ${providerData.email} already exists, skipping...`);
            continue;
        }
        const hashedPassword = await bcrypt.hash(providerData.password, 10);
        const user = await prisma.user.create({
            data: {
                email: providerData.email,
                username: providerData.username,
                password: hashedPassword,
                firstName: providerData.firstName,
                lastName: providerData.lastName,
                avatar: providerData.avatar,
                city: providerData.city,
                country: providerData.country,
                latitude: providerData.latitude,
                longitude: providerData.longitude,
                phone: providerData.phone,
                roles: providerData.roles,
                isActive: true,
                isEmailVerified: true,
                termsAccepted: true,
                termsAcceptedAt: new Date(),
                serviceProvider: {
                    create: {
                        ...providerData.profile,
                        services: {
                            create: providerData.services,
                        },
                    },
                },
            },
            include: {
                serviceProvider: {
                    include: {
                        services: true,
                    },
                },
            },
        });
        console.log(`Created provider: ${user.email}`);
        console.log(`  - Profile ID: ${user.serviceProvider?.id}`);
        console.log(`  - Services: ${user.serviceProvider?.services.length}`);
    }
    console.log('Seed completed!');
}
main()
    .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-providers.js.map