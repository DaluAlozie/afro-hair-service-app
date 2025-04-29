import React, { useCallback } from 'react'
import { AddOn as AddOnProps } from '@/components/business/types';
import { View, Text, useTheme, Switch, XStack, ScrollView } from 'tamagui';
import Pressable from '@/components/utils/Pressable';
import Feather from '@expo/vector-icons/Feather';
import { useBusinessStore } from '@/utils/stores/businessStore';
import confirm from '@/components/utils/Alerts/Confirm';
import notify from '@/components/utils/Alerts/Notify';
import { makeStyles } from '../utils';

export default function AddOn({ id, name, price, duration, enabled, service_id, style_id, editAddOnPrice}:
    AddOnProps & { editAddOnPrice: (id: number) => void }) {
    const theme = useTheme();
    const styles = makeStyles(theme);
    const currency = "£";
    const removeAddOn = useBusinessStore(state => state.removeAddOn);
    const enableAddOn = useBusinessStore(state => state.enableAddOn);
    const disableAddOn = useBusinessStore(state => state.disableAddOn);

    const deleteAddOn = useCallback(
        async () => {
            confirm(
                async () => {
                  const { error } = await removeAddOn(service_id, style_id, id)
                  if (error) console.log(error);
                  else {
                    notify("Add on removed", "Note that existing appointments will not be affected",);
                  }
                },
                "Remove AddOn",
                "Are you sure you want to remove this add on ?",
                "Remove",
                "Cancel",
                "destructive"
            );
        },
        [removeAddOn]
    )
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
          <Text style={styles.title}>Price</Text>
          <View style={styles.content}>
              <Pressable
              onPress={() => editAddOnPrice(id)}
              style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }} activeOpacity={0.7} scale={0.99}>
              <Text style={[styles.contentText, { marginRight: 3 }]}>
                  {currency}{price}
              </Text>
              <Feather name="edit-3" size={16} color={theme.color.val}/>
              </Pressable>
          </View>
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
        <View>
          <Text style={styles.title}>Enabled</Text>
          <Text style={styles.enabledText}>
            {enabled ? "Yes" : "No"}
          </Text>
        </View>
        <Switch
          defaultChecked={enabled}
          onCheckedChange={
            (checked) => checked ?
              enableAddOn(service_id, style_id, id):
              disableAddOn(service_id, style_id, id)
          }
          native>
          <Switch.Thumb/>
        </Switch>
      </XStack>
      <Separator />
      <View justifyContent='center' style={styles.deleteSection}>
        <Pressable
          activeOpacity={0.85} scale={0.99} onPress={deleteAddOn} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text color={theme.danger.val} fontSize={16}>
            Remove AddOn
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
