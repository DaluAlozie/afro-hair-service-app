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
  newTwitter: yup
    .string()
    .max(90, "The twitter handle exceeds the character limit of 50.")
});

export function EditBusinessTwitterForm({ close }: { close: () => void }) {

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const twitter = useBusinessStore(state => state.twitter);
  const editBusinessTwitter = useBusinessStore((state) => state.editBusinessTwitter)
  const onSubmit = useCallback(async (data: { newTwitter?: string | undefined}) => {
    confirm(
      async () => {
        const { newTwitter } = data;
        const { error } = await editBusinessTwitter(newTwitter ?? null);
        if (error) console.log(error);
        else close();
      },
      "Edit Business Twitter",
      "Are you sure you want to edit the business twitter?",
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
                    label="Twitter"
                    name="newTwitter"
                    placeholder='Twitter'
                    textContentType="none"
                    defaultValue={twitter??""}
                    symbol='@'
                    />
                {errors.newTwitter && <InputError>{errors.newTwitter.message?.toString()}</InputError>}
            </YStack>
        </YStack>
        <SubmitButton onPress={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
            Edit Twitter
        </SubmitButton>
      </YStack>
    </EditModalForm>
  )
}