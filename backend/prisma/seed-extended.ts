import { PrismaClient, UserRole, ServiceType, PetType, PetSize, PetGender, EnergyLevel, PricingUnit, DayOfWeek } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Barrios de Buenos Aires con coordenadas
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

// Nombres argentinos comunes
const firstNames = ['Juan', 'María', 'Carlos', 'Laura', 'Diego', 'Ana', 'Pablo', 'Sofía', 'Martín', 'Lucía', 'Fernando', 'Valentina', 'Sebastián', 'Camila', 'Mateo', 'Florencia', 'Nicolás', 'Agustina', 'Lucas', 'Victoria'];
const lastNames = ['González', 'Rodríguez', 'Fernández', 'López', 'Martínez', 'García', 'Pérez', 'Sánchez', 'Romero', 'Silva', 'Torres', 'Díaz', 'Moreno', 'Álvarez', 'Castro', 'Herrera', 'Molina', 'Vargas'];

// Nombres de mascotas
const dogNames = ['Max', 'Luna', 'Rocky', 'Bella', 'Toby', 'Lola', 'Bruno', 'Mia', 'Charlie', 'Coco', 'Thor', 'Nina', 'Simba', 'Nala', 'Bobby'];
const catNames = ['Michi', 'Garfield', 'Felix', 'Pelusa', 'Salem', 'Mittens', 'Whiskers', 'Luna', 'Simba', 'Oliver', 'Leo', 'Chloe', 'Nala', 'Tigger', 'Shadow'];

// Razas
const dogBreeds = ['Labrador', 'Golden Retriever', 'Border Collie', 'Beagle', 'Bulldog Francés', 'Pastor Alemán', 'Caniche', 'Chihuahua', 'Dálmata', 'Mestizo', 'Schnauzer', 'Cocker Spaniel'];
const catBreeds = ['Siamés', 'Persa', 'Maine Coon', 'Bengalí', 'Ragdoll', 'British Shorthair', 'Mestizo', 'Gato Común Europeo'];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

