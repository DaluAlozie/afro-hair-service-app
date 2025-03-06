import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, useTheme } from 'tamagui';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBusinessStore } from '@/utils/stores/businessStore';
import { Collapsible } from '@/components/utils';
import AddOn from '@/components/business/addon/AddOn';
import EditAddOnPriceModal from '@/components/business/addon/EditAddOnPriceModal';
import { AddOn as AddOnProps } from '@/components/business/types';
import { makeContainerStyles } from '@/components/business/utils';
import { AddButton, SectionTitle } from '../..';

export default function AddOns() {
  const { serviceId, styleId } = useLocalSearchParams();
  const router = useRouter();
  const services = useBusinessStore((state) => state.services);
  const theme = useTheme();
  const styles = makeContainerStyles(theme);

  const onLayout = useCallback(() => {
    if (typeof serviceId !== 'string' || isNaN(parseInt(serviceId))) {
      router.dismissTo('/(business)/services');
      return null;
    }
    if (typeof styleId !== 'string' || isNaN(parseInt(styleId))) {
      router.dismissTo(`/service/${serviceId}/index`);
      return null;
    }
    const service = services.get(parseInt(serviceId));
    if (!service) {
      router.dismissTo('/(business)/services');
      return null;
    }
    const style = service.styles.get(parseInt(styleId));
    if (!style) {
      router.dismissTo(`/service/${serviceId}/index`);
      return null;
    }
  }, [serviceId, styleId]);
  const style = services.get(parseInt(serviceId as string))?.styles.get(parseInt(styleId as string));
  const addOns = Array.from(style?.addOns.values() || []);
    const  [open, setOpen] = useState(false);
    const  [addOnId, setAddOnId] = useState(-1);

    const openEditAddOnPriceModal = (addOnId: number) => {
      setAddOnId(addOnId);
      setOpen(true);
    }
  return (
    <>
      {style !== undefined && (
        <>
          <EditAddOnPriceModal
            serviceId={style.service_id}
            styleId={style.id}
            variantId={addOnId}
            open={open}
            setOpen={setOpen}
            />
          <ScrollView
            onLayout={onLayout}
            style={{ flex: 1, backgroundColor: theme.background.val}}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <AddButton
              href={`/service/${serviceId}/style/${styleId}/addAddOn`}
              text="Add Add On" />
            {style && (
              <Collapsible defaultOpen={true} style={{ width: "100%" }}
              header={<SectionTitle title={"Add Ons"} />}
                >
                {addOns.map(useMemo(() => {
                  const AddOnComponent = (addOn: AddOnProps) => (
                    <AddOn key={addOn.id} {...addOn} editAddOnPrice={openEditAddOnPriceModal} />
                  );
                  AddOnComponent.displayName = 'AddOnComponent';
                  return AddOnComponent;
                }, [addOns]))}
              </Collapsible>
            )}
          </ScrollView>
        </>
      )}
    </>
  );
}

