import React from 'react';
import { AnimatePresence, Button, Spinner, useTheme } from 'tamagui';
import Pressable from '../Pressable';
import { View, StyleSheet } from 'react-native';
import { StyleProps } from 'react-native-reanimated';

type SubmitButtonProps = {
    children?: string | React.ReactNode;
    onPress: () => void;
    isSubmitting: boolean;
    disabled?: boolean;
    style?: StyleProps | undefined;
};

export default function SubmitButton({ children, onPress, isSubmitting, style, disabled = false }: SubmitButtonProps) {
    const theme = useTheme();
    return (
        <View style={styles.container}>
            <Pressable
                onPress={onPress}
                disabled={isSubmitting || disabled}
                activeOpacity={1}
                style={[{
                    backgroundColor: theme.accent.val,
                    height: 50,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    width: '100%',
                    borderRadius: 200,
                    opacity: isSubmitting || disabled ? 0.5: 1,
                }, style]}
                pressedStyle={{
                    opacity: 0.7,
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
                                color={theme.white1.val}
                                key="loading-spinner"
                                opacity={0.8}
                                scale={1}
                                animation="quick"
                                enterStyle={{
                                opacity: 1,
                                    scale: 1,
                                }}
                                exitStyle={{
                                    opacity: 1,
                                    scale: 1,
                                }}
                            />
                        </AnimatePresence>
                    ) : (
                        typeof children === 'string' ? (
                            <Button.Text style={{ color: theme.white1.val, fontSize: 16 }}>{children}</Button.Text>
                        ) : (
                            children
                        )
                    )}
                </View>
            </Pressable>
            {/* Dim overlay when the button is disabled */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
    },
});
