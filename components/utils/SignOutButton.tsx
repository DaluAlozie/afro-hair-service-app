import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import Pressable from './Pressable'; // Ensure this points to your Pressable component
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/utils/stores/authStore';
import { useTheme } from 'tamagui';
import { UseThemeResult } from '@tamagui/web';
import useResetStores from '@/hooks/useResetStores';
import useToast from '@/hooks/useToast';

export default function SignOutButton() {
    const theme = useTheme();
    const router = useRouter();
    const signOut = useAuthStore((state) => state.signOut);
    const resetStores  = useResetStores();
    const { showToast } = useToast();

    const [disabled, setDisabled] = useState(false);
    const styles  = makeStyle(theme);
    const onPress = async () => {
        setDisabled(true);
        await resetStores();
        const { error } = await signOut();
        if (error) {
            showToast(
            'Something went wrong',
            error.message,
            "error",
            )
            setDisabled(false);
            return;
        }
        if (router.canDismiss()) router.dismissAll();
        router.replace("/landing")
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
