import { YStack } from 'tamagui'

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useBusinessStore } from '@/utils/stores/businessStore';
import { FormattedInput, InputError } from '@/components/utils/form/inputs';
import SubmitButton from '@/components/utils/form/SubmitButton';
import React, { useCallback } from 'react';
import confirm from '@/components/utils/Alerts/Confirm';
import EditModalForm from '@/components/utils/ui/EditModalForm';


const schema = yup.object().shape({
newInstagram: yup
  .string()
  .max(50, "The instagram handle exceeds the character limit of 50.")
});


export function EditBusinessInstagramForm({ close }: { close: () => void }) {

const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
  resolver: yupResolver(schema),
});

const instagram = useBusinessStore(state => state.instagram);
const editBusinessInstagram = useBusinessStore((state) => state.editBusinessInstagram)
const onSubmit = useCallback(async (data: { newInstagram?: string | undefined }) => {
  confirm(
    async () => {
      const { newInstagram } = data;
      const { error } = await editBusinessInstagram(newInstagram??null);
      if (error) console.log(error);
      else close();
    },
    "Edit Instagram",
    "Are you sure you want to edit the business instagram ?",
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
                <FormattedInput
                    control={control}
                    label="Instagram"
                    name="newInstagram"
                    placeholder='Instagram'
                    textContentType="none"
                    defaultValue={instagram ?? ""}
                    symbol='@'
                    />
                {errors.newInstagram && <InputError>{errors.newInstagram.message?.toString()}</InputError>}
            </YStack>
        </YStack>
        <SubmitButton onPress={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
            Edit Instagram
        </SubmitButton>
      </YStack>
  </EditModalForm>
)
}