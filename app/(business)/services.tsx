import BusinessWrapper from '@/components/business/BusinessWrapper'
import { useBusinessStore } from '@/utils/stores/businessStore';
import React from 'react'
import { FlashList } from "@shopify/flash-list";
import { useTheme, View, YStack, Text } from 'tamagui';
import ServiceCover from '@/components/business/service/ServiceCover';
import { makeContainerStyles } from '@/components/business/utils';
import { AddButton } from '../service/[serviceId]';

export default function Services() {
  const theme = useTheme();
  const loadingServices = useBusinessStore((state) => state.loadingServices);
  const services = useBusinessStore((state) => state.services);
  const items = Array.from(services.values());
  const styles = makeContainerStyles(theme);

  return (
    <BusinessWrapper loading={loadingServices}>
      <YStack width={"100%"} height={"100%"} padding={20}>
        {services.size <= 0 ? (
          <>
            <HeaderComponent/>
            <View style={styles.container}>
              <Text opacity={0.6}>No Services</Text>
            </View>
          </>
          ) : (
            <FlashList
            showsVerticalScrollIndicator={false}
              ListHeaderComponent={() => <HeaderComponent /> }
              data={items}
              renderItem={ ({ item: { id, name, description} }) => <ServiceCover id={id} name={name} description={description} key={id}/>}
              ItemSeparatorComponent={Separator}
              estimatedItemSize={100}
              extraData={services}
          />
        )}
      </YStack>
    </BusinessWrapper>
  )
}

function Separator() {
  const theme = useTheme();
  return (
    <View
      width={"10%"}
      height={0}
      backgroundColor={theme.gray8.val}
      alignSelf='center'
      borderRadius={100}
    />
  )
}

function HeaderComponent() {
  return (
    <AddButton
      href={"/myBusiness/addService"}
      text={"Add Service"}
    />
  )
}

