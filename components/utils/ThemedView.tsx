import React from 'react';
import { View, type ViewProps } from 'react-native';
import { useTheme } from 'tamagui';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, ...otherProps }: ThemedViewProps) {
  const theme = useTheme();
  return <View style={[{ backgroundColor: theme.background.val }, style]} {...otherProps} />;
}
