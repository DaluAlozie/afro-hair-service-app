import React, { useCallback } from 'react'
import { View } from 'react-native'
import { Location as LocationProps } from '../types'
import { Switch, Text, useTheme } from 'tamagui'
import Pressable from '@/components/utils/Pressable';
import { useBusinessStore } from '@/utils/stores/businessStore';
import { StyleSheet } from 'react-native'
import { UseThemeResult } from '@tamagui/core'
import confirm from '@/components/utils/Alerts/Confirm';
import notify from '@/components/utils/Alerts/Notify';

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
            <Text style={styles.title}>Appartement Number</Text>
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

const makeStyles = (theme: UseThemeResult) => StyleSheet.create({
  container: {
    width: '100%',
    alignItems: "stretch",
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: theme.section.val,
    margin: 10,
    alignSelf: 'center',
    paddingTop: 10,
  },
  title: {
    fontSize: 15,
  },
  section: {
    flexDirection: 'row',
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