import { FontAwesome } from '@expo/vector-icons';
import React from 'react'
import { ViewStyle } from 'react-native';
import { Input, useTheme, useWindowDimensions, View, XStack } from 'tamagui';

type SearchBarProps = {
    input: string;
    setInput: (text: string) => void;
    showResults: () => void;
    placeholder: string;
    style?: ViewStyle | undefined
}

export default function SearchBar({ input, setInput, showResults, placeholder, style }: SearchBarProps) {
    const { width } = useWindowDimensions();
    const theme = useTheme();
    return (
        <XStack style={[{
            borderRadius: 100,
            height: 50,
            width: '100%',
            zIndex: 1,
            borderWidth: 1,
            borderColor: theme.gray4.val,
            backgroundColor: theme.section.val,
            paddingHorizontal: 20,
            alignItems: 'center',
        }, style]}>
            <View style={{ alignItems: 'flex-start', justifyContent: 'center', width: "5%" }}>
                <FontAwesome name="search" size={width <= 500 ? 16 : 20} color={theme.gray9.val} />
            </View>
            <Input
                style={{
                    width: '95%',
                    backgroundColor: "none",
                    borderWidth: 0,
                    borderColor: "none",
                    outline: "none",
                    outlineColor: "none",
                }}
                borderWidth={0}
                placeholder={placeholder}
                value={input}
                onChangeText={(text) => {
                    setInput(text);
                    showResults();
                }}
                onFocus={showResults}
            />
        </XStack>
    )
}

