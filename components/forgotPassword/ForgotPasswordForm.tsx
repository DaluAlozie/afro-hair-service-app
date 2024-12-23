import {
  Paragraph,
  SizableText,
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
import { Link } from 'expo-router';
import SubmitButton from '../utils/form/SubmitButton';
import { useHeaderHeight } from '@react-navigation/elements';
import { useTheme } from 'tamagui';
import { useToastController } from '@tamagui/toast';
import { showToast } from '../utils/Toast/CurrentToast';

const schema = yup.object().shape({
  email: yup.string().required('Email is required').email("Please enter a valid email"),
});


export function ForgotPasswordForm() {
  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const toast = useToastController();
  const theme = useTheme();
  const headerHeight = useHeaderHeight();

  const onSubmit = useCallback(async (data: { email: string }) => {
    const { error } = await forgotPassword(data.email);
    if (error) {
      showToast(
        toast,
        'Something went wrong',
        error.message,
        "error",
        headerHeight
      )
      return;
    }
    showToast(
      toast,
      "Recovery link sent to email",
      "Check your inbox",
      "info",
      headerHeight
    );
    reset()
  },[]);

  return (
    <DismissKeyboard>
      <Form alignItems='center' backgroundColor={theme.background}>
        <YStack
          alignItems="stretch"
          justifyContent="center"
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
          <YStack gap="$3" width="100%">
            <YStack gap="$2">
              <Input
                control={control}
                label="Enter your email"
                name="email"
                placeholder='email@example.com'
                textContentType='emailAddress'/>
              {errors.email && <InputError>{errors.email.message?.toString()}</InputError>}
            </YStack>
          </YStack>
          <SubmitButton onPress={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
              Reset Password
          </SubmitButton>
          <SignInLink/>
        </YStack>
      </Form>
    </DismissKeyboard>
  )
}

const SignInLink = () => {
  return (
    <Link href={{ pathname: '/login' }}>
      <Paragraph textDecorationStyle="unset" ta="center">
        Remember Password ?{' '}
        <SizableText
          hoverStyle={{
            color: '$colorHover',
          }}
          textDecorationLine="underline"
        >
          Sign in
        </SizableText>
      </Paragraph>
    </Link>
  )
}
