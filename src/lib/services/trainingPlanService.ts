import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Exercise } from '@/lib/data/exerciseDatabase';
import { DayCompletion, TrainingPlanProgress } from './workoutProgressService';

export interface DayExercise {
  exerciseId?: string;
  exercise: Exercise;
  sets: number;
  reps?: string;
  duration?: string;
  distance?: string;
  weight?: string;
  rest: number;
  rpe?: number;
  intensity?: string;
  notes?: string;
  customParameters?: Record<string, any>;
}

export interface TrainingDay {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  name: string;
  exercises: DayExercise[];
  isRestDay: boolean;
  notes?: string;
  // Progress tracking fields
  completions?: DayCompletion[];
  lastCompleted?: Timestamp;
  timesCompleted?: number;
}

export interface TrainingPlan {
  id?: string;
  userId: string;
  name: string;
  description?: string;
  duration: number; // weeks
  daysPerWeek: number;
  trainingDays: TrainingDay[];
  goals: string[];
  targetLevel: string;
  equipment: string[];
  status: 'draft' | 'active' | 'completed' | 'paused';
  isArchived: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  startDate?: Timestamp;
  endDate?: Timestamp;
  completedAt?: Timestamp;
  isTemplate: boolean;
  templateCategory?: string;
  createdBy?: string;
  createdByName?: string; // Name of the user who created the template
  tags?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  sharedWith?: string[]; // Array of user IDs who have access to this template
  // Progress tracking fields
  progress?: TrainingPlanProgress;
}

export interface CustomExercise extends Exercise {
  userId: string;
  isCustom: true;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export class TrainingPlanService {
  private static trainingPlansCollection = 'training_plans';
  private static customExercisesCollection = 'custom_exercises';

  // Helper function to remove undefined values from objects
  private static cleanFirebaseData(obj: any): any {
    if (obj === null || obj === undefined) {
      return null;
    }

    if (Array.isArray(obj)) {
      return obj.map(this.cleanFirebaseData.bind(this));
    }

    if (typeof obj === 'object') {
      const cleaned: any = {};
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (value !== undefined) {
          cleaned[key] = this.cleanFirebaseData(value);
        }
      });
      return cleaned;
    }

