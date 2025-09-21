# Exercise Library JSON Structure - Comprehensive Training Database

Let me create a comprehensive exercise database with proper categorization for filtering by activity type (Climbing, Gym, Running, etc.) and specific exercise types.## How the Exercise Selection Flow Works:

### 1. **Activity Type Selection** (First Filter)

User selects main activity:

- 🏋️ Gym Training
- 🧗 Climbing Training
- 🏃 Running
- 🧘 Yoga & Flexibility

### 2. **Subcategory Selection** (Second Filter)

Based on activity, user sees relevant subcategories:

**For Gym:**

- Chest, Back, Legs, Shoulders, Arms, Core, Cardio Equipment

**For Climbing:**

- Fingerboard, Campus Board, Bouldering, Strength, Core, Antagonist

**For Running:**

- Endurance Runs, Speed Work, Running Drills

### 3. **Exercise Selection**

User sees filtered exercises and can:

- View exercise details (equipment needed, muscle groups, difficulty)
- See default parameters (sets, reps/time, rest)
- Add to their plan

### 4. **Customization**

For each selected exercise, user can adjust:

- **Sets**: Number of sets
- **Measurement**:
  - Reps (e.g., "8-12", "max", "5 each side")
  - Time (e.g., "30s", "45min")
  - Distance (e.g., "400m", "5km")
  - Intervals (e.g., "7s on/3s off")
- **Rest**: Rest period between sets
- **Intensity**: If applicable (easy, moderate, hard)
- **Notes**: Personal notes

### 5. **Day Assignment**

User assigns exercises to specific training days:

- Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday

### 6. **Custom Exercise Creation**

If an exercise isn't in the database, users can create custom ones with:

- Name
- Category/Subcategory
- Equipment needed
- Measurement type
- Default parameters

## Example User Flow:

**User wants to create a mixed training plan:**

1. **Monday - Gym (Chest & Triceps)**
   - Gym → Chest → Bench Press (4 sets x 8-12 reps)
   - Gym → Chest → Dumbbell Fly (3 sets x 12-15 reps)
   - Gym → Arms → Tricep Pushdown (3 sets x 15 reps)

2. **Tuesday - Climbing Training**
   - Climbing → Fingerboard → Repeaters 7/3 (6 sets)
   - Climbing → Core → Hanging Knee Raises (3 sets x 20)
   - Climbing → Antagonist → Push-ups (3 sets x 25)

3. **Wednesday - Running**
   - Running → Endurance → Easy Run (45 minutes)
   - Running → Drills → Strides (4 x 100m)

4. **Thursday - Rest Day**

5. **Friday - Gym (Back & Biceps)**
   - Gym → Back → Pull-ups (4 sets x max)
   - Gym → Back → Barbell Row (4 sets x 10)
   - Gym → Arms → Hammer Curls (3 sets x 12)

6. **Saturday - Climbing (Bouldering)**
   - Climbing → Bouldering → 4x4 Boulders (4 rounds)
   - Climbing → Bouldering → Limit Bouldering (5 problems)

7. **Sunday - Yoga Recovery**
   - Yoga → Flows → Yin Yoga (60 minutes)
   - Yoga → Stretches → Hip Flexor Stretch (2 sets x 60s)

This structure allows users to create highly customized training plans mixing different activities throughout their week, with proper exercise selection, parameters, and rest days.

