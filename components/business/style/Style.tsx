import React, { useCallback } from 'react'
import { View } from 'react-native'
import { Style as StyleProps } from '../types'
import { Text, XStack, YStack, Switch, useTheme, ScrollView } from 'tamagui'
import Pressable from '@/components/utils/Pressable'
import Feather from '@expo/vector-icons/Feather'
import { useBusinessStore } from '@/utils/stores/businessStore'
import confirm from '@/components/utils/Alerts/Confirm'
import { useRouter } from 'expo-router'
import { makeStyles } from '../utils'

export default function Style(
  { id, name, description, enabled, service_id  }: StyleProps) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const router = useRouter();
  const removeStyle = useBusinessStore(state => state.removeStyle);
  const enableStyle = useBusinessStore(state => state.enableStyle);
  const disableStyle = useBusinessStore(state => state.disableStyle);
  const deleteOption = useCallback(
    async () => {
      confirm(
        async () => await removeStyle(service_id, id),
        "Remove Style",
        "Are you sure you want to remove this style?",
        "Remove",
        "Cancel",
        "destructive"
      );
    },
    []
  )
  return (
    <YStack style={styles.container}>
      <XStack style={styles.section}>
        <Text style={styles.title}>Name</Text>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.contentText}>
            {name}
          </Text>
        </ScrollView>
      </XStack>
      <Separator/>
      <XStack style={styles.section}>
        <Text style={styles.title}>Description</Text>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.contentText}>
            {description}
          </Text>
        </ScrollView>
      </XStack>
      <Separator/>
      <Pressable
        style={styles.section}
        onPress={() => router.push(`/service/${service_id}/style/${id}/variants`)}
        activeOpacity={0.7} scale={0.99}>
        <Text style={styles.title}>Variations</Text>
          <Feather name="chevron-right" size={25} color={theme.gray11.val} />
      </Pressable>
      <Separator/>
      <Pressable
        style={styles.section}
        onPress={() => router.push(`/service/${service_id}/style/${id}/addOns`)}
        activeOpacity={0.7} scale={0.99}
        >
        <Text style={styles.title}>Add Ons</Text>
        <Feather name="chevron-right" size={25} color={theme.gray11.val} />
      </Pressable>
      <Separator/>
      <Pressable
        style={styles.section}
        onPress={() => router.push(`/service/${service_id}/style/${id}/customizableOptions`) }
        activeOpacity={0.7} scale={0.99}
        >
        <Text style={styles.title}>Customizations</Text>
        <Feather name="chevron-right" size={25} color={theme.gray11.val} />
      </Pressable>
      <Separator/>
      <XStack style={styles.section}>
        <View>
          <Text style={styles.title}>Enabled</Text>
          <Text style={styles.enabledText}>
            {enabled ? "Yes" : "No"}
          </Text>
        </View>
        <Switch
          defaultChecked={enabled} native
          onCheckedChange={
            async (checked) => checked ?
              await enableStyle(service_id, id) :
              await disableStyle(service_id, id)
            }
          >
          <Switch.Thumb/>
        </Switch>
      </XStack>
      <Separator/>
      <XStack style={styles.deleteSection}>
        <Pressable
        activeOpacity={0.6} scale={0.99} style={{ justifyContent: "center", alignItems: "center" }} onPress={deleteOption}>
          <Text style={[styles.title, { color: theme.danger.val }]}>Remove Style</Text>
        </Pressable>
      </XStack>
    </YStack>
  )
}

function Separator() {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return <View style={styles.separator} />
}
