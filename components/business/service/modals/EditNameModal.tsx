import React from 'react'
import { Modal } from '@/components/utils/ui/Modal'
import { View } from 'tamagui'
import { EditServiceNameForm } from '../forms/EditNameForm'


export default function EditNameModal(
    { serviceId, open, setOpen }:
    { serviceId: number, open: boolean, setOpen: (value: boolean) => void }
) {
  return (
    <Modal open={open} setOpen={setOpen}>
        <View style={{ height: "auto", width: "90%"}}>
            <EditServiceNameForm serviceId={serviceId} close={() => setOpen(false)} />
        </View>
    </Modal>
    )
}
