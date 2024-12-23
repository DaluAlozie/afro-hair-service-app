import React from "react"
import { Keyboard, Pressable } from "react-native"

type DismissKeyboardProps = {
    children: React.ReactNode
}
export default function DismissKeyboard({ children }: DismissKeyboardProps) {

  return (
    <Pressable onPress={ () => Keyboard.dismiss() }>
      { children }
    </Pressable>
  )
}