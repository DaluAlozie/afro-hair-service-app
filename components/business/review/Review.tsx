import React from "react";
import { Review as ReviewProps } from "../types";
import { Text, View } from "tamagui";
import Stars from "./Stars";
import { formatDate } from "../availability/utils";

export default function Review({ content, rating, created_at }: ReviewProps) {
    return (
        <View marginVertical={20} gap={10}>
            <Text fontSize={14} opacity={0.7}>{formatDate(created_at) + " " + created_at.getFullYear().toString()}</Text>
            <Stars rating={rating} size={14}/>
            <Text fontSize={18}>{content}</Text>
        </View>
    )
}