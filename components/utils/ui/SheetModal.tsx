import React from 'react'
import { Sheet } from 'tamagui'

type SheetModalProps = {
    open: boolean
    setOpen: (val: boolean) => void
    snapPoints: (string | number)[]
    children: React.ReactNode
}

export default function SheetModal({ open, setOpen, snapPoints, children }: SheetModalProps) {
    return (
        <Sheet
            native={false}
            modal
            dismissOnSnapToBottom
            animation="medium"
            animationConfig={{ type: 'spring', mass: 0.1 }}
            snapPointsMode={"percent"}
            snapPoints={snapPoints}
            open={open}
            onOpenChange={setOpen}
        >
            <Sheet.Frame padding="$4" gap="$5" backgroundColor={"$section"}>
            {children}
            </Sheet.Frame>
            <Sheet.Overlay
            backgroundColor="$shadowColor"
            animation="lazy"
            enterStyle={{ opacity: 0.5 }}
            exitStyle={{ opacity: 0.5 }}
            />
        </Sheet>

    )
}
