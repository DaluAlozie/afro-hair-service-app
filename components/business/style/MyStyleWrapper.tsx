import React, { useCallback } from 'react';
import { View } from '@tamagui/core';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBusinessStore } from '@/utils/stores/businessStore';

export default function MyStyleWrapper({ children }: { children: React.ReactNode }) {
  const { serviceId, styleId } = useLocalSearchParams();
  const router = useRouter();
  const services = useBusinessStore((state) => state.services);

  const onLayout = useCallback(() => {
    if (typeof serviceId !== 'string' || isNaN(parseInt(serviceId))) {
      router.dismissTo('/(business)/services');
      return null;
    }
    if (typeof styleId !== 'string' || isNaN(parseInt(styleId))) {
      router.dismissTo(`/service/${serviceId}/index`);
      return null;
    }
    const service = services.get(parseInt(serviceId));
    if (!service) {
      router.dismissTo('/(business)/services');
      return null;
    }
    const style = service.styles.get(parseInt(styleId));
    if (!style) {
      router.dismissTo(`/service/${serviceId}/index`);
      return null;
    }
  }, [serviceId, styleId]);

  return (
    <View onLayout={onLayout} flex={1}>
        { children }
    </View>
  );
}

