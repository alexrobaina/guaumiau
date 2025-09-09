# CruxClimb Onboarding Documentation

## Overview
The CruxClimb onboarding process collects comprehensive user data to create personalized climbing training plans. The onboarding consists of 7 steps that gather information about climbing experience, current abilities, goals, equipment access, availability, injuries, and preferred climbing styles.

## Data Collection Structure

### 1. Experience Level (`experience`)
**Type:** String (enum)
**Options:**
- `beginner` - New to climbing or less than 6 months experience
- `intermediate` - 6 months to 2 years of regular climbing
- `advanced` - 2+ years with consistent training
- `elite` - Competitive level or professional climber

**Purpose:** Determines the baseline difficulty and complexity of training programs.

### 2. Current Climbing Grades (`currentGrade`)
**Type:** Object with two properties
```typescript
{
  boulder: string,
  sport: string
}
```

#### Boulder Grades (V-Scale)
Available options: `VB`, `V0`, `V1`, `V2`, `V3`, `V4`, `V5`, `V6`, `V7`, `V8`, `V9`, `V10+`

#### Sport Grades (YDS - Yosemite Decimal System)
Available options: `5.5`, `5.6`, `5.7`, `5.8`, `5.9`, `5.10a`, `5.10b`, `5.10c`, `5.10d`, `5.11a`, `5.11b`, `5.11c`, `5.11d`, `5.12a`, `5.12b`, `5.12c`, `5.12d`, `5.13a`, `5.13b`, `5.13c`, `5.13d`, `5.14+`

#### French Grading Scale for Rock Climbing
The French grading system is widely used in Europe and consists of numbers followed by letters:

**Beginner Grades:**
- `3` - Very easy, suitable for beginners
- `4` - Easy climbing with good holds
- `5a`, `5b`, `5c` - Moderate difficulty

**Intermediate Grades:**
- `6a`, `6a+`, `6b`, `6b+`, `6c`, `6c+` - Intermediate level
- `7a`, `7a+`, `7b`, `7b+`, `7c`, `7c+` - Advanced intermediate

**Advanced Grades:**
- `8a`, `8a+`, `8b`, `8b+`, `8c`, `8c+` - Advanced climbing
- `9a`, `9a+`, `9b`, `9b+`, `9c` - Elite level climbing

**Professional/Competition Grades:**
- `9c+` and above - World-class climbing

**Conversion Reference:**
- French `6a` ≈ YDS `5.10a` ≈ V-scale `V0-V1`
- French `7a` ≈ YDS `5.12a` ≈ V-scale `V6`
- French `8a` ≈ YDS `5.13b` ≈ V-scale `V11`

### 3. Training Goals (`goals`)
**Type:** Array of strings
**Predefined Options:**
- `strength` - Build Strength (Improve overall climbing power and finger strength)
- `endurance` - Improve Endurance (Climb longer routes and sessions without getting pumped)
- `technique` - Better Technique (Focus on movement efficiency and climbing skills)
- `grade-progression` - Grade Progression (Systematically climb harder grades)
- `competition` - Competition Training (Prepare for climbing competitions)
- `injury-prevention` - Injury Prevention (Focus on mobility, stability, and antagonist training)
- `general-fitness` - General Fitness (Improve overall health and conditioning)

**Additional:** Users can add custom goals as free text.

### 4. Equipment Access (`equipment`)
**Type:** Array of Equipment objects
**Equipment Categories:**
- Hangboards/fingerboards
- Campus boards
- Weights/dumbbells
- Resistance bands
- Pull-up bars
- Climbing gym access
- Home wall/woody
- TRX/suspension trainers
- Yoga mats
- Foam rollers
- System boards (Moon Board, Kilter Board, etc.)

**Purpose:** Determines which exercises and training methods can be included in the program.

### 5. Training Availability (`trainingAvailability`)
**Type:** Object
```typescript
{
  daysPerWeek: number,     // 1-7 days
  hoursPerSession: number  // 0.5-4+ hours
}
```

**Days Per Week Options:** 1, 2, 3, 4, 5, 6, 7
**Hours Per Session Options:** 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4+

**Purpose:** Creates realistic training schedules that fit the user's lifestyle.

### 6. Injuries and Physical Limitations (`injuries`)
**Type:** Array of strings
**Predefined Options:**
- `finger` - Finger injuries (pulley injuries, tendonitis)
- `shoulder` - Shoulder problems (impingement, instability)
- `elbow` - Elbow issues (tennis elbow, golfer's elbow)
- `back` - Back problems (lower back pain, disc issues)
- `knee` - Knee injuries
- `ankle` - Ankle problems
- `wrist` - Wrist issues
- `none` - No current injuries

**Special Values:**
- `none` - Indicates no injuries (clears all other selections)
- Custom injuries can be added as free text

**Purpose:** Modifies training plans to avoid aggravating existing conditions and includes appropriate rehabilitation exercises.

### 7. Preferred Climbing Style (`preferredStyle`)
**Type:** String (enum)
**Options:**
- `boulder` - Bouldering focus
- `sport` - Sport climbing focus
- `trad` - Traditional climbing focus
- `all` - No specific preference, mix of all styles

**Purpose:** Tailors training emphasis toward the user's preferred climbing discipline.

## Data Flow and Storage

### Store Structure
The onboarding data is stored in a Zustand store with the following structure:

```typescript
interface OnboardingData {
  experience: 'beginner' | 'intermediate' | 'advanced' | 'elite' | null;
  currentGrade: {
    boulder: string;
    sport: string;
  };
  goals: string[];
  equipment: Equipment[];
  trainingAvailability: {
    daysPerWeek: number;
    hoursPerSession: number;
  };
  injuries: string[];
  preferredStyle: 'boulder' | 'sport' | 'trad' | 'all' | null;
  completed: boolean;
}
```

### Navigation Flow
1. **Experience** → Grade
2. **Grade** → Goals  
3. **Goals** → Equipment
4. **Equipment** → Availability
5. **Availability** → Injuries
6. **Injuries** → Style
7. **Style** → Complete

### Validation Rules
- **Experience:** Required before proceeding
- **Grade:** Both boulder and sport grades must be selected
- **Goals:** At least one goal must be selected
- **Equipment:** No validation (can proceed with no equipment)
- **Availability:** Default values provided (3 days/week, 1 hour/session)
- **Injuries:** Optional (defaults to empty array)
- **Style:** Required before completion

## Progress Tracking
- **Current Step:** Tracks which onboarding screen the user is on (0-6)
- **Total Steps:** Always 7
- **Progress Bar:** Displayed on each screen showing completion percentage
- **Navigation:** Users can go back to previous steps to modify their selections

## Completion and Integration
Once onboarding is completed:
1. `completed` flag is set to `true`
2. User data is persisted to AsyncStorage
3. User is redirected to the main app (`/(tabs)`)
4. Training plans are generated based on collected data

## Technical Implementation
- **Store:** Zustand with immer middleware for state management
- **Persistence:** AsyncStorage for local data persistence
- **Navigation:** Expo Router for screen transitions
- **Validation:** Real-time validation with disabled/enabled next buttons
- **UI Components:** Reusable OnboardingScreen wrapper with consistent progress indicators