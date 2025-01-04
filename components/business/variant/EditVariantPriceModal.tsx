import React from 'react'
import { Modal } from '@/components/utils/ui/Modal'
import { View } from 'tamagui'
import { EditVariantPriceForm } from './EditVariantPriceForm'


export default function EditVariantPriceModal(
    { serviceId, serviceOptionId, variantId, open, setOpen }:
    { serviceId: number, serviceOptionId: number, variantId: number, open: boolean, setOpen: (value: boolean) => void }
) {
  return (
    <Modal open={open} setOpen={setOpen}>
        <View style={{ height: "auto", width: "90%"}}>
            <EditVariantPriceForm
                serviceId={serviceId} serviceOptionId={serviceOptionId} variantId={variantId} close={() => setOpen(false)} />
        </View>
    </Modal>
    )
}
