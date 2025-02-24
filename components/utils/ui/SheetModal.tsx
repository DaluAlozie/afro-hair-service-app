import React from 'react'
import { Sheet, useTheme } from 'tamagui'

type SheetModalProps = {
    open: boolean
    setOpen: (val: boolean) => void
    snapPoints: (string | number)[]
    children: React.ReactNode
}

export default function SheetModal({ open, setOpen, snapPoints, children }: SheetModalProps) {
    const theme = useTheme();
    return (
        <Sheet
            forceRemoveScrollEnabled={open}
            modal={false}
            open={open}
            onOpenChange={setOpen}
            snapPoints={snapPoints}
            snapPointsMode={"percent"}
            dismissOnSnapToBottom
            position={0}
            zIndex={100_000}
            animationConfig={{ type: 'spring', mass: 0.1 }}
        >
            <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0.5 }}
            exitStyle={{ opacity: 0.5 }}
            />
            <Sheet.Handle backgroundColor={theme.section.val} opacity={0.7}/>
            <Sheet.Frame padding="$4" justifyContent="center" alignItems="center" gap="$5" backgroundColor={"$section"}>
                {children}
            </Sheet.Frame>
        </Sheet>
    )
}
