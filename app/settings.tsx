import AuthWrapper from '@/components/auth/AuthWrapper'
import SettingsNavigation from '@/components/settings/SettingsNavigation'
import { ThemedView } from '@/components/utils'
import SignOutButton from '@/components/utils/SignOutButton'
import React from 'react'
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Settings() {
  return (
    <AuthWrapper>
      <SafeAreaView style={{ height: "100%", width: "100%"}}>
        <ThemedView style={styles.page}>
          <SettingsNavigation/>
        <SignOutButton/>
      </ThemedView>
      </SafeAreaView>
    </AuthWrapper>
  )
}

const styles = StyleSheet.create({
  page: {
    height: "100%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  }
});
