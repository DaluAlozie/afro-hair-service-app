import React from 'react';
import { Text, YStack } from 'tamagui';
import { AddOn } from '../types';

interface AddOnsListProps {
  addOns: AddOn[];
}

export const AddOnsList: React.FC<AddOnsListProps> = ({ addOns }) => {
  return (
    <YStack gap="$2">
      <Text fontSize="$6" fontWeight="bold">
        Add-Ons
      </Text>
      {addOns.length > 0 ? (
        addOns.map((addOn, index) => <Text key={index} fontSize={16}>{addOn.name}</Text>)
      ) : (
        <Text fontSize={16}>No add-ons selected</Text>
      )}
    </YStack>
  );
};