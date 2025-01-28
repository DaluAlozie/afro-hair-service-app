import { AddAddOnForm } from '@/components/business/addon/AddAddOnForm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react'
import { View } from 'tamagui'

export default function AddVariant() {
    const { serviceId, serviceOptionId } = useLocalSearchParams();
    const [validParams, setValidParams] = useState(true);
    const router = useRouter();
    const onLayout = useCallback(() => {
        if (typeof serviceId !== "string" || isNaN(parseInt(serviceId))) {
            router.dismissTo(`/service/${serviceId}/serviceOption/${serviceOptionId}/variants`);
            setValidParams(false);
            return null
        }
        if (typeof serviceOptionId !== "string" || isNaN(parseInt(serviceOptionId))) {
            router.dismissTo(`/service/${serviceId}/serviceOption/${serviceOptionId}/variants`);
            setValidParams(false);
            return null
        }
    }, [serviceId, serviceOptionId])

  return (
    <View onLayout={onLayout}>
        {
            validParams &&
            <AddAddOnForm serviceId={parseInt(serviceId as string)} serviceOptionId={parseInt(serviceOptionId as string)}/>
        }
    </View>
  )
}
