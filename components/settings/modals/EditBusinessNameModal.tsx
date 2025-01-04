import React from 'react'
import { Modal } from '@/components/utils/ui/Modal'
import { View } from 'tamagui'
import { EditBusinessNameForm } from '../forms/EditNameForm'


export default function EditNameModal(
    { open, setOpen }:
    { open: boolean, setOpen: (value: boolean) => void }
) {
  return (
    <Modal open={open} setOpen={setOpen}>
        <View style={{ height: "auto", width: "90%"}}>
            <EditBusinessNameForm close={() => setOpen(false)} />
        </View>
    </Modal>
    )
}
