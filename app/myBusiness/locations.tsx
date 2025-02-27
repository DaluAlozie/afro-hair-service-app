import BusinessLocation from '@/components/business/businessLocation/BusinessLocation';
import { Collapsible } from '@/components/utils/Collapsible';
import { useBusinessStore } from '@/utils/stores/businessStore';
import React from 'react'
import { useTheme, ScrollView } from 'tamagui'
import BusinessWrapper from '@/components/business/BusinessWrapper';
import { makeContainerStyles } from '@/components/business/utils';
import { AddButton, SectionTitle } from '../service/[serviceId]';

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
        <AddButton
          href={"/myBusiness/addLocation"}
          text={"Add Location"}
        />
        <Collapsible style={{ width: "100%" }}
          defaultOpen={true}
          header={<SectionTitle title= "Locations" />}>
            {items.map((item) => (
            <BusinessLocation key={item.id} {...item}/>
            ))}
        </Collapsible>
      </ScrollView>
    </BusinessWrapper>
  )
}
