import React from 'react';
import { View, XStack, YStack, useTheme, Text } from 'tamagui';
import { StyleSheet } from 'react-native';
import { UseThemeResult } from '@tamagui/core';
import AddAvailability from '@/components/business/availability/AddAvailability';
import Pressable from '@/components/utils/Pressable';
import RemoveAvailability from '@/components/business/availability/RemoveAvailability';
import ViewAvailability from '@/components/business/availability/ViewAvailability';
import BusinessWrapper from '@/components/business/BusinessWrapper';
import { useBusinessStore } from '@/utils/stores/businessStore';

export default function Availability() {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const loadingAvailability = useBusinessStore((state) => state.loadingAvailability);
  const [mode, setMode] = React.useState<'add' | 'remove' | 'view'>('add');

  return (
    <BusinessWrapper loading={loadingAvailability}>
      <View style={styles.container}>
        <YStack height={30} width={"100%"} justifyContent="flex-start">
          <XStack justifyContent='space-between' gap={20}>
            <XStack justifyContent='flex-start' gap={20}>
              <Pressable onPress={() => setMode('add')} activeOpacity={0.5} scale={0.95}>
                <Text
                  opacity={mode === 'add' ? 1 : 0.3}
                  fontSize={16}
                >
                  Add
                </Text>
              </Pressable>
              <Pressable onPress={() => setMode('remove')} activeOpacity={0.5} scale={0.95}>
                <Text
                  opacity={mode === 'remove' ? 1 : 0.3}
                  fontSize={16}
                >Remove</Text>
              </Pressable>
            </XStack>
            <View alignSelf='flex-end'>
              <Pressable onPress={() => setMode('view')} activeOpacity={0.5} scale={0.95}>
                <Text
                  opacity={mode === 'view' ? 1 : 0.3}
                  fontSize={16}
                >View</Text>
              </Pressable>
            </View>
          </XStack>
          <View height={2} width={"100%"}>
              <View
                height={2}
                backgroundColor={theme.secondaryAccent.val}
                marginLeft={mode === 'remove' ? 50 : 0}
                width={mode === 'add' ? 30 : mode === "remove" ? 60 : 40}
                alignSelf={mode === "view" ? "flex-end" : "flex-start"}
              />
          </View>
        </YStack>
        {mode === 'add' ? <AddAvailability/> : mode === "remove"? <RemoveAvailability/> : <ViewAvailability/>}
      </View>
    </BusinessWrapper>

  );
}

const makeStyles = (theme: UseThemeResult) =>
  StyleSheet.create({
    container: {
      width: '100%',
      padding: 20,
      backgroundColor: theme.background.val,
      alignSelf: 'center',
      paddingTop: 20,
      maxWidth: 600,
      height: '100%',
    },
    calendar: {
      width: '100%',
      borderRadius: 10,
      alignSelf: 'center',
    },
  });
