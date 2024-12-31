import React from "react"
import { View } from "react-native"
import Svg, { Path } from "react-native-svg"

// {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M6.906.384a1.75 1.75 0 0 1 2.187 0l5.25 4.2c.415.332.657.835.657 1.367v7.019a1.75 1.75 0 0 1-1.75 1.75h-2.5a.75.75 0 0 1-.75-.75V8.72H6v5.25a.75.75 0 0 1-.75.75h-2.5A1.75 1.75 0 0 1 1 12.97V5.95c0-.531.242-1.034.657-1.366l5.249-4.2Z"></path></svg> */}

export default function HomeFill({ size, color }: { size: number, color: string }) {
  return (
    <View>
      <Svg viewBox="0 0 16 16" width={size} height={size}>
        <Path
            d="M6.906.384a1.75 1.75 0 0 1 2.187 0l5.25 4.2c.415.332.657.835.657 1.367v7.019a1.75 1.75 0 0 1-1.75 1.75h-2.5a.75.75 0 0 1-.75-.75V8.72H6v5.25a.75.75 0 0 1-.75.75h-2.5A1.75 1.75 0 0 1 1 12.97V5.95c0-.531.242-1.034.657-1.366l5.249-4.2Z"
            fill={color}
        />
      </Svg>
    </View>
  )
}