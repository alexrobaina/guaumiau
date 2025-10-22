import React, {memo} from 'react';
import {View} from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import {styles} from './styles';
import {theme} from '@/theme';

type IconName = keyof typeof LucideIcons;

interface IIconProps {
  name: IconName;
  size?: number;
  color?: string;
  testID?: string;
}

export const Icon = memo<IIconProps>(
  ({name, size = 24, color = theme.colors.text, testID}) => {
    const LucideIcon = LucideIcons[name] as React.ComponentType<{
      size: number;
      color: string;
    }>;

    if (!LucideIcon) {
      return <View style={[styles.container, {width: size, height: size}]} testID={testID} />;
    }

    return <LucideIcon size={size} color={color} />;
  },
);
