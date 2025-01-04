import React from 'react'
import { Modal } from '@/components/utils/ui/Modal'
import { View } from 'tamagui'
import { EditBusinessInstagramForm } from '../forms/EditInstagramForm'


export default function EditInstagramModal(
    { open, setOpen }:
    { open: boolean, setOpen: (value: boolean) => void }
) {
  return (
    <Modal open={open} setOpen={setOpen}>
        <View style={{ height: "auto", width: "90%"}}>
            <EditBusinessInstagramForm close={() => setOpen(false)} />
        </View>
    </Modal>
    )
}
