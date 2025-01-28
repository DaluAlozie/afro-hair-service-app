import React from "react";
import { View } from "react-native";
import { Review as ReviewProps } from "../types";
import { Text } from "tamagui";

export default function Review(
    { id, description, business_rating_id, business_id }: ReviewProps
) {
    return (
        <View>
            <Text>{id}</Text>
            <Text>{description}</Text>
            <Text>{business_rating_id}</Text>
            <Text>{business_id}</Text>
        </View>
    )
}