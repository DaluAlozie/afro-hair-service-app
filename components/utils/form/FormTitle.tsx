import React from 'react'
import { ThemedText } from '../ThemedText'

export default function FormTitle({ children }: { children: string }) {
  return (
    <ThemedText
        style={{
            fontWeight: 'bold',
            fontSize: 30,
            width:"100%",
            height: "auto",
            lineHeight: 40,
        }}>
        { children }
    </ThemedText>
  )
}
