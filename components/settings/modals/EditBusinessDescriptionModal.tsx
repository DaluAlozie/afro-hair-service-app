import React from 'react'
import { Modal } from '@/components/utils/ui/Modal'
import { View } from 'tamagui'
import { EditBusinessDescriptionForm } from '../forms/EditDescriptionForm'


export default function EditDescModal(
    { open, setOpen }:
    { open: boolean, setOpen: (value: boolean) => void }
) {
  return (
    <Modal open={open} setOpen={setOpen}>
        <View style={{ height: "auto", width: "90%"}}>
            <EditBusinessDescriptionForm close={() => setOpen(false)} />
        </View>
    </Modal>
    )
}
