import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import type { SelectProps as TSelectProps } from 'tamagui';
import {  Sheet, XStack, YStack, Text, View, useTheme } from 'tamagui';
import Pressable from '../Pressable';
import { DimensionValue } from 'react-native';
import SheetModal from '../ui/SheetModal';

type SelectProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  val: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setVal: (val: any) => void;
  label: string;
  items: { label: string; value: string }[];
  width?: DimensionValue;
  height?: DimensionValue;
  disabled?: boolean;
} & TSelectProps;

export function Select(props: SelectProps) {
  return (
    <YStack gap="$4" width={props.width} height={props.height} opacity={props.disabled ? 0.5 : 1}>
      <SelectSkeleton {...props} />
    </YStack>
  );
}

export function SelectSkeleton({ label, items, val, setVal, width, disabled, ...props}: SelectProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const [selectedLabelValue, setSelectedLabelValue] = useState(items.find((item) => `${item.value}` == `${val}`)?.label);
  return (
    <View>
      <Pressable
        disabled={disabled}
        pressedStyle={{
          opacity: 0.7,
        }}
        style={{
          borderRadius: 2000,
          height: props.height ?? 40,
          width: width,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.section.val,
        }}
        activeOpacity={0.9}
        scale={0.95}
        onPress={() => setOpen(true)}
      >
        <XStack justifyContent='space-between' alignItems='center' width='100%' paddingHorizontal={15}>
          <Text color={theme.color.val} numberOfLines={2}>{val === undefined ? label : selectedLabelValue}</Text>
          {open ? <ChevronUp color={theme.color.val} size={20} /> : <ChevronDown color={theme.color.val} size={20} />}
        </XStack>
      </Pressable>
      <SheetModal
        open={open}
        setOpen={setOpen}
        snapPoints={[40]}
        >
          <Sheet.ScrollView>
            <HeaderComponent title={label} />
          {useMemo(
            () =>
              items.map((item) => (
                <SelectItem
                  disabled={disabled}
                  key={item.value}
                  label={item.label}
                  value={item.value}
                  setVal={(val) => {
                    setVal(val);
                    setOpen(false);
                   }}
                  setLabel={setSelectedLabelValue}
                  selectedValue={val}
                />
              )),
            [items, val, setVal]
          )}
          </Sheet.ScrollView>
        </SheetModal>
    </View>
  );
}

type SelectItemProps = {
  label: string;
  value: string;
  setVal: (val: string) => void;
  setLabel: (val: string) => void;
  selectedValue: string;
  disabled?: boolean;
};

const SelectItem = ({
  label,
  value,
  setVal,
  setLabel,
  selectedValue,
  disabled,
}: SelectItemProps) => {
  const theme = useTheme();
  return (
    <Pressable
      disabled={disabled}
      style={{
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: `${selectedValue}` == `${value}` ?  theme.accent.val : theme.section.val,
        borderRadius: 5,
      }}
      pressedStyle={{ backgroundColor: theme.accent.val, opacity: 0.3 }}
      activeOpacity={0.2}
      scale={0.999}
      onPress={() => {
        setVal(value);
        setLabel(label);
      }}
    >
      <Text
        numberOfLines={2}
        marginLeft={20}
        width={"100%"}
        color={`${selectedValue}` == `${value}` ? theme.white1.val : theme.color.val}
        textOverflow="ellipsis">
          {label}
      </Text>
    </Pressable>
  );
};

type HeaderProps = {
  title: string;
};

const HeaderComponent = ({ title }: HeaderProps) => {
  return (
    <XStack gap="$4" alignItems="center" width={"100%"} height={40} backgroundColor={"$section"} paddingLeft={20}>
      <Text f={2} fontWeight="bold" fontSize={16}>
        {title}
      </Text>
    </XStack>
  );
};

HeaderComponent.displayName = 'HeaderComponent';
