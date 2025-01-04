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

const phoneNumberValidation = new RegExp(
  "^(\\s*|\\+?\\d{1,4}[-.\\s]?\\(?\\d{1,4}\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9})$"
);

const schema = yup.object().shape({
newNumber: yup
  .string()
  .max(25, "Invalid contact number")
  .matches(phoneNumberValidation, "Invalid contact number"),
});


export function EditBusinessPhoneNumberForm({ close }: { close: () => void }) {

const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
  resolver: yupResolver(schema),
});

const theme = useTheme();
const phoneNumber = useBusinessStore(state => state.phoneNumber);
const editBusinessPhoneNumber = useBusinessStore((state) => state.editBusinessPhoneNumber)
const onSubmit = useCallback(async (data: { newNumber?: string | undefined }) => {
  confirm(
    async () => {
      const { newNumber } = data;
      const { error } = await editBusinessPhoneNumber(newNumber ?? null);
      if (error) console.log(error);
      else close();
    },
    "Edit Contact Number",
    "Are you sure you want to edit the contact number ?",
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
                      label="Phone Number"
                      name="newNumber"
                      placeholder='0123456789'
                      textContentType="telephoneNumber"
                      defaultValue={phoneNumber ?? ""}
                      />
                  {errors.newNumber && <InputError>{errors.newNumber.message?.toString()}</InputError>}
              </YStack>
          </YStack>
          <SubmitButton onPress={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
              Edit Contact Number
          </SubmitButton>
        </YStack>
    </Form>
  </DismissKeyboard>
)
}