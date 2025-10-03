After finishing your changes:

1. run npx expo start --clear --reset-cache
2. Resolve the terminal problems
3. Open the IOS simulator yo compile the project
4. If have error try to fix
5. Don't kill the port 8081 the idea is you can debug etc...
6. Don't make aleatory changes, just work in that i tell you in the prompt

- use this architector for all components in the app: \
  Button/
  ├── Button.tsx # Component logic
  ├── Button.styles.ts # Styles with makeStyles
  ├── Button.types.ts # TypeScript interfaces
  └── index.ts # Barrel export

- Use the next structure.

src/
├── hooks/ # 🎣 All business logic lives here
├── components/ # 🎨 Pure presentational components (Atomic Design)
├── app/ # 📱 Expo Router screens (containers only)
├── services/ # 🔧 External integrations (Firebase, APIs)
├── store/ # 🗃️ Global state (Zustand)
└── design-system/

hooks/
├── api/ # Data fetching & mutations
│ ├── useWorkouts.ts # GET workouts
│ ├── useCreateWorkout.ts # POST workout
│ ├── useUpdateWorkout.ts # UPDATE workout
│ └── useDeleteWorkout.ts # DELETE workout
│
├── business/ # Business logic & computations
│ ├── useTrainingPlan.ts # Training plan logic
│ ├── useProgressCalculator.ts # Progress calculations
│ ├── useExerciseSelector.ts # Exercise selection AI
│ └── useWorkoutTimer.ts # Timer management
│
├── ui/ # UI state & interactions
│ ├── useModal.ts # Modal state management
│ ├── useToast.ts # Toast notifications
│ ├── useBottomSheet.ts # Bottom sheet control
│ └── useAnimation.ts # Animation values
│
├── auth/ # Authentication hooks
│ ├── useAuth.ts # Auth state & methods
│ ├── useUser.ts # Current user data
│ └── usePermissions.ts # Permission checks
│
├── device/ # Device capabilities
│ ├── useNetwork.ts # Network status
│ ├── useStorage.ts # AsyncStorage wrapper
│ ├── useCamera.ts # Camera access
│ └── useBiometrics.ts # Biometric auth
│
└── utils/ # Utility hooks
├── useDebounce.ts # Debounced values
├── useInterval.ts # Safe intervals
├── usePrevious.ts # Previous value tracking
└── useWhyDidYouUpdate.ts # Debug re-renders

components/
├── primitives/ # Level 0: Styled base elements
│ ├── Box/ # Flexbox container
│ ├── Text/ # Typography component
│ ├── Stack/ # Spacing components
│ └── Surface/ # Elevated containers
│
├── atoms/ # Level 1: Single UI elements
│ ├── Button/
│ │ ├── Button.tsx # Pure component (no business logic)
│ │ ├── Button.styles.ts # Styles only
│ │ ├── Button.types.ts # TypeScript interfaces
│ │ ├── Button.test.tsx # Unit tests
│ │ └── index.ts # Barrel export
│ ├── Input/
│ ├── Icon/
│ └── Badge/
│
├── molecules/ # Level 2: Composed components
│ ├── FormField/ # Label + Input + Error
│ ├── Card/ # Container with sections
│ ├── ListItem/ # Item with actions
│ └── SearchBar/ # Input + Icon + Clear
│
├── organisms/ # Level 3: Complex UI sections
│ ├── WorkoutCard/ # Full workout display
│ ├── ExerciseList/ # List of exercises
│ ├── TimerDisplay/ # Timer with controls
│ └── ProgressChart/ # Data visualization
│
└── templates/ # Level 4: Page layouts
├── AuthLayout/ # Authentication pages
├── TabLayout/ # Main app layout
└── ModalLayout/ # Modal wrapper

✅ DO's

Keep components pure - No API calls, no business logic
Use hooks for everything - All logic lives in hooks
Implement react query in the API calls hooks
Use the Store only for the user or complex step-by-step forms
Compose small hooks - Each hook does one thing well
Co-locate related code - Component files stay together
Type everything - Full TypeScript coverage
Test hooks separately - Business logic tests in hooks
Memoize expensive operations - Use useMemo/useCallback

❌ DON'Ts

Don't put logic in components - Components only render
Don't use inline styles - Use style files
Don't fetch in components - Use data hooks
Don't manage complex state in components - Use state hooks
Don't repeat hook logic - Create reusable hooks
Don't ignore TypeScript - Fix all type errors
Don't couple hooks to components - Keep them independent

- # credential to make login in the app is alexrobainaph@gmail.com pass: salsamora3000
- Please don't kill all ports. You can kill only the ports that you are using
- if the storage change. Update the documentatios automaticaly @docs/DATA-STORAGE-LOCATIONS.md
- If you need to create a new component, add this component to atoms, molecules, or organisms.
- Use custom hooks for every API firebase call. User is the only think that we can use in the store. Yo can save things in the store only if I tell you.

- Use this library for UI react-native-paper. But mantain the atom architecture
- Necesito que uses este archivo para que tengas buenas practicas con firebase @docs/04-User-plan-traoning.md \
  \
  Asegurate de que no rompes nada de lo anterior cuando creas algo nuevo y las redirecciones funcionen correctamente.
- use the expo ncp to debug
- don't add nothing in spanish in the app
- Run the app on port 9082 in the background and read the logs. If you detect an error, fix it. (Dont kill the port)
