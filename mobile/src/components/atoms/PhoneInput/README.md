# PhoneInput Component

Un componente de entrada de número telefónico con selección de país y detección automática de ubicación.

## Características

- ✅ Selección de país con modal de búsqueda
- ✅ Detección automática del país del usuario
- ✅ Validación de formato de número telefónico
- ✅ Solo permite dígitos numéricos
- ✅ Muestra bandera y código de país
- ✅ Soporte para más de 50 países
- ✅ Búsqueda de países por nombre o código
- ✅ Interfaz totalmente en español
- ✅ Sigue los principios de diseño atómico

## Uso Básico

```tsx
import React, {useState} from 'react';
import {PhoneInput} from '@/components/atoms/PhoneInput';

const MyComponent = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');

  return (
    <PhoneInput
      value={phoneNumber}
      onChangePhoneNumber={setPhoneNumber}
      onChangeCountryCode={setCountryCode}
      onChangeFormattedPhoneNumber={setFormattedPhone}
    />
  );
};
```

## Propiedades

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `value` | `string` | ✅ | Valor del número telefónico (solo dígitos) |
| `onChangePhoneNumber` | `(phoneNumber: string) => void` | ✅ | Callback cuando cambia el número |
| `onChangeCountryCode` | `(countryCode: string) => void` | ❌ | Callback cuando cambia el código de país |
| `onChangeFormattedPhoneNumber` | `(formattedPhone: string) => void` | ❌ | Callback con número formateado completo |
| `defaultCountry` | `string` | ❌ | Código de país predeterminado (ej: 'AR', 'MX') |
| `placeholder` | `string` | ❌ | Texto del placeholder (default: 'Número de teléfono') |
| `error` | `string` | ❌ | Mensaje de error a mostrar |
| `disabled` | `boolean` | ❌ | Deshabilita el componente |
| `autoDetectCountry` | `boolean` | ❌ | Detecta automáticamente el país del usuario (default: true) |

## Ejemplos

### Con país predeterminado

```tsx
<PhoneInput
  value={phoneNumber}
  onChangePhoneNumber={setPhoneNumber}
  defaultCountry="AR"
  autoDetectCountry={false}
/>
```

### Con validación de errores

```tsx
<PhoneInput
  value={phoneNumber}
  onChangePhoneNumber={setPhoneNumber}
  error={phoneNumber.length < 8 ? 'Número muy corto' : undefined}
/>
```

### Deshabilitado

```tsx
<PhoneInput
  value={phoneNumber}
  onChangePhoneNumber={setPhoneNumber}
  disabled={true}
/>
```

### Obteniendo el número completo formateado

```tsx
const [phoneNumber, setPhoneNumber] = useState('');
const [formattedPhone, setFormattedPhone] = useState('');

<PhoneInput
  value={phoneNumber}
  onChangePhoneNumber={setPhoneNumber}
  onChangeFormattedPhoneNumber={setFormattedPhone}
/>

// formattedPhone será algo como: "+54 1123456789"
```

## Países Soportados

El componente incluye más de 50 países, priorizando países de América Latina y España:

- 🇦🇷 Argentina (+54)
- 🇲🇽 México (+52)
- 🇪🇸 España (+34)
- 🇺🇸 Estados Unidos (+1)
- 🇨🇱 Chile (+56)
- 🇨🇴 Colombia (+57)
- Y muchos más...

## Detección Automática de País

El componente utiliza `react-native-localize` para detectar automáticamente el país del usuario basándose en la configuración del dispositivo. Si la detección automática está habilitada (por defecto), el componente:

1. Detecta el país del dispositivo
2. Busca el país en la lista de países soportados
3. Si lo encuentra, lo selecciona automáticamente
4. Si no, usa el `defaultCountry` o el primer país de la lista

## Arquitectura

El componente sigue los principios de **Atomic Design**:

```
PhoneInput/ (Átomo)
├── index.tsx              # Componente principal
├── PhoneInput.types.ts    # Tipos TypeScript
├── PhoneInput.styles.ts   # Estilos
├── countries.data.ts      # Datos de países
└── README.md              # Documentación
```

## Dependencias

- `react-native-localize`: Para detección automática de país
- Componentes nativos de React Native (TextInput, Modal, FlatList)
