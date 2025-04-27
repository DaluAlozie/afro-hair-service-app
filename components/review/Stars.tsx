import { FontAwesome } from '@expo/vector-icons'
import React from 'react'
import { XStack } from 'tamagui'
import Pressable from '../utils/Pressable';

export default function Stars({ value, setValue }: { value: number, setValue: (value: number) => void }) {
  return (
        <XStack>
            <Pressable onPress={() => setValue(1)}>
                <Star active={value >= 1} />    
            </Pressable>
            <Pressable onPress={() => setValue(2)}>
                <Star active={value >= 2} />
            </Pressable>
            <Pressable onPress={() => setValue(3)}>
                <Star active={value >= 3} />
            </Pressable>
            <Pressable onPress={() => setValue(4)}>
                <Star active={value >= 4} />
            </Pressable>
            <Pressable onPress={() => setValue(5)}>
                <Star active={value >= 5} />
            </Pressable>
        </XStack>
  )
}


const Star = ({ active }: { active: boolean }) => {
    return (
        <>
            {active ? <FontAwesome name="star" size={10} color="#FFD43B" /> : <FontAwesome name="star-o" size={10} color="#FFD43B" />}
        </>
    )
}
