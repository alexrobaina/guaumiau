# 🔐 Credenciales de Prueba - GuauMiau

Este documento contiene todas las credenciales de prueba para la aplicación GuauMiau.

## 📱 Cuentas de Usuario

### 👤 Administrador

- **Email:** `admin@guaumiau.com`
- **Password:** `Admin123!`
- **Rol:** Administrador del sistema
- **Descripción:** Acceso completo al sistema

---

### 🐕 Dueños de Mascotas (Clientes)

#### Cliente 1: María García
- **Email:** `maria.garcia@example.com`
- **Password:** `Password123!`
- **Username:** `maria_garcia`
- **Teléfono:** `+541112345679`
- **Ubicación:** Av. Santa Fe 1234, Buenos Aires, CABA
- **Mascotas:**
  - Max (Golden Retriever, Macho, 3 años)
  - Toby (Beagle, Macho, 2 años)
  - Luna (Husky Siberiano, Hembra, 4 años)

#### Cliente 2: Carlos López
- **Email:** `carlos.lopez@example.com`
- **Password:** `Password123!`
- **Username:** `carlos_lopez`
- **Teléfono:** `+541112345681`
- **Ubicación:** Av. Corrientes 2500, Buenos Aires, CABA
- **Mascotas:**
  - Michi (Gato, Macho, 2 años)
  - Pelusa (Gato Persa, Hembra, 3 años)

---

### 🚶 Paseadores/Proveedores de Servicios

#### Proveedor 1: Ana Martínez ⭐ Premium
- **Email:** `ana.martinez@example.com`
- **Password:** `Password123!`
- **Username:** `ana_martinez`
- **Teléfono:** `+541112345682`
- **Ubicación:** Av. Cabildo 3000, Buenos Aires, CABA
- **Rating:** 4.9/5.0 (47 reseñas)
- **Servicios:**
  - Paseo de Perros - $1,200 ARS
  - Cuidado de Gatos - $1,500 ARS
- **Disponibilidad:** Lunes a Viernes: 8:00-18:00, Sábados: 9:00-14:00
- **Verificado:** ✅ Sí
- **Seguro:** ✅ Sí
- **Experiencia:** 3 años

#### Proveedor 2: Lucía Fernández ⭐ Premium
- **Email:** `lucia.fernandez@example.com`
- **Password:** `Password123!`
- **Username:** `lucia_fernandez`
- **Teléfono:** `+541112345683`
- **Ubicación:** Av. Las Heras 2200, Buenos Aires, CABA
- **Rating:** 4.8/5.0 (52 reseñas)
- **Servicios:**
  - Paseo de Perros - $1,000 ARS
  - Running con Perros - $1,500 ARS
  - Guardería Canina - $2,500 ARS
- **Disponibilidad:** Lunes a Domingo: 7:00-20:00
- **Verificado:** ✅ Sí
- **Seguro:** ✅ Sí
- **Experiencia:** 5 años

#### Proveedor 3: Diego Rodríguez 🆓 Free
- **Email:** `diego.rodriguez@example.com`
- **Password:** `Password123!`
- **Username:** `diego_rodriguez`
- **Teléfono:** `+541112345684`
- **Ubicación:** Av. Belgrano 1500, Buenos Aires, CABA
- **Rating:** 4.7/5.0 (28 reseñas)
- **Servicios:**
  - Paseo de Perros - $800 ARS
  - Visitas a Domicilio - $600 ARS
- **Disponibilidad:** Lunes a Viernes: 15:00-21:00
- **Verificado:** ✅ Sí
- **Seguro:** ❌ No
- **Experiencia:** 2 años

---

## 🗺️ Datos de Ubicación

Todas las ubicaciones están en Buenos Aires, Argentina:

| Usuario | Latitud | Longitud | Dirección |
|---------|---------|----------|-----------|
| María García | -34.59539 | -58.37331 | Av. Santa Fe 1234 |
| Carlos López | -34.60373 | -58.38152 | Av. Corrientes 2500 |
| Ana Martínez | -34.56029 | -58.45185 | Av. Cabildo 3000 |
| Lucía Fernández | -34.58754 | -58.39598 | Av. Las Heras 2200 |
| Diego Rodríguez | -34.61208 | -58.38085 | Av. Belgrano 1500 |

