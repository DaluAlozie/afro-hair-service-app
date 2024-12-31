import AuthWrapper from '@/components/auth/AuthWrapper'
import { ThemedText, ThemedView } from '@/components/utils'
import React from 'react'

export default function Overview() {
  return (
    <AuthWrapper>
      <ThemedView>
        <ThemedText>Overview</ThemedText>
      </ThemedView>
    </AuthWrapper>
  )
}
