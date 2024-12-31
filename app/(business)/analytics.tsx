import AuthWrapper from '@/components/auth/AuthWrapper'
import { ThemedText, ThemedView } from '@/components/utils'
import React from 'react'

export default function Analytics() {
  return (
    <AuthWrapper>
      <ThemedView>
        <ThemedText>Analytics</ThemedText>
      </ThemedView>
    </AuthWrapper>
  )
}
