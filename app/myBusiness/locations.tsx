import BusinessLocation from '@/components/business/businessLocation/BusinessLocation';
import { Collapsible } from '@/components/utils/Collapsible';
import { useBusinessStore } from '@/utils/stores/businessStore';
import React, { useMemo } from 'react'
import { useTheme, View, Text, ScrollView } from 'tamagui'
import { useRouter } from 'expo-router';
import Pressable from '@/components/utils/Pressable';
import BusinessWrapper from '@/components/business/BusinessWrapper';
import { makeContainerStyles } from '@/components/business/utils';
import { SectionTitle } from '../service/[serviceId]';

export default function Locations() {
    const theme = useTheme();
    const loadingLocations = useBusinessStore((state) => state.loadingLocations);
    const locations = useBusinessStore(state => state.locations);
    const items = Array.from(locations.values());
    const styles = makeContainerStyles(theme);
  return (
    <BusinessWrapper loading={loadingLocations}>
      <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
        <Collapsible style={{ width: "100%" }}
          defaultOpen={true}
          header={<SectionTitle title= "Locations" />}>
            {items.map((item) => (
                useMemo(() => <BusinessLocation key={item.id} {...item}/>, [items])
            ))}
        </Collapsible>
        <AddButton/>
      </ScrollView>
    </BusinessWrapper>
  )
}

function AddButton() {
  const theme = useTheme();
  const styles = makeContainerStyles(theme);
  const router = useRouter()
  return (
    <View
    flexDirection='row'
    justifyContent='flex-end'
    width={"100%"}
    height={"auto"}
  >
    <Pressable
      onPress={() => router.push('/myBusiness/addLocation')}
      style={styles.addButton}
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

