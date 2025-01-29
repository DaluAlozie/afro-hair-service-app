import React from 'react'
import { View, XStack, ScrollView, useTheme } from 'tamagui'
import { CustomizableOption as CustomizableOptionType } from "../types";
import { useBusinessStore } from '@/utils/stores/businessStore';
import { useCallback } from 'react';
import confirm from '@/components/utils/Alerts/Confirm';
import { UseThemeResult } from '@tamagui/core';
import { StyleSheet, Text } from 'react-native';
import Pressable from '@/components/utils/Pressable';

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
          <Text style={styles.contentLabel}>Name</Text>
          <ScrollView contentContainerStyle={styles.content}>
              <Text style={styles.contentText}>{name}</Text>
          </ScrollView>
      </XStack>
      <Separator />
      <XStack style={styles.section}>
          <Text style={styles.contentLabel}>Type</Text>
          <ScrollView contentContainerStyle={styles.content}>
              <Text style={[styles.contentText, { opacity: 0.7, fontWeight: "normal" }]}>{convertType(type)}</Text>
          </ScrollView>
      </XStack>
      {
        type === 'numeric' && lower_bound !== null && (
          <>
            <Separator />
            <XStack style={styles.section}>
                <Text style={styles.contentLabel}>Minimum</Text>
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
                <Text style={styles.contentLabel}>Maximum</Text>
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
          activeOpacity={0.85} scale={0.99} onPress={deleteCustomizableOption} style={{ justifyContent: "center", alignItems: "center" }}>
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

const makeStyles = (theme: UseThemeResult) => StyleSheet.create({
  container: {
    width: '100%',
    alignItems: "stretch",
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: theme.section.val,
    margin: 10,
    alignSelf: 'center',
  },
  title: {
    fontSize: 15,
    color: theme.color.val
  },
  section: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    width: '100%',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: theme.gray5.val,
  },
  content: {
    alignSelf: 'flex-end',
    width: '50%',
    justifyContent: "flex-end",
    color: theme.color.val
  },
  contentLabel: {
    fontSize: 15,
    textAlign: "right",
    color: theme.color.val
  },
  contentText: {
    fontSize: 14,
    textAlign: "right",
    color: theme.color.val,
    fontWeight: "bold"

  },
  pressable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  }
});