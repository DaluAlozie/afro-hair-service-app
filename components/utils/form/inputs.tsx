/* eslint-disable @typescript-eslint/no-explicit-any */
import { Colors } from '@/constants/Colors'
import React, { ReactNode, useId, useState } from 'react'
import { Control, Controller } from 'react-hook-form'
import { DimensionValue, KeyboardTypeOptions, Platform, TextInputIOSProps, useColorScheme } from 'react-native'
import {
  View,
  Input as InputSkeleton,
  TextArea as TextAreaSkeleton,
  Label,
  Switch as TSwitch,
  Text as TamaguiText,
  useTheme,
  RadioGroup,
  XStack,
} from 'tamagui'
import { Text, StyleSheet } from 'react-native'
import DateTimePicker, { AndroidNativeProps } from '@react-native-community/datetimepicker';
import { SizeTokens, UseThemeResult } from '@tamagui/core';
import Pressable from '../Pressable'
import { Picker as RNPicker } from '@react-native-picker/picker';

type InputProps = {
  name: string,
  control: Control<any,any>,
  label: string,
  placeholder: string,
  defaultValue?: string | number | undefined | null,
  textContentType?:  TextInputIOSProps["textContentType"] | undefined,
  secureTextEntry?: boolean | undefined,
  size?: string | number | undefined,
  gap?: string | number | undefined,
  keyboardType?: KeyboardTypeOptions | undefined,
  disabled?: boolean | undefined,
}

export const Input = ({
  control,name, defaultValue, label, placeholder, textContentType, secureTextEntry, gap, keyboardType, disabled }: InputProps) => {
  const id = useId();
  const theme = useTheme();
  return (
  <Controller
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <View gap={gap ?? "$1"} position='relative' opacity={disabled ? 0.3 : 1}>
          <Label style={{ fontSize: 15, fontWeight: 800, color: theme.color.val }} htmlFor={id}>
            <Text style={{ fontWeight: "bold" }}>{label}</Text>
          </Label>
          <InputSkeleton
            id={id}
            placeholder={placeholder}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            textContentType={textContentType}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            disabled={disabled ?? false}
            />
        </View>
      )}
      name={name}
      defaultValue={defaultValue}
  />
  )
}

export const TextArea = ({ control,
  name,
  defaultValue,
  label,
  placeholder,
  textContentType,
  secureTextEntry,
  size,
  gap,
  disabled
}: InputProps) => {
  const id = useId();
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <Controller
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <View position='relative' gap={gap ?? "$1"}>
          {disabled && <View style={styles.overlay} pointerEvents="none" />}
          <Label style={{ fontWeight: "bold", color: theme.color.val }}  htmlFor={id}>{label}</Label>
          <TextAreaSkeleton
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            placeholder={placeholder}
            textContentType={textContentType}
            secureTextEntry={secureTextEntry}
            size={size}
            gap={gap}
            height={"$16"}
            maxLength={200}
            disabled={disabled ?? false}
          />
        </View>
      )}
      name={name}
      defaultValue={defaultValue ?? ""}
    />
  )
}

type SwitchProps = {
  name: string,
  control: Control<any,any>,
  label: string,
  disabled?: boolean | undefined,
  defaultValue?: boolean | undefined,
  size?: string | number | undefined,
  gap?: string | number | undefined,
}

export const Switch = ({ control, name, defaultValue, label, gap, disabled }: SwitchProps) => {
  const id = useId();
  const theme = useTheme();
  return (
    <Controller
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <View position='relative'alignItems='flex-start' gap={gap ?? "$1"} opacity={disabled ? 0.3 : 1}>
          <Label style={{ fontWeight: "bold" }}  htmlFor={id}>{label}</Label>
          <TSwitch
            id={id}
            onCheckedChange={onChange}
            onBlur={onBlur}
            value={value}
            gap={gap}
            native
            backgroundColor={theme.section.val}
            margin={0}
            width={50}
            defaultChecked={defaultValue}
            disabled={disabled}
          >
            <TSwitch.Thumb disabled={disabled}/>
          </TSwitch>
        </View>
      )}
      name={name}
      defaultValue={defaultValue}
    />
  )
}

export const InputError =  ({children}: { children?: ReactNode }) => {
  const colorScheme = useColorScheme() ?? 'light';
  return (
    <TamaguiText alignSelf='flex-start' fontSize="$4" color={ colorScheme === "light" ? Colors.light.error : Colors.dark.error }>
      {children}
    </TamaguiText>
  )
}
export const FormattedInput = ({
  control,
  name,
  defaultValue,
  label,
  placeholder,
  keyboardType,
  gap,
  symbol
}: InputProps & { symbol: string }) => {
  const id = useId();
  const theme = useTheme();

  const formatValue = (value: string | undefined): string => {
    if (!value) return ""; // Default format
    return symbol + unformatValue(value);
  };
  const unformatValue = (value: string | undefined): string => {
    if (!value) return ""; // Default format
    return value.replace(new RegExp(`${symbol}`, "gi"), ""); // symbol characters
  }

  return (
    <Controller
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <View gap={gap ?? "$1"}>
          <Label style={{ fontSize: 15, fontWeight: 800, color: theme.color.val }} htmlFor={id}>
            <Text style={{ fontWeight: "bold" }}>{label}</Text>
          </Label>
          <InputSkeleton
            id={id}
            placeholder={placeholder}
            onChangeText={(text) => {
              onChange(unformatValue(text)); // Pass raw value (without symbol) to the form control
            }}
            onBlur={onBlur}
            value={formatValue(value)}
            keyboardType={keyboardType} // Set keyboard to numeric for easier input
          />
        </View>
      )}
      name={name}
      defaultValue={defaultValue ?? ""}
    />
  );
};

