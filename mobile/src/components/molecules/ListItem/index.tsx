import React, {memo} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {styles} from './styles';

interface IListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightAccessory?: 'arrow' | 'text' | 'component';
  rightText?: string;
  rightComponent?: React.ReactNode;
  onPress?: () => void;
  testID?: string;
}

export const ListItem = memo<IListItemProps>(
  ({
    title,
    subtitle,
    leftIcon,
    rightAccessory = 'arrow',
    rightText,
    rightComponent,
    onPress,
    testID,
  }) => {
    const content = (
      <>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {rightAccessory === 'arrow' && <View style={styles.arrow} />}
        {rightAccessory === 'text' && rightText && (
          <Text style={styles.rightText}>{rightText}</Text>
        )}
        {rightAccessory === 'component' && rightComponent}
      </>
    );

    if (onPress) {
      return (
        <TouchableOpacity
          style={styles.container}
          onPress={onPress}
          activeOpacity={0.7}
          testID={testID}>
          {content}
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.container} testID={testID}>
        {content}
      </View>
    );
  },
);
