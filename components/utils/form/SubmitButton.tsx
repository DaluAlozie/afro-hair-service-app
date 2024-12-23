import React from 'react'
import { AnimatePresence, Button, Spinner, Theme, useTheme } from 'tamagui';

type SubmitButtonProps = {
    children: string;
    onPress: () => void;
    isSubmitting: boolean;
}

export default function SubmitButton({ children, onPress, isSubmitting }: SubmitButtonProps) {
    const theme = useTheme({inverse:true})
    return (
        <Theme inverse>
            <Button
                flexDirection='row'
                justifyContent='center'
                disabled={isSubmitting}
                onPress={onPress}
                width="100%"
                pressStyle= {{
                    backgroundColor: theme.onPressStyle, // #bbb
                    borderColor: theme.onPressStyle
                }}
            >
            { isSubmitting ?
                (
                    <AnimatePresence>
                        <Spinner
                            themeInverse
                            color="$color"
                            key="loading-spinner"
                            opacity={1}
                            scale={1}
                            animation="quick"
                            enterStyle={{
                                opacity: 0,
                                scale: 0.5,
                            }}
                            exitStyle={{
                                opacity: 0,
                                scale: 0.5,
                            }}
                        />
                </AnimatePresence>
                ) : <Button.Text>{children}</Button.Text>
            }
            </Button>
        </Theme>
    )
}
