import GoogleLogo from '@/assets/icons/google'
import React from 'react'
import ThirdPartySignIn from './ThirdPartySignIn'
import { useAuthStore } from '@/utils/stores/authStore';

export default function GoogleLogin() {
  const onPress = useAuthStore((state) => state.googleSignIn);

  return (
    <ThirdPartySignIn name='Google' onPress={onPress}>
      <GoogleLogo />
    </ThirdPartySignIn>
  )
}