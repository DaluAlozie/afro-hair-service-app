import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, useTheme } from 'tamagui';
import { View } from '@tamagui/core';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useBusinessStore } from '@/utils/stores/businessStore';
import Variant from '@/components/business/variant/Variant';
import { Collapsible } from '@/components/utils';
import EditVariantPriceModal from '@/components/business/variant/EditVariantPriceModal';
import { AddButton, SectionTitle } from '../..';
import { makeContainerStyles } from '@/components/business/utils';

export default function Variants() {
  const { serviceId, serviceOptionId } = useLocalSearchParams();
  const parsedServiceId = parseInt(serviceId as string);
  const parsedServiceOptionId = parseInt(serviceOptionId as string);
  const services = useBusinessStore((state) => state.services);
  const serviceOption = services.get(parsedServiceId)?.service_options.get(parsedServiceOptionId);

  const theme = useTheme();
  const styles = makeContainerStyles(theme);
  const navigation = useNavigation();

  useEffect(() => {
    if (!serviceOption) {
      return;
    }
    const title = serviceOption.name;
    navigation.setOptions({
      title: title.length < 20 ? title + " Variants" : "Variants",
    });
  }, [serviceOption]);
  const variants = Array.from(serviceOption?.variants.values() || []);
    const  [open, setOpen] = useState(false);
    const  [variantId, setVariantId] = useState(-1);

    const openEditVariantPriceModal = (variantId: number) => {
      setVariantId(variantId);
      setOpen(true);
    }
  return (
    <>
      {serviceOption !== undefined && (
        <>
          <EditVariantPriceModal
            serviceId={serviceOption.service_id}
            serviceOptionId={serviceOption.id}
            variantId={variantId}
            open={open}
            setOpen={setOpen}
            />

          <ScrollView
            width={"100%"}
            minHeight={"100%"}
            paddingTop={20}
            style={{ backgroundColor: theme.background.val}}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <AddButton
                href={`/service/${serviceId}/serviceOption/${serviceOptionId}/addVariant`}
                text={"Add Variant"}
            />
            {serviceOption && (
              <Collapsible defaultOpen={true} style={{ width: '100%' }}
              header={<SectionTitle title="Variants" />}>
                {useMemo(() => variants.map((variant) => (
                  <Variant key={variant.id} {...variant} editVariantPrice={openEditVariantPriceModal} />
                )), [variants])}
              </Collapsible>
            )}
            <View height={50}/>
          </ScrollView>
        </>
      )}
    </>
  );
}