import React, {memo} from 'react';
import {Text as RNText, TextProps as RNTextProps} from 'react-native';
import {styles} from './styles';

interface ITextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  color?: 'primary' | 'secondary' | 'text' | 'textSecondary' | 'error' | 'success' | 'warning';
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
}

export const Text = memo<ITextProps>(
  ({
    variant = 'body',
    color = 'text',
    align = 'left',
    children,
    style,
    ...props
  }) => {
    return (
      <RNText
        style={[styles[variant], styles[color], styles[align], style]}
        {...props}>
        {children}
      </RNText>
    );
  },
);
