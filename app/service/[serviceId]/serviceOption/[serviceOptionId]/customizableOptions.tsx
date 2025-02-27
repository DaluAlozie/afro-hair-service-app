import React from 'react';
import { ScrollView, useTheme } from 'tamagui';

import { useLocalSearchParams } from 'expo-router';
import { useBusinessStore } from '@/utils/stores/businessStore';
import { Collapsible } from '@/components/utils';
import CustomizableOption from '@/components/business/customizableOption/CustomizableOption';
import MyServiceOptionWrapper from '@/components/business/serviceOption/MyServiceOptionWrapper';
import { AddButton, SectionTitle } from '../..';
import { makeContainerStyles } from '@/components/business/utils';

export default function CustomizableOptions() {
  const { serviceId, serviceOptionId } = useLocalSearchParams();
  const services = useBusinessStore((state) => state.services);
  const theme = useTheme();
  const styles = makeContainerStyles(theme);
  const serviceOption = services.get(parseInt(serviceId as string))?.service_options.get(parseInt(serviceOptionId as string));
  const customizableOptions = Array.from(serviceOption?.customizableOptions.values() || []);
  return (
    <MyServiceOptionWrapper>
      {services && serviceOption !== undefined && (
        <>
          <ScrollView
            style={{ flex: 1, backgroundColor: theme.background.val }}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <AddButton
              href={`/service/${serviceId}/serviceOption/${serviceOptionId}/addCustomizableOption`}
              text="Add Customization" />
            {serviceOption && (
              <Collapsible defaultOpen={true} style={{ width: '100%', }}
              header={<SectionTitle title="Customizable Options" />}>
                {customizableOptions.map((option) => (
                  <CustomizableOption key={option.id} {...option} />
                ))}
              </Collapsible>
            )}
          </ScrollView>
        </>
      )}
    </MyServiceOptionWrapper>
  );
}