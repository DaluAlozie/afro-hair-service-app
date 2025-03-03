import React from "react"
import { useTheme } from "@tamagui/web"
import { Text, ScrollView, XStack, View } from "tamagui";
import Feather from '@expo/vector-icons/Feather';
import Pressable from "@/components/utils/Pressable";
import { router } from "expo-router";

export default function ServiceCover(
    {
        id,
        name,
        description,
    }: { id: number, name: string, description: string }
) {
    const theme = useTheme();

    return (
        <Pressable scale={0.98} onPress={() => router.push(`/service/${id}`)}
            style={{
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: 80,
            }}>
            <XStack>
                <ScrollView style={{ width: "100%", height: 60 }}>
                <Text
                    color={theme.color.val}
                    fontSize={24}
                    fontWeight={"bold"}
                >
                    {name}
                </Text>
                <Text>{description}</Text>
                </ScrollView>
                <View marginRight={-10}>
                    <Feather name="chevron-right" size={35} color={theme.color.val} />
                </View>
            </XStack>
        </Pressable>
    )
}