JSON Example:
{
"exerciseCategories": {
"gym": {
"label": "Gym Training",
"icon": "🏋️",
"subcategories": {
"chest": {
"label": "Chest",
"exercises": [
{
"id": "bench-press-barbell",
"name": "Barbell Bench Press",
"equipment": ["barbell", "bench"],
"muscleGroups": ["chest", "triceps", "shoulders"],
"measurementType": "reps",
"defaultSets": 4,
"defaultReps": "8-12",
"defaultRest": 90,
"difficulty": "intermediate"
},
{
"id": "bench-press-dumbbell",
"name": "Dumbbell Bench Press",
"equipment": ["dumbbells", "bench"],
"muscleGroups": ["chest", "triceps", "shoulders"],
"measurementType": "reps",
"defaultSets": 4,
"defaultReps": "8-12",
"defaultRest": 90,
"difficulty": "beginner"
},
{
"id": "incline-bench-press",
"name": "Incline Bench Press",
"equipment": ["barbell", "incline-bench"],
"muscleGroups": ["upper-chest", "shoulders"],
"measurementType": "reps",
"defaultSets": 4,
"defaultReps": "8-12",
"defaultRest": 90,
"difficulty": "intermediate"
},
{
"id": "chest-fly",
"name": "Chest Fly",
"equipment": ["dumbbells", "bench"],
"muscleGroups": ["chest"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "12-15",
"defaultRest": 60,
"difficulty": "beginner"
},
{
"id": "cable-crossover",
"name": "Cable Crossover",
"equipment": ["cable-machine"],
"muscleGroups": ["chest"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "12-15",
"defaultRest": 60,
"difficulty": "intermediate"
},
{
"id": "push-ups",
"name": "Push-ups",
"equipment": [],
"muscleGroups": ["chest", "triceps", "shoulders"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "max",
"defaultRest": 60,
"difficulty": "beginner"
},
{
"id": "dips",
"name": "Chest Dips",
"equipment": ["dip-bars"],
"muscleGroups": ["lower-chest", "triceps"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "8-12",
"defaultRest": 90,
"difficulty": "intermediate"
}
]
},
"back": {
"label": "Back",
"exercises": [
{
"id": "deadlift",
"name": "Deadlift",
"equipment": ["barbell"],
"muscleGroups": ["back", "glutes", "hamstrings"],
"measurementType": "reps",
"defaultSets": 4,
"defaultReps": "5-8",
"defaultRest": 180,
"difficulty": "advanced"
},
{
"id": "pull-ups",
"name": "Pull-ups",
"equipment": ["pull-up-bar"],
"muscleGroups": ["lats", "biceps"],
"measurementType": "reps",
"defaultSets": 4,
"defaultReps": "max",
"defaultRest": 90,
"difficulty": "intermediate"
},
{
"id": "lat-pulldown",
"name": "Lat Pulldown",
"equipment": ["cable-machine"],
"muscleGroups": ["lats", "biceps"],
"measurementType": "reps",
"defaultSets": 4,
"defaultReps": "10-12",
"defaultRest": 60,
"difficulty": "beginner"
},
{
"id": "barbell-row",
"name": "Barbell Row",
"equipment": ["barbell"],
"muscleGroups": ["mid-back", "lats", "biceps"],
"measurementType": "reps",
"defaultSets": 4,
"defaultReps": "8-12",
"defaultRest": 90,
"difficulty": "intermediate"
},
{
"id": "cable-row",
"name": "Seated Cable Row",
"equipment": ["cable-machine"],
"muscleGroups": ["mid-back", "lats"],
"measurementType": "reps",
"defaultSets": 4,
"defaultReps": "10-12",
"defaultRest": 60,
"difficulty": "beginner"
},
{
"id": "t-bar-row",
"name": "T-Bar Row",
"equipment": ["t-bar", "barbell"],
"muscleGroups": ["mid-back", "lats"],
"measurementType": "reps",
"defaultSets": 4,
"defaultReps": "8-12",
"defaultRest": 90,
"difficulty": "intermediate"
}
]
},
"legs": {
"label": "Legs",
"exercises": [
{
"id": "squat",
"name": "Back Squat",
"equipment": ["barbell", "squat-rack"],
"muscleGroups": ["quads", "glutes", "hamstrings"],
"measurementType": "reps",
"defaultSets": 4,
"defaultReps": "8-12",
"defaultRest": 120,
"difficulty": "intermediate"
},
{
"id": "front-squat",
"name": "Front Squat",
"equipment": ["barbell", "squat-rack"],
"muscleGroups": ["quads", "core"],
"measurementType": "reps",
"defaultSets": 4,
"defaultReps": "8-12",
"defaultRest": 120,
"difficulty": "advanced"
},
{
"id": "leg-press",
"name": "Leg Press",
"equipment": ["leg-press-machine"],
"muscleGroups": ["quads", "glutes"],
"measurementType": "reps",
"defaultSets": 4,
"defaultReps": "12-15",
"defaultRest": 90,
"difficulty": "beginner"
},
{
"id": "lunges",
"name": "Walking Lunges",
"equipment": ["dumbbells"],
"muscleGroups": ["quads", "glutes", "hamstrings"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "10 each leg",
"defaultRest": 60,
"difficulty": "intermediate"
},
{
"id": "leg-curls",
"name": "Leg Curls",
"equipment": ["leg-curl-machine"],
"muscleGroups": ["hamstrings"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "12-15",
"defaultRest": 60,
"difficulty": "beginner"
},
{
"id": "calf-raises",
"name": "Calf Raises",
"equipment": ["dumbbells"],
"muscleGroups": ["calves"],
"measurementType": "reps",
"defaultSets": 4,
"defaultReps": "15-20",
"defaultRest": 45,
"difficulty": "beginner"
}
]
},
"shoulders": {
"label": "Shoulders",
"exercises": [
{
"id": "overhead-press",
"name": "Overhead Press",
"equipment": ["barbell"],
"muscleGroups": ["shoulders", "triceps"],
"measurementType": "reps",
"defaultSets": 4,
"defaultReps": "8-10",
"defaultRest": 90,
"difficulty": "intermediate"
},
{
"id": "dumbbell-shoulder-press",
"name": "Dumbbell Shoulder Press",
"equipment": ["dumbbells"],
"muscleGroups": ["shoulders", "triceps"],
"measurementType": "reps",
"defaultSets": 4,
"defaultReps": "10-12",
"defaultRest": 60,
"difficulty": "beginner"
},
{
"id": "lateral-raises",
"name": "Lateral Raises",
"equipment": ["dumbbells"],
"muscleGroups": ["lateral-delts"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "12-15",
"defaultRest": 45,
"difficulty": "beginner"
},
{
"id": "front-raises",
"name": "Front Raises",
"equipment": ["dumbbells"],
"muscleGroups": ["front-delts"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "12-15",
"defaultRest": 45,
"difficulty": "beginner"
},
{
"id": "rear-delt-fly",
"name": "Rear Delt Fly",
"equipment": ["dumbbells"],
"muscleGroups": ["rear-delts"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "15-20",
"defaultRest": 45,
"difficulty": "intermediate"
}
]
},
"arms": {
"label": "Arms",
"exercises": [
{
"id": "barbell-curl",
"name": "Barbell Curl",
"equipment": ["barbell"],
"muscleGroups": ["biceps"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "10-12",
"defaultRest": 60,
"difficulty": "beginner"
},
{
"id": "hammer-curl",
"name": "Hammer Curl",
"equipment": ["dumbbells"],
"muscleGroups": ["biceps", "forearms"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "10-12",
"defaultRest": 60,
"difficulty": "beginner"
},
{
"id": "tricep-pushdown",
"name": "Tricep Pushdown",
"equipment": ["cable-machine"],
"muscleGroups": ["triceps"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "12-15",
"defaultRest": 45,
"difficulty": "beginner"
},
{
"id": "overhead-tricep-extension",
"name": "Overhead Tricep Extension",
"equipment": ["dumbbell"],
"muscleGroups": ["triceps"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "10-12",
"defaultRest": 60,
"difficulty": "intermediate"
}
]
},
"core": {
"label": "Core",
"exercises": [
{
"id": "plank",
"name": "Plank",
"equipment": [],
"muscleGroups": ["core"],
"measurementType": "time",
"defaultSets": 3,
"defaultDuration": "30-60s",
"defaultRest": 60,
"difficulty": "beginner"
},
{
"id": "side-plank",
"name": "Side Plank",
"equipment": [],
"muscleGroups": ["obliques"],
"measurementType": "time",
"defaultSets": 3,
"defaultDuration": "30s each side",
"defaultRest": 45,
"difficulty": "intermediate"
},
{
"id": "crunches",
"name": "Crunches",
"equipment": [],
"muscleGroups": ["abs"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "20-30",
"defaultRest": 45,
"difficulty": "beginner"
},
{
"id": "russian-twists",
"name": "Russian Twists",
"equipment": ["medicine-ball"],
"muscleGroups": ["obliques", "abs"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "20-30",
"defaultRest": 45,
"difficulty": "intermediate"
},
{
"id": "leg-raises",
"name": "Leg Raises",
"equipment": [],
"muscleGroups": ["lower-abs"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "15-20",
"defaultRest": 60,
"difficulty": "intermediate"
}
]
},
"cardio": {
"label": "Cardio Equipment",
"exercises": [
{
"id": "treadmill",
"name": "Treadmill",
"equipment": ["treadmill"],
"muscleGroups": ["cardiovascular", "legs"],
"measurementType": "time",
"defaultSets": 1,
"defaultDuration": "20-45min",
"defaultRest": 0,
"difficulty": "beginner",
"intensityOptions": ["walk", "jog", "run", "intervals"]
},
{
"id": "stationary-bike",
"name": "Stationary Bike",
"equipment": ["stationary-bike"],
"muscleGroups": ["cardiovascular", "legs"],
"measurementType": "time",
"defaultSets": 1,
"defaultDuration": "30-60min",
"defaultRest": 0,
"difficulty": "beginner",
"intensityOptions": ["easy", "moderate", "hard", "intervals"]
},
{
"id": "elliptical",
"name": "Elliptical",
"equipment": ["elliptical"],
"muscleGroups": ["cardiovascular", "full-body"],
"measurementType": "time",
"defaultSets": 1,
"defaultDuration": "20-45min",
"defaultRest": 0,
"difficulty": "beginner",
"intensityOptions": ["low", "moderate", "high"]
},
{
"id": "rowing-machine",
"name": "Rowing Machine",
"equipment": ["rowing-machine"],
"muscleGroups": ["cardiovascular", "back", "legs"],
"measurementType": "time",
"defaultSets": 1,
"defaultDuration": "20-30min",
"defaultRest": 0,
"difficulty": "intermediate",
"intensityOptions": ["steady", "intervals", "pyramid"]
},
{
"id": "stair-climber",
"name": "Stair Climber",
"equipment": ["stair-climber"],
"muscleGroups": ["cardiovascular", "glutes", "legs"],
"measurementType": "time",
"defaultSets": 1,
"defaultDuration": "15-30min",
"defaultRest": 0,
"difficulty": "intermediate"
}
]
}
}
},
"climbing": {
"label": "Climbing Training",
"icon": "🧗",
"subcategories": {
"fingerboard": {
"label": "Fingerboard",
"exercises": [
{
"id": "max-hangs-20mm",
"name": "Max Hangs - 20mm Edge",
"equipment": ["hangboard"],
"muscleGroups": ["fingers", "forearms"],
"measurementType": "time",
"defaultSets": 5,
"defaultDuration": "10s",
"defaultRest": 180,
"difficulty": "advanced",
"gripTypes": ["half-crimp", "open-hand"]
},
{
"id": "max-hangs-15mm",
"name": "Max Hangs - 15mm Edge",
"equipment": ["hangboard"],
"muscleGroups": ["fingers", "forearms"],
"measurementType": "time",
"defaultSets": 5,
"defaultDuration": "7s",
"defaultRest": 180,
"difficulty": "elite"
},
{
"id": "repeaters-7-3",
"name": "Repeaters (7/3)",
"equipment": ["hangboard"],
"muscleGroups": ["fingers", "forearms"],
"measurementType": "intervals",
"defaultSets": 6,
"defaultDuration": "7s on/3s off x6",
"defaultRest": 120,
"difficulty": "intermediate"
},
{
"id": "density-hangs",
"name": "Density Hangs",
"equipment": ["hangboard"],
"muscleGroups": ["fingers", "forearms"],
"measurementType": "time",
"defaultSets": 10,
"defaultDuration": "10s",
"defaultRest": 10,
"difficulty": "intermediate"
},
{
"id": "one-arm-hangs",
"name": "One Arm Hangs",
"equipment": ["hangboard"],
"muscleGroups": ["fingers", "forearms", "shoulders"],
"measurementType": "time",
"defaultSets": 3,
"defaultDuration": "5-10s",
"defaultRest": 180,
"difficulty": "elite"
},
{
"id": "pocket-hangs",
"name": "Pocket Hangs",
"equipment": ["hangboard"],
"muscleGroups": ["fingers"],
"measurementType": "time",
"defaultSets": 3,
"defaultDuration": "10s",
"defaultRest": 120,
"difficulty": "advanced",
"pocketTypes": ["2-finger", "3-finger", "mono"]
}
]
},
"campus": {
"label": "Campus Board",
"exercises": [
{
"id": "campus-ladder",
"name": "Campus Ladder",
"equipment": ["campus-board"],
"muscleGroups": ["fingers", "arms", "back"],
"measurementType": "reps",
"defaultSets": 5,
"defaultReps": "1-4-7",
"defaultRest": 180,
"difficulty": "advanced"
},
{
"id": "campus-doubles",
"name": "Campus Doubles",
"equipment": ["campus-board"],
"muscleGroups": ["fingers", "arms", "power"],
"measurementType": "reps",
"defaultSets": 5,
"defaultReps": "1-3-5-7",
"defaultRest": 180,
"difficulty": "elite"
},
{
"id": "campus-bumps",
"name": "Campus Bumps",
"equipment": ["campus-board"],
"muscleGroups": ["fingers", "arms"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "5 bumps each hand",
"defaultRest": 120,
"difficulty": "advanced"
},
{
"id": "campus-touches",
"name": "Campus Touches",
"equipment": ["campus-board"],
"muscleGroups": ["fingers", "coordination"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "10 touches",
"defaultRest": 90,
"difficulty": "intermediate"
}
]
},
"bouldering": {
"label": "Bouldering",
"exercises": [
{
"id": "boulder-4x4",
"name": "4x4 Boulders",
"equipment": ["climbing-wall"],
"muscleGroups": ["full-body"],
"measurementType": "rounds",
"defaultSets": 4,
"defaultReps": "4 problems",
"defaultRest": 240,
"difficulty": "intermediate",
"description": "Climb 4 problems 4 times with minimal rest"
},
{
"id": "limit-bouldering",
"name": "Limit Bouldering",
"equipment": ["climbing-wall"],
"muscleGroups": ["full-body", "technique"],
"measurementType": "attempts",
"defaultSets": 5,
"defaultReps": "3-5 attempts",
"defaultRest": 300,
"difficulty": "advanced",
"description": "Work at maximum difficulty"
},
{
"id": "volume-bouldering",
"name": "Volume Bouldering",
"equipment": ["climbing-wall"],
"muscleGroups": ["endurance", "technique"],
"measurementType": "problems",
"defaultSets": 1,
"defaultProblems": "20-30",
"defaultRest": "as needed",
"difficulty": "intermediate",
"description": "Many problems below max grade"
},
{
"id": "system-board",
"name": "System Board Training",
"equipment": ["system-board"],
"muscleGroups": ["fingers", "technique", "power"],
"measurementType": "moves",
"defaultSets": 5,
"defaultReps": "10-15 moves",
"defaultRest": 180,
"difficulty": "intermediate"
},
{
"id": "power-endurance-circuits",
"name": "Power Endurance Circuits",
"equipment": ["climbing-wall"],
"muscleGroups": ["full-body", "endurance"],
"measurementType": "time",
"defaultSets": 3,
"defaultDuration": "5min on/5min off",
"defaultRest": 300,
"difficulty": "advanced"
}
]
},
"strength": {
"label": "Climbing Strength",
"exercises": [
{
"id": "weighted-pull-ups",
"name": "Weighted Pull-ups",
"equipment": ["pull-up-bar", "weight-belt"],
"muscleGroups": ["back", "biceps"],
"measurementType": "reps",
"defaultSets": 4,
"defaultReps": "5-8",
"defaultRest": 180,
"difficulty": "advanced"
},
{
"id": "lock-offs",
"name": "Lock-off Holds",
"equipment": ["pull-up-bar"],
"muscleGroups": ["biceps", "back"],
"measurementType": "time",
"defaultSets": 3,
"defaultDuration": "5-15s",
"defaultRest": 120,
"difficulty": "intermediate"
},
{
"id": "frenchies",
"name": "Frenchies",
"equipment": ["pull-up-bar"],
"muscleGroups": ["back", "biceps", "endurance"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "5 cycles",
"defaultRest": 180,
"difficulty": "advanced"
},
{
"id": "typewriter-pull-ups",
"name": "Typewriter Pull-ups",
"equipment": ["pull-up-bar"],
"muscleGroups": ["back", "biceps", "core"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "5 each side",
"defaultRest": 120,
"difficulty": "advanced"
},
{
"id": "muscle-ups",
"name": "Muscle-ups",
"equipment": ["pull-up-bar"],
"muscleGroups": ["back", "chest", "triceps"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "3-5",
"defaultRest": 180,
"difficulty": "elite"
}
]
},
"core": {
"label": "Climbing Core",
"exercises": [
{
"id": "hanging-knee-raises",
"name": "Hanging Knee Raises",
"equipment": ["pull-up-bar"],
"muscleGroups": ["abs", "hip-flexors"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "15-20",
"defaultRest": 60,
"difficulty": "beginner"
},
{
"id": "toes-to-bar",
"name": "Toes to Bar",
"equipment": ["pull-up-bar"],
"muscleGroups": ["abs", "hip-flexors"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "10-15",
"defaultRest": 90,
"difficulty": "intermediate"
},
{
"id": "front-lever",
"name": "Front Lever Progressions",
"equipment": ["pull-up-bar"],
"muscleGroups": ["core", "back", "shoulders"],
"measurementType": "time",
"defaultSets": 3,
"defaultDuration": "5-20s",
"defaultRest": 120,
"difficulty": "advanced"
},
{
"id": "windshield-wipers",
"name": "Windshield Wipers",
"equipment": ["pull-up-bar"],
"muscleGroups": ["obliques", "abs"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "5-10 each side",
"defaultRest": 90,
"difficulty": "advanced"
},
{
"id": "hollow-body-hold",
"name": "Hollow Body Hold",
"equipment": [],
"muscleGroups": ["core"],
"measurementType": "time",
"defaultSets": 3,
"defaultDuration": "30-60s",
"defaultRest": 60,
"difficulty": "beginner"
}
]
},
"antagonist": {
"label": "Antagonist Training",
"exercises": [
{
"id": "push-ups",
"name": "Push-ups",
"equipment": [],
"muscleGroups": ["chest", "triceps"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "15-25",
"defaultRest": 60,
"difficulty": "beginner"
},
{
"id": "ring-dips",
"name": "Ring Dips",
"equipment": ["gymnastic-rings"],
"muscleGroups": ["chest", "triceps"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "8-12",
"defaultRest": 90,
"difficulty": "intermediate"
},
{
"id": "reverse-wrist-curls",
"name": "Reverse Wrist Curls",
"equipment": ["dumbbells"],
"muscleGroups": ["forearm-extensors"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "15-20",
"defaultRest": 45,
"difficulty": "beginner"
},
{
"id": "finger-extensions",
"name": "Finger Extensions",
"equipment": ["rubber-band"],
"muscleGroups": ["finger-extensors"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "20-30",
"defaultRest": 30,
"difficulty": "beginner"
},
{
"id": "overhead-press",
"name": "Overhead Press",
"equipment": ["dumbbells"],
"muscleGroups": ["shoulders"],
"measurementType": "reps",
"defaultSets": 3,
"defaultReps": "10-12",
"defaultRest": 60,
"difficulty": "intermediate"
}
]
}
}
},
"running": {
"label": "Running",
"icon": "🏃",
"subcategories": {
"endurance": {
"label": "Endurance Runs",
"exercises": [
{
"id": "easy-run",
"name": "Easy Run",
"equipment": [],
"muscleGroups": ["cardiovascular", "legs"],
"measurementType": "time",
"defaultSets": 1,
"defaultDuration": "30-60min",
"pace": "conversational",
"difficulty": "beginner"
},
{
"id": "long-run",
"name": "Long Run",
"equipment": [],
"muscleGroups": ["cardiovascular", "legs"],
"measurementType": "time",
"defaultSets": 1,
"defaultDuration": "60-180min",
"pace": "easy to moderate",
"difficulty": "intermediate"
},
{
"id": "tempo-run",
"name": "Tempo Run",
"equipment": [],
"muscleGroups": ["cardiovascular", "legs"],
"measurementType": "time",
"defaultSets": 1,
"defaultDuration": "20-40min",
"pace": "comfortably hard",
"difficulty": "intermediate"
},
{
"id": "progression-run",
"name": "Progression Run",
"equipment": [],
"muscleGroups": ["cardiovascular", "legs"],
"measurementType": "time",
"defaultSets": 1,
"defaultDuration": "30-60min",
"pace": "easy to fast",
"difficulty": "advanced"
},
{
"id": "recovery-run",
"name": "Recovery Run",
"equipment": [],
"muscleGroups": ["cardiovascular", "legs"],
"measurementType": "time",
"defaultSets": 1,
"defaultDuration": "20-40min",
"pace": "very easy",
"difficulty": "beginner"
}
]
},
"speed": {
"label": "Speed Work",
"exercises": [
{
"id": "interval-400m",
"name": "400m Intervals",
"equipment": [],
"muscleGroups": ["cardiovascular", "legs"],
"measurementType": "intervals",
"defaultSets": 8,
"defaultReps": "400m",
"defaultRest": 90,
"pace": "5k pace",
"difficulty": "intermediate"
},
{
"id": "interval-800m",
"name": "800m Intervals",
"equipment": [],
"muscleGroups": ["cardiovascular", "legs"],
"measurementType": "intervals",
"defaultSets": 6,
"defaultReps": "800m",
"defaultRest": 120,
"pace": "5k pace",
"difficulty": "intermediate"
},
{
"id": "interval-1k",
"name": "1K Intervals",
"equipment": [],
"muscleGroups": ["cardiovascular", "legs"],
"measurementType": "intervals",
"defaultSets": 5,
"defaultReps": "1000m",
"defaultRest": 180,
"pace": "5k-10k pace",
"difficulty": "advanced"
},
{
"id": "fartlek",
"name": "Fartlek Training",
"equipment": [],
"muscleGroups": ["cardiovascular", "legs"],
"measurementType": "time",
"defaultSets": 1,
"defaultDuration": "30-45min",
"description": "Variable pace with random surges",
"difficulty": "intermediate"
},
{
"id": "hill-repeats",
"name": "Hill Repeats",
"equipment": [],
"muscleGroups": ["cardiovascular", "legs", "power"],
"measurementType": "intervals",
"defaultSets": 6,
"defaultDuration": "60-90s uphill",
"defaultRest": "jog down",
"difficulty": "intermediate"
},
{
"id": "sprints",
"name": "Sprint Intervals",
"equipment": [],
"muscleGroups": ["legs", "power"],
"measurementType": "intervals",
"defaultSets": 10,
"defaultDuration": "20-30s",
"defaultRest": 60,
"pace": "maximum",
"difficulty": "advanced"
}
]
},
"drills": {
"label": "Running Drills",
"exercises": [
{
"id": "high-knees",
"name": "High Knees",
"equipment": [],
"muscleGroups": ["hip-flexors", "calves"],
"measurementType": "time",
"defaultSets": 3,
"defaultDuration": "30s",
"defaultRest": 30,
"difficulty": "beginner"
},
{
"id": "butt-kicks",
"name": "Butt Kicks",
"equipment": [],
"muscleGroups": ["hamstrings", "calves"],
"measurementType": "time",
"defaultSets": 3,
"defaultDuration": "30s",
"defaultRest": 30,
"difficulty": "beginner"
},
{
"id": "a-skips",
"name": "A-Skips",
"equipment": [],
"muscleGroups": ["hip-flexors", "coordination"],
"measurementType": "distance",
"defaultSets": 3,
"defaultDistance": "30m",
"defaultRest": 45,
"difficulty": "intermediate"
},
{
"id": "b-skips",
"name": "B-Skips",
"equipment": [],
"muscleGroups": ["hamstrings", "coordination"],
"measurementType": "distance",
"defaultSets": 3,
"defaultDistance": "30m",
"defaultRest": 45,
"difficulty": "intermediate"
},
{
"id": "strides",
"name": "Strides",
"equipment": [],
"muscleGroups": ["legs", "form"],
"measurementType": "distance",
"defaultSets": 4,
"defaultDistance": "80-100m",
"pace": "85-90% effort",
"defaultRest": 60,
"difficulty": "beginner"
}
]
}
}
},
"yoga": {
"label": "Yoga & Flexibility",
"icon": "🧘",
"subcategories": {
"flows": {
"label": "Yoga Flows",
"exercises": [
{
"id": "sun-salutation-a",
"name": "Sun Salutation A",
"equipment": ["yoga-mat"],
"muscleGroups": ["full-body", "flexibility"],
"measurementType": "rounds",
"defaultSets": 5,
"defaultReps": "1 flow",
"defaultRest": 0,
"difficulty": "beginner"
},
{
"id": "sun-salutation-b",
"name": "Sun Salutation B",
"equipment": ["yoga-mat"],
"muscleGroups": ["full-body", "flexibility"],
"measurementType": "rounds",
"defaultSets": 5,
"defaultReps": "1 flow",
"defaultRest": 0,
"difficulty": "intermediate"
},
{
"id": "vinyasa-flow",
"name": "Vinyasa Flow",
"equipment": ["yoga-mat"],
"muscleGroups": ["full-body", "flexibility"],
"measurementType": "time",
"defaultSets": 1,
"defaultDuration": "30-60min",
"difficulty": "intermediate"
},
{
"id": "power-yoga",
"name": "Power Yoga",
"equipment": ["yoga-mat"],
"muscleGroups": ["full-body", "strength", "flexibility"],
"measurementType": "time",
"defaultSets": 1,
"defaultDuration": "45-75min",
"difficulty": "advanced"
},
{
"id": "yin-yoga",
"name": "Yin Yoga",
"equipment": ["yoga-mat", "blocks"],
"muscleGroups": ["flexibility", "relaxation"],
"measurementType": "time",
"defaultSets": 1,
"defaultDuration": "45-90min",
"difficulty": "beginner"
}
]
},
"stretches": {
"label": "Stretching",
"exercises": [
{
"id": "hamstring-stretch",
"name": "Hamstring Stretch",
"equipment": [],
"muscleGroups": ["hamstrings"],
"measurementType": "time",
"defaultSets": 2,
"defaultDuration": "30-60s each leg",
"defaultRest": 0,
"difficulty": "beginner"
},
{
"id": "hip-flexor-stretch",
"name": "Hip Flexor Stretch",
"equipment": [],
"muscleGroups": ["hip-flexors"],
"measurementType": "time",
"defaultSets": 2,
"defaultDuration": "30-60s each side",
"defaultRest": 0,
"difficulty": "beginner"
},
{
"id": "pigeon-pose",
"name": "Pigeon Pose",
"equipment": ["yoga-mat"],
"muscleGroups": ["hips", "glutes"],
"measurementType": "time",
"defaultSets": 2,
"defaultDuration": "60-90s each side",
"defaultRest": 0,
"difficulty": "intermediate"
},
{
"id": "shoulder-stretch",
"name": "Shoulder Stretch",
"equipment": [],
"muscleGroups": ["shoulders"],
"measurementType": "time",
"defaultSets": 2,
"defaultDuration": "30s each side",
"defaultRest": 0,
"difficulty": "beginner"
},
{
"id": "splits-progression",
"name": "Splits Progression",
"equipment": ["yoga-mat"],
"muscleGroups": ["hamstrings", "hip-flexors"],
"measurementType": "time",
"defaultSets": 3,
"defaultDuration": "60s",
"defaultRest": 30,
"difficulty": "advanced"
}
]
}
}
}
}
