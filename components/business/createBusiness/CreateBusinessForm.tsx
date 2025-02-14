import {
  YStack,
  Form,
} from 'tamagui'

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useBusinessStore } from '@/utils/stores/businessStore';
import DismissKeyboard from '../../utils/DismissKeyboard';
import { Input, InputError } from '../../utils/form/inputs';
import React, { useCallback } from 'react';
import SubmitButton from '../../utils/form/SubmitButton';
import { useTheme } from 'tamagui';
import { useRouter } from 'expo-router';

const phoneNumberValidation = new RegExp(
  "^(\\s*|\\+?\\d{1,4}[-.\\s]?\\(?\\d{1,4}\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9})$"
);

const schema = yup.object().shape({
  name: yup
    .string()
    .required('The business name is required')
    .max(50, "The name exceeds the character limit of 50.o."),
  description: yup
    .string()
    .required('A description of the business is required')
    .max(50, "The description exceeds the character limit of 50."),
  number: yup
    .string()
    .max(25, "Invalid contact number")
    .matches(phoneNumberValidation, "Invalid contact number"),
});

export function CreateBusinessForm() {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const theme = useTheme();
  const createBusiness = useBusinessStore((state) => state.createBusiness)
  const onSubmit = useCallback(async (data: { name: string, number?: string, description: string }) => {
    const { name, number, description } = data
    const { error } = await createBusiness(name, number ?? null, description)
    if (error)console.log(error);
    else router.dismissTo("/(business)");
    reset()
  },[]);

  return (
    <DismissKeyboard>
      <Form alignItems="center" backgroundColor={theme.background}>
        <YStack
          alignItems="stretch"
          justifyContent="flex-start"
          marginTop="$14"
          minWidth="60%"
          width="100%"
          maxWidth="100%"
          height="100%"
          gap="$5"
          padding="$7"
          paddingVertical="$6"
          $gtSm={{
            paddingVertical: '$4',
            width: 400,
          }}
        >
          <YStack gap="$3">
            <YStack gap="$2">
              <Input
                control={control}
                label="Business Name"
                name="name"
                placeholder='Business Name'
                textContentType='organizationName'/>
              {errors.name && <InputError>{errors.name.message?.toString()}</InputError>}
            </YStack>
            <YStack>
            <Input
              control={control}
              label="Business Description"
              name="description"
              placeholder='Description of the business'
              textContentType="organizationName"
              />
            {errors.description && <InputError>{errors.description.message?.toString()}</InputError>}
            </YStack>
            <YStack>
            <Input
              control={control}
              label="Contact Number"
              name="number"
              placeholder='0123456789'
              textContentType="telephoneNumber"/>
              {errors.number && <InputError>{errors.number.message?.toString()}</InputError>}
            </YStack>
          </YStack>
          <SubmitButton onPress={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
              Start Business
          </SubmitButton>
        </YStack>
      </Form>
    </DismissKeyboard>
  )
}