import React from 'react'
import { Modal } from '@/components/utils/ui/Modal'
import { View } from 'tamagui'
import { EditBusinessPhoneNumberForm } from '../forms/EditPhoneNumberForm'


export default function EditPhoneNumberModal(
    { open, setOpen }:
    { open: boolean, setOpen: (value: boolean) => void }
) {
  return (
    <Modal open={open} setOpen={setOpen}>
        <View style={{ height: "auto", width: "90%"}}>
            <EditBusinessPhoneNumberForm close={() => setOpen(false)} />
        </View>
    </Modal>
    )
}
