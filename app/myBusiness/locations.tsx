import BusinessLocation from '@/components/business/businessLocation/BusinessLocation';
import { Collapsible } from '@/components/utils/Collapsible';
import { useBusinessStore } from '@/utils/stores/businessStore';
import React from 'react'
import { useTheme, View, Text, ScrollView } from 'tamagui'
import { StyleSheet } from 'react-native'
import { UseThemeResult } from '@tamagui/core'
import { useRouter } from 'expo-router';
import Pressable from '@/components/utils/Pressable';

export default function Locations() {
    const theme = useTheme();
    const locations = useBusinessStore(state => state.locations);
    const items = Array.from(locations.values());
    const styles = makeStyles(theme);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HeaderComponent/>
      <Collapsible defaultOpen={true}>
          {items.map((item) => (
              <BusinessLocation key={item.id} {...item}/>
          ))}
      </Collapsible>
    </ScrollView>
  )
}

function HeaderComponent() {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const router =  useRouter()
  return (
    <View
    flexDirection='row'
    justifyContent='flex-end'
    width={"100%"}
    height={"auto"}
  >
    <Pressable
      onPress={() => router.push('/myBusiness/addLocation')}
      style={styles.addLocationButton}
      innerStyle={styles.innerStyle}
      pressedStyle={{ backgroundColor: theme.onPressStyle.val }}
      scale={0.99}
      activeOpacity={0.85}
      >
      <Text style={{ color: theme.color.val, height: "auto" }}>
        Add Location
      </Text>
    </Pressable>
  </View>
  )
}

const makeStyles = (
  theme: UseThemeResult,
) => StyleSheet.create({
  container: {
    width: '100%',
    height: "100%",
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    alignSelf: 'center',
    backgroundColor: theme.background.val,
  },
  addLocationButton: {
    height: 50,
    width: "100%",
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.section.val,
    marginBottom: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  innerStyle: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  }
})