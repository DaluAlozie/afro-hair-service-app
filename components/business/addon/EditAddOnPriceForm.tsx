import {
    YStack,
    Form,
  } from 'tamagui'

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useBusinessStore } from '@/utils/stores/businessStore';
import DismissKeyboard from '../../utils/DismissKeyboard';
import { CurrencyInput, InputError } from '../../utils/form/inputs';
import React, { useCallback } from 'react';
import SubmitButton from '../../utils/form/SubmitButton';
import { useTheme  } from 'tamagui';
import confirm from '../../utils/Alerts/Confirm';
import notify from '@/components/utils/Alerts/Notify';

const schema = yup.object().shape({
  newPrice: yup
      .number()
      .typeError('The add on price must be a valid number') // Custom type error message
      .positive('The add on price must be greater than 0')
      .required('An add on price is required'),
});


export function EditAddOnPriceForm({ serviceId, serviceOptionId, addOnId, close }:
  { serviceId: number, serviceOptionId: number, addOnId: number, close: () => void }) {

  const addOn = useBusinessStore(
    state => state.services.get(serviceId)?.service_options.get(serviceOptionId)?.addOns.get(addOnId)
  );
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const theme = useTheme();
  const editAddOnPrice = useBusinessStore((state) => state.editAddOnPrice)
  const onSubmit = useCallback(async (data: { newPrice: number }) => {
    confirm(
      async () => {
        const { newPrice } = data;
        const { error } = await editAddOnPrice(serviceId, serviceOptionId, addOnId,  newPrice);
        if (error) console.log(error);
        else {
          notify("Price Changed", "Note that existing appointments will not be affected by this change.");
          close();
        };
      },
      "Edit add on price",
      "Are you sure you want to edit the add on price?",
      "Edit",
      "Cancel",
      "default"
    );
    },[]);

  return (
    <DismissKeyboard>
      <Form alignItems="center" height={300} width={"100%"} backgroundColor={theme.background.val}>
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
                label="Add On Price"
                name="newPrice"
                placeholder='0'
                textContentType="none"
                keyboardType="numeric"
                defaultValue={addOn?.price.toString()}
                />
                {errors.newPrice && <InputError>{errors.newPrice.message?.toString()}</InputError>}
            </YStack>
          </YStack>
          <SubmitButton onPress={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
              Edit Add On Price
          </SubmitButton>
        </YStack>
      </Form>
    </DismissKeyboard>
  )
}