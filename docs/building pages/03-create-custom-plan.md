# Custom Training Plan Creator - Complete Feature Documentation & Wireframes

## 📱 Screen Overview

**Screen Name:** Custom Training Plan Creator (Multi-Step Wizard)  
**File Location:** `src/app/training/create-custom-plan.tsx`  
**Navigation:** Training Plans → Create Tab → Custom Plan  
**Purpose:** Step-by-step wizard for creating personalized training plans from scratch

---

## 🎯 User Stories

As a climber creating a custom plan, I want to:

- Define my training schedule and duration
- Select specific goals and available equipment
- Build a weekly workout structure with exercises
- Preview my plan before finalizing
- Save and immediately start using my custom plan

---

## 🖼️ Wireframe Structure

### Step 1: Basic Information

```
┌─────────────────────────────────┐
│  Custom Plan Creator - Step 1    │
├─────────────────────────────────┤
│  ┌─────────────────────────┐    │
│  │   🔶 Header (Orange)    │    │
│  │   Create Training Plan  │    │
│  │   Design perfect workout│    │
│  │                         │    │
│  │   ① ━━━ ② --- ③        │    │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │   Basic Information     │    │
│  └─────────────────────────┘    │
│                                  │
│  Plan Name *                     │
│  ┌─────────────────────────┐    │
│  │ e.g., 12-Week Strength  │    │
│  └─────────────────────────┘    │
│                                  │
│  Description                     │
│  ┌─────────────────────────┐    │
│  │ Describe your training  │    │
│  │ plan goals and approach│    │
│  │                         │    │
│  └─────────────────────────┘    │
│                                  │
│  Duration (weeks) *   Days/week *│
│  ┌──────────┐    ┌──────────┐   │
│  │    4     │    │    3     │   │
│  └──────────┘    └──────────┘   │
│                                  │
│  Training Goals *                │
│  ┌─────────┐  ┌─────────┐      │
│  │Strength │  │Endurance│      │
│  └─────────┘  └─────────┘      │
│  ┌─────────┐  ┌─────────┐      │
│  │Weight   │  │ Muscle  │      │
│  │ Loss    │  │  Gain   │      │
│  └─────────┘  └─────────┘      │
│  ┌─────────┐  ┌─────────┐      │
│  │Flexibil │  │ Sport   │      │
│  │  ity    │  │Specific │      │
│  └─────────┘  └─────────┘      │
│                                  │
│  Available Equipment *           │
│  ┌─────────┐  ┌─────────┐      │
│  │  Gym    │  │  Home   │      │
│  │ Access  │  │Equipment│      │
│  └─────────┘  └─────────┘      │
│  ┌─────────┐  ┌─────────┐      │
│  │Bodyweig │  │Dumbbells│      │
│  │ht Only  │  │         │      │
│  └─────────┘  └─────────┘      │
│  ┌─────────┐  ┌─────────┐      │
│  │Resistan │  │ Pull-up │      │
│  │ce Bands │  │   Bar   │      │
│  └─────────┘  └─────────┘      │
│                                  │
│  Difficulty Level *              │
│  ┌─────────┐  ┌─────────┐      │
│  │Beginner │  │Intermed │      │
│  │(Active) │  │  iate   │      │
│  └─────────┘  └─────────┘      │
│  ┌─────────┐  ┌─────────┐      │
│  │Advanced │  │  Elite  │      │
│  └─────────┘  └─────────┘      │
│                                  │
│  ┌─────────────────────────┐    │
│  │        [Next →]         │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

### Step 2: Exercise Selection

```
┌─────────────────────────────────┐
│  Custom Plan Creator - Step 2    │
├─────────────────────────────────┤
│  ┌─────────────────────────┐    │
│  │   🔶 Header (Orange)    │    │
│  │   Create Training Plan  │    │
│  │   Design perfect workout│    │
│  │                         │    │
│  │   ① ✓   ② ━━━ ③ ---    │    │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │   Select Exercises      │    │
│  └─────────────────────────┘    │
│                                  │
│  Activity Type                   │
│  ┌─────────────────────────┐    │
│  │ 🏆 Add Exercises to    │ >  │
│  │    Your Plan           │    │
│  └─────────────────────────┘    │
│                                  │
│  Your Training Week              │
│  ┌─────────────────────────┐    │
│  │ Monday                  │    │
│  │ [+ Add Exercise]       │    │
│  │ Rest Day 😴            │    │
│  ├─────────────────────────┤    │
│  │ Tuesday                 │    │
│  │ [+ Add Exercise]       │    │
│  │ Rest Day 😴            │    │
│  ├─────────────────────────┤    │
│  │ Wednesday               │    │
│  │ [+ Add Exercise]       │    │
│  │ Rest Day 😴            │    │
│  ├─────────────────────────┤    │
│  │ Thursday                │    │
│  │ [+ Add Exercise]       │    │
│  │ Rest Day 😴            │    │
│  ├─────────────────────────┤    │
│  │ Friday                  │    │
│  │ [+ Add Exercise]       │    │
│  │ Rest Day 😴            │    │
│  ├─────────────────────────┤    │
│  │ Saturday                │    │
│  │ [+ Add Exercise]       │    │
│  │ Rest Day 😴            │    │
│  ├─────────────────────────┤    │
│  │ Sunday                  │    │
│  │ [+ Add Exercise]       │    │
│  │ Rest Day 😴            │    │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │  [← Back]    [Next →]  │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