export const CurrencyInput = ({placeholder, ...props}: InputProps) => {
  const currency = "£";
  return (
    <FormattedInput {...props} symbol={currency} keyboardType="decimal-pad" placeholder={currency+placeholder}  />
  );
};

type TimePickerProps = {
  name: string;
  control: Control<any, any>;
  label: string;
  defaultValue?: Date;
  gap?: string | number | undefined;
  mode?: AndroidNativeProps['mode'];
  disabled?: boolean | undefined;
};

export const TimePicker = ({
  control,
  name,
  label,
  defaultValue,
  gap,
  mode = 'time',
  disabled,
}: TimePickerProps) => {
  const id = React.useId();
  const theme = useTheme();
  const [date, setDate] = useState(defaultValue ?? new Date());
  const [show, setShow] = useState(false);
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue ?? new Date()}
      render={({ field: { onChange, value } }) => (
        <View style={{ position: 'relative', gap: gap ?? '$1', opacity: disabled ? 0.3 : 1 }}>
          <Label
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: theme.color.val,
            }}
            htmlFor={id}
          >
            <Text style={{ fontWeight: 'bold' }}>{label}</Text>
          </Label>

          {/* DateTimePicker with optional dim overlay */}
          <View style={{ position: 'relative' }}>
            {(Platform.OS === 'ios' || show)  && (
              <DateTimePicker
                value={value}
                mode={mode}
                display="default"
                is24Hour
                minuteInterval={5}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                  paddingRight: 5,
                  paddingLeft: 0,
                }}
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setDate(selectedDate);
                    onChange(selectedDate);
                    setShow(false);
                  }
                }}
                disabled={disabled}
              />)}
              {Platform.OS === 'android' && (
                <Pressable onPress={() => setShow(true)} scale={0.99} activeOpacity={0.7} disabled={disabled} style={{
                  alignItems: 'center',
                  borderRadius: 10,
                  justifyContent: 'center',
                  backgroundColor: theme.section.val,
                  padding: 10,
                  height: 50,
                  width: 90,
                  }}>
                  <Text style={{ color: theme.color.val }}>{time}</Text>
                </Pressable>
            )}
          </View>
        </View>
      )}
    />
  );
};

type PickerProps = {
  name: string;
  control: Control<any, any>;
  label: string;
  items: { label: string; value: string | number }[];
  placeholder: string,
  gap?: string | number | undefined;
  disabled?: boolean | undefined;
  defaultValue?: string | number | undefined;
  width?: DimensionValue | undefined,
  noItemsMessage?: string | undefined,
};

export const Picker = ({
  control,
  name,
  label,
  items,
  gap,
  disabled,
  defaultValue,
  placeholder,
  noItemsMessage = "No items available",
}: PickerProps) => {
  const id = React.useId();
  const theme = useTheme();
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field: { onChange, value } }) => (
        <View gap={gap ?? '$1'} opacity={disabled ? 0.3 : 1}>
          <Label style={{ fontSize: 15, fontWeight: 800, color: theme.color.val }} htmlFor={id}>
            <Text style={{ fontWeight: 'bold' }}>{label}</Text>
          </Label>
          <RNPicker
            selectedValue={value}
            onValueChange={onChange}
            placeholder={placeholder}
            style={{
              width: '100%',
              color: theme.color.val,
              overflow: 'hidden',
              borderRadius: 10,
              height: 200,
            }}
            >
              {items.length === 0 && <RNPicker.Item label={noItemsMessage} value={-1} enabled={false} />}
            {items.map((item) => (
              <RNPicker.Item key={item.value} label={item.label} value={item.value} />
            ))}
          </RNPicker>
        </View>
      )}
    />
  );
};

const makeStyles = (theme: UseThemeResult) => StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.tameOverlay.val, // Dim effect
    borderRadius: 5,
    zIndex: 1,
  },
});


export function RadioGroupItemWithLabel(props: {
  size: SizeTokens;
  value: string;
  label: string;
  width?: string | number;
  selectedValue: string;
}) {
  const id = useId();
  const theme = useTheme();
  const isSelected = props.value === props.selectedValue;
  return (
    <XStack width={props.width} alignItems="center" gap="$4">
      <RadioGroup.Item
        value={props.value}
        id={id}
        size={props.size}
        width={"100%"}
        height={50}
        borderRadius={10}
        justifyContent="flex-start"
        alignItems="flex-start"
        backgroundColor={isSelected ? "auto" : "auto"}
        borderColor={"$color"}
        borderWidth={isSelected ? 2 : 1}
        opacity={isSelected ? 1 : 0.2}
        paddingLeft={"$4"}
        shadowColor={"$shadow"}
        hoverStyle={{
          backgroundColor: "$blue300",
          shadowColor: "$shadowHover",
        }}
        transition="all 0.2s ease-in-out"
      >
        <Label size={props.size} fontWeight={"bold"} htmlFor={id}>
          <Text style={{ fontWeight: isSelected ? 700:"normal", color: theme.color.val }}>
            {props.label}
          </Text>
        </Label>
      </RadioGroup.Item>
    </XStack>
  );
}