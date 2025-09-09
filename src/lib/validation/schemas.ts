import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export const registerSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and number'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export const workoutSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, 'Workout name must be at least 3 characters')
    .max(50, 'Workout name must be less than 50 characters')
    .required('Workout name is required'),
  description: yup
    .string()
    .max(500, 'Description must be less than 500 characters'),
  difficulty: yup
    .string()
    .oneOf(['beginner', 'intermediate', 'advanced', 'elite'])
    .required('Difficulty is required'),
  duration: yup
    .number()
    .min(5, 'Duration must be at least 5 minutes')
    .max(180, 'Duration must be less than 3 hours')
    .required('Duration is required'),
  exercises: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required('Exercise name is required'),
        sets: yup.number().min(1).max(10),
        reps: yup.number().min(1).max(100),
        duration: yup.number().min(1).max(600),
        rest: yup.number().min(0).max(600),
      })
    )
    .min(1, 'At least one exercise is required'),
});

export const profileSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  experience: yup
    .string()
    .oneOf(['beginner', 'intermediate', 'advanced', 'elite'])
    .required('Experience level is required'),
  preferredStyle: yup
    .string()
    .oneOf(['boulder', 'sport', 'trad', 'all'])
    .required('Preferred style is required'),
  currentGrade: yup.object().shape({
    boulder: yup.string().required('Boulder grade is required'),
    sport: yup.string().required('Sport grade is required'),
  }),
  goals: yup.array().of(yup.string()).min(1, 'At least one goal is required'),
  trainingAvailability: yup.object().shape({
    daysPerWeek: yup
      .number()
      .min(1, 'At least 1 day per week')
      .max(7, 'Maximum 7 days per week')
      .required('Days per week is required'),
    hoursPerSession: yup
      .number()
      .min(0.5, 'At least 30 minutes per session')
      .max(4, 'Maximum 4 hours per session')
      .required('Hours per session is required'),
  }),
});