### Exercise Selection Modal

```
┌─────────────────────────────────┐
│      Select Exercise Modal       │
├─────────────────────────────────┤
│  ┌─────────────────────────┐    │
│  │  Select Exercise      X │    │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │ 🔍 Search exercises... │    │
│  └─────────────────────────┘    │
│                                  │
│  Category                        │
│  ┌───────┐ ┌───────┐ ┌──────┐  │
│  │  All  │ │ Gym   │ │Climb │  │
│  │Active │ │Train. │ │ ing  │  │
│  └───────┘ └───────┘ └──────┘  │
│                                  │
│  Subcategory                     │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐   │
│  │All │ │Chest│ │Back│ │Legs│   │
│  └────┘ └────┘ └────┘ └────┘   │
│  ┌──────────┐ ┌──────────┐      │
│  │Shoulders │ │   Core   │      │
│  └──────────┘ └──────────┘      │
│                                  │
│  Exercise List                   │
│  ┌─────────────────────────┐    │
│  │ Barbell Bench Press    │    │
│  │ Equipment: barbell     │    │
│  │ Targets: chest,triceps│    │
│  │ ♥4 sets 8-12 reps     │    │
│  │ 90s rest [Intermediate]│    │
│  │ [Add Exercise]         │    │
│  ├─────────────────────────┤    │
│  │ Dumbbell Bench Press   │    │
│  │ Equipment: dumbbells   │    │
│  │ Targets: chest,triceps│    │
│  │ ♥4 sets 8-12 reps     │    │
│  │ 90s rest [Beginner]    │    │
│  │ [Add Exercise]         │    │
│  ├─────────────────────────┤    │
│  │ Incline Bench Press    │    │
│  │ Equipment: barbell     │    │
│  │ Targets: upper chest   │    │
│  │ ♥4 sets 8-12 reps     │    │
│  │ 90s rest [Intermediate]│    │
│  │ [Add Exercise]         │    │
│  └─────────────────────────┘    │
│                                  │
│  [➕] Floating Add Button        │
└─────────────────────────────────┘
```

### Step 3: Review & Confirm

