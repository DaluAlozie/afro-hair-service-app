import { YStack } from 'tamagui'

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useBusinessStore } from '@/utils/stores/businessStore';
import { Input, InputError } from '../../../utils/form/inputs';
import React, { useCallback } from 'react';
import SubmitButton from '../../../utils/form/SubmitButton';
import confirm from '../../../utils/Alerts/Confirm';
import EditModalForm from '@/components/utils/ui/EditModalForm';

const schema = yup.object().shape({
  newDescription: yup
    .string()
    .required('The service description is required')
    .max(50, "The description exceeds the character limit of 50.")
});


export function EditDescriptionForm({ serviceId, close }:
  { serviceId: number, close: () => void }) {

  const description = useBusinessStore(state => state.services.get(serviceId)?.description);
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const editServiceDescription = useBusinessStore((state) => state.editServiceDescription)
  const onSubmit = useCallback(async (data: { newDescription: string }) => {
    confirm(
      async () => {
        const { newDescription } = data;
        const { error } = await editServiceDescription(serviceId, newDescription);
        if (error) console.log(error);
        else close();
      },
      "Edit Service Description",
      "Are you sure you want to edit the service description?",
      "Edit",
      "Cancel",
      "default"
    );
    },[]);

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
                  <Input
                      control={control}
                      label="Service Description"
                      name="newDescription"
                      placeholder='Service Description'
                      textContentType="none"
                      defaultValue={description}
                      />
                  {errors.newDescription && <InputError>{errors.newDescription.message?.toString()}</InputError>}
              </YStack>
          </YStack>
          <SubmitButton onPress={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
              Edit Service Description
          </SubmitButton>
        </YStack>
    </EditModalForm>
  )
}