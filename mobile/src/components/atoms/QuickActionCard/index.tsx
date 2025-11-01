import React, {memo} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import {styles} from './styles';

interface IQuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
  testID?: string;
}

export const QuickActionCard = memo<IQuickActionCardProps>(
  ({icon, title, onPress, testID}) => {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.7}
        testID={testID}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
    );
  },
);
