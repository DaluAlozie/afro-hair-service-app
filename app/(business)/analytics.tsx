import BusinessWrapper from '@/components/business/BusinessWrapper'
import { ThemedText, ThemedView } from '@/components/utils'
import { Fonts } from '@/constants/Fonts';
import { useBusinessStore } from '@/utils/stores/businessStore';
import { UseThemeResult } from '@tamagui/web';
import React from 'react'
import { StyleSheet } from 'react-native'
import { useTheme } from 'tamagui';

export default function Analytics() {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const appointments = useBusinessStore((state) => state.appointments);
  return (
    <BusinessWrapper>
      {appointments.size <= 0 ? (
        <ThemedView style={styles.container}>
          <ThemedText style={styles.fadedText}>No Data</ThemedText>
        </ThemedView>
      ) : <></>}
    </BusinessWrapper>
  )
}

const makeStyles = (theme: UseThemeResult) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background.val
  },
  fadedText: {
    lineHeight: 30,
    fontSize: Fonts.contentAlt.fontSize,
    color: theme.gray8.val
  }
})