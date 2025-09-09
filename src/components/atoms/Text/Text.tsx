import React from 'react';
import { Text as RNText } from 'react-native';

import { CustomTextProps } from './Text.types';
import { makeStyles } from './Text.styles';

export const Text: React.FC<CustomTextProps> = (
  {
    children,
    variant = 'body',
    color = 'default',
    style,
    ...props
  }
) => {
  const styles = makeStyles();
  
  const textStyle = [
    styles.base,
    styles[variant],
    styles[`${color}Color`],
    style,
  ];

  return (
    <RNText style={textStyle} {...props}>
      {children}
    </RNText>
  );
};