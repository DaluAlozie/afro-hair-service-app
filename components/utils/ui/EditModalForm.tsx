import React from 'react'
import { Form, useTheme } from 'tamagui'
import KeyboardAvoidingView from '../KeyboardAvoidingView'

export default function EditModalForm({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <Form
      alignItems="center"
      alignSelf='center'
      justifyContent='center'
      height={250}
      maxWidth={400}
      width={"100%"}
      backgroundColor={theme.background.val}
      borderRadius={20}>
      <KeyboardAvoidingView>
        {children}
      </KeyboardAvoidingView>
    </Form>
  )
}
