import { AddStyleForm } from '@/components/business/style/AddStyleForm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback } from 'react'
import { View } from 'tamagui'

export default function AddStyle() {
    const router = useRouter();
    const { serviceId } = useLocalSearchParams();
    const onLayout = useCallback(() => {
        if (typeof serviceId !== "string" || isNaN(parseInt(serviceId))) {
            router.dismissTo("/(business)/services");
            return null;
        }
    }, [serviceId])
  return (
    <View onLayout={onLayout}>
        <AddStyleForm serviceId={parseInt(serviceId as string)}/>
    </View>
  )
}
