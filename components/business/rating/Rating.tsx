import React from 'react'
import { View } from 'react-native'
import { Rating as RatingProps} from '../types'
import { Text } from 'tamagui'


export default function Rating(
    { id, score, service_id, business_id }: RatingProps
) {
    return (
        <View>
            <Text>{id}</Text>
            <Text>{score}</Text>
            <Text>{service_id}</Text>
            <Text>{business_id}</Text>
        </View>
    )
}
