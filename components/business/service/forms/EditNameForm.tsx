import {
    YStack,
    Form,
  } from 'tamagui'

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useBusinessStore } from '@/utils/stores/businessStore';
import DismissKeyboard from '../../../utils/DismissKeyboard';
import { Input, InputError } from '../../../utils/form/inputs';
import React, { useCallback } from 'react';
import SubmitButton from '../../../utils/form/SubmitButton';
import { useTheme  } from 'tamagui';
import confirm from '../../../utils/Alerts/Confirm';

const schema = yup.object().shape({
  newName: yup
    .string()
    .required('The service name is required')
    .max(50, "The name exceeds the character limit of 50."),
});


export function EditServiceNameForm({ serviceId, close }:
  { serviceId: number, close: () => void }) {

  const name = useBusinessStore(state => state.services.get(serviceId)?.title);
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const theme = useTheme();
  const editServiceName = useBusinessStore((state) => state.editServiceName)
  const onSubmit = useCallback(async (data: { newName: string }) => {
    confirm(
      async () => {
        const { newName } = data;
        const { error } = await editServiceName(serviceId, newName);
        if (error) console.log(error);
        else close();
      },
      "Edit Service Name",
      "Are you sure you want to edit the service name?",
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
                    <Input
                        control={control}
                        label="Service Name"
                        name="newName"
                        placeholder='Service Name'
                        textContentType="none"
                        defaultValue={name}
                        />
                    {errors.newName && <InputError>{errors.newName.message?.toString()}</InputError>}
                </YStack>
            </YStack>
            <SubmitButton onPress={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
                Edit Service Name
            </SubmitButton>
          </YStack>
      </Form>
    </DismissKeyboard>
  )
}