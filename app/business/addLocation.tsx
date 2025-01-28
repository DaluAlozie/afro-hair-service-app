import AuthWrapper from '@/components/auth/AuthWrapper'
import React from 'react'
import { AddBusinessLocationForm } from '@/components/business/businessLocation/AddBusinessLocationForm'

export default function createBusiness() {
  return (
    <AuthWrapper>
      <AddBusinessLocationForm/>
    </AuthWrapper>
  )
}
