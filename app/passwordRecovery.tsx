import React, { useEffect, useState } from 'react'
import { useNavigationContainerRef, useRootNavigationState, useRouter } from 'expo-router';
import { useAuthStore } from '@/utils/stores/authStore';
import { getQueryParams } from 'expo-auth-session/build/QueryParams';
import PageSpinner from '@/components/utils/loading/PageSpinner';
import DeepLinkHandler from '@/components/navigation/DeepLinkHandler';
import AnonWrapper from '@/components/auth/AnonWrapper';
import useToast from '@/hooks/useToast';

export default function PasswordRecovery() {
  const [url, setURL] = useState<string | null>(null);
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const rootNavigationState = useRootNavigationState();
  const navigationContainerRef = useNavigationContainerRef();
  const { showToast } = useToast();

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
        "Something went wrong",
        error_message ?? error_description,
        "error",
      );
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