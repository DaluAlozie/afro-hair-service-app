import React from 'react'
import PageSpinner from '../utils/loading/PageSpinner'
import SubmitButton from '../utils/form/SubmitButton'
import { useAuthStore } from '@/utils/stores/authStore'
import { ThemedView } from '../utils'

export default function HomePage() {
    const forgotPassword = useAuthStore((state) => state.forgotPassword)

    const onSubmit = async () => {
        await forgotPassword("dalualozie@gmail.com")
      }
  return (
    <ThemedView>
        <PageSpinner/>
        <SubmitButton onPress={onSubmit} isSubmitting={false}>Forgot Password</SubmitButton>
    </ThemedView>
  )
}
