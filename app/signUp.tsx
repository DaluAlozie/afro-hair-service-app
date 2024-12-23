import React from 'react'
import { SignUpForm } from '@/components/signUp/SignUpForm'
import AnonWrapper from '@/components/auth/AnonWrapper'

export default function SignUp() {
  return (
    <AnonWrapper>
      <SignUpForm></SignUpForm>
    </AnonWrapper>
  )
}