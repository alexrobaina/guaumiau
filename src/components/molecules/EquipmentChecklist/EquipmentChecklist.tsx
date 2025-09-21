import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Chip, Icon, useTheme, Checkbox, List } from 'react-native-paper';
import { Equipment } from '@/types';

interface EquipmentChecklistProps {
  equipment: Equipment[];
  onChecklistComplete?: (isComplete: boolean) => void;
}

export const EquipmentChecklist: React.FC<EquipmentChecklistProps> = ({ 
  equipment, 
  onChecklistComplete 
}) => {
  const theme = useTheme();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const styles = StyleSheet.create({
    card: {
      margin: 16,
      elevation: 2,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    description: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      marginBottom: 16,
      lineHeight: 20,
    },
    equipmentList: {
      marginBottom: 16,
    },
    equipmentItem: {
      paddingVertical: 8,
      paddingHorizontal: 0,
    },
    equipmentInfo: {
      flex: 1,
      marginLeft: 12,
    },
    equipmentName: {
      fontSize: 16,
      fontWeight: '500',
    },
    equipmentDescription: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      marginTop: 2,
    },
    progressSection: {
      backgroundColor: theme.colors.surfaceVariant,
      padding: 12,
      borderRadius: 8,
      marginTop: 8,
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    progressTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.onSurfaceVariant,
    },
    progressCount: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    progressBar: {
      height: 6,
      backgroundColor: theme.colors.outline,
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
      borderRadius: 3,
    },
    alternativesSection: {
      marginTop: 16,
      padding: 12,
      backgroundColor: theme.colors.errorContainer,
      borderRadius: 8,
    },
    alternativesTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.onErrorContainer,
      marginBottom: 8,
    },
    alternativeText: {
      fontSize: 12,
      color: theme.colors.onErrorContainer,
      lineHeight: 16,
    },
  });

  const equipmentMap = {
    fingerboard: {
      name: 'Fingerboard/Hangboard',
      description: 'Mounted training board with various holds',
      icon: 'hand-extended',
      alternatives: 'Pull-up bar with towels, or doorway pull-up bar'
    },
    campus_board: {
      name: 'Campus Board',
      description: 'Overhanging board with ladder rungs',
      icon: 'ladder',
      alternatives: 'System board, or modified pull-up variations'
    },
    pull_up_bar: {
      name: 'Pull-up Bar',
      description: 'Horizontal bar for pull-ups and hanging',
      icon: 'weight-lifter',
      alternatives: 'Playground equipment, or resistance bands'
    },
    resistance_bands: {
      name: 'Resistance Bands',
      description: 'Elastic bands for strength training',
      icon: 'elastic',
      alternatives: 'Light weights, or bodyweight variations'
    },
    dumbbells: {
      name: 'Dumbbells',
      description: 'Free weights for strength training',
      icon: 'dumbbell',
      alternatives: 'Water bottles, books, or resistance bands'
    },
    yoga_mat: {
      name: 'Yoga/Exercise Mat',
      description: 'Mat for floor exercises and stretching',
      icon: 'yoga',
      alternatives: 'Towel or carpeted area'
    },
    system_board: {
      name: 'System Board',
      description: 'Standardized training wall with holds',
      icon: 'grid',
      alternatives: 'Any climbing wall or fingerboard'
    },
    basic_equipment: {
      name: 'Basic Equipment',
      description: 'Space to move and basic bodyweight setup',
      icon: 'home',
      alternatives: 'Any open space (2m x 2m minimum)'
    }
  };

  const handleItemCheck = (equipmentKey: string) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(equipmentKey)) {
      newCheckedItems.delete(equipmentKey);
    } else {
      newCheckedItems.add(equipmentKey);
    }
    setCheckedItems(newCheckedItems);
    
    const isComplete = newCheckedItems.size === equipment.length;
    onChecklistComplete?.(isComplete);
  };

  const progressPercentage = (checkedItems.size / equipment.length) * 100;
  const missingEquipment = equipment.filter(eq => !checkedItems.has(eq));

  if (equipment.length === 0) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Equipment Required</Text>
          <Text style={styles.description}>
            No special equipment needed for this workout! Just bring yourself and some space to move.
          </Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.cardTitle}>Equipment Checklist</Text>
        <Text style={styles.description}>
          Make sure you have access to the following equipment before starting your workout.
        </Text>

        <ScrollView style={styles.equipmentList} showsVerticalScrollIndicator={false}>
          {equipment.map((equipmentKey) => {
            const equipmentInfo = equipmentMap[equipmentKey] || {
              name: equipmentKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              description: 'Required for this workout',
              icon: 'tools',
              alternatives: 'Check with your gym or training facility'
            };

            const isChecked = checkedItems.has(equipmentKey);

            return (
              <List.Item
                key={equipmentKey}
                style={styles.equipmentItem}
                left={() => (
                  <Checkbox
                    status={isChecked ? 'checked' : 'unchecked'}
                    onPress={() => handleItemCheck(equipmentKey)}
                  />
                )}
                right={() => (
                  <Icon 
                    source={equipmentInfo.icon} 
                    size={24} 
                    color={isChecked ? theme.colors.primary : theme.colors.onSurfaceVariant} 
                  />
                )}
                onPress={() => handleItemCheck(equipmentKey)}
              >
                <View style={styles.equipmentInfo}>
                  <Text style={[
                    styles.equipmentName,
                    isChecked && { color: theme.colors.primary }
                  ]}>
                    {equipmentInfo.name}
                  </Text>
                  <Text style={styles.equipmentDescription}>
                    {equipmentInfo.description}
                  </Text>
                </View>
              </List.Item>
            );
          })}
        </ScrollView>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Setup Progress</Text>
            <Text style={styles.progressCount}>
              {checkedItems.size}/{equipment.length} ready
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progressPercentage}%` }
              ]} 
            />
          </View>
        </View>

        {missingEquipment.length > 0 && (
          <View style={styles.alternativesSection}>
            <Text style={styles.alternativesTitle}>
              💡 Don't have some equipment?
            </Text>
            {missingEquipment.slice(0, 2).map(eq => {
              const info = equipmentMap[eq];
              return (
                <Text key={eq} style={styles.alternativeText}>
                  • {info?.name || eq}: {info?.alternatives || 'Check alternatives in exercise descriptions'}
                </Text>
              );
            })}
            {missingEquipment.length > 2 && (
              <Text style={styles.alternativeText}>
                ... and alternatives for {missingEquipment.length - 2} more items
              </Text>
            )}
          </View>
        )}
      </Card.Content>
    </Card>
  );
};