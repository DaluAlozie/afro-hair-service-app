import { useTheme, UseThemeResult } from '@tamagui/core'
import React from 'react'
import { StyleSheet } from 'react-native'
import { View } from 'react-native-reanimated/lib/typescript/Animated';
import { StyleProps } from 'react-native-reanimated';

type CardProps = {
    children?: React.ReactNode;
    style: StyleProps
}

export default function Card({ children, style }: CardProps) {
    const theme = useTheme();
    const styles = makeStyles(theme);
    return (
        <View style={[styles.container, style]}>
            {children}
        </View>
    )
}

const makeStyles = (theme: UseThemeResult) => StyleSheet.create({
    container: {
        backgroundColor: theme.background075.val,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        padding: 5,
    },
})