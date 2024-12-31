import AuthWrapper from '@/components/auth/AuthWrapper'
import { ThemedText, ThemedView } from '@/components/utils'
import React from 'react'

export default function Appointments() {
  return (
    <AuthWrapper>
      <ThemedView>
        <ThemedText>Appointments</ThemedText>
      </ThemedView>
    </AuthWrapper>
  )
}
