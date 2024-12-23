import Svg, { Path } from "react-native-svg"
import React from 'react'
import { View } from "tamagui"

export default function AzureLogo() {
  return (
    <View>
        <Svg
            viewBox="0 0 48 48"
            width={22}
            height={22}
        >
            <Path
                fill="#ff5722"
                d="M6 6H22V22H6z"
                transform="rotate(-180 14 14)"/>
            <Path
                fill="#4caf50"
                d="M26 6H42V22H26z"
                transform="rotate(-180 34 14)"/>
            <Path
                fill="#ffc107"
                d="M26 26H42V42H26z"
                transform="rotate(-180 34 34)"/>
            <Path fill="#03a9f4"
                d="M6 26H22V42H6z"
                transform="rotate(-180 14 34)"/>
        </Svg>
    </View>
  )
}