```
┌─────────────────────────────────┐
│  Custom Plan Creator - Step 3    │
├─────────────────────────────────┤
│  ┌─────────────────────────┐    │
│  │   🔶 Header (Orange)    │    │
│  │   Create Training Plan  │    │
│  │   Review and confirm    │    │
│  │                         │    │
│  │   ① ✓   ② ✓   ③ ━━━    │    │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │   Review Your Plan      │    │
│  └─────────────────────────┘    │
│                                  │
│  Plan Summary                    │
│  ┌─────────────────────────┐    │
│  │ Name: [User's Plan Name]│    │
│  │ Duration: X weeks       │    │
│  │ Frequency: Y days/week  │    │
│  │ Goals: [Selected Goals] │    │
│  │ Difficulty: [Level]     │    │
│  └─────────────────────────┘    │
│                                  │
│  Weekly Schedule                 │
│  ┌─────────────────────────┐    │
│  │ Monday:                 │    │
│  │ • Exercise 1 (4x12)     │    │
│  │ • Exercise 2 (3x10)     │    │
│  ├─────────────────────────┤    │
│  │ Tuesday: Rest Day       │    │
│  ├─────────────────────────┤    │
│  │ Wednesday:              │    │
│  │ • Exercise 3 (5x5)      │    │
│  │ • Exercise 4 (4x8)      │    │
│  ├─────────────────────────┤    │
│  │ [Show More Days...]     │    │
│  └─────────────────────────┘    │
│                                  │
│  Equipment Needed                │
│  ┌─────────────────────────┐    │
│  │ • Barbell               │    │
│  │ • Dumbbells             │    │
│  │ • Pull-up Bar           │    │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │  [← Back] [Create Plan] │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

---

## 🔧 Component Architecture

### 1. Step Progress Indicator

**Component:** `StepProgressIndicator.tsx`

**Features:**

- Visual representation of three steps
- Active step highlighting
- Completed step checkmarks
- Step labels (optional on larger screens)

**Props & State:**

```typescript
interface StepProgressProps {
  currentStep: 1 | 2 | 3;
  completedSteps: number[];
  onStepClick?: (step: number) => void; // Allow backward navigation
}
```

### 2. Step 1 Components

#### 2.1 Plan Name Input

**Component:** `PlanNameInput.tsx`

**Features:**

- Required field validation
- Character limit (50 chars)
- Placeholder with example
- Real-time validation feedback

#### 2.2 Training Goals Selector

**Component:** `TrainingGoalsSelector.tsx`

**Features:**

- Multi-select chip buttons
- Visual selection state
- Minimum 1, maximum 5 goals
- Goal descriptions on long press

**Goal Options:**

```typescript
const trainingGoals = [
  { id: 'strength', label: 'Strength Building', icon: '💪' },
  { id: 'endurance', label: 'Endurance', icon: '🏃' },
  { id: 'weight_loss', label: 'Weight Loss', icon: '⚖️' },
  { id: 'muscle_gain', label: 'Muscle Gain', icon: '💯' },
  { id: 'flexibility', label: 'Flexibility', icon: '🧘' },
  { id: 'sport_specific', label: 'Sport Specific', icon: '🎯' },
  { id: 'general_fitness', label: 'General Fitness', icon: '❤️' },
  { id: 'rehabilitation', label: 'Rehabilitation', icon: '🏥' },
];
```

#### 2.3 Equipment Selector

**Component:** `EquipmentSelector.tsx`

**Features:**

- Multi-select chips
- Equipment categories
- Smart filtering based on selection
- "No equipment" option

**Equipment Categories:**

```typescript
const equipmentOptions = {
  location: ['Gym Access', 'Home Equipment'],
  bodyweight: ['Bodyweight Only'],
  freeWeights: ['Dumbbells', 'Barbell', 'Kettlebell'],
  machines: ['Cable Machine', 'Smith Machine'],
  accessories: ['Resistance Bands', 'Pull-up Bar', 'Yoga Mat'],
  climbing: ['Climbing Wall', 'Hangboard', 'Campus Board'],
};
```

#### 2.4 Difficulty Level Selector

**Component:** `DifficultyLevelSelector.tsx`

**Features:**

- Single selection radio buttons
- Visual distinction for selected level
- Description tooltips for each level
- Color coding (green for beginner, orange for intermediate, etc.)

### 3. Step 2 Components

#### 3.1 Weekly Schedule Builder

**Component:** `WeeklyScheduleBuilder.tsx`

**Features:**

- Seven-day calendar layout
- Add exercise buttons for each day
- Rest day toggles
- Drag-and-drop reordering (future enhancement)
- Exercise count indicators

**State Management:**

```typescript
interface WeeklySchedule {
  monday: Exercise[];
  tuesday: Exercise[];
  wednesday: Exercise[];
  thursday: Exercise[];
  friday: Exercise[];
  saturday: Exercise[];
  sunday: Exercise[];
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string; // "8-12" or "30s"
  rest: number; // seconds
  equipment: string[];
  targetMuscles: string[];
}
```

#### 3.2 Exercise Selection Modal

**Component:** `ExerciseSelectionModal.tsx`

**Features:**

- Full-screen modal with search
- Category and subcategory filters
- Exercise cards with details
- Equipment indicators
- Difficulty badges
- Add to day functionality

**Exercise Data Structure:**

```typescript
interface ExerciseTemplate {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  equipment: string[];
  targetMuscles: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  defaultSets: number;
  defaultReps: string;
  defaultRest: number;
  instructions: string;
  videoUrl?: string;
}
```

### 4. Step 3 Components

#### 4.1 Plan Summary Card

**Component:** `PlanSummaryCard.tsx`

**Features:**

- Consolidated view of all plan details
- Editable fields with inline editing
- Validation summary
- Total workout time estimation

#### 4.2 Weekly Schedule Preview

**Component:** `WeeklySchedulePreview.tsx`

**Features:**

- Collapsible day sections
- Exercise details with sets/reps
- Total daily workout duration
- Equipment needed per day
- Edit buttons for quick modifications

---

## 📊 Data Management

### Form State Management

```typescript
// Using React Hook Form or Formik
interface CustomPlanFormData {
  // Step 1
  planName: string;
  description?: string;
  duration: number; // weeks
  daysPerWeek: number;
  trainingGoals: string[];
  equipment: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite';

  // Step 2
  weeklySchedule: WeeklySchedule;

