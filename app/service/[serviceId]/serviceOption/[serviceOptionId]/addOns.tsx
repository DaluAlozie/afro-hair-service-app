import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, useTheme, Text } from 'tamagui';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBusinessStore } from '@/utils/stores/businessStore';
import { Collapsible } from '@/components/utils';
import Pressable from '@/components/utils/Pressable';
import AddOn from '@/components/business/addon/AddOn';
import EditAddOnPriceModal from '@/components/business/addon/EditAddOnPriceModal';
import { AddOn as AddOnProps } from '@/components/business/types';
import { makeContainerStyles } from '@/components/business/utils';
import { SectionTitle } from '../..';

export default function AddOns() {
  const { serviceId, serviceOptionId } = useLocalSearchParams();
  const router = useRouter();
  const services = useBusinessStore((state) => state.services);
  const theme = useTheme();
  const styles = makeContainerStyles(theme);

  const onLayout = useCallback(() => {
    if (typeof serviceId !== 'string' || isNaN(parseInt(serviceId))) {
      router.dismissTo('/(business)/services');
      return null;
    }
    if (typeof serviceOptionId !== 'string' || isNaN(parseInt(serviceOptionId))) {
      router.dismissTo(`/service/${serviceId}/index`);
      return null;
    }
    const service = services.get(parseInt(serviceId));
    if (!service) {
      router.dismissTo('/(business)/services');
      return null;
    }
    const serviceOption = service.service_options.get(parseInt(serviceOptionId));
    if (!serviceOption) {
      router.dismissTo(`/service/${serviceId}/index`);
      return null;
    }
  }, [serviceId, serviceOptionId]);
  const serviceOption = services.get(parseInt(serviceId as string))?.service_options.get(parseInt(serviceOptionId as string));
  const addOns = Array.from(serviceOption?.addOns.values() || []);
    const  [open, setOpen] = useState(false);
    const  [addOnId, setAddOnId] = useState(-1);

    const openEditAddOnPriceModal = (addOnId: number) => {
      setAddOnId(addOnId);
      setOpen(true);
    }
  return (
    <>
      {serviceOption !== undefined && (
        <>
          <EditAddOnPriceModal
            serviceId={serviceOption.service_id}
            serviceOptionId={serviceOption.id}
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
            {serviceOption && (
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
            <Pressable
              onPress={() =>
                router.push(`/service/${serviceId}/serviceOption/${serviceOptionId}/addAddOn`)
              }
              activeOpacity={0.85}
              scale={0.99}
              style={styles.addButton}
              pressedStyle={{ backgroundColor: theme.onPressStyle.val }}
            >
              <Text>Create Add on</Text>
            </Pressable>
          </ScrollView>
        </>
      )}
    </>
  );
}

