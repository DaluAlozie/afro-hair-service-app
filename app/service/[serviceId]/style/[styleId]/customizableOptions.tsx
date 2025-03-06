import React from 'react';
import { ScrollView, useTheme } from 'tamagui';

import { useLocalSearchParams } from 'expo-router';
import { useBusinessStore } from '@/utils/stores/businessStore';
import { Collapsible } from '@/components/utils';
import CustomizableOption from '@/components/business/customizableOption/CustomizableOption';
import MyStyleWrapper from '@/components/business/style/MyStyleWrapper';
import { AddButton, SectionTitle } from '../..';
import { makeContainerStyles } from '@/components/business/utils';

export default function CustomizableOptions() {
  const { serviceId, styleId } = useLocalSearchParams();
  const services = useBusinessStore((state) => state.services);
  const theme = useTheme();
  const styles = makeContainerStyles(theme);
  const style = services.get(parseInt(serviceId as string))?.styles.get(parseInt(styleId as string));
  const customizableOptions = Array.from(style?.customizableOptions.values() || []);
  return (
    <MyStyleWrapper>
      {services && style !== undefined && (
        <>
          <ScrollView
            style={{ flex: 1, backgroundColor: theme.background.val }}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <AddButton
              href={`/service/${serviceId}/style/${styleId}/addCustomizableOption`}
              text="Add Customization" />
            {style && (
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
    </MyStyleWrapper>
  );
}