async function main() {
  console.log('🌱 Starting extended seed for Buenos Aires...');
  console.log('=' .repeat(60));

  // ==========================================
  // 1. CREAR USUARIO DE PRUEBA EN PALERMO
  // ==========================================
  console.log('\n👤 Creating test user in Palermo...');

  const testUserPassword = 'TestPalermo2024!';
  const hashedTestPassword = await bcrypt.hash(testUserPassword, 10);

  const palermo = buenosAiresNeighborhoods[0]; // Palermo

  const testUser = await prisma.user.create({
    data: {
      email: 'test@palermo.com',
      username: 'test_palermo',
      password: hashedTestPassword,
      firstName: 'Usuario',
      lastName: 'Prueba',
      phone: '+541155550001',
      roles: [UserRole.PET_OWNER],
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

  // ==========================================
  // 2. CREAR MASCOTAS PARA EL USUARIO DE PRUEBA
  // ==========================================
  console.log('\n🐕 Creating pets for test user...');

  const testUserPets: any[] = [];

  // Perro 1 - Max
  const dog1 = await prisma.pet.create({
    data: {
      ownerId: testUser.id,
      name: 'Max',
      type: PetType.DOG,
      breed: 'Labrador Retriever',
      size: PetSize.LARGE,
      weight: 32,
      age: 4,
      gender: PetGender.MALE,
      photos: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop'],
      isVaccinated: true,
      vaccinationRecords: [
        { name: 'Rabia', date: '2024-03-15', nextDue: '2025-03-15' },
        { name: 'Séxtuple', date: '2024-03-15', nextDue: '2025-03-15' },
      ],
      isNeutered: true,
      energyLevel: EnergyLevel.HIGH,
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

  // Perro 2 - Luna
  const dog2 = await prisma.pet.create({
    data: {
      ownerId: testUser.id,
      name: 'Luna',
      type: PetType.DOG,
      breed: 'Golden Retriever',
      size: PetSize.LARGE,
      weight: 28,
      age: 2,
      gender: PetGender.FEMALE,
      photos: ['https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400&h=400&fit=crop'],
      isVaccinated: true,
      isNeutered: false,
      energyLevel: EnergyLevel.VERY_HIGH,
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

  // ==========================================
  // 3. CREAR PASEADORES Y CUIDADORES EN BUENOS AIRES
  // ==========================================
  console.log('\n🚶 Creating service providers in Buenos Aires...');

  const providers: any[] = [];

  for (let i = 0; i < 20; i++) {
    const neighborhood = getRandomElement(buenosAiresNeighborhoods);
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${i}`;

    // Pequeña variación en las coordenadas
    const latVariation = getRandomFloat(-0.015, 0.015);
    const lngVariation = getRandomFloat(-0.015, 0.015);

    const password = await bcrypt.hash(`Provider${i}Pass!`, 10);

    // Determinar servicios ofrecidos
    const servicesOffered: ServiceType[] = [];
    const serviceDescription: string[] = [];

    if (i % 4 === 0) {
      // Solo paseador de perros
      servicesOffered.push(ServiceType.DOG_WALKING, ServiceType.DOG_RUNNING);
      serviceDescription.push('Paseador de perros');
    } else if (i % 4 === 1) {
      // Solo cuidador de gatos
      servicesOffered.push(ServiceType.CAT_SITTING, ServiceType.HOME_VISITS, ServiceType.CAT_BOARDING);
      serviceDescription.push('Cuidador de gatos');
    } else if (i % 4 === 2) {
      // Paseador y cuidador de perros
      servicesOffered.push(ServiceType.DOG_WALKING, ServiceType.DOG_SITTING, ServiceType.DOG_BOARDING);
      serviceDescription.push('Paseador y cuidador de perros');
    } else {
      // Multi-mascota
      servicesOffered.push(
        ServiceType.DOG_WALKING,
        ServiceType.CAT_SITTING,
        ServiceType.PET_SITTING,
        ServiceType.HOME_VISITS
      );
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
        roles: [UserRole.SERVICE_PROVIDER],
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

    // Crear perfil de proveedor
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
            ? [PetType.DOG, PetType.CAT]
            : [PetType.DOG]
          : [PetType.CAT],
        acceptedPetSizes: [PetSize.SMALL, PetSize.MEDIUM, PetSize.LARGE, PetSize.EXTRA_LARGE],
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

    // Crear servicios para el proveedor
    for (const serviceType of servicesOffered) {
      let basePrice = 0;
      let pricingUnit: PricingUnit = PricingUnit.PER_HOUR;
      let duration: number | undefined;

      switch (serviceType) {
        case ServiceType.DOG_WALKING:
          basePrice = getRandomInt(700, 1500);
          pricingUnit = PricingUnit.PER_WALK;
          duration = getRandomInt(30, 60);
          break;
        case ServiceType.DOG_RUNNING:
          basePrice = getRandomInt(1000, 2000);
          pricingUnit = PricingUnit.PER_HOUR;
          duration = 60;
          break;
        case ServiceType.CAT_SITTING:
          basePrice = getRandomInt(600, 1400);
          pricingUnit = PricingUnit.PER_VISIT;
          duration = getRandomInt(20, 40);
          break;
        case ServiceType.DOG_SITTING:
          basePrice = getRandomInt(1500, 3500);
          pricingUnit = PricingUnit.PER_DAY;
          break;
        case ServiceType.CAT_BOARDING:
          basePrice = getRandomInt(1000, 2000);
          pricingUnit = PricingUnit.PER_NIGHT;
          break;
        case ServiceType.DOG_BOARDING:
          basePrice = getRandomInt(2000, 4000);
          pricingUnit = PricingUnit.PER_NIGHT;
          break;
        case ServiceType.PET_SITTING:
          basePrice = getRandomInt(1200, 3000);
          pricingUnit = PricingUnit.PER_DAY;
          break;
        case ServiceType.HOME_VISITS:
          basePrice = getRandomInt(500, 1200);
          pricingUnit = PricingUnit.PER_VISIT;
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
            ? [PetType.DOG]
            : serviceType.includes('CAT')
            ? [PetType.CAT]
            : [PetType.DOG, PetType.CAT],
          acceptedPetSizes: [PetSize.SMALL, PetSize.MEDIUM, PetSize.LARGE],
          isActive: true,
          extraPetFee: Math.round(basePrice * 0.3),
          weekendSurcharge: getRandomInt(15, 25),
          holidaySurcharge: getRandomInt(25, 40),
        },
      });
    }

    // Crear disponibilidad
    const workDays = [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY];
    const weekendDays = [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY];

    // Disponibilidad entre semana
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

    // Fin de semana (70% de los proveedores)
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

  // Mostrar algunos proveedores de ejemplo
  console.log('\n📍 Sample providers by neighborhood:');
  const grouped = providers.reduce((acc, p) => {
    if (!acc[p.neighborhood]) acc[p.neighborhood] = [];
    acc[p.neighborhood].push(p);
    return acc;
  }, {} as Record<string, typeof providers>);

  Object.keys(grouped).slice(0, 5).forEach(neighborhood => {
    const count = grouped[neighborhood].length;
    console.log(`   ${neighborhood}: ${count} provider(s)`);
  });

  // ==========================================
  // RESUMEN FINAL
  // ==========================================
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
