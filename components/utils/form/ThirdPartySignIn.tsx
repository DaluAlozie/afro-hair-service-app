import { AuthProps } from '@/utils/stores/authStore'
import { useHeaderHeight } from '@react-navigation/elements'
import { useToastController } from '@tamagui/toast'
import { useRouter } from 'expo-router'
import React from 'react'
import { Button, XStack } from 'tamagui'
import { showToast } from '../Toast/CurrentToast'

type ThirdPartySignInProps = {
    name: string
    children: React.ReactNode
    onPress: () => Promise<AuthProps>
}

export default function ThirdPartySignIn({ name, children, onPress }: ThirdPartySignInProps) {
  const router = useRouter();
  const toast = useToastController();
  const headerHeight = useHeaderHeight();

  const onClick = async () => {
    const { error } = await onPress();
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
      'Sign in successful !',
      "Welcome to ....",
      "success",
      headerHeight
    );
    if (router.canDismiss()) router.dismissAll();
    router.replace("/");
  }
  return (
    <Button width="100%" onPress={onClick}>
        <XStack width="100%" justifyContent="center" gap="$2">
            <Button.Icon>
                { children }
            </Button.Icon>
            <Button.Text>Continue with { name } </Button.Text>
        </XStack>
    </Button>
  )
}