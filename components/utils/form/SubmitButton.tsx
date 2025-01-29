import React from 'react';
import { AnimatePresence, Button, Spinner, useTheme } from 'tamagui';
import Pressable from '../Pressable';
import { View, StyleSheet } from 'react-native';
import { UseThemeResult } from '@tamagui/core';

type SubmitButtonProps = {
    children?: string | React.ReactNode;
    onPress: () => void;
    isSubmitting: boolean;
    disabled?: boolean;
};

export default function SubmitButton({ children, onPress, isSubmitting, disabled = false }: SubmitButtonProps) {
    const theme = useTheme();
    const inverseTheme = useTheme({ inverse: true });
    const styles = makeStyles(theme);
    return (
        <View style={styles.container}>
            <Pressable
                onPress={onPress}
                disabled={isSubmitting || disabled}
                activeOpacity={1}
                style={{
                    backgroundColor: inverseTheme.background.val,
                    height: 45,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    width: '100%',
                    borderRadius: 7,
                }}
                pressedStyle={{
                    backgroundColor: inverseTheme.onPressStyle?.val,
                }}
            >
                <View
                    style={{
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                    }}
                >
                    {isSubmitting ? (
                        <AnimatePresence>
                            <Spinner
                                color={inverseTheme.gray12.val}
                                key="loading-spinner"
                                opacity={1}
                                scale={1}
                                animation="quick"
                                enterStyle={{
                                    opacity: 1,
                                    scale: 0.5,
                                }}
                                exitStyle={{
                                    opacity: 1,
                                    scale: 0.5,
                                }}
                            />
                        </AnimatePresence>
                    ) : (
                        typeof children === 'string' ? (
                            <Button.Text style={{ color: inverseTheme.color.val }}>{children}</Button.Text>
                        ) : (
                            children
                        )
                    )}
                </View>
            </Pressable>
            {/* Dim overlay when the button is disabled */}
            {disabled && (
                <View style={styles.overlay} pointerEvents="none" />
            )}
        </View>
    );
}

const makeStyles = (theme: UseThemeResult) => StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme.overlay.val, // Semi-transparent dim effect
        borderRadius: 5,
    },
});
