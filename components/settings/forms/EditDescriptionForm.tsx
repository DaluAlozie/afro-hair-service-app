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
newDescription: yup
  .string()
  .required('The business description is required')
  .max(50, "The description exceeds the character limit of 50.")
});

export function EditBusinessDescriptionForm({ close }: { close: () => void }) {

const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
  resolver: yupResolver(schema),
});

const description = useBusinessStore(state => state.description);
const editBusinessDescription = useBusinessStore((state) => state.editBusinessDescription)
const onSubmit = useCallback(async (data: { newDescription: string }) => {
  confirm(
    async () => {
      const { newDescription } = data;
      const { error } = await editBusinessDescription(newDescription);
      if (error) console.log(error);
      else close();
    },
    "Edit Business Description",
    "Are you sure you want to edit the business description?",
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
                      label="Business Description"
                      name="newDescription"
                      placeholder='Business Description'
                      textContentType="none"
                      defaultValue={description}
                      />
                  {errors.newDescription && <InputError>{errors.newDescription.message?.toString()}</InputError>}
              </YStack>
          </YStack>
          <SubmitButton onPress={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
              Edit Business Description
          </SubmitButton>
        </YStack>
    </EditModalForm>
  )
}