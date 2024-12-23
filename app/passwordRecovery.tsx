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

export default function PasswordRecovery() {
  const toast = useToastController();
  const [url, setURL] = useState<string | null>(null);
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const setSession = useAuthStore((state) => state.setSession);
  const rootNavigationState = useRootNavigationState();
  const navigationContainerRef = useNavigationContainerRef();

  useEffect(() => {
    let error_message: string | undefined = undefined;
    if (!navigationContainerRef.isReady()) return;
    if (!url) return;
    const handleURL = async () => {
      const { params: { access_token, refresh_token, error_code, error_description }} = getQueryParams(url);
      if (access_token && access_token && !error_code) {
        const { error } = await setSession(access_token, refresh_token);
        if (!error) {
          if (router.canDismiss()) router.dismissAll();
          router.replace("/resetPassword");
          return
        }
        error_message = error?.message
      }
      showToast(
        toast,
        "Something went wrong",
        error_message ?? error_description,
        "error",
        headerHeight
      )
      router.replace("/login");
    }
    handleURL();
  },[url,rootNavigationState?.key]);
  return (
    <AnonWrapper>
      <DeepLinkHandler url={url} setURL={(val: string | null) => setURL(val)}>
      <PageSpinner/>
      </DeepLinkHandler>
    </AnonWrapper>
  )
}