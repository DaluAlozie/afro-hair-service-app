import React from 'react'
import { ScrollView, Sheet } from 'tamagui'

import { KeyboardAvoidingView as RNKeyboardAvoidingView, Platform } from 'react-native';

export default function KeyboardAvoidingView({ children, sheet = false }: { children: React.ReactNode, sheet?: boolean }) {
  return (
    <RNKeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ height: '100%', width: '100%' }}
          keyboardVerticalOffset={100}
        >
          {
          sheet ? (
            <Sheet.ScrollView
              contentContainerStyle={{ minHeight: '100%' }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
              keyboardDismissMode="interactive">
                {children}
            </Sheet.ScrollView>
          ) :
            <ScrollView
              contentContainerStyle={{ minHeight: '100%' }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
              keyboardDismissMode="interactive">
              {children}
            </ScrollView>
          }
    </RNKeyboardAvoidingView>
  )
}
