import AuthWrapper from '@/components/auth/AuthWrapper'
import DismissKeyboard from '@/components/utils/DismissKeyboard'
import KeyboardAvoidingView from '@/components/utils/KeyboardAvoidingView'
import useToast from '@/hooks/useToast'
import { useCustomerStore } from '@/utils/stores/customerStore'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useState, useEffect, useRef } from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { useTheme, View, Input, XStack, ScrollView } from 'tamagui';

interface ChatMessage {
  sender: 'user' | 'bot'
  message: string
}

const ChatScreen: React.FC = () => {
  const chatbotHistory = useCustomerStore((state) => state.chatbotHistory)
  const addChatbotMessage = useCustomerStore((state) => state.addChatbotMessage)
  const [input, setInput] = useState('')
  const listRef = useRef<ScrollView>(null)
  const toast = useToast()
  const theme = useTheme()

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true })
  }, [chatbotHistory])

  const handleSend = async () => {
    if (!input.trim()) return
    addChatbotMessage(input, 'user')
    const userMessage = input
    setInput('')

    try {
      const res = await fetch(process.env.CHATBOT_API_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `${process.env.CHATBOT_API_KEY}`
        },
        body: JSON.stringify({
           query: userMessage,
           filters: [],
           conversation_history: chatbotHistory.map((msg) => ({
              sender: msg.sender,
              message: msg.message,
            })),
          }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      addChatbotMessage(data.reply, 'bot')
    } catch {
      toast.showToast('Error', 'Failed to send message', 'error')
    }
  }

  return (
    <AuthWrapper>
      <KeyboardAvoidingView offset={20}>
        <DismissKeyboard>
          <>
            <ScrollView
              ref={listRef}
              style={{ flex: 1, backgroundColor: theme.background.val, paddingTop: 50 }}
              contentContainerStyle={styles.messagesList}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="never"
              keyboardDismissMode="interactive"
              >
              { 
                chatbotHistory.map((item, index) => (
                    <View key={index}>
                      {renderItem({ item })}
                    </View>
                ))
              }
              { chatbotHistory.length === 0 && (
                <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center', opacity: 0.3 }}>
                  <MaterialCommunityIcons name="robot-outline" size={200} color={theme.color.val} />
                  <Text 
                    style={{
                      color: theme.color.val,
                      fontSize: 24,
                      marginBottom: 100,
                      fontWeight: 'bold' }}>
                        Start Chatting
                  </Text>
                </View>
              )}
            </ScrollView>
        
            <View style={{ backgroundColor: theme.red10.val }}>    
              <XStack width={"100%"} height={50} position="absolute" bottom={100} paddingHorizontal={16} justifyContent='space-between' alignItems='center'>
                <Input
                  value={input}
                  onChangeText={setInput}
                  placeholder="Type your message..."
                  placeholderTextColor={theme.color.val+"80"}
                  returnKeyType="send"
                  onSubmitEditing={handleSend}
                  style={[styles.chatInput, { borderColor: theme.border?.val, backgroundColor: theme.card?.val, color: theme.text?.val }]}  
                />
                <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                    <Text style={[styles.sendButtonText, { color: theme.accent.val }]}>Send</Text>
                </TouchableOpacity>
              </XStack>

            </View>
          </>
        </DismissKeyboard>
      </KeyboardAvoidingView>
    </AuthWrapper>
  )
}
const renderItem = ({ item }: { item: ChatMessage }) => {
  const theme = useTheme()
  const isUser = item.sender === 'user'
  const bubbleStyle = isUser ? styles.userBubble : styles.botBubble
  const textColor = isUser ? theme.white1.val : theme.color.val
  const backgroundColor = isUser ? theme.accent.val : theme.background.val

  return (
    <View style={[styles.bubble, bubbleStyle, { backgroundColor }]}>
      <Text style={[styles.messageText, { color: textColor }]}>
        {item.message}
      </Text>
    </View>
  )
}
export default ChatScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: '100%',

  },
  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    maxWidth: '80%',
    borderRadius: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
  },
  botBubble: {
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    bottom: 100,
  },
  chatInput: {
    height: "100%",
    width: "85%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 0,
    borderRadius:  100,
    borderColor: "red",
    fontSize: 16,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: "10%",
    maxWidth: 50,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    
  },
})
