import {
  Paragraph,
  Separator,
  SizableText,
  Theme,
  YStack,
  XStack,
  Form,
  useTheme
} from 'tamagui'

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useAuthStore } from '@/utils/stores/authStore';
import DismissKeyboard from '../utils/DismissKeyboard';
import { Input, InputError } from '../utils/form/inputs';
import AppleLogin from '../utils/form/AppleLogin';
import React, { useCallback } from 'react';
import AzureLogin from '../utils/form/AzureLogin';
import GoogleLogin from '../utils/form/GoogleLogin';
import { useRouter } from 'expo-router';
import SubmitButton from '../utils/form/SubmitButton';
import { useToastController } from '@tamagui/toast';
import { useHeaderHeight } from '@react-navigation/elements';
import { showToast } from '../utils/Toast/CurrentToast';
import Link from '../utils/Link';

const schema = yup.object().shape({
  email: yup.string().required('Email is required').email("Please enter a valid email"),
  password: yup.string().required('Password is required'),
});


export function LoginForm() {
  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const theme = useTheme();
  const router = useRouter();
  const toast = useToastController();
  const headerHeight = useHeaderHeight();

  const signIn = useAuthStore((state) => state.signIn);
  const onSubmit = useCallback(async (data: { email: string; password: string; }) => {
    const { error } = await signIn(data.email, data.password);
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
    if (router.canDismiss()) router.dismissAll();
    router.replace("/(tabs)");
    reset();
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
          gap="$4"
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
                label="Email"
                name="email"
                placeholder='email@example.com'
                textContentType='emailAddress'/>
              {errors.email && <InputError>{errors.email.message?.toString()}</InputError>}
            </YStack>
            <YStack gap="$2" width="100%">
              <Input
                control={control}
                label="Password"
                name="password"
                placeholder='Password'
                textContentType='password'
                secureTextEntry/>
              {errors.password && <InputError>{errors.password.message?.toString()}</InputError>}
              <YStack width="100%" alignItems="flex-end">
                  <ForgotPasswordLink />
              </YStack>
            </YStack>
          </YStack>
          <SubmitButton onPress={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
            Sign In
          </SubmitButton>
          <YStack gap="$3" width="100%" alignItems="center">
            <Theme>
              <YStack
                gap="$3"
                width="100%"
                alignItems="center"
              >
                <XStack width="100%" alignItems="center" gap="$4">
                  <Separator />
                  <Paragraph>Or</Paragraph>
                  <Separator />
                </XStack>
                <YStack flexWrap="wrap" gap="$3">
                  <GoogleLogin></GoogleLogin>
                  <AppleLogin></AppleLogin>
                  <AzureLogin></AzureLogin>
                </YStack>
              </YStack>
            </Theme>
          </YStack>
          <SignUpLink />
        </YStack>
      </Form>
    </DismissKeyboard>
  )
}

const SignUpLink = () => {
  return (
    <Link href={{ pathname: '/signUp' }}>
      <Paragraph textDecorationStyle="unset" ta="center">
        Don&apos;t have an account?{' '}
        <SizableText
          hoverStyle={{
            color: '$colorHover',
          }}
          textDecorationLine="underline"
        >
          Sign up
        </SizableText>
      </Paragraph>
    </Link>
  )
}

const ForgotPasswordLink = () => {
  return (
    <Link href={{ pathname: '/forgotPassword' }}>
      <SizableText
          color="$gray11"
          hoverStyle={{
            color: '$gray12',
          }}
          size="$1"
          marginTop="$1"
          textDecorationLine="underline"
        >
          Forgot Password
        </SizableText>
    </Link>
  )
}
