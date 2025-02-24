import React from 'react'
import { View, XStack, ScrollView, useTheme } from 'tamagui'
import { CustomizableOption as CustomizableOptionType } from "../types";
import { useBusinessStore } from '@/utils/stores/businessStore';
import { useCallback } from 'react';
import confirm from '@/components/utils/Alerts/Confirm';
import { Text } from 'react-native';
import Pressable from '@/components/utils/Pressable';
import { makeStyles } from '../utils';

const convertType = (type: string) => {
  switch (type) {
    case 'numeric':
      return 'Number';
    case 'text':
      return 'Text';
    case 'boolean':
      return 'Boolean';
    default:
      return 'Unknown';
  }
}
export default function CustomizableOption({  id, name, type, lower_bound, upper_bound, service_option_id, service_id }: CustomizableOptionType) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const removeCustomizableOption = useBusinessStore(state => state.removeCustomizableOption);
  const deleteCustomizableOption = useCallback(async () => {
    confirm(
      async () => {
        const { error } = await removeCustomizableOption(service_id, service_option_id, id);
        if (error) console.log(error);
        else return;
      },
      "Remove Customization",
      "Are you sure you want to remove this customization?",
      "Remove",
      "Cancel",
      "destructive"
    );
  }, [])

  return (
    <View style={styles.container}>
      <XStack style={styles.section}>
          <Text style={styles.title}>Name</Text>
          <ScrollView contentContainerStyle={styles.content}>
              <Text style={styles.contentText}>{name}</Text>
          </ScrollView>
      </XStack>
      <Separator />
      <XStack style={styles.section}>
          <Text style={styles.title}>Type</Text>
          <ScrollView contentContainerStyle={styles.content}>
              <Text style={[styles.contentText, { opacity: 0.7, fontWeight: "normal" }]}>{convertType(type)}</Text>
          </ScrollView>
      </XStack>
      {
        type === 'numeric' && lower_bound !== null && (
          <>
            <Separator />
            <XStack style={styles.section}>
                <Text style={styles.title}>Minimum</Text>
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.contentText}>{lower_bound ?? "None"}</Text>
                </ScrollView>
            </XStack>
          </>
        )
      }
         {
        type === 'numeric' && upper_bound !== null && (
          <>
            <Separator />
            <XStack style={styles.section}>
                <Text style={styles.title}>Maximum</Text>
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.contentText}>{upper_bound ?? "None"}</Text>
                </ScrollView>
            </XStack>
          </>
        )
      }
      <Separator />
      <View justifyContent='center' style={styles.section}>
        <Pressable
          activeOpacity={0.85} scale={0.99} onPress={deleteCustomizableOption} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: theme.danger.val, fontSize: 16 }}>
            Remove Customization
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const Separator = () => {
    const theme = useTheme();
    const styles = makeStyles(theme);
    return <View style={styles.separator} />;
}