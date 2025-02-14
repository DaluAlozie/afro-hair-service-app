import React from 'react';
import { ScrollView, useTheme, Text } from 'tamagui';
import { StyleSheet } from 'react-native';
import { UseThemeResult } from '@tamagui/core';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBusinessStore } from '@/utils/stores/businessStore';
import { Collapsible } from '@/components/utils';
import Pressable from '@/components/utils/Pressable';
import CustomizableOption from '@/components/business/customizableOption/CustomizableOption';
import MyServiceOptionWrapper from '@/components/business/serviceOption/MyServiceOptionWrapper';

export default function CustomizableOptions() {
  const { serviceId, serviceOptionId } = useLocalSearchParams();
  const router = useRouter();
  const services = useBusinessStore((state) => state.services);
  const theme = useTheme();
  const styles = makeStyles(theme);
  const serviceOption = services.get(parseInt(serviceId as string))?.service_options.get(parseInt(serviceOptionId as string));
  const customizableOptions = Array.from(serviceOption?.customizableOptions.values() || []);
  return (
    <MyServiceOptionWrapper>
      {services && serviceOption !== undefined && (
        <>
          <ScrollView
            style={{ flex: 1, backgroundColor: theme.background.val}}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            {serviceOption && (
              <Collapsible defaultOpen={true}>
                {customizableOptions.map((option) => (
                  <CustomizableOption key={option.id} {...option} />
                ))}
              </Collapsible>
            )}
            <Pressable
              onPress={() =>
                router.push(`/service/${serviceId}/serviceOption/${serviceOptionId}/addCustomizableOption`)
              }
              activeOpacity={0.85}
              scale={0.99}
              style={styles.addButton}
              pressedStyle={{ backgroundColor: theme.onPressStyle.val }}
            >
              <Text>Add Customizable Options</Text>
            </Pressable>
          </ScrollView>
        </>
      )}
    </MyServiceOptionWrapper>
  );
}

const makeStyles = (theme: UseThemeResult) =>
  StyleSheet.create({
    container: {
      width: '90%',
      alignItems: 'center',
      alignSelf: 'center',
      borderRadius: 10,
    },
    addButton: {
      flexDirection: 'row',
      alignSelf: 'center',
      height: 50,
      justifyContent: 'center',
      backgroundColor: theme.section.val,
      width: '100%',
      borderRadius: 10,
      marginVertical: 20,
    },
  });