  // Meta
  createdAt: Date;
  userId: string;
  status: 'draft' | 'active';
}
```

### Validation Rules

```typescript
const validationRules = {
  step1: {
    planName: 'required|min:3|max:50',
    duration: 'required|min:1|max:52',
    daysPerWeek: 'required|min:1|max:7',
    trainingGoals: 'required|min:1|max:5',
    equipment: 'required|min:1',
    difficulty: 'required',
  },
  step2: {
    weeklySchedule: 'required|minExercises:1',
  },
};
```

---

## 🎨 Design Specifications

### Visual Hierarchy

```typescript
const designSystem = {
  header: {
    height: 140,
    background: 'linear-gradient(135deg, #FF6B35, #FF8C42)',
    progressBar: {
      activeColor: '#FFFFFF',
      inactiveColor: 'rgba(255,255,255,0.4)',
      completedColor: '#4CAF50',
    },
  },
  form: {
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
    },
    input: {
      borderRadius: 8,
      borderColor: '#E0E0E0',
      focusColor: '#FF6B35',
    },
    chip: {
      unselected: {
        background: '#F5F5F5',
        border: '#E0E0E0',
      },
      selected: {
        background: '#FFF4F0',
        border: '#FF6B35',
      },
    },
  },
};
```

### Animation & Transitions

```typescript
const animations = {
  stepTransition: {
    duration: 300,
    type: 'slide-horizontal',
  },
  chipSelection: {
    scale: 1.05,
    duration: 150,
  },
  modalOpen: {
    type: 'slide-up',
    duration: 250,
  },
};
```

---

## 🔄 User Flow & Navigation

### Forward Navigation Logic

```
Step 1 → Validation → Step 2 → Add Exercises → Step 3 → Create Plan
         ↓ Invalid
         Show Errors
```

### Backward Navigation

- Users can go back to previous steps
- Form data persists when navigating backward
- Confirmation dialog if leaving with unsaved changes

### Exercise Addition Flow

```
Day Selection → Exercise Modal → Category Filter → Exercise Selection → Add to Day → Close Modal
```

---

## 💻 Implementation Guide

### Phase 1: Form Structure

```typescript
// src/app/training/create-custom-plan.tsx
export default function CreateCustomPlan() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CustomPlanFormData>(initialData);

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    const plan = await createTrainingPlan(formData);
    navigation.navigate('PlanDetails', { planId: plan.id });
  };

  return (
    <View style={styles.container}>
      <StepProgressIndicator
        currentStep={currentStep}
        completedSteps={getCompletedSteps()}
      />
      {renderStepContent(currentStep)}
      <NavigationButtons
        onNext={handleNext}
        onBack={handleBack}
        onSubmit={handleSubmit}
        currentStep={currentStep}
      />
    </View>
  );
}
```

### Phase 2: Step Components

Build each step as a separate component for maintainability.

### Phase 3: Exercise Library Integration

Connect to your exercise database and implement filtering/search.

### Phase 4: Validation & Error Handling

Implement comprehensive validation with user-friendly error messages.

---

## 🧪 Testing Requirements

### Form Validation Tests

- Required fields enforcement
- Min/max value constraints
- Step progression logic
- Data persistence across steps

### User Flow Tests

- Complete plan creation flow
- Back navigation data retention
- Exercise addition and removal
- Form submission success/failure

### Edge Cases

- No exercises selected
- Invalid date combinations
- Network failure during submission
- Maximum exercises per day limits

---

## 📝 Implementation Checklist

### Step 1 Implementation

- [ ] Plan name input with validation
- [ ] Description textarea
- [ ] Duration and frequency selectors
- [ ] Training goals multi-select
- [ ] Equipment multi-select
- [ ] Difficulty single-select
- [ ] Step validation logic

### Step 2 Implementation

- [ ] Weekly calendar layout
- [ ] Add exercise buttons
- [ ] Exercise selection modal
- [ ] Category filtering
- [ ] Search functionality
- [ ] Exercise cards with details
- [ ] Day-exercise association

### Step 3 Implementation

- [ ] Plan summary generation
- [ ] Weekly schedule preview
- [ ] Equipment needed list
- [ ] Edit capabilities
- [ ] Final validation
- [ ] Plan creation API call
- [ ] Success navigation

### Polish & UX

- [ ] Loading states
- [ ] Error messages
- [ ] Animations between steps
- [ ] Keyboard handling
- [ ] Accessibility labels

---

## 🚀 Future Enhancements

### Version 2.0

- AI-powered exercise suggestions based on goals
- Exercise video previews in selection modal
- Workout duration estimation
- Calorie burn predictions
- Copy week to all weeks feature

### Version 3.0

- Progressive overload automation
- Periodization templates
- Exercise substitution suggestions
- Integration with wearables for auto-adjustment
- Social sharing of custom plans

---

This documentation provides a complete blueprint for implementing the Custom Training Plan Creator with its three-step wizard interface.
