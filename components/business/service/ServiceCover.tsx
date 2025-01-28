import React from "react"
import { useTheme } from "@tamagui/web"
import { View, Text, ScrollView } from "tamagui";
import Feather from '@expo/vector-icons/Feather';
import Pressable from "@/components/utils/Pressable";
import { router } from "expo-router";

export default function ServiceCover(
    {
        id,
        title,
        description,
    }: { id: number, title: string, description: string }
) {
    const theme = useTheme();

    return (
        <View
            flexDirection='row'
            justifyContent='space-between'
            alignItems="center"
            alignSelf="center"
            width={"100%"}
            height={"auto"}
            padding={25}
            paddingRight={10}
            backgroundColor={theme.section.val}
            marginVertical={10}
            borderRadius={10}
        >
            <ScrollView style={{ width: "60%", height: 60 }}>
                <Text
                    color={theme.color.val}
                    fontSize={30}
                    fontWeight={"bold"}
                >
                    {title}
                </Text>
                <Text>{description}</Text>
            </ScrollView>
            <View flex={2} justifyContent="flex-end" alignItems="flex-end">
                <Pressable scale={0.98} onPress={() => router.push(`/service/${id}`)}
                    style={{ alignItems: "flex-end", justifyContent: "center", width: "100%" }}>
                    <Feather name="chevron-right" size={50} color={theme.color.val} />
                </Pressable>
            </View>
        </View>
    )
}