    return obj;
  }

  // Training Plan CRUD Operations
  static async createTrainingPlan(planData: Omit<TrainingPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const plan: Omit<TrainingPlan, 'id'> = {
        ...planData,
        isArchived: false, // Default to not archived
        createdAt: now,
        updatedAt: now,
      };

      // Clean undefined values before sending to Firebase
      const cleanPlan = this.cleanFirebaseData(plan);
      const docRef = await addDoc(collection(db, this.trainingPlansCollection), cleanPlan);
      console.log('✅ Training plan created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creating training plan:', error);
      throw error;
    }
  }

  static async getTrainingPlan(planId: string): Promise<TrainingPlan | null> {
    try {
      const docRef = doc(db, this.trainingPlansCollection, planId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as TrainingPlan;
      } else {
        console.log('❌ No training plan found with ID:', planId);
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting training plan:', error);
      throw error;
    }
  }

  static async getUserTrainingPlans(userId: string): Promise<TrainingPlan[]> {
    try {
      console.log('🔍 Fetching training plans for userId:', userId);

      // First, try with orderBy
      let q = query(
        collection(db, this.trainingPlansCollection),
        where('userId', '==', userId),
        where('isArchived', '==', false),
        orderBy('updatedAt', 'desc')
      );

      let querySnapshot;
      try {
        querySnapshot = await getDocs(q);
      } catch (orderError) {
        console.log('⚠️ OrderBy failed, trying without orderBy:', orderError);
        // If orderBy fails (likely due to missing index), try without it
        q = query(
          collection(db, this.trainingPlansCollection),
          where('userId', '==', userId),
          where('isArchived', '==', false)
        );
        querySnapshot = await getDocs(q);
      }

      const plans: TrainingPlan[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('📄 Found training plan document:', { id: doc.id, name: data.name, status: data.status, isArchived: data.isArchived });
        plans.push({ id: doc.id, ...data } as TrainingPlan);
      });

      // Sort manually if we couldn't use orderBy
      plans.sort((a, b) => {
        const aTime = a.updatedAt?.toMillis?.() || a.createdAt?.toMillis?.() || 0;
        const bTime = b.updatedAt?.toMillis?.() || b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });

      console.log('✅ Retrieved training plans for user:', userId, 'Count:', plans.length);
      return plans;
    } catch (error) {
      console.error('❌ Error getting user training plans:', error);
      // Return empty array instead of throwing to prevent UI crash
      console.log('🔧 Returning empty array due to error');
      return [];
    }
  }

  static async updateTrainingPlan(planId: string, updates: Partial<TrainingPlan>): Promise<void> {
    try {
      const docRef = doc(db, this.trainingPlansCollection, planId);
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(docRef, updateData);
      console.log('✅ Training plan updated:', planId);
    } catch (error) {
      console.error('❌ Error updating training plan:', error);
      throw error;
    }
  }

  static async archiveTrainingPlan(planId: string): Promise<void> {
    try {
      const docRef = doc(db, this.trainingPlansCollection, planId);
      await updateDoc(docRef, {
        isArchived: true,
        updatedAt: Timestamp.now(),
      });
      console.log('✅ Training plan archived:', planId);
    } catch (error) {
      console.error('❌ Error archiving training plan:', error);
      throw error;
    }
  }

  static async deleteTrainingPlan(planId: string): Promise<void> {
    try {
      const docRef = doc(db, this.trainingPlansCollection, planId);
      await deleteDoc(docRef);
      console.log('✅ Training plan deleted:', planId);
    } catch (error) {
      console.error('❌ Error deleting training plan:', error);
      throw error;
    }
  }

  static async getTrainingPlanTemplates(): Promise<TrainingPlan[]> {
    try {
      console.log('🔍 Fetching training plan templates');

      // Query only for templates (without orderBy to avoid composite index requirement)
      const q = query(
        collection(db, this.trainingPlansCollection),
        where('isTemplate', '==', true)
      );

      const querySnapshot = await getDocs(q);

      const templates: TrainingPlan[] = [];
      querySnapshot.forEach((doc) => {
        templates.push({ id: doc.id, ...doc.data() } as TrainingPlan);
      });

      // Sort by createdAt in JavaScript
      templates.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });

      console.log('✅ Retrieved training plan templates:', {
        templates: templates.length,
        templateNames: templates.map(t => t.name)
      });
      return templates;
    } catch (error) {
      console.error('❌ Error getting training plan templates:', error);
      throw error;
    }
  }

  // Get templates shared with a specific user
  static async getSharedTemplates(userId: string): Promise<TrainingPlan[]> {
    try {
      console.log('🔍 Fetching shared templates for user:', userId);

      // Query templates where the user is in the sharedWith array
      const q = query(
        collection(db, this.trainingPlansCollection),
        where('isTemplate', '==', true),
        where('sharedWith', 'array-contains', userId)
      );

      const querySnapshot = await getDocs(q);

      const templates: TrainingPlan[] = [];
      querySnapshot.forEach((doc) => {
        templates.push({ id: doc.id, ...doc.data() } as TrainingPlan);
      });

      // Sort by createdAt in JavaScript
      templates.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });

      console.log('✅ Retrieved shared templates:', templates.length);
      return templates;
    } catch (error) {
      console.error('❌ Error getting shared templates:', error);
      throw error;
    }
  }

  // Add a user to the sharedWith array of a template
  static async addUserToSharedTemplate(templateId: string, userId: string): Promise<void> {
    try {
      console.log('👥 Adding user to shared template:', { templateId, userId });

      const template = await this.getTrainingPlan(templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      if (!template.isTemplate) {
        throw new Error('This is not a template');
      }

      // Check if user is already in sharedWith array
      const sharedWith = template.sharedWith || [];
      if (sharedWith.includes(userId)) {
        console.log('ℹ️ User already has access to this template');
        return;
      }

      // Add user to sharedWith array
      const docRef = doc(db, this.trainingPlansCollection, templateId);
      await updateDoc(docRef, {
        sharedWith: [...sharedWith, userId],
        updatedAt: Timestamp.now(),
      });

      console.log('✅ User added to shared template successfully');
    } catch (error) {
      console.error('❌ Error adding user to shared template:', error);
      throw error;
    }
  }

  // Custom Exercise CRUD Operations
  static async createCustomExercise(exerciseData: Omit<CustomExercise, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const exercise: Omit<CustomExercise, 'id'> = {
        ...exerciseData,
        isCustom: true,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, this.customExercisesCollection), exercise);
      console.log('✅ Custom exercise created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creating custom exercise:', error);
      throw error;
    }
  }

  static async getUserCustomExercises(userId: string): Promise<CustomExercise[]> {
    try {
      // Query without orderBy to avoid composite index requirement
      const q = query(
        collection(db, this.customExercisesCollection),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      const exercises: CustomExercise[] = [];

      querySnapshot.forEach((doc) => {
        exercises.push({ id: doc.id, ...doc.data() } as CustomExercise);
      });

      // Sort in JavaScript instead of Firestore
      exercises.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime; // desc
      });

      console.log('✅ Retrieved custom exercises for user:', userId, exercises.length);
      return exercises;
    } catch (error) {
      console.error('❌ Error getting user custom exercises:', error);
      throw error;
    }
  }

  static async updateCustomExercise(exerciseId: string, updates: Partial<CustomExercise>): Promise<void> {
    try {
      const docRef = doc(db, this.customExercisesCollection, exerciseId);
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(docRef, updateData);
      console.log('✅ Custom exercise updated:', exerciseId);
    } catch (error) {
      console.error('❌ Error updating custom exercise:', error);
      throw error;
    }
  }

  static async deleteCustomExercise(exerciseId: string): Promise<void> {
    try {
      const docRef = doc(db, this.customExercisesCollection, exerciseId);
      await deleteDoc(docRef);
      console.log('✅ Custom exercise deleted:', exerciseId);
    } catch (error) {
      console.error('❌ Error deleting custom exercise:', error);
      throw error;
    }
  }

  // Utility methods
  static async duplicateTrainingPlan(planId: string, userId: string, newName?: string): Promise<string> {
    try {
      const originalPlan = await this.getTrainingPlan(planId);
      if (!originalPlan) {
        throw new Error('Training plan not found');
      }

      const duplicatedPlan = {
        ...originalPlan,
        userId,
        name: newName || `${originalPlan.name} (Copy)`,
        status: 'draft' as const,
        isTemplate: false,
        isArchived: false,
      };

      // Remove the original ID and timestamps
      delete duplicatedPlan.id;
      delete duplicatedPlan.createdAt;
      delete duplicatedPlan.updatedAt;

      return await this.createTrainingPlan(duplicatedPlan);
    } catch (error) {
      console.error('❌ Error duplicating training plan:', error);
      throw error;
    }
  }

  // Create a new training plan from a template
  static async createPlanFromTemplate(templateId: string, userId: string, customName?: string): Promise<string> {
    try {
      console.log('📋 Creating training plan from template:', templateId);

      const template = await this.getTrainingPlan(templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      if (!template.isTemplate) {
        throw new Error('This is not a template');
      }

      const now = Timestamp.now();
      const totalDays = template.duration * template.daysPerWeek;

      // Create new plan from template with user's data
      const newPlan = {
        ...template,
        userId,
        name: customName || template.name,
        status: 'draft' as const,
        isTemplate: false,
        isArchived: false,
        startDate: undefined,
        endDate: undefined,
        completedAt: undefined,
        progress: {
          completedDays: 0,
          totalDays,
          completedWorkouts: [],
          currentWeek: 1,
          streakDays: 0,
          totalVolume: 0,
          totalExercises: 0,
          completionRate: 0
        } as TrainingPlanProgress,
      };

      // Remove the original template ID and timestamps
      delete (newPlan as any).id;
      delete (newPlan as any).createdAt;
      delete (newPlan as any).updatedAt;

      const newPlanId = await this.createTrainingPlan(newPlan);
      console.log('✅ Training plan created from template:', newPlanId);
      return newPlanId;
    } catch (error) {
      console.error('❌ Error creating plan from template:', error);
      throw error;
    }
  }

  static async activateTrainingPlan(planId: string): Promise<void> {
    try {
      const plan = await this.getTrainingPlan(planId);
      if (!plan) {
        throw new Error('Training plan not found');
      }

      // Initialize progress tracking
      const initialProgress: TrainingPlanProgress = {
        completedDays: 0,
        totalDays: plan.duration * plan.daysPerWeek,
        completedWorkouts: [],
        currentWeek: 1,
        streakDays: 0,
        totalVolume: 0,
        totalExercises: 0,
        completionRate: 0
      };

      await this.updateTrainingPlan(planId, {
        status: 'active',
        startDate: Timestamp.now(),
        progress: initialProgress
      });
      console.log('✅ Training plan activated:', planId);
    } catch (error) {
      console.error('❌ Error activating training plan:', error);
      throw error;
    }
  }

  static async completeTrainingPlan(planId: string): Promise<void> {
    try {
      await this.updateTrainingPlan(planId, {
        status: 'completed',
        endDate: Timestamp.now(),
      });
      console.log('✅ Training plan completed:', planId);
    } catch (error) {
      console.error('❌ Error completing training plan:', error);
      throw error;
    }
  }

  // Get training plan progress
  static async getTrainingPlanProgress(planId: string): Promise<TrainingPlanProgress | null> {
    try {
      const plan = await this.getTrainingPlan(planId);
      if (!plan || !plan.progress) {
        return null;
      }
      return plan.progress;
    } catch (error) {
      console.error('❌ Error getting training plan progress:', error);
      throw error;
    }
  }

  // Update completion rate for existing plans without progress data
  static async updatePlanCompletionRate(planId: string): Promise<void> {
    try {
      const plan = await this.getTrainingPlan(planId);
      if (!plan) {
        throw new Error('Training plan not found');
      }

      const totalDays = plan.duration * plan.daysPerWeek;
      const completedDays = plan.progress?.completedDays || 0;
      const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

      // Update the plan with calculated progress if it doesn't exist
      if (!plan.progress) {
        const initialProgress: TrainingPlanProgress = {
          completedDays: 0,
          totalDays,
          completedWorkouts: [],
          currentWeek: 1,
          streakDays: 0,
          totalVolume: 0,
          totalExercises: 0,
          completionRate: 0
        };

        await this.updateTrainingPlan(planId, {
          progress: initialProgress
        });
      } else {
        const updates: any = {};
        updates['progress.completionRate'] = completionRate;
        updates['progress.totalDays'] = totalDays;

        await updateDoc(doc(db, this.trainingPlansCollection, planId), {
          ...updates,
          updatedAt: Timestamp.now(),
        });
      }

      console.log('✅ Plan completion rate updated:', planId, completionRate);
    } catch (error) {
      console.error('❌ Error updating plan completion rate:', error);
      throw error;
    }
  }

  // Batch update all user plans to ensure they have progress data
  static async initializeProgressForAllPlans(userId: string): Promise<void> {
    try {
      const plans = await this.getUserTrainingPlans(userId);

      for (const plan of plans) {
        if (!plan.progress && plan.id) {
          const totalDays = plan.duration * plan.daysPerWeek;
          const initialProgress: TrainingPlanProgress = {
            completedDays: 0,
            totalDays,
            completedWorkouts: [],
            currentWeek: 1,
            streakDays: 0,
            totalVolume: 0,
            totalExercises: 0,
            completionRate: 0
          };

          await this.updateTrainingPlan(plan.id, {
            progress: initialProgress
          });
        }
      }

      console.log('✅ Progress initialized for all plans for user:', userId);
    } catch (error) {
      console.error('❌ Error initializing progress for all plans:', error);
      throw error;
    }
  }

  // Restart a completed training plan for a new cycle
  static async restartTrainingPlan(planId: string, userId: string): Promise<string> {
    try {
      console.log('🔄 Restarting training plan:', planId);

      const originalPlan = await this.getTrainingPlan(planId);
      if (!originalPlan) {
        throw new Error('Training plan not found');
      }

      // Ensure user owns this plan
      if (originalPlan.userId !== userId) {
        throw new Error('Unauthorized to restart this plan');
      }

      const now = Timestamp.now();
      const totalDays = originalPlan.duration * originalPlan.daysPerWeek;

      // Reset the plan progress for the new cycle
      const resetProgress: TrainingPlanProgress = {
        completedDays: 0,
        totalDays,
        completedWorkouts: [],
        currentWeek: 1,
        streakDays: 0,
        totalVolume: 0,
        totalExercises: 0,
        completionRate: 0
      };

      // Update the existing plan
      await this.updateTrainingPlan(planId, {
        status: 'active',
        startDate: now,
        endDate: undefined,
        completedAt: undefined,
        progress: resetProgress,
        updatedAt: now
      });

      console.log('✅ Training plan restarted successfully:', planId);
      return planId;
    } catch (error) {
      console.error('❌ Error restarting training plan:', error);
      throw error;
    }
  }

  // Create a copy of completed plan for new cycle (alternative approach)
  static async createNewCycleFromPlan(planId: string, userId: string, cycleName?: string): Promise<string> {
    try {
      console.log('🔄 Creating new cycle from plan:', planId);

      const originalPlan = await this.getTrainingPlan(planId);
      if (!originalPlan) {
        throw new Error('Training plan not found');
      }

      // Ensure user owns this plan
      if (originalPlan.userId !== userId) {
        throw new Error('Unauthorized to copy this plan');
      }

      // Create a new plan based on the original
      const now = Timestamp.now();
      const cycleNumber = await this.getPlanCycleCount(planId, userId) + 1;
      const newPlanName = cycleName || `${originalPlan.name} (Cycle ${cycleNumber})`;

      const newPlan = {
        ...originalPlan,
        name: newPlanName,
        status: 'active' as const,
        startDate: now,
        progress: {
          completedDays: 0,
          totalDays: originalPlan.duration * originalPlan.daysPerWeek,
          completedWorkouts: [],
          currentWeek: 1,
          streakDays: 0,
          totalVolume: 0,
          totalExercises: 0,
          completionRate: 0
        } as TrainingPlanProgress,
        // Add cycle metadata
        originalPlanId: planId,
        cycleNumber,
        isTemplate: false,
        isArchived: false
      };

      // Remove fields that shouldn't be copied
      delete (newPlan as any).id;
      delete (newPlan as any).createdAt;
      delete (newPlan as any).updatedAt;
      delete (newPlan as any).endDate;
      delete (newPlan as any).completedAt;

      const newPlanId = await this.createTrainingPlan(newPlan);
      console.log('✅ New cycle created with ID:', newPlanId);
      return newPlanId;
    } catch (error) {
      console.error('❌ Error creating new cycle:', error);
      throw error;
    }
  }

  // Get the number of cycles for a plan
  static async getPlanCycleCount(originalPlanId: string, userId: string): Promise<number> {
    try {
      const plans = await this.getUserTrainingPlans(userId);
      const cycles = plans.filter(plan =>
        (plan as any).originalPlanId === originalPlanId || plan.id === originalPlanId
      );
      return cycles.length;
    } catch (error) {
      console.error('❌ Error getting plan cycle count:', error);
      return 0;
    }
  }

  // Get all cycles of a plan
  static async getPlanCycles(originalPlanId: string, userId: string): Promise<TrainingPlan[]> {
    try {
      const plans = await this.getUserTrainingPlans(userId);
      const cycles = plans.filter(plan =>
        (plan as any).originalPlanId === originalPlanId || plan.id === originalPlanId
      );

      // Sort by creation date
      return cycles.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return aTime - bTime;
      });
    } catch (error) {
      console.error('❌ Error getting plan cycles:', error);
      return [];
    }
  }

  // Repeat a completed training plan (create a new active copy)
  static async repeatTrainingPlan(planId: string, userId: string): Promise<string> {
    try {
      console.log('🔄 Repeating training plan:', planId);

      const originalPlan = await this.getTrainingPlan(planId);
      if (!originalPlan) {
        throw new Error('Training plan not found');
      }

      // Ensure user owns this plan
      if (originalPlan.userId !== userId) {
        throw new Error('Unauthorized to repeat this plan');
      }

      // Ensure the plan is completed
      if (originalPlan.status !== 'completed') {
        throw new Error('Only completed plans can be repeated');
      }

      const now = Timestamp.now();
      const totalDays = originalPlan.duration * originalPlan.daysPerWeek;

      // Create a new active copy of the plan
      const newPlan = {
        ...originalPlan,
        name: `${originalPlan.name} (Repeated)`,
        status: 'active' as const,
        startDate: now,
        progress: {
          completedDays: 0,
          totalDays,
          completedWorkouts: [],
          currentWeek: 1,
          streakDays: 0,
          totalVolume: 0,
          totalExercises: 0,
          completionRate: 0
        } as TrainingPlanProgress,
        isTemplate: false,
        isArchived: false
      };

      // Remove fields that shouldn't be copied
      delete (newPlan as any).id;
      delete (newPlan as any).createdAt;
      delete (newPlan as any).updatedAt;
      delete (newPlan as any).endDate;
      delete (newPlan as any).completedAt;

      // Clean undefined values from the plan data
      const cleanedPlan = this.cleanFirebaseData(newPlan);

      const newPlanId = await this.createTrainingPlan(cleanedPlan);
      console.log('✅ Training plan repeated with new ID:', newPlanId);
      return newPlanId;
    } catch (error) {
      console.error('❌ Error repeating training plan:', error);
      throw error;
    }
  }

  // Reset a training plan's progress to start over
  static async resetTrainingPlan(planId: string, userId: string): Promise<void> {
    try {
      console.log('🔄 Resetting training plan:', planId);

      const plan = await this.getTrainingPlan(planId);
      if (!plan) {
        throw new Error('Training plan not found');
      }

      // Ensure user owns this plan
      if (plan.userId !== userId) {
        throw new Error('Unauthorized to reset this plan');
      }

      const now = Timestamp.now();
      const totalDays = plan.duration * plan.daysPerWeek;

      // Reset the plan progress
      const resetProgress: TrainingPlanProgress = {
        completedDays: 0,
        totalDays,
        completedWorkouts: [],
        currentWeek: 1,
        streakDays: 0,
        totalVolume: 0,
        totalExercises: 0,
        completionRate: 0
      };

      // Update the plan with reset progress and active status
      await this.updateTrainingPlan(planId, {
        status: 'active',
        startDate: now,
        progress: resetProgress,
        updatedAt: now
      });

      console.log('✅ Training plan reset successfully:', planId);
    } catch (error) {
      console.error('❌ Error resetting training plan:', error);
      throw error;
    }
  }
}