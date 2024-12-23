import AuthWrapper from '@/components/auth/AuthWrapper'
import SettingsNavigation from '@/components/settings/SettingsNavigation'
import React from 'react'

export default function Settings() {
  return (
    <AuthWrapper>
      <SettingsNavigation/>
    </AuthWrapper>
  )
}