---

## 📊 Datos de Prueba Incluidos

El seed incluye los siguientes datos de ejemplo:

- ✅ **6 Usuarios** (1 admin, 2 clientes, 3 proveedores)
- ✅ **3 Perfiles de Proveedores** con información completa
- ✅ **6 Mascotas** (4 perros, 2 gatos)
- ✅ **8 Servicios** con precios variados
- ✅ **4 Reservas** (completadas, en progreso, confirmadas, canceladas)
- ✅ **10 Puntos de GPS** para rastreo
- ✅ **3 Reseñas** con respuestas
- ✅ **2 Conversaciones** con mensajes
- ✅ **2 Transacciones** de pago
- ✅ **4 Notificaciones**
- ✅ **4 Badges/Insignias**
- ✅ **6 Badges asignados** a usuarios
- ✅ **4 Documentos** de verificación
- ✅ **3 Proveedores guardados**

---

## 🔄 Cómo Resetear los Datos

Si necesitas resetear la base de datos y volver a ejecutar el seed:

```bash
cd backend
npm run prisma:seed
```

---

## 🧪 Escenarios de Prueba

### Escenario 1: Crear una Reserva como Cliente
1. Login con: `maria.garcia@example.com` / `Password123!`
2. Buscar paseadores disponibles en el mapa
3. Seleccionar a Ana Martínez o Lucía Fernández
4. Crear una reserva seleccionando:
   - Servicio: Paseo de Perros
   - Mascotas: Max y/o Luna
   - Fecha y hora
   - Dirección de recogida

### Escenario 2: Ver Reservas como Proveedor
1. Login con: `ana.martinez@example.com` / `Password123!`
2. Ver reservas pendientes
3. Aceptar o rechazar reservas
4. Ver historial de servicios

### Escenario 3: Sistema de Pagos
1. Login como cliente
2. Crear una reserva
3. Ver el desglose de precios con:
   - Precio del servicio (multiplicado por cantidad de mascotas)
   - Comisión de plataforma (15%)
   - Total a pagar
4. Proceder con Mercado Pago (requiere configuración de API keys)

### Escenario 4: Gestión de Mascotas
1. Login con: `carlos.lopez@example.com` / `Password123!`
2. Ver mascotas existentes (Michi y Pelusa)
3. Agregar una nueva mascota
4. Editar información de mascotas existentes

---

## 🔑 Configuración Requerida

Para que todas las funciones trabajen correctamente, asegúrate de configurar en `backend/.env`:

```bash
# Base de Datos
DATABASE_URL="postgresql://user:password@localhost:5433/dbname?schema=public"

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=refresh-secret-change-in-production

# Google Places API (para búsqueda de direcciones)
GOOGLE_PLACES_API_KEY=your-google-places-api-key

# Mercado Pago (para pagos)
MERCADOPAGO_AR_ACCESS_TOKEN=TEST-xxx-argentina
MERCADOPAGO_AR_PUBLIC_KEY=TEST-xxx-ar
MERCADOPAGO_CO_ACCESS_TOKEN=TEST-xxx-colombia
MERCADOPAGO_CO_PUBLIC_KEY=TEST-xxx-co

# Email (para notificaciones)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

---

## 📝 Notas Importantes

- 🔒 **Todas las contraseñas de prueba son:** `Password123!` (excepto admin que es `Admin123!`)
- 🇦🇷 **País por defecto:** Argentina (ARS)
- 💰 **Moneda:** Peso Argentino (ARS)
- 🌍 **Idioma:** Español
- ⏰ **Zona horaria:** America/Argentina/Buenos_Aires
- 📱 **Comisión de plataforma:** 15% sobre cada transacción

---

## 🆘 Soporte

Si tienes problemas con las credenciales o necesitas resetear la base de datos:

1. Verifica que Docker esté corriendo: `docker ps`
2. Verifica la conexión a la base de datos: `cd backend && npx prisma db push`
3. Ejecuta el seed nuevamente: `npm run prisma:seed`

---

**Última actualización:** 21 de Noviembre de 2024
