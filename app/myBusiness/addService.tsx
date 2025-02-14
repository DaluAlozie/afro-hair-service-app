import AuthWrapper from '@/components/auth/AuthWrapper'
import { AddServiceForm } from '@/components/business/service/forms/AddServiceForm'
import React from 'react'

export default function createBusiness() {
  return (
    <AuthWrapper>
      <AddServiceForm/>
    </AuthWrapper>
  )
}
