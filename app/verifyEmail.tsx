import React, { useEffect, useState } from 'react'
import { useToastController } from '@tamagui/toast';
import { useNavigationContainerRef, useRootNavigationState, useRouter } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import { useAuthStore } from '@/utils/stores/authStore';
import { getQueryParams } from 'expo-auth-session/build/QueryParams';
import PageSpinner from '@/components/utils/loading/PageSpinner';
import DeepLinkHandler from '@/components/navigation/DeepLinkHandler';
import AnonWrapper from '@/components/auth/AnonWrapper';
import { showToast } from '@/components/utils/Toast/CurrentToast';

export default function VerifyEmail() {
  const toast = useToastController()
  const [url, setURL] = useState<string | null>(null);
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const rootNavigationState = useRootNavigationState();
  const navigationContainerRef = useNavigationContainerRef();

  useEffect(() => {
    if (!navigationContainerRef.isReady()) return;
    if (!url) return;
    const { params: { access_token, error_description }} = getQueryParams(url);
    if (access_token) {
      showToast(
        toast,
        'Email Verified',
        'You can now Sign in.',
        'success',
        headerHeight
      );
    }
    else {
      showToast(
        toast,
        'Something went wrong',
        error_description,
        'error',
        headerHeight
      );
    }
    if (router.canDismiss()) router.dismiss();
    else if (isLoggedIn) router.replace("/(tabs)");
    else router.replace("/login")
  },[url,rootNavigationState?.key]);
  return (
    <AnonWrapper>
      <DeepLinkHandler url={url} setURL={(val: string | null) => setURL(val)}>
      <PageSpinner/>
      </DeepLinkHandler>
    </AnonWrapper>
  )
}