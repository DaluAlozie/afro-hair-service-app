import { YStack } from 'tamagui'

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useBusinessStore } from '@/utils/stores/businessStore';
import { Input, InputError } from '@/components/utils/form/inputs';
import SubmitButton from '@/components/utils/form/SubmitButton';
import React, { useCallback } from 'react';
import confirm from '@/components/utils/Alerts/Confirm';
import EditModalForm from '@/components/utils/ui/EditModalForm';


const schema = yup.object().shape({
newName: yup
  .string()
  .required('The business name is required')
  .max(50, "The name exceeds the character limit of 50.")
});


export function EditBusinessNameForm({ close }: { close: () => void }) {

const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
  resolver: yupResolver(schema),
});

const name = useBusinessStore(state => state.name);
const editBusinessName = useBusinessStore((state) => state.editBusinessName)
const onSubmit = useCallback(async (data: { newName: string }) => {
  confirm(
    async () => {
      const { newName } = data;
      const { error } = await editBusinessName(newName);
      if (error) console.log(error);
      else close();
    },
    "Edit Business Name",
    "Are you sure you want to edit the business name?",
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
                    label="Business Name"
                    name="newName"
                    placeholder='Business Name'
                    textContentType="none"
                    defaultValue={name}
                    />
                {errors.newName && <InputError>{errors.newName.message?.toString()}</InputError>}
            </YStack>
        </YStack>
        <SubmitButton onPress={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
            Edit Business Name
        </SubmitButton>
      </YStack>
    </EditModalForm>
  )
}