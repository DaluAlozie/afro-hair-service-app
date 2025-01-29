import React from 'react';
import { useWindowDimensions } from 'react-native';
import { Svg, Path } from 'react-native-svg';

export default function ImageCrop() {
  return (
      <SquareWithCircleHole />
  )
}

const SquareWithCircleHole = () => {
  const { width } = useWindowDimensions();
  const size = normalise(width), holeRadius = size/2, color = "rgba(0,0,0,0.6)"
  const center = size / 2;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
    style={{ position: 'absolute', top: 0, left: 0, zIndex: 1}}>
      <Path
        fill={color}
        fillRule="evenodd"
        d={`
          M 0 0 H ${size} V ${size} H 0 Z
          M ${center - holeRadius} ${center}
          A ${holeRadius} ${holeRadius} 0 1 0 ${center + holeRadius} ${center}
          A ${holeRadius} ${holeRadius} 0 1 0 ${center - holeRadius} ${center}
          Z
        `}
      />
    </Svg>
  );
};

export function normalise(width: number) {
  return width > 800 ? 500 : width*0.8;
}