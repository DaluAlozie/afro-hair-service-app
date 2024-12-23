import React from 'react'
import { ResetPasswordForm } from '@/components/resetPassword/ResetPasswordForm'
import AuthWrapper from '@/components/auth/AuthWrapper'

export default function ResetPassword() {
  return (
    <AuthWrapper>
      <ResetPasswordForm></ResetPasswordForm>
    </AuthWrapper>
  )
}