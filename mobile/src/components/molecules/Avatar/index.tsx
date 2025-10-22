import React, {memo} from 'react';
import {View, Image, Text} from 'react-native';
import {styles} from './styles';

interface IAvatarProps {
  source?: {uri: string} | number;
  initials?: string;
  size?: 'small' | 'medium' | 'large';
  showOnlineIndicator?: boolean;
  testID?: string;
}

export const Avatar = memo<IAvatarProps>(
  ({
    source,
    initials,
    size = 'medium',
    showOnlineIndicator = false,
    testID,
  }) => {
    return (
      <View style={styles.container} testID={testID}>
        <View style={[styles.avatar, styles[size]]}>
          {source ? (
            <Image source={source} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={[styles.initialsContainer, styles[size]]}>
              <Text style={[styles.initials, styles[`${size}Text`]]}>
                {initials || '??'}
              </Text>
            </View>
          )}
        </View>
        {showOnlineIndicator && (
          <View style={[styles.onlineIndicator, styles[`${size}Indicator`]]} />
        )}
      </View>
    );
  },
);
