import React from 'react'
import { ForgotPasswordForm } from '@/components/forgotPassword/ForgotPasswordForm'
import AnonWrapper from '@/components/auth/AnonWrapper'

export default function ForgotPassword() {
  return (
    <AnonWrapper>
      <ForgotPasswordForm></ForgotPasswordForm>
    </AnonWrapper>
  )
}