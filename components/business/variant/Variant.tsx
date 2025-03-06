import React, { useCallback } from 'react'
import { Variant as VariantProps } from '@/components/business/types';
import { ScrollView, View, Text, useTheme, Switch, XStack } from 'tamagui';
import Pressable from '@/components/utils/Pressable';
import Feather from '@expo/vector-icons/Feather';
import { useBusinessStore } from '@/utils/stores/businessStore';
import confirm from '@/components/utils/Alerts/Confirm';
import { makeStyles } from '../utils';

export default function Variant({ id, name, price, duration, enabled, service_id, style_id, editVariantPrice}:
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
                async () => await removeVariant(service_id, style_id, id),
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
              <Text style={[styles.contentText, { marginRight: 3 }]}>
                {currency}{price}
              </Text>
              <Feather name="edit-3" size={16} color={theme.color.val}/>
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
              enableVariant(service_id, style_id, id):
              disableVariant(service_id, style_id, id)
          }
          native>
          <Switch.Thumb/>
        </Switch>
      </XStack>
      <Separator />
      <View justifyContent='center' style={styles.deleteSection}>
        <Pressable
          activeOpacity={0.85} scale={0.99} onPress={deleteVariant} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
