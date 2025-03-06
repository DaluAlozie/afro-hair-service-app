import React from 'react'
import { Modal } from '@/components/utils/ui/Modal'
import { View } from 'tamagui'
import { EditAddOnPriceForm } from './EditAddOnPriceForm'


export default function EditAddOnPriceModal(
    { serviceId, styleId, variantId, open, setOpen }:
    { serviceId: number, styleId: number, variantId: number, open: boolean, setOpen: (value: boolean) => void }
) {
  return (
    <Modal open={open} setOpen={setOpen}>
        <View style={{ height: "auto", width: "90%"}}>
            <EditAddOnPriceForm
                serviceId={serviceId} styleId={styleId} addOnId={variantId} close={() => setOpen(false)} />
        </View>
    </Modal>
    )
}
