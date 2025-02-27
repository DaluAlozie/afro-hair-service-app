import BusinessWrapper from '@/components/business/BusinessWrapper'
import { ThemedText, ThemedView } from '@/components/utils'
import { Fonts } from '@/constants/Fonts';
import { useBusinessStore } from '@/utils/stores/businessStore';
import { useTheme, UseThemeResult } from '@tamagui/web';
import React from 'react'
import { StyleSheet } from 'react-native'
import { FlashList } from "@shopify/flash-list";
import { View, YStack } from 'tamagui';
import Pressable from '@/components/utils/Pressable';import { useRouter } from 'expo-router';
import ServiceCover from '@/components/business/service/ServiceCover';

export default function Services() {
  const theme = useTheme();
  const loadingServices = useBusinessStore((state) => state.loadingServices);
  const services = useBusinessStore((state) => state.services);
  const items = Array.from(services.values());
  const styles = makeStyles(theme);

  return (
    <BusinessWrapper loading={loadingServices}>
      <YStack width={"100%"} height={"100%"} padding={20}>
        {services.size <= 0 ? (
          <>
            <HeaderComponent/>
            <ThemedView style={styles.container}>
              <ThemedText style={styles.fadedText}>No Services</ThemedText>
            </ThemedView>
          </>
          ) : (
            <FlashList
              ListFooterComponent={() => <HeaderComponent /> }
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
      width={"95%"}
      height={0}
      backgroundColor={theme.gray8.val}
      alignSelf='center'
      borderRadius={100}
    />
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
      onPress={() => router.push('/myBusiness/addService')}
      style={styles.addServiceButton}
      innerStyle={styles.innerStyle}
      pressedStyle={{ backgroundColor: theme.onPressStyle.val }}
      scale={0.99}
      activeOpacity={0.85}
      >
      <ThemedText style={{ color: theme.color.val, height: "auto" }}>
        Add Service
      </ThemedText>
    </Pressable>
  </View>
  )
}

const makeStyles = (
  theme: UseThemeResult,
) => StyleSheet.create({
  container: {
    height: "73%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  fadedText: {
    lineHeight: 30,
    fontSize: Fonts.contentAlt.fontSize,
    color: theme.gray8.val
  },
  addServiceButton: {
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