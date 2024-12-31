import AuthWrapper from '@/components/auth/AuthWrapper'
import { ThemedText, ThemedView } from '@/components/utils'
import React from 'react'

export default function Services() {
  return (
    <AuthWrapper>
      <ThemedView>
        <ThemedText>Services</ThemedText>
      </ThemedView>
    </AuthWrapper>
  )
}
