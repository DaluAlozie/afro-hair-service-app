import React from 'react'
import { AnimatePresence, Button, Spinner, Theme, useTheme } from 'tamagui';
import Pressable from '../Pressable';
import { View } from 'react-native';

type SubmitButtonProps = {
    children?: string;
    onPress: () => void;
    isSubmitting: boolean;
}

export default function SubmitButton({ children, onPress, isSubmitting }: SubmitButtonProps) {
    const theme = useTheme({inverse:true})
    return (
        <Theme inverse>
            <Pressable
                onPress={onPress}
                disabled={isSubmitting}
                activeOpacity={0.95}
                style={{
                    backgroundColor: theme.background.val,
                    height: 45,
                    flexDirection:'row',
                    justifyContent:'center',
                    alignSelf: "center",
                    width: "100%",
                    borderRadius: 7,
                    // : theme.color.val
                }}
                pressedStyle={{
                    backgroundColor: theme.onPressStyle.val,
                }}
            >
                <View style={{justifyContent: "center", width: "100%", height: "100%", alignItems: "center"}}>
                { isSubmitting ?
                    <AnimatePresence>
                        <Spinner
                            // themeInverse
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
                    </AnimatePresence> :
                    <Button.Text>{children}</Button.Text>
                }
                </View>
            </Pressable>
        </Theme>
    )
}
