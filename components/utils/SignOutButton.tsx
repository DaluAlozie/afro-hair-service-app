import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import Pressable from './Pressable'; // Ensure this points to your Pressable component
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/utils/stores/authStore';
import { useHeaderHeight } from '@react-navigation/elements';
import { useToastController } from '@tamagui/toast';
import { useTheme } from 'tamagui';
import { showToast } from './Toast/CurrentToast';
import { UseThemeResult } from '@tamagui/web';

export default function SignOutButton() {
    const theme = useTheme();
    const router = useRouter();
    const toast = useToastController();
    const headerHeight = useHeaderHeight();
    const signOut = useAuthStore((state) => state.signOut)
    const [disabled, setDisabled] = useState(false);
    const styles  = makeStyle(theme);
    const onPress = async () => {
        setDisabled(true);
        const { error } = await signOut();
        if (error) {
            showToast(
            toast,
            'Something went wrong',
            error.message,
            "error",
            headerHeight
            )
            setDisabled(false);
            return;
        }
        if (router.canDismiss()) router.dismissAll();
        router.replace("/login")
        setDisabled(false);
    }
    return (
        <Pressable style={styles.button} disabled={disabled} onPress={onPress}>
            <Text style={styles.text}>
                Log out
            </Text>
        </Pressable>
    );
}

const makeStyle = (theme: UseThemeResult) => StyleSheet.create({
  button: {
    height: 50,
    alignSelf: "flex-end",
  },
  text: {
    color: theme.danger.val,
    fontSize: 16,
    fontWeight: "bold",
  },
});
