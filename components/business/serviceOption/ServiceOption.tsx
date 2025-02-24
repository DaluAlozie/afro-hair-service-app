import React, { useCallback } from 'react'
import { View } from 'react-native'
import { ServiceOption as ServiceOptionProps } from '../types'
import { Text, XStack, YStack, Switch, useTheme, ScrollView } from 'tamagui'
import Pressable from '@/components/utils/Pressable'
import Feather from '@expo/vector-icons/Feather'
import { useBusinessStore } from '@/utils/stores/businessStore'
import confirm from '@/components/utils/Alerts/Confirm'
import { useRouter } from 'expo-router'
import { makeStyles } from '../utils'

export default function ServiceOption(
  { id, name, description, enabled, service_id  }: ServiceOptionProps) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const router = useRouter();
  const removeServiceOption = useBusinessStore(state => state.removeServiceOption);
  const enableServiceOption = useBusinessStore(state => state.enableServiceOption);
  const disableServiceOption = useBusinessStore(state => state.disableServiceOption);
  const deleteOption = useCallback(
    async () => {
      confirm(
        async () => await removeServiceOption(service_id, id),
        "Remove Service Option",
        "Are you sure you want to remove this service option?",
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
        onPress={() => router.push(`/service/${service_id}/serviceOption/${id}/variants`)}
        activeOpacity={0.7} scale={0.99}>
        <Text style={styles.title}>Variants</Text>
          <Feather name="chevron-right" size={25} color={theme.gray11.val} />
      </Pressable>
      <Separator/>
      <Pressable
        style={styles.section}
        onPress={() => router.push(`/service/${service_id}/serviceOption/${id}/addOns`)}
        activeOpacity={0.7} scale={0.99}
        >
        <Text style={styles.title}>Add Ons</Text>
        <Feather name="chevron-right" size={25} color={theme.gray11.val} />
      </Pressable>
      <Separator/>
      <Pressable
        style={styles.section}
        onPress={() => router.push(`/service/${service_id}/serviceOption/${id}/customizableOptions`) }
        activeOpacity={0.7} scale={0.99}
        >
        <Text style={styles.title}>Customizations</Text>
        <Feather name="chevron-right" size={25} color={theme.gray11.val} />
      </Pressable>
      <Separator/>
      <XStack style={styles.section}>
        <Text style={styles.title}>Enabled</Text>
        <Switch
          defaultChecked={enabled} native
          onCheckedChange={
            async (checked) => checked ?
              await enableServiceOption(service_id, id) :
              await disableServiceOption(service_id, id)
            }
          >
          <Switch.Thumb/>
        </Switch>
      </XStack>
      <Separator/>
      <XStack style={[styles.section, { justifyContent: "center", alignItems: "center" }]}>
        <Pressable
        activeOpacity={0.6} scale={0.99} style={{ justifyContent: "center", alignItems: "center" }} onPress={deleteOption}>
          <Text style={[styles.title, { color: theme.danger.val }]}>Remove Service Option</Text>
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
