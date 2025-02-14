import React from "react"
import { Keyboard, TouchableWithoutFeedback } from "react-native"

type DismissKeyboardProps = {
    children?: React.ReactNode
    onPress?: () => void
}
export default function DismissKeyboard({ children, onPress }: DismissKeyboardProps) {

  return (
    <TouchableWithoutFeedback style={{ width: "100%" }} onPress={() => {
        Keyboard.dismiss()
        if (onPress) {
          onPress()
        }
    }}>
      { children }
    </TouchableWithoutFeedback>
  )
}