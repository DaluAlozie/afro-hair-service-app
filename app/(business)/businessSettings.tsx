import AuthWrapper from '@/components/auth/AuthWrapper'
import { ThemedText, ThemedView } from '@/components/utils'
import React from 'react'

export default function BusinessSettings() {
  return (
    <AuthWrapper>
      <ThemedView>
        <ThemedText>Business Settings</ThemedText>
      </ThemedView>
    </AuthWrapper>
  )
}
