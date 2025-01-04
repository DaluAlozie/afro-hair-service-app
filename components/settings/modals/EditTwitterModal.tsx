import React from 'react'
import { Modal } from '@/components/utils/ui/Modal'
import { View } from 'tamagui'
import { EditBusinessTwitterForm } from '../forms/EditTwitterForm'


export default function EditTwitterModal(
    { open, setOpen }:
    { open: boolean, setOpen: (value: boolean) => void }
) {
  return (
    <Modal open={open} setOpen={setOpen}>
        <View style={{ height: "auto", width: "90%"}}>
            <EditBusinessTwitterForm close={() => setOpen(false)} />
        </View>
    </Modal>
    )
}
