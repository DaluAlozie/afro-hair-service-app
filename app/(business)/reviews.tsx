import AuthWrapper from '@/components/auth/AuthWrapper'
import { ThemedText, ThemedView } from '@/components/utils'
import React from 'react'

export default function Reviews() {
  return (
    <AuthWrapper>
      <ThemedView>
        <ThemedText>Reviews</ThemedText>
      </ThemedView>
    </AuthWrapper>
  )
}
