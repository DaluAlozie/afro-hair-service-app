import { AddAddOnForm } from '@/components/business/addon/AddAddOnForm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react'
import { View } from 'tamagui'

export default function AddVariant() {
    const { serviceId, styleId } = useLocalSearchParams();
    const [validParams, setValidParams] = useState(true);
    const router = useRouter();
    const onLayout = useCallback(() => {
        if (typeof serviceId !== "string" || isNaN(parseInt(serviceId))) {
            router.dismissTo(`/service/${serviceId}/style/${styleId}/variants`);
            setValidParams(false);
            return null
        }
        if (typeof styleId !== "string" || isNaN(parseInt(styleId))) {
            router.dismissTo(`/service/${serviceId}/style/${styleId}/variants`);
            setValidParams(false);
            return null
        }
    }, [serviceId, styleId])

  return (
    <View onLayout={onLayout}>
        {
            validParams &&
            <AddAddOnForm serviceId={parseInt(serviceId as string)} styleId={parseInt(styleId as string)}/>
        }
    </View>
  )
}
