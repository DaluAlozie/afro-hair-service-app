import React from 'react'
import { LoginForm } from '@/components/login/LoginForm'
import AnonWrapper from '@/components/auth/AnonWrapper'

export default function Login() {
  return (
    <AnonWrapper>
      <LoginForm/>
    </AnonWrapper>
  )
}