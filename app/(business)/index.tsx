import { ThemedText, ThemedView } from '@/components/utils'
import React from 'react'
import { useTheme } from 'tamagui';
import { UseThemeResult } from '@tamagui/web';
import { StyleSheet } from 'react-native';
import BusinessWrapper from '@/components/business/BusinessWrapper';
import { useBusinessStore } from '@/utils/stores/businessStore';

export default function Overview() {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const loading = useBusinessStore((state) => state.loading)
  return (
    <BusinessWrapper loading={loading}>
      <ThemedView style={styles.container}>
        <ThemedText>Overview</ThemedText>
      </ThemedView>
    </BusinessWrapper>
  )
}

const makeStyles = (theme: UseThemeResult) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background.val
  }
})