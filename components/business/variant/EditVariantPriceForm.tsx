import { YStack } from 'tamagui'

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';


import React, { useCallback } from 'react';
import notify from '@/components/utils/Alerts/Notify';
import { CurrencyInput, InputError } from '@/components/utils/form/inputs';
import SubmitButton from '@/components/utils/form/SubmitButton';
import { useBusinessStore } from '@/utils/stores/businessStore';
import confirm from '@/components/utils/Alerts/Confirm';
import EditModalForm from '@/components/utils/ui/EditModalForm';

const schema = yup.object().shape({
  newPrice: yup
      .number()
      .typeError('The variant price must be a valid number') // Custom type error message
      .positive('The variant price must be greater than 0')
      .required('A variant price is required'),
});


export function EditVariantPriceForm({ serviceId, styleId, variantId, close }:
  { serviceId: number, styleId: number, variantId: number, close: () => void }) {

  const variant = useBusinessStore(
    state => state.services.get(serviceId)?.styles.get(styleId)?.variants.get(variantId)
  );
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const editVariantPrice = useBusinessStore((state) => state.editVariantPrice)
  const onSubmit = useCallback(async (data: { newPrice: number }) => {
    confirm(
      async () => {
        const { newPrice } = data;
        const { error } = await editVariantPrice(serviceId, styleId, variantId,  newPrice);
        if (error) console.log(error);
        else {
          notify("Price Changed", "Note that existing appointments will not be affected by this change.")
          close();
        }
      },
      "Edit Variant Price",
      "Are you sure you want to edit the Variant price?",
      "Edit",
      "Cancel",
      "default"
    );
    }, [editVariantPrice, serviceId, styleId, variantId, close]);

  return (
    <EditModalForm>
      <YStack
          alignItems="stretch"
          justifyContent="flex-start"
          minWidth="60%"
          width="100%"
          height="100%"
          gap="$5"
          padding="$7"
          paddingVertical="$6"
          $gtSm={{
          paddingVertical: '$4',
          width: 400,
          }}
      >
        <YStack gap="$3" width="100%">
          <YStack>
            <CurrencyInput
              control={control}
              label="Variant Price"
              name="newPrice"
              placeholder='0'
              textContentType="none"
              keyboardType="numeric"
              defaultValue={variant?.price.toString()}
              />
              {errors.newPrice && <InputError>{errors.newPrice.message?.toString()}</InputError>}
          </YStack>
        </YStack>
        <SubmitButton onPress={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
            Edit Variant Price
        </SubmitButton>
      </YStack>
    </EditModalForm>
  )
}