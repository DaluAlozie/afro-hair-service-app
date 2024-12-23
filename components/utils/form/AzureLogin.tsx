import AzureLogo from '@/assets/icons/azure'
import React from 'react'
import ThirdPartySignIn from './ThirdPartySignIn'
import { useAuthStore } from '@/utils/stores/authStore';

export default function AzureLogin() {
  const onPress = useAuthStore((state) => state.azureSignIn);

  return (
    <ThirdPartySignIn name='Microsoft' onPress={onPress}>
      <AzureLogo />
    </ThirdPartySignIn>
  )
}