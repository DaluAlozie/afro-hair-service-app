import React from 'react'
import { Modal } from '@/components/utils/ui/Modal'
import { View } from 'tamagui'
import { EditVariantPriceForm } from './EditVariantPriceForm'


export default function EditVariantPriceModal(
    { serviceId, styleId, variantId, open, setOpen }:
    { serviceId: number, styleId: number, variantId: number, open: boolean, setOpen: (value: boolean) => void }
) {
  return (
    <Modal open={open} setOpen={setOpen}>
        <View style={{ width: "90%"}}>
            <EditVariantPriceForm
                serviceId={serviceId} styleId={styleId} variantId={variantId} close={() => setOpen(false)} />
        </View>
    </Modal>
    )
}
