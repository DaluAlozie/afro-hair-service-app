import {
  Paragraph,
  SizableText,
  YStack,
  XStack,
  Form,
  useTheme
} from 'tamagui'
import DismissKeyboard from '../utils/DismissKeyboard'
import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useAuthStore } from '@/utils/stores/authStore';
import { AuthStore } from '@/utils/stores/authStore';
import { Input, InputError } from '../utils/form/inputs';
import { useRouter } from 'expo-router';
import SubmitButton from '../utils/form/SubmitButton';
import FormTitle from '../utils/form/FormTitle';
import { useHeaderHeight } from '@react-navigation/elements';
import { useToastController } from '@tamagui/toast';
import { showToast } from '../utils/Toast/CurrentToast';
import Link from '../utils/Link';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  surname: yup.string().required('Surname is required'),
  email: yup.string().required('Email is required').email("Please enter a valid email"),
  password: yup.string().required('Password is required').min(8,"Password must be at least 8 characters"),
  confirmPassword: yup.string().oneOf([yup.ref('password'), undefined], 'Passwords must match')
});

export function SignUpForm() {
  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const theme = useTheme();
  const router = useRouter();
  const toast = useToastController();
  const headerHeight = useHeaderHeight();
  const signUp = useAuthStore((state: AuthStore) => state.signUp);

  const onSubmit = useCallback(async (data: { firstName: string, surname: string, email: string; password: string; }) => {
    const { error } = await signUp(data.email, data.password)

    if (error) {
      showToast(
        toast,
        "Something went wrong",
        error.message,
        "error",
        headerHeight
      );
      return;
    }
    showToast(
      toast,
      "Account Created Successfully !",
      "A verification link was sent to your Email",
      "info",
      headerHeight
    );
    router.push("/login");
    reset();
  },[]);

  return (
    <DismissKeyboard>
      <Form alignItems='center' backgroundColor={theme.background.val}>
        <YStack
          alignItems="stretch"
          justifyContent="center"
          minWidth="60%"
          width="100%"
          maxWidth="100%"
          height="100%"
          gap="$6"
          padding="$7"
          paddingVertical="$6"
          $gtSm={{
            paddingVertical: '$4',
            width: 400,
          }}
        >
          <FormTitle>Create an Account</FormTitle>
          <YStack gap="$1" width="100%">
            <XStack gap="$3" width="100%" justifyContent="space-between">
              <YStack gap="$2" flex={1}>
                <Input
                  control={control}
                  label="First Name"
                  name="firstName"
                  placeholder='First Name'
                  textContentType='givenName'/>
                {errors.firstName && <InputError>{errors.firstName.message?.toString()}</InputError>}
              </YStack>
              <YStack gap="$2" flex={1}>
                <Input
                  control={control}
                  label="Surname"
                  name="surname"
                  placeholder='Surname'
                  textContentType='familyName'/>
                {errors.surname && <InputError>{errors.surname.message?.toString()}</InputError>}
             </YStack>
            </XStack>
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
            </YStack>
            <YStack gap="$2" width="100%">
              <Input
                control={control}
                label="Confirm Password"
                name="confirmPassword"
                placeholder='Confirm Password'
                textContentType='password'
                secureTextEntry/>
              {errors.confirmPassword && <InputError>{errors.confirmPassword.message?.toString()}</InputError>}
            </YStack>
          </YStack>
          <SubmitButton onPress={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
            Sign Up
          </SubmitButton>
          <SignInLink />
        </YStack>
      </Form>
    </DismissKeyboard>
  )
}


const SignInLink = () => {
  return (
    <Link href={{ pathname: '/login' }}>
      <Paragraph textDecorationStyle="unset" ta="center">
        Already have an account?{' '}
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