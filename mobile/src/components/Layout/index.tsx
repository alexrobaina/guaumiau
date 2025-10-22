import { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';

interface LayoutProps {
  children: ReactNode;
  style?: ViewStyle;
  useSafeArea?: boolean;
}

export function Layout({ children, style, useSafeArea = true }: LayoutProps) {
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    useSafeArea && {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    },
    style,
  ];

  return <View style={containerStyle}>{children}</View>;
}
