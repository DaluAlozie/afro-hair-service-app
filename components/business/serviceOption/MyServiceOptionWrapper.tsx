import React, { useCallback } from 'react';
import { View } from '@tamagui/core';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBusinessStore } from '@/utils/stores/businessStore';

export default function MyServiceOptionWrapper({ children }: { children: React.ReactNode }) {
  const { serviceId, serviceOptionId } = useLocalSearchParams();
  const router = useRouter();
  const services = useBusinessStore((state) => state.services);

  const onLayout = useCallback(() => {
    if (typeof serviceId !== 'string' || isNaN(parseInt(serviceId))) {
      router.dismissTo('/(business)/services');
      return null;
    }
    if (typeof serviceOptionId !== 'string' || isNaN(parseInt(serviceOptionId))) {
      router.dismissTo(`/service/${serviceId}/index`);
      return null;
    }
    const service = services.get(parseInt(serviceId));
    if (!service) {
      router.dismissTo('/(business)/services');
      return null;
    }
    const serviceOption = service.service_options.get(parseInt(serviceOptionId));
    if (!serviceOption) {
      router.dismissTo(`/service/${serviceId}/index`);
      return null;
    }
  }, [serviceId, serviceOptionId]);

  return (
    <View onLayout={onLayout} flex={1}>
        { children }
    </View>
  );
}

