import {
  YStack,
  Form
} from 'tamagui'

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useAuthStore } from '@/utils/stores/authStore';
import DismissKeyboard from '../utils/DismissKeyboard';
import { Input, InputError } from '../utils/form/inputs';
import React, { useCallback } from 'react';
import SubmitButton from '../utils/form/SubmitButton';
import useToast from '@/hooks/useToast';

const schema = yup.object().shape({
  password: yup.string().required('Password is required').min(8,"Password must be at least 8 characters"),
  confirmPassword: yup.string().oneOf([yup.ref('password'), undefined], 'Passwords must match')
});

export function ResetPasswordForm() {
  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
  });
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const { showToast } = useToast();

  const onSubmit = useCallback(async (data: { password: string; }) => {
    const { error } = await resetPassword(data.password);
    if (error) {
      showToast(
        'Something went wrong',
        error.message,
        "error",
      )
      return;
    }
    showToast(
      'Password Changed Successfully !',
      "You can now sign in with your new password",
      "success",
    );
    reset();
  },[]);

  return (
    <DismissKeyboard>
      <Form alignItems='center'>
        <YStack
          alignItems="stretch"
          justifyContent="center"
          minWidth="60%"
          width="100%"
          maxWidth="100%"
          height="100%"
          gap="$4"
          padding="$7"
          paddingVertical="$6"
          $gtSm={{
            paddingVertical: '$4',
            width: 400,
          }}
        >
          <YStack gap="$3" width="100%">
          <YStack gap="$2" width="100%">
              <Input
                control={control}
                label="New Password"
                name="password"
                placeholder='New Password'
                textContentType='password'
                secureTextEntry/>
              {errors.password && <InputError>{errors.password.message?.toString()}</InputError>}
            </YStack>
            <YStack gap="$2" width="100%">
              <Input
                control={control}
                label="Confirm New Password"
                name="confirmPassword"
                placeholder='Confirm New Password'
                textContentType='password'
                secureTextEntry/>
              {errors.confirmPassword && <InputError>{errors.confirmPassword.message?.toString()}</InputError>}
            </YStack>
          </YStack>
          <SubmitButton onPress={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
            Reset Password
          </SubmitButton>
        </YStack>
      </Form>
    </DismissKeyboard>
  )
}