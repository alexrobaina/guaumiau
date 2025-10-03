import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { exerciseDatabase, Exercise } from '@/lib/data/exerciseDatabase';
import { DayExercise } from '@/lib/services/trainingPlanService';
import { useUserCustomExercises } from '@/hooks/queries/useTrainingPlanQueries';
import { ExerciseSelectorProps } from './ExerciseSelector.types';
import { makeStyles } from './ExerciseSelector.styles';
import { Colors } from '@/lib/colors';

export const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  onClose,
  onSelectExercise,
  onCreateCustom,
}) => {
  const styles = makeStyles();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');

  const { data: customExercises = [] } = useUserCustomExercises();

  // Get all available exercises (database + custom)
  const allExercises = useMemo(() => {
    const databaseExercises: Exercise[] = [];

    Object.entries(exerciseDatabase.exerciseCategories).forEach(([categoryKey, category]) => {
      Object.entries(category.subcategories).forEach(([subKey, subcategory]) => {
        subcategory.exercises.forEach(exercise => {
          databaseExercises.push({
            ...exercise,
            category: categoryKey,
            subcategory: subKey,
          } as Exercise & { category: string; subcategory: string });
        });
      });
    });

    return [...databaseExercises, ...customExercises];
  }, [customExercises]);

  // Filter exercises based on search and filters
  const filteredExercises = useMemo(() => {
    return allExercises.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.muscleGroups.some(muscle => muscle.toLowerCase().includes(searchQuery.toLowerCase()));

      const exerciseCategory = (exercise as any).category || 'custom';
      const exerciseSubcategory = (exercise as any).subcategory || 'custom';

      const matchesCategory = selectedCategory === 'all' || exerciseCategory === selectedCategory;
      const matchesSubcategory = selectedSubcategory === 'all' || exerciseSubcategory === selectedSubcategory;

      return matchesSearch && matchesCategory && matchesSubcategory;
    });
  }, [allExercises, searchQuery, selectedCategory, selectedSubcategory]);

  // Get available categories and subcategories
  const categories = useMemo(() => {
    const cats = ['all', ...Object.keys(exerciseDatabase.exerciseCategories)];
    if (customExercises.length > 0) cats.push('custom');
    return cats;
  }, [customExercises]);

  const subcategories = useMemo(() => {
    if (selectedCategory === 'all') return ['all'];
    if (selectedCategory === 'custom') return ['all'];

    const category = exerciseDatabase.exerciseCategories[selectedCategory];
    return category ? ['all', ...Object.keys(category.subcategories)] : ['all'];
  }, [selectedCategory]);

  const handleSelectExercise = (exercise: Exercise) => {
    const dayExercise: DayExercise = {
      exerciseId: exercise.id,
      exercise,
      sets: exercise.defaultSets,
      reps: exercise.defaultReps,
      duration: exercise.defaultDuration,
      distance: exercise.defaultDistance,
      rest: exercise.defaultRest,
      notes: '',
    };

    onSelectExercise(dayExercise);
  };

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return {
          badge: styles.difficultyBadgeBeginner,
          text: styles.difficultyTextBeginner,
        };
      case 'intermediate':
        return {
          badge: styles.difficultyBadgeIntermediate,
          text: styles.difficultyTextIntermediate,
        };
      case 'advanced':
        return {
          badge: styles.difficultyBadgeAdvanced,
          text: styles.difficultyTextAdvanced,
        };
      case 'elite':
        return {
          badge: styles.difficultyBadgeElite,
          text: styles.difficultyTextElite,
        };
      default:
        return {
          badge: styles.difficultyBadgeBeginner,
          text: styles.difficultyTextBeginner,
        };
    }
  };

  const renderExerciseCard = ({ item: exercise }: { item: Exercise }) => {
    const difficultyStyle = getDifficultyStyle(exercise.difficulty);

    return (
      <View style={styles.exerciseCard}>
        {exercise.image && (
          <Image
            source={typeof exercise.image === 'number' ? exercise.image : { uri: exercise.image }}
            style={styles.exerciseImage}
            resizeMode="cover"
          />
        )}

        <View style={styles.exerciseHeader}>
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseEquipment}>
              Equipment: {exercise.equipment.length > 0 ? exercise.equipment.join(', ') : 'None'}
            </Text>
            <Text style={styles.exerciseMuscleGroups}>
              Targets: {exercise.muscleGroups.join(', ')}
            </Text>
          </View>

          <View style={[styles.difficultyBadge, difficultyStyle.badge]}>
            <Text style={[styles.difficultyText, difficultyStyle.text]}>
              {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.exerciseDetails}>
          <View style={styles.exerciseDetail}>
            <Ionicons name="fitness" size={12} color={Colors.gray[600]} />
            <Text style={styles.exerciseDetailText}>
              {exercise.defaultSets} sets
            </Text>
          </View>

          {exercise.measurementType === 'reps' && exercise.defaultReps && (
            <View style={styles.exerciseDetail}>
              <Ionicons name="repeat" size={12} color={Colors.gray[600]} />
              <Text style={styles.exerciseDetailText}>
                {exercise.defaultReps} reps
              </Text>
            </View>
          )}

          {exercise.measurementType === 'time' && exercise.defaultDuration && (
            <View style={styles.exerciseDetail}>
              <Ionicons name="time" size={12} color={Colors.gray[600]} />
              <Text style={styles.exerciseDetailText}>
                {exercise.defaultDuration}
              </Text>
            </View>
          )}

          {exercise.measurementType === 'distance' && exercise.defaultDistance && (
            <View style={styles.exerciseDetail}>
              <Ionicons name="location" size={12} color={Colors.gray[600]} />
              <Text style={styles.exerciseDetailText}>
                {exercise.defaultDistance}
              </Text>
            </View>
          )}

          <View style={styles.exerciseDetail}>
            <Ionicons name="pause" size={12} color={Colors.gray[600]} />
            <Text style={styles.exerciseDetailText}>
              {exercise.defaultRest}s rest
            </Text>
          </View>
        </View>

        {exercise.description && (
          <Text style={styles.exerciseDescription}>
            {exercise.description}
          </Text>
        )}

        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => handleSelectExercise(exercise)}
        >
          <Text style={styles.selectButtonText}>Add Exercise</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name="search-outline"
        size={64}
        color={Colors.gray[400]}
        style={styles.emptyStateIcon}
      />
      <Text style={styles.emptyStateTitle}>No exercises found</Text>
      <Text style={styles.emptyStateDescription}>
        Try adjusting your search or filters, or create a custom exercise.
      </Text>
      <TouchableOpacity style={styles.createCustomButton} onPress={onCreateCustom}>
        <Text style={styles.createCustomButtonText}>Create Custom Exercise</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Select Exercise</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={20} color={Colors.gray[600]} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        {/* Category Filter */}
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterChip,
                  selectedCategory === category ? styles.filterChipActive : styles.filterChipInactive
                ]}
                onPress={() => {
                  setSelectedCategory(category);
                  setSelectedSubcategory('all');
                }}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedCategory === category ? styles.filterChipTextActive : styles.filterChipTextInactive
                ]}>
                  {category === 'all' ? '🏃 All Activities' :
                   category === 'custom' ? '⭐ Custom' :
                   category === 'gym' ? '🏋️ Gym Training' :
                   category === 'climbing' ? '🧗 Climbing Training' :
                   category === 'running' ? '🏃 Running' :
                   category === 'yoga' ? '🧘 Yoga & Flexibility' :
                   category === 'swimming' ? '🏊 Swimming' :
                   exerciseDatabase.exerciseCategories[category]?.label || category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {selectedCategory !== 'all' && selectedCategory !== 'custom' && (
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Subcategory</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {subcategories.map((subcategory) => (
                <TouchableOpacity
                  key={subcategory}
                  style={[
                    styles.filterChip,
                    selectedSubcategory === subcategory ? styles.filterChipActive : styles.filterChipInactive
                  ]}
                  onPress={() => setSelectedSubcategory(subcategory)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedSubcategory === subcategory ? styles.filterChipTextActive : styles.filterChipTextInactive
                  ]}>
                    {subcategory === 'all' ? 'All' :
                     exerciseDatabase.exerciseCategories[selectedCategory]?.subcategories[subcategory]?.label || subcategory}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Exercise List */}
      <View style={styles.content}>
        <FlatList
          data={filteredExercises}
          renderItem={renderExerciseCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.exercisesList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      </View>

      {/* Floating Add Custom Button */}
      <TouchableOpacity style={styles.floatingButton} onPress={onCreateCustom}>
        <Ionicons name="add" size={24} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
};