import React from 'react'
import { Modal } from '@/components/utils/ui/Modal'
import { View } from 'tamagui'
import { EditAddOnPriceForm } from './EditAddOnPriceForm'


export default function EditAddOnPriceModal(
    { serviceId, serviceOptionId, variantId, open, setOpen }:
    { serviceId: number, serviceOptionId: number, variantId: number, open: boolean, setOpen: (value: boolean) => void }
) {
  return (
    <Modal open={open} setOpen={setOpen}>
        <View style={{ height: "auto", width: "90%"}}>
            <EditAddOnPriceForm
                serviceId={serviceId} serviceOptionId={serviceOptionId} addOnId={variantId} close={() => setOpen(false)} />
        </View>
    </Modal>
    )
}
