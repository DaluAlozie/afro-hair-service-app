import React, { useCallback } from 'react'
import { View } from 'react-native'
import { Location as LocationProps } from '../types'
import { Switch, Text, useTheme } from 'tamagui'
import Pressable from '@/components/utils/Pressable';
import { useBusinessStore } from '@/utils/stores/businessStore';
import confirm from '@/components/utils/Alerts/Confirm';
import notify from '@/components/utils/Alerts/Notify';
import { makeStyles } from '../utils';

export default function BusinessLocation(
  { id, street_address, flat_number, city, postcode, country, enabled }: LocationProps
) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const enableLocation = useBusinessStore(state => state.enableLocation);
  const disableLocation = useBusinessStore(state => state.disableLocation);
  const removeBusinessLocation = useBusinessStore(state => state.removeBusinessLocation);
  const deleteLocation =  useCallback(
    async () => {
      confirm(
        async () => {
          await removeBusinessLocation(id)
          notify("Location Removed", "Note that existing appointments will be unaffected");
        },
        "Remove Location",
        "Are you sure you want to remove this location?",
        "Remove",
        "Cancel",
        "destructive"
      );
    },
    []
  )
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Street Address</Text>
        <Text style={styles.contentText}>{street_address}</Text>
      </View>
      {
        flat_number && (
        <>
          <Separator/>
          <View style={styles.section}>
            <Text style={styles.title}>Apartment Number</Text>
            <Text style={styles.contentText}>{flat_number}</Text>
          </View>
        </>
      )}
      <Separator/>
      <View style={styles.section}>
        <Text style={styles.title}>City</Text>
        <Text style={styles.contentText}>{city}</Text>
      </View>
      <Separator/>
      <View style={styles.section}>
        <Text style={styles.title}>Postcode</Text>
        <Text style={styles.contentText}>{postcode}</Text>
      </View>
      <Separator/>
      <View style={styles.section}>
        <Text style={styles.title}>Country</Text>
        <Text style={styles.contentText}>{country}</Text>
      </View>
      <Separator/>
      <View style={styles.section}>
        <Text style={styles.title}>Enabled</Text>
        <Switch
          defaultChecked={enabled} native
          onCheckedChange={
            async (checked) => {
              if (checked) {
                await enableLocation(id);
                notify("Location Enabled", "This location has been enabled");
              } else {
                await disableLocation(id);
                notify("Location Disabled", "Note that existing appointments will be unaffected");
              }
            }
          }
          >
          <Switch.Thumb/>
        </Switch>
      </View>
      <Separator/>
      <View style={[styles.section, { justifyContent: "center", alignItems: "center" }]}>
        <Pressable
        activeOpacity={0.6} scale={0.99} style={{ justifyContent: "center", alignItems: "center" }} onPress={deleteLocation}>
          <Text style={[styles.title, { color: theme.danger.val }]}>Remove Location</Text>
        </Pressable>
      </View>
    </View>
  )
}

function Separator() {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return <View style={styles.separator} />
}