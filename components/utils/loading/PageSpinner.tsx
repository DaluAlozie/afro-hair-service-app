import React from 'react'
import { AnimatePresence, Spinner, XStack } from 'tamagui'

export default function PageSpinner() {
  return (
      <XStack width="100%" height="100%" justifyContent='center' alignItems='center'>
        <AnimatePresence>
        <Spinner
        width={"$15"}
            color="$color"
            key="loading-spinner"
            opacity={1}
            scale={200}
            animation="quick"
            // position="absolute"
            enterStyle={{
                opacity: 0,
                scale: 0.5,
            }}
            size='large'
            exitStyle={{
                opacity: 0,
                scale: 0.5,
            }}
        />
        </AnimatePresence>
    </XStack>
  )
}
