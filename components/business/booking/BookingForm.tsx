import {
    YStack,
    Form,
    XStack,
    View,
    useTheme,
    RadioGroup
  } from 'tamagui'

import { Control, Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import DismissKeyboard from '../../utils/DismissKeyboard';
import { InputError, RadioGroupItemWithLabel } from '../../utils/form/inputs';
import React, { useCallback, useEffect, useState } from 'react';
import SubmitButton from '../../utils/form/SubmitButton';
import KeyboardAvoidingView from '@/components/utils/KeyboardAvoidingView';
import { useCustomerStore } from '@/utils/stores/customerStore';
import { Text } from 'react-native';
import { BookingInfo } from '@/components/business/booking/types';
import Pressable from '@/components/utils/Pressable';
import { Entypo } from '@expo/vector-icons';
import { Collapsible } from '@/components/utils';
import { AddOn, Variant } from '../types';

const schema = yup.object().shape({
    variant: yup
        .string()
        .required('Please select a style'),
    addOns: yup.array().of(
        yup.number()
    )
    .default([] as number[])
});

  export function BookingForm({ serviceOption, variants, addOns }: BookingInfo) {
    const { control, handleSubmit, formState: { errors, isSubmitting }, watch, reset} = useForm({
      resolver: yupResolver(schema),
      defaultValues: {
        variant: `${variants[0]?.id ?? ""}`
      }
    });

    useEffect(() => {
        reset({ variant: `${variants[0]?.id ?? ""}` });
    }, [serviceOption, variants, addOns]);

    const variantId = watch('variant');
    const variantCost = variantId ? variants.find(v => v.id === parseInt(variantId))?.price ?? 0 : 0;
    const [selectedAddOns, setSelectedAddOns] = useState<number[]>([]);
    const addOnCost = selectedAddOns.reduce((acc, curr) => {
        const addOn = addOns.find(a => a.id === curr);
        return addOn ? acc + addOn.price : acc;
    }, 0);

    const total = variantCost + addOnCost;
    const currency = "£";

    const theme = useTheme();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const bookAppointment = useCustomerStore((state) => state.bookAppointment)
    const onSubmit = useCallback(async () => {

    },[]);

    return (
        <View height={"80%"} width={"100%"} backgroundColor={"$background"}>
        <KeyboardAvoidingView>
            <DismissKeyboard>
                <Form alignItems="flex-start" height={"100%"} width={"100%"}>
                    <YStack
                        position='relative'
                        alignItems="stretch"
                        justifyContent="flex-start"
                        minWidth="60%"
                        width="100%"
                        maxWidth="100%"
                        height="100%"
                        gap="$10"
                        paddingVertical="$6"
                    >
                        <YStack gap="$7" width={"100%"} height={"100%"} alignItems='flex-start'>
                            <YStack gap="$5" width={"100%"}>
                                <Text style={{ fontSize: 24, fontWeight: "800", color: theme.color.val }}>{serviceOption?.name}</Text>
                                <VariantInputs variants={variants} control={control} />
                                {errors.variant && <InputError>{errors.variant.message}</InputError>}
                            </YStack>
                            <YStack gap="$2" width={"100%"} >
                                { addOns.length > 0 &&
                                <AddOnInputs addOns={addOns} control={control} selectedAddOns={selectedAddOns} setSelectedAddOns={setSelectedAddOns} />
                                }
                                {errors.variant && <InputError>{errors.variant.message}</InputError>}
                            </YStack>
                            <View height={50}/>
                        </YStack>
                    </YStack>
                </Form>
            </DismissKeyboard>
        </KeyboardAvoidingView>
        <XStack gap="$3" width={"100%"} paddingVertical={10} alignItems='center' justifyContent='space-between' backgroundColor={"$background"}>
            <View>
                <Text style={{ fontSize: 24, fontWeight: "800", color: theme.color.val }}>{currency}{total.toFixed(2)}</Text>
            </View>
            <View flex={1}>
                <SubmitButton onPress={handleSubmit(onSubmit)} isSubmitting={isSubmitting} disabled={variants[0] === undefined || variantId === ""}>
                    Continue
                </SubmitButton>
            </View>
        </XStack>
        </View>
    )
}

type VariantInputsProps = {
    variants: Variant[];
    control: Control<{
        variant: string;
        addOns: (number | undefined)[];
    }, unknown>;
}

const VariantInputs = ({ variants, control }: VariantInputsProps) => {
    return (
        <Controller
            control={control}
            name={"variant"}
            defaultValue={`${variants[0]?.id ?? ""}`}
            render={({ field: { onChange, value } }) => (
            <RadioGroup gap="$4"
                value={`${value}`}
                onValueChange={onChange}
                defaultValue={`${variants[0]?.id ?? ""}`}
            >
                {
                    variants.map(v =>
                        <RadioGroupItemWithLabel selectedValue={`${value}`} key={v.id} value={`${v.id}`} label={v.name} size={24} />
                    )
                }
            </RadioGroup>
        )}
        />
    )
}


type AddOnInputsProps = {
    addOns: AddOn[];
    control: Control<{
        variant: string;
        addOns: (number | undefined)[];
    }, unknown>;
    selectedAddOns: number[];
    setSelectedAddOns: (addOn: number[]) => void;
}
const AddOnInputs = ({ addOns, control, selectedAddOns, setSelectedAddOns }: AddOnInputsProps) => {
    const theme = useTheme();
    const currency = "£";
    return (
    <Controller
        control={control}
        name={"addOns"}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
        <View gap="$1" width={"100%"}>
            <Collapsible
                defaultOpen={false}
                header={<Text style={{ fontSize: 14, fontWeight: 800, color: theme.color.val }}>Add Ons</Text>}>
                <View height={20}/>
                {
                addOns.map(a =>
                    <XStack key={a.id} width={"100%"} height={40} justifyContent="space-between" alignItems='center'>
                        <Text style={{ fontSize: 14, fontWeight: 600, color: theme.color.val, opacity: !value.includes(a.id) ? 0.3 : 1 }}>
                            {a.name}
                        </Text>
                        <XStack alignItems='center' justifyContent='space-between' gap="$3">
                            <Pressable
                                onPress={() => {
                                    setSelectedAddOns(selectedAddOns.filter(id => id !== a.id))
                                    onChange(value.filter(id => id !== a.id))
                                }}
                                disabled={!value.includes(a.id)}
                                style={{
                                    opacity: value.includes(a.id) ? 1 : 0.3,
                                    height: "100%",
                                    alignItems: "center",
                                    justifyContent: "center"
                                    }}
                                >
                                <Entypo name="minus" size={24} color={theme.color.val} />
                            </Pressable>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: theme.color.val,
                                opacity: value.includes(a.id) ? 0.3 : 1
                                }}>
                                {currency}{a.price}
                            </Text>
                            <Pressable
                                onPress={() => {
                                    setSelectedAddOns([...selectedAddOns, a.id])
                                    onChange([...value, a.id])
                                }}
                                disabled={value.includes(a.id)}
                                style={{
                                    opacity: value.includes(a.id) ? 0.3 : 1,
                                    height: "100%",
                                    alignItems: "center",
                                    justifyContent: "center"
                                    }}>
                                <Entypo name="plus" size={24} color={theme.color.val} />
                            </Pressable>
                        </XStack>
                    </XStack>
                )}
            </Collapsible>

        </View>
    )}
    />
)}

