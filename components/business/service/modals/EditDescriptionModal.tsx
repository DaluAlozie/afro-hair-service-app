import React from 'react'
import { Modal } from '@/components/utils/ui/Modal'
import { View } from 'tamagui'
import { EditDescriptionForm } from '../forms/EditDescriptionForm'

export default function EditDescriptionModal(
    { serviceId, open, setOpen }:
    { serviceId: number, open: boolean, setOpen: (value: boolean) => void }
) {
  return (
    <Modal open={open} setOpen={setOpen}>
        <View style={{ height: "auto", width: "90%"}}>
            <EditDescriptionForm serviceId={serviceId} close={() => setOpen(false)} />
        </View>
    </Modal>
    )
}
