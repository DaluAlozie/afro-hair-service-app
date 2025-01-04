import React from 'react'
import { ScrollView } from 'tamagui'

import { KeyboardAvoidingView as RNKeyboardAvoidingView, Platform } from 'react-native';

export default function KeyboardAvoidingView({ children }: { children: React.ReactNode }) {
  return (
    <RNKeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ height: '100%', width: '100%' }}
          keyboardVerticalOffset={150}
        >
        <ScrollView showsVerticalScrollIndicator={false}>
            {children}
        </ScrollView>
    </RNKeyboardAvoidingView>
  )
}
