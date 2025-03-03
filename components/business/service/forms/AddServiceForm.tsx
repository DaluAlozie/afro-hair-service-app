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
import { useRouter } from 'expo-router';
import KeyboardAvoidingView from '@/components/utils/KeyboardAvoidingView';

const schema = yup.object().shape({
  name: yup
    .string()
    .required('The service name is required')
    .max(50, "The name exceeds the character limit of 50."),
  description: yup
    .string()
    .required('A description of the service is required')
    .max(50, "The description exceeds the character limit of 50.")
});

export function AddServiceForm() {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const addService = useBusinessStore((state) => state.addService)
  const onSubmit = useCallback(async (data: { name: string, description: string }) => {
    const { name, description } = data
    const { error } = await addService(name, description)
    if (error)console.log(error);
    else router.dismissTo("/services");
    reset()
  },[]);

  return (
      <KeyboardAvoidingView>
        <DismissKeyboard>
          <Form alignItems="center">
            <YStack
              alignItems="stretch"
              justifyContent="space-between"
              minWidth="60%"
              width="100%"
              maxWidth="100%"
              height="100%"
              gap="$5"
              padding="$7"
              paddingVertical="$6"
              $gtSm={{
                width: 400,
              }}
            >
              <YStack gap="$3">
                <YStack gap="$2">
                  <Input
                    control={control}
                    label="Service Name"
                    name="name"
                    placeholder='Service Name'
                    textContentType='organizationName'/>
                  {errors.name && <InputError>{errors.name.message?.toString()}</InputError>}
                </YStack>
                <YStack>
                <Input
                  control={control}
                  label="Service Description"
                  name="description"
                  placeholder='Description of the service'
                  textContentType="organizationName"
                  />
                {errors.description && <InputError>{errors.description.message?.toString()}</InputError>}
                </YStack>
              </YStack>
              <SubmitButton onPress={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
                  Add Service
              </SubmitButton>
            </YStack>
          </Form>
        </DismissKeyboard>
      </KeyboardAvoidingView>
  )
}