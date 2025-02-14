import React from 'react';
import Svg, { Rect, Path, Circle, G } from 'react-native-svg';

const Status = ({ size = 1080, color = 'rgb(0,0,250)' }: { size: number, color: string}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 1080 1080">
      <Rect x="0" y="0" width="100%" height="100%" fill="transparent" />
      <G transform="matrix(1 0 0 1 540 540)">
        <Rect
          x="-540"
          y="-540"
          width="1080"
          height="1080"
          fill={color}
          stroke="none"
          strokeWidth="1"
          strokeDasharray="none"
          strokeLinecap="butt"
          strokeDashoffset="0"
          strokeLinejoin="miter"
          strokeMiterlimit="4"
          fillRule="nonzero"
          opacity="0"
          vectorEffect="non-scaling-stroke"
        />
      </G>
      <G transform="matrix(10.5 0 0 10.5 30 -10)">
        <Path
          d="M 50 92.875 C 26.358 92.875 7.125 73.642 7.125 50 C 7.125 26.358000000000004 26.358 7.125 50 7.125 C 73.642 7.125 92.875 26.358 92.875 50 C 92.875 73.642 73.642 92.875 50 92.875 z M 50 9.125 C 27.461 9.125 9.125 27.461 9.125 50 C 9.125 72.538 27.461 90.875 50 90.875 C 72.538 90.875 90.875 72.538 90.875 50 C 90.875 27.461 72.538 9.125 50 9.125 z"
          fill={color}
          stroke={color}
          strokeWidth="0"
          strokeDasharray="none"
          strokeLinecap="round"
          strokeDashoffset="0"
          strokeLinejoin="miter"
          strokeMiterlimit="4"
          fillRule="nonzero"
          opacity="1"
          vectorEffect="non-scaling-stroke"
        />
      </G>
      <G transform="matrix(6.14 0 0 6.14 560 511.25)">
        <Circle
          cx="0"
          cy="0"
          r="35"
          fill={color}
          stroke={color}
          strokeWidth="0"
          strokeDasharray="none"
          strokeLinecap="butt"
          strokeDashoffset="0"
          strokeLinejoin="miter"
          strokeMiterlimit="4"
          fillRule="nonzero"
          opacity="1"
          vectorEffect="non-scaling-stroke"
        />
      </G>
    </Svg>
  );
};

export default Status;