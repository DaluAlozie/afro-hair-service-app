import {
  YStack,
  Form,
  useTheme,
} from 'tamagui'

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useBusinessStore } from '@/utils/stores/businessStore';
import DismissKeyboard from '@/components/utils/DismissKeyboard';
import { Input, InputError } from '@/components/utils/form/inputs';
import SubmitButton from '@/components/utils/form/SubmitButton';
import React, { useCallback } from 'react';
import confirm from '@/components/utils/Alerts/Confirm';


const schema = yup.object().shape({
newFacebook: yup
  .string()
  .max(50, "The facebook handle exceeds the character limit of 50.")
});


export function EditBusinessFacebookForm({ close }: { close: () => void }) {

const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
  resolver: yupResolver(schema),
});

const theme = useTheme();
const facebook = useBusinessStore(state => state.facebook);
const editBusinessFacebook = useBusinessStore((state) => state.editBusinessFacebook)
const onSubmit = useCallback(async (data: { newFacebook?: string | undefined }) => {
  confirm(
    async () => {
      const { newFacebook } = data;
      const { error } = await editBusinessFacebook(newFacebook??null);
      if (error) console.log(error);
      else close();
    },
    "Edit Facebook",
    "Are you sure you want to edit the business facebook ?",
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
                      label="Facebook"
                      name="newFacebook"
                      placeholder='Facebook'
                      textContentType="none"
                      defaultValue={facebook ?? ""}
                      />
                  {errors.newFacebook && <InputError>{errors.newFacebook.message?.toString()}</InputError>}
              </YStack>
          </YStack>
          <SubmitButton onPress={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
              Edit Facebook
          </SubmitButton>
        </YStack>
    </Form>
  </DismissKeyboard>
)
}