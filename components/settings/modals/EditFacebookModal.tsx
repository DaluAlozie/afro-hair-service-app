import React from 'react'
import { Modal } from '@/components/utils/ui/Modal'
import { View } from 'tamagui'
import { EditBusinessFacebookForm } from '../forms/EditFacebookForm'


export default function EditFacebookModal(
    { open, setOpen }:
    { open: boolean, setOpen: (value: boolean) => void }
) {
  return (
    <Modal open={open} setOpen={setOpen}>
        <View style={{ height: "auto", width: "90%"}}>
            <EditBusinessFacebookForm close={() => setOpen(false)} />
        </View>
    </Modal>
    )
}
