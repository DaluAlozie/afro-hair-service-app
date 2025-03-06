import React from 'react';
import { View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function Stars({ rating, size }: { rating: number, size: number }) {
  const wholePart = Math.floor(rating);
  const decimalPart = rating - wholePart;
  const stars = [];

  // Add full stars
  for (let i = 0; i < wholePart; i++) {
    stars.push(
      <FontAwesome key={`full-${i}`} name="star" size={size} color="gold" />
    );
  }

  // Add a half star if the decimal part is at least 0.5
  if (decimalPart >= 0.5 && stars.length < 5) {
    stars.push(
      <FontAwesome key="half" name="star-half-o" size={size} color="gold" />
    );
  }

  // Fill the remaining stars with empty icons
  while (stars.length < 5) {
    stars.push(
      <FontAwesome key={`empty-${stars.length}`} name="star-o" size={size} color="gold" />
    );
  }

  return (
    <View style={{ flexDirection: 'row' }}>
      {stars}
    </View>
  );
}
