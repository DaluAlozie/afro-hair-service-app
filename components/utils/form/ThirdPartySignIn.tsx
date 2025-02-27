import { AuthProps } from '@/utils/stores/authStore'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Button, useTheme, XStack } from 'tamagui'
import Pressable from '../Pressable'
import { UseThemeResult } from '@tamagui/web'
import { StyleSheet } from 'react-native'
import useToast from '@/hooks/useToast'

type ThirdPartySignInProps = {
    name: string
    children: React.ReactNode
    onPress: () => Promise<AuthProps>
}

export default function ThirdPartySignIn({ name, children, onPress }: ThirdPartySignInProps) {
  const router = useRouter();
  const theme = useTheme();
  const [disabled, setDisabled] = useState(false);
  const styles = makeStyle(theme);
  const { showToast } = useToast();

  const onClick = async () => {
    setDisabled(true);
    const { error } = await onPress();
    setDisabled(false);

    if (error) {
      showToast(
        'Something went wrong',
        error.message,
        "error",
      )
      return;
    }
    if (router.canDismiss()) router.dismissAll();
    router.replace("/(tabs)");
  }
  return (
    <Pressable
      onPress={onClick}
      style={styles.button}
      pressedStyle={styles.buttonPressed}
      activeOpacity={0.95}
      disabled={disabled}
      >
        <XStack width="100%" height="100%" justifyContent="center" gap="$2" alignItems="center">
            <Button.Icon>
                { children }
            </Button.Icon>
            <Button.Text style={styles.buttonText}>Continue with { name } </Button.Text>
        </XStack>
    </Pressable>
  )
}

const makeStyle = (theme: UseThemeResult) => StyleSheet.create({
  button: {
    backgroundColor: theme.section.val,
    height: 45,
    flexDirection:'row',
    justifyContent:'center',
    alignSelf: "center",
    width: "100%",
    borderRadius: 100,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: theme.color.val,
    fontSize: 14,
  },
});
