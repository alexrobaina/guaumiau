export interface Exercise {
  id: string;
  name: string;
  equipment: string[];
  muscleGroups: string[];
  measurementType: 'reps' | 'time' | 'distance' | 'intervals' | 'rounds';
  defaultSets: number;
  defaultReps?: string;
  defaultDuration?: string;
  defaultDistance?: string;
  defaultRest: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  description?: string;
  notes?: string;
  isCustom?: boolean;
  createdBy?: string;
  createdAt?: string;
  // Specific to certain exercise types
  gripTypes?: string[];
  pocketTypes?: string[];
  intensityOptions?: string[];
  pace?: string;
}

export interface ExerciseCategory {
  label: string;
  icon: string;
  subcategories: Record<string, ExerciseSubcategory>;
}

export interface ExerciseSubcategory {
  label: string;
  exercises: Exercise[];
}

export interface ExerciseDatabase {
  exerciseCategories: Record<string, ExerciseCategory>;
  customExerciseTemplate: Partial<Exercise>;
}

export const exerciseDatabase: ExerciseDatabase = {
  exerciseCategories: {
    gym: {
      label: "Gym Training",
      icon: "🏋️",
      subcategories: {
        chest: {
          label: "Chest",
          exercises: [
            {
              id: "bench-press-barbell",
              name: "Barbell Bench Press",
              equipment: ["barbell", "bench"],
              muscleGroups: ["chest", "triceps", "shoulders"],
              measurementType: "reps",
              defaultSets: 4,
              defaultReps: "8-12",
              defaultRest: 90,
              difficulty: "intermediate"
            },
            {
              id: "bench-press-dumbbell",
              name: "Dumbbell Bench Press",
              equipment: ["dumbbells", "bench"],
              muscleGroups: ["chest", "triceps", "shoulders"],
              measurementType: "reps",
              defaultSets: 4,
              defaultReps: "8-12",
              defaultRest: 90,
              difficulty: "beginner"
            },
            {
              id: "incline-bench-press",
              name: "Incline Bench Press",
              equipment: ["barbell", "incline-bench"],
              muscleGroups: ["upper-chest", "shoulders"],
              measurementType: "reps",
              defaultSets: 4,
              defaultReps: "8-12",
              defaultRest: 90,
              difficulty: "intermediate"
            },
            {
              id: "chest-fly",
              name: "Chest Fly",
              equipment: ["dumbbells", "bench"],
              muscleGroups: ["chest"],
              measurementType: "reps",
              defaultSets: 3,
              defaultReps: "12-15",
              defaultRest: 60,
              difficulty: "beginner"
            },
            {
              id: "push-ups",
              name: "Push-ups",
              equipment: [],
              muscleGroups: ["chest", "triceps", "shoulders"],
              measurementType: "reps",
              defaultSets: 3,
              defaultReps: "max",
              defaultRest: 60,
              difficulty: "beginner"
            }
          ]
        },
        back: {
          label: "Back",
          exercises: [
            {
              id: "deadlift",
              name: "Deadlift",
              equipment: ["barbell"],
              muscleGroups: ["back", "glutes", "hamstrings"],
              measurementType: "reps",
              defaultSets: 4,
              defaultReps: "5-8",
              defaultRest: 180,
              difficulty: "advanced"
            },
            {
              id: "pull-ups",
              name: "Pull-ups",
              equipment: ["pull-up-bar"],
              muscleGroups: ["lats", "biceps"],
              measurementType: "reps",
              defaultSets: 4,
              defaultReps: "max",
              defaultRest: 90,
              difficulty: "intermediate"
            },
            {
              id: "lat-pulldown",
              name: "Lat Pulldown",
              equipment: ["cable-machine"],
              muscleGroups: ["lats", "biceps"],
              measurementType: "reps",
              defaultSets: 4,
              defaultReps: "10-12",
              defaultRest: 60,
              difficulty: "beginner"
            },
            {
              id: "barbell-row",
              name: "Barbell Row",
              equipment: ["barbell"],
              muscleGroups: ["mid-back", "lats", "biceps"],
              measurementType: "reps",
              defaultSets: 4,
              defaultReps: "8-12",
              defaultRest: 90,
              difficulty: "intermediate"
            }
          ]
        },
        legs: {
          label: "Legs",
          exercises: [
            {
              id: "squat",
              name: "Back Squat",
              equipment: ["barbell", "squat-rack"],
              muscleGroups: ["quads", "glutes", "hamstrings"],
              measurementType: "reps",
              defaultSets: 4,
              defaultReps: "8-12",
              defaultRest: 120,
              difficulty: "intermediate"
            },
            {
              id: "front-squat",
              name: "Front Squat",
              equipment: ["barbell", "squat-rack"],
              muscleGroups: ["quads", "core"],
              measurementType: "reps",
              defaultSets: 4,
              defaultReps: "8-12",
              defaultRest: 120,
              difficulty: "advanced"
            },
            {
              id: "leg-press",
              name: "Leg Press",
              equipment: ["leg-press-machine"],
              muscleGroups: ["quads", "glutes"],
              measurementType: "reps",
              defaultSets: 4,
              defaultReps: "12-15",
              defaultRest: 90,
              difficulty: "beginner"
            },
            {
              id: "lunges",
              name: "Walking Lunges",
              equipment: ["dumbbells"],
              muscleGroups: ["quads", "glutes", "hamstrings"],
              measurementType: "reps",
              defaultSets: 3,
              defaultReps: "10 each leg",
              defaultRest: 60,
              difficulty: "intermediate"
            }
          ]
        },
        shoulders: {
          label: "Shoulders",
          exercises: [
            {
              id: "overhead-press",
              name: "Overhead Press",
              equipment: ["barbell"],
              muscleGroups: ["shoulders", "triceps"],
              measurementType: "reps",
              defaultSets: 4,
              defaultReps: "8-10",
              defaultRest: 90,
              difficulty: "intermediate"
            },
            {
              id: "dumbbell-shoulder-press",
              name: "Dumbbell Shoulder Press",
              equipment: ["dumbbells"],
              muscleGroups: ["shoulders", "triceps"],
              measurementType: "reps",
              defaultSets: 4,
              defaultReps: "10-12",
              defaultRest: 60,
              difficulty: "beginner"
            },
            {
              id: "lateral-raises",
              name: "Lateral Raises",
              equipment: ["dumbbells"],
              muscleGroups: ["lateral-delts"],
              measurementType: "reps",
              defaultSets: 3,
              defaultReps: "12-15",
              defaultRest: 45,
              difficulty: "beginner"
            }
          ]
        },
        arms: {
          label: "Arms",
          exercises: [
            {
              id: "barbell-curl",
              name: "Barbell Curl",
              equipment: ["barbell"],
              muscleGroups: ["biceps"],
              measurementType: "reps",
              defaultSets: 3,
              defaultReps: "10-12",
              defaultRest: 60,
              difficulty: "beginner"
            },
            {
              id: "hammer-curl",
              name: "Hammer Curl",
              equipment: ["dumbbells"],
              muscleGroups: ["biceps", "forearms"],
              measurementType: "reps",
              defaultSets: 3,
              defaultReps: "10-12",
              defaultRest: 60,
              difficulty: "beginner"
            },
            {
              id: "tricep-pushdown",
              name: "Tricep Pushdown",
              equipment: ["cable-machine"],
              muscleGroups: ["triceps"],
              measurementType: "reps",
              defaultSets: 3,
              defaultReps: "12-15",
              defaultRest: 45,
              difficulty: "beginner"
            }
          ]
        },
        core: {
          label: "Core",
          exercises: [
            {
              id: "plank",
              name: "Plank",
              equipment: [],
              muscleGroups: ["core"],
              measurementType: "time",
              defaultSets: 3,
              defaultDuration: "30-60s",
              defaultRest: 60,
              difficulty: "beginner"
            },
            {
              id: "side-plank",
              name: "Side Plank",
              equipment: [],
              muscleGroups: ["obliques"],
              measurementType: "time",
              defaultSets: 3,
              defaultDuration: "30s each side",
              defaultRest: 45,
              difficulty: "intermediate"
            },
            {
              id: "crunches",
              name: "Crunches",
              equipment: [],
              muscleGroups: ["abs"],
              measurementType: "reps",
              defaultSets: 3,
              defaultReps: "20-30",
              defaultRest: 45,
              difficulty: "beginner"
            }
          ]
        }
      }
    },
    climbing: {
      label: "Climbing Training",
      icon: "🧗",
      subcategories: {
        fingerboard: {
          label: "Fingerboard",
          exercises: [
            {
              id: "max-hangs-20mm",
              name: "Max Hangs - 20mm Edge",
              equipment: ["hangboard"],
              muscleGroups: ["fingers", "forearms"],
              measurementType: "time",
              defaultSets: 5,
              defaultDuration: "10s",
              defaultRest: 180,
              difficulty: "advanced",
              gripTypes: ["half-crimp", "open-hand"]
            },
            {
              id: "repeaters-7-3",
              name: "Repeaters (7/3)",
              equipment: ["hangboard"],
              muscleGroups: ["fingers", "forearms"],
              measurementType: "intervals",
              defaultSets: 6,
              defaultDuration: "7s on/3s off x6",
              defaultRest: 120,
              difficulty: "intermediate"
            },
            {
              id: "density-hangs",
              name: "Density Hangs",
              equipment: ["hangboard"],
              muscleGroups: ["fingers", "forearms"],
              measurementType: "time",
              defaultSets: 10,
              defaultDuration: "10s",
              defaultRest: 10,
              difficulty: "intermediate"
            }
          ]
        },
        campus: {
          label: "Campus Board",
          exercises: [
            {
              id: "campus-ladder",
              name: "Campus Ladder",
              equipment: ["campus-board"],
              muscleGroups: ["fingers", "arms", "back"],
              measurementType: "reps",
              defaultSets: 5,
              defaultReps: "1-4-7",
              defaultRest: 180,
              difficulty: "advanced"
            },
            {
              id: "campus-doubles",
              name: "Campus Doubles",
              equipment: ["campus-board"],
              muscleGroups: ["fingers", "arms", "power"],
              measurementType: "reps",
              defaultSets: 5,
              defaultReps: "1-3-5-7",
              defaultRest: 180,
              difficulty: "elite"
            }
          ]
        },
        bouldering: {
          label: "Bouldering",
          exercises: [
            {
              id: "boulder-4x4",
              name: "4x4 Boulders",
              equipment: ["climbing-wall"],
              muscleGroups: ["full-body"],
              measurementType: "rounds",
              defaultSets: 4,
              defaultReps: "4 problems",
              defaultRest: 240,
              difficulty: "intermediate",
              description: "Climb 4 problems 4 times with minimal rest"
            },
            {
              id: "limit-bouldering",
              name: "Limit Bouldering",
              equipment: ["climbing-wall"],
              muscleGroups: ["full-body", "technique"],
              measurementType: "reps",
              defaultSets: 5,
              defaultReps: "3-5 attempts",
              defaultRest: 300,
              difficulty: "advanced",
              description: "Work at maximum difficulty"
            }
          ]
        },
        strength: {
          label: "Climbing Strength",
          exercises: [
            {
              id: "weighted-pull-ups",
              name: "Weighted Pull-ups",
              equipment: ["pull-up-bar", "weight-belt"],
              muscleGroups: ["back", "biceps"],
              measurementType: "reps",
              defaultSets: 4,
              defaultReps: "5-8",
              defaultRest: 180,
              difficulty: "advanced"
            },
            {
              id: "lock-offs",
              name: "Lock-off Holds",
              equipment: ["pull-up-bar"],
              muscleGroups: ["biceps", "back"],
              measurementType: "time",
              defaultSets: 3,
              defaultDuration: "5-15s",
              defaultRest: 120,
              difficulty: "intermediate"
            }
          ]
        },
        core: {
          label: "Climbing Core",
          exercises: [
            {
              id: "hanging-knee-raises",
              name: "Hanging Knee Raises",
              equipment: ["pull-up-bar"],
              muscleGroups: ["abs", "hip-flexors"],
              measurementType: "reps",
              defaultSets: 3,
              defaultReps: "15-20",
              defaultRest: 60,
              difficulty: "beginner"
            },
            {
              id: "toes-to-bar",
              name: "Toes to Bar",
              equipment: ["pull-up-bar"],
              muscleGroups: ["abs", "hip-flexors"],
              measurementType: "reps",
              defaultSets: 3,
              defaultReps: "10-15",
              defaultRest: 90,
              difficulty: "intermediate"
            }
          ]
        }
      }
    },
    running: {
      label: "Running",
      icon: "🏃",
      subcategories: {
        endurance: {
          label: "Endurance Runs",
          exercises: [
            {
              id: "easy-run",
              name: "Easy Run",
              equipment: [],
              muscleGroups: ["cardiovascular", "legs"],
              measurementType: "time",
              defaultSets: 1,
              defaultDuration: "30-60min",
              defaultRest: 0,
              pace: "conversational",
              difficulty: "beginner"
            },
            {
              id: "long-run",
              name: "Long Run",
              equipment: [],
              muscleGroups: ["cardiovascular", "legs"],
              measurementType: "time",
              defaultSets: 1,
              defaultDuration: "60-180min",
              defaultRest: 0,
              pace: "easy to moderate",
              difficulty: "intermediate"
            },
            {
              id: "tempo-run",
              name: "Tempo Run",
              equipment: [],
              muscleGroups: ["cardiovascular", "legs"],
              measurementType: "time",
              defaultSets: 1,
              defaultDuration: "20-40min",
              defaultRest: 0,
              pace: "comfortably hard",
              difficulty: "intermediate"
            }
          ]
        },
        speed: {
          label: "Speed Work",
          exercises: [
            {
              id: "interval-400m",
              name: "400m Intervals",
              equipment: [],
              muscleGroups: ["cardiovascular", "legs"],
              measurementType: "intervals",
              defaultSets: 8,
              defaultReps: "400m",
              defaultRest: 90,
              pace: "5k pace",
              difficulty: "intermediate"
            },
            {
              id: "hill-repeats",
              name: "Hill Repeats",
              equipment: [],
              muscleGroups: ["cardiovascular", "legs", "power"],
              measurementType: "intervals",
              defaultSets: 6,
              defaultDuration: "60-90s uphill",
              defaultRest: 120,
              difficulty: "intermediate"
            }
          ]
        },
        drills: {
          label: "Running Drills",
          exercises: [
            {
              id: "high-knees",
              name: "High Knees",
              equipment: [],
              muscleGroups: ["hip-flexors", "calves"],
              measurementType: "time",
              defaultSets: 3,
              defaultDuration: "30s",
              defaultRest: 30,
              difficulty: "beginner"
            },
            {
              id: "strides",
              name: "Strides",
              equipment: [],
              muscleGroups: ["legs", "form"],
              measurementType: "distance",
              defaultSets: 4,
              defaultDistance: "80-100m",
              pace: "85-90% effort",
              defaultRest: 60,
              difficulty: "beginner"
            }
          ]
        }
      }
    },
    yoga: {
      label: "Yoga & Flexibility",
      icon: "🧘",
      subcategories: {
        flows: {
          label: "Yoga Flows",
          exercises: [
            {
              id: "sun-salutation-a",
              name: "Sun Salutation A",
              equipment: ["yoga-mat"],
              muscleGroups: ["full-body", "flexibility"],
              measurementType: "rounds",
              defaultSets: 5,
              defaultReps: "1 flow",
              defaultRest: 0,
              difficulty: "beginner"
            },
            {
              id: "vinyasa-flow",
              name: "Vinyasa Flow",
              equipment: ["yoga-mat"],
              muscleGroups: ["full-body", "flexibility"],
              measurementType: "time",
              defaultSets: 1,
              defaultDuration: "30-60min",
              defaultRest: 0,
              difficulty: "intermediate"
            },
            {
              id: "yin-yoga",
              name: "Yin Yoga",
              equipment: ["yoga-mat", "blocks"],
              muscleGroups: ["flexibility", "relaxation"],
              measurementType: "time",
              defaultSets: 1,
              defaultDuration: "45-90min",
              defaultRest: 0,
              difficulty: "beginner"
            }
          ]
        },
        stretches: {
          label: "Stretching",
          exercises: [
            {
              id: "hamstring-stretch",
              name: "Hamstring Stretch",
              equipment: [],
              muscleGroups: ["hamstrings"],
              measurementType: "time",
              defaultSets: 2,
              defaultDuration: "30-60s each leg",
              defaultRest: 0,
              difficulty: "beginner"
            },
            {
              id: "hip-flexor-stretch",
              name: "Hip Flexor Stretch",
              equipment: [],
              muscleGroups: ["hip-flexors"],
              measurementType: "time",
              defaultSets: 2,
              defaultDuration: "30-60s each side",
              defaultRest: 0,
              difficulty: "beginner"
            },
            {
              id: "pigeon-pose",
              name: "Pigeon Pose",
              equipment: ["yoga-mat"],
              muscleGroups: ["hips", "glutes"],
              measurementType: "time",
              defaultSets: 2,
              defaultDuration: "60-90s each side",
              defaultRest: 0,
              difficulty: "intermediate"
            }
          ]
        }
      }
    }
  },
  customExerciseTemplate: {
    id: "",
    name: "",
    equipment: [],
    muscleGroups: [],
    measurementType: "reps",
    defaultSets: 3,
    defaultReps: "",
    defaultDuration: "",
    defaultDistance: "",
    defaultRest: 60,
    difficulty: "beginner",
    description: "",
    notes: "",
    isCustom: true
  }
};