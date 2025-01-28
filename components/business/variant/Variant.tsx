import React, { useCallback } from 'react'
import { Variant as VariantProps } from '@/components/business/types';
import { ScrollView, View, Text, useTheme, Switch, XStack } from 'tamagui';
import { StyleSheet } from 'react-native';
import { UseThemeResult } from '@tamagui/core';
import Pressable from '@/components/utils/Pressable';
import Feather from '@expo/vector-icons/Feather';
import { useBusinessStore } from '@/utils/stores/businessStore';
import confirm from '@/components/utils/Alerts/Confirm';

export default function Variant({ id, name, price, duration, enabled, service_id, service_option_id, editVariantPrice}:
    VariantProps & { editVariantPrice: (id: number) => void }) {
    const theme = useTheme();
    const styles = makeStyles(theme);
    const currency = "£";
    const removeVariant = useBusinessStore(state => state.removeVariant);
    const enableVariant = useBusinessStore(state => state.enableVariant);
    const disableVariant = useBusinessStore(state => state.disableVariant);

    const deleteVariant = useCallback(
        async () => {
            confirm(
                async () => await removeVariant(service_id, service_option_id, id),
                "Remove Variant",
                "Are you sure you want to remove this variant?",
                "Remove",
                "Cancel",
                "destructive"
            );
        },
        [removeVariant]
    )
  return (
    <View style={styles.container}>
        <XStack style={styles.section}>
            <Text>Name</Text>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.contentText}>{name}</Text>
            </ScrollView>
        </XStack>
        <Separator />
        <XStack style={styles.section}>
          <Text style={styles.title}>Price</Text>
          <ScrollView contentContainerStyle={styles.content}>
            <Pressable
              onPress={() => editVariantPrice(id)}
              style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }} activeOpacity={0.7} scale={0.99}>
              <Text style={[styles.contentText, { marginRight: 2 }]}>
                {currency}{price}
              </Text>
              <Feather name="edit-3" size={12} color={theme.color.val}/>
            </Pressable>
          </ScrollView>
      </XStack>
      <Separator />
      <XStack style={styles.section}>
        <Text style={styles.title}>Duration</Text>
        <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.contentText}>{duration} { duration > 1 ? "minutes": "minute"}</Text>
        </ScrollView>
      </XStack>
      <Separator />
      <XStack style={styles.section}>
        <Text style={styles.title}>Enabled</Text>
        <Switch
          defaultChecked={enabled}
          onCheckedChange={
            (checked) => checked ?
              enableVariant(service_id, service_option_id, id):
              disableVariant(service_id, service_option_id, id)
          }
          native>
          <Switch.Thumb/>
        </Switch>
      </XStack>
      <Separator />
      <View justifyContent='center' style={styles.section}>
        <Pressable
          activeOpacity={0.85} scale={0.99} onPress={deleteVariant} style={{ justifyContent: "center", alignItems: "center" }}>
          <Text color={theme.danger.val} fontSize={16}>
            Remove Variant
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
  },
  contentText: {
    fontSize: 14,
    textAlign: "right"
  },
  pressable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  }
});