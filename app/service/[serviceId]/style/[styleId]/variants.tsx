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
  const { serviceId, styleId } = useLocalSearchParams();
  const parsedServiceId = parseInt(serviceId as string);
  const parsedStyleId = parseInt(styleId as string);
  const services = useBusinessStore((state) => state.services);
  const style = services.get(parsedServiceId)?.styles.get(parsedStyleId);

  const theme = useTheme();
  const styles = makeContainerStyles(theme);
  const navigation = useNavigation();

  useEffect(() => {
    if (!style) {
      return;
    }
    const title = style.name;
    navigation.setOptions({
      title: title.length < 20 ? title + " Variations" : "Variations",
    });
  }, [style]);
  const variants = Array.from(style?.variants.values() || []);
    const  [open, setOpen] = useState(false);
    const  [variantId, setVariantId] = useState(-1);

    const openEditVariantPriceModal = (variantId: number) => {
      setVariantId(variantId);
      setOpen(true);
    }
  return (
    <>
      {style !== undefined && (
        <>
          <EditVariantPriceModal
            serviceId={style.service_id}
            styleId={style.id}
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
                href={`/service/${serviceId}/style/${styleId}/addVariant`}
                text={"Add Variation"}
            />
            {style && (
              <Collapsible defaultOpen={true} style={{ width: '100%' }}
              header={<SectionTitle title="Variations" />}>
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