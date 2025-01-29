import Appointment from '@/components/business/appointment/Appointment'
import BusinessWrapper from '@/components/business/BusinessWrapper'
import { ThemedText, ThemedView } from '@/components/utils'
import Pressable from '@/components/utils/Pressable'
import { Fonts } from '@/constants/Fonts'
import { useBusinessStore } from '@/utils/stores/businessStore'
import Entypo from '@expo/vector-icons/Entypo'
import { FlashList } from '@shopify/flash-list'
import { UseThemeResult } from '@tamagui/web'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, useColorScheme } from 'react-native'
import { Text, useTheme, View } from 'tamagui'

export default function Appointments() {
  const theme = useTheme();
  const inverseTheme = useTheme({ inverse: true });
  const styles = makeStyles(theme);
  const scheme = useColorScheme();
  const appointments = useBusinessStore((state) => state.appointments);
  const router = useRouter();
  return (
    <BusinessWrapper>
      {appointments.size <= 0 ? (
        <ThemedView style={styles.container}>
          <ThemedText style={styles.fadedText}>No Appointments</ThemedText>
        </ThemedView>
      ) : (
        <FlashList
          data={Array.from(appointments.values())}
          renderItem={({ item }) => (
            <Appointment key={item.id} {...item}
            />
          )}
        />
      )}
      <View position='absolute' bottom={50} right={20}>
        <Pressable onPress={() => router.push('/myBusiness/availability')} activeOpacity={0.99} style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: scheme === 'light' ? theme.section.val : inverseTheme.background.val,
            width: 130,
            height: 55,
            justifyContent: 'center',
            gap: 10,
            borderRadius: 100,
          }}>
          <Entypo name="calendar" size={24} color={ scheme === 'light' ? theme.color.val : inverseTheme.color.val} />
          <Text color={scheme === 'light' ? theme.color.val : inverseTheme.color.val}>Availability</Text>
        </Pressable>
      </View>
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