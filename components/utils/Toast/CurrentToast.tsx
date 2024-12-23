import { Toast, useToastController, useToastState } from '@tamagui/toast';
import React from 'react';
import { View } from 'tamagui';
import { ThemedText } from '../ThemedText';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
export type ToastType = 'error' | 'success' | 'warning' | 'info'

export type StyleMap = {
  [key in ToastType]: {
    background: string;
    border?: string; // Optional if some styles don't have borders
    font: string;
    icon?: string; // Optional if some styles don't have icons
  };
};



const styleMap: StyleMap = {
  error: {
    background: '#FEE2E2', // Light red
    border: '#F87171', // Medium red
    icon: '', // Error icon
    font: '#B91C1C', // Dark red
  },
  success: {
    background: '#D1FAE5', // Light green
    border: '#34D399', // Medium green
    icon: '', // Success icon
    font: '#065F46', // Dark green
  },
  warning: {
    background: '#FEF9C3', // Light yellow
    border: '#FACC15', // Medium yellow
    icon: '', // Warning icon
    font: '#92400E', // Dark orange
  },
  info: {
    background: '#DBEAFE', // Light blue
    border: '#60A5FA', // Medium blue
    icon: '', // Info icon
    font: '#1E3A8A', // Dark blue
  },
};

export function CurrentToast() {
  const currentToast = useToastState();
  const type: 'error' | 'success' | 'warning' | 'info' = currentToast?.customData?.type;
  const top = initialWindowMetrics!.insets.top;
  const headerHeight = currentToast?.customData?.headerHeight;
  const topOffset = Platform.OS == "ios"? headerHeight-top : top;

  if (!currentToast || !type) {
    return null;
  }

  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      enterStyle={{ opacity: 0, y: -40 }}
      exitStyle={{ opacity: 0, y: -40 }}
      y={0}
      opacity={1}
      scale={1}
      animation="100ms"
      unstyled={true}
      $xs={{
        height: 80
      }}
      height={100}
      top={topOffset}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: styleMap[type].background,
        borderBottomWidth: 6,
        borderColor: styleMap[type].border,
        borderRadius: 12, // Flat corners
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        minWidth: '90%',
        maxWidth: 500,
        alignSelf: 'center',
        opacity: 0.95,
      }}
    >
      {/* Icon Section */}
      <View
        style={{
          marginRight: 12,
          fontSize: 24,
        }}
      >
        <ThemedText>{styleMap[type].icon}</ThemedText>
      </View>

      {/* Content Section */}
      <View style={{ flex: 1 }}>
        <Toast.Title
          style={{
            color: styleMap[type].font,
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 4,
          }}
        >
          {currentToast.title}
        </Toast.Title>
        <Toast.Description
          style={{
            color: styleMap[type].font,
            fontSize: 14,
            lineHeight: 20,
          }}
        >
          {currentToast.message}
        </Toast.Description>
      </View>
    </Toast>
  );
}

export const showToast = (
  toast:  ReturnType<typeof useToastController>,
  title: string,
  message: string,
  type: string,
  headerHeight: number) => {
    toast.show(title, {
      message: message ?? "",
      customData: { type: type, headerHeight }
  })
}