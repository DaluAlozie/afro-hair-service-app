import React from "react"
import { Keyboard, TouchableWithoutFeedback } from "react-native"

type DismissKeyboardProps = {
    children?: React.ReactNode
    onPress?: () => void
}
export default function DismissKeyboard({ children, onPress }: DismissKeyboardProps) {

  return (
    <TouchableWithoutFeedback onPress={
      () => {
        Keyboard.dismiss()
        if (onPress) {
          onPress()
    }}}>
      { children }
    </TouchableWithoutFeedback>
  )
}