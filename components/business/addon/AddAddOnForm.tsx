import {
    YStack,
    Form,
  } from 'tamagui'

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useBusinessStore } from '@/utils/stores/businessStore';
import DismissKeyboard from '../../utils/DismissKeyboard';
import { Input, Switch, InputError, CurrencyInput } from '../../utils/form/inputs';
import React, { useCallback } from 'react';
import SubmitButton from '../../utils/form/SubmitButton';
import { useTheme  } from 'tamagui';
import { useRouter } from 'expo-router';
import KeyboardAvoidingView from '@/components/utils/KeyboardAvoidingView';

const schema = yup.object().shape({
    name: yup
    .string()
    .required('The add on name is required')
    .max(50, "The name exceeds the character limit of 50."),
    price: yup
        .number()
        .typeError('The add on price must be a valid number') // Custom type error message
        .positive('The add on price must be greater than 0')
        .required('A add on price is required'),
    duration: yup
        .number()
        .typeError('The add on duration must be a valid number') // Custom type error message
        .positive('The add on duration must be greater than 0')
        .required('A add on duration is required'),
    enabled: yup
        .boolean()
        .required('Please enable or disable the service option')
});

  export function AddAddOnForm({ serviceId, serviceOptionId }: { serviceId: number, serviceOptionId: number}) {
    const router = useRouter();
    const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
      resolver: yupResolver(schema),
    });

    const theme = useTheme();
    const addAddOn = useBusinessStore((state) => state.addAddOn)
    const onSubmit = useCallback(async (data: {
        name: string, price: number, duration: number, enabled: boolean
    }) => {
      const { name, price, duration, enabled } = data;
      const { error } = await addAddOn(name, price, duration, enabled, serviceOptionId, serviceId)
      if (error) console.log(error);
      else router.dismissTo(`/service/${serviceId}/serviceOption/${serviceOptionId}/addOns`);
      reset()
    },[]);

    return (
        <KeyboardAvoidingView>
            <DismissKeyboard>
                <Form alignItems="center" backgroundColor={theme.background}>
                    <YStack
                        alignItems="stretch"
                        justifyContent="space-between"
                        minWidth="60%"
                        width="100%"
                        maxWidth="100%"
                        height="100%"
                        gap="$10"
                        padding="$7"
                        paddingVertical="$6"
                        $gtSm={{
                            width: 400,
                        }}
                    >
                        <YStack gap="$3">
                            <YStack gap="$2">
                                <Input
                                control={control}
                                label="Add On Name"
                                name="name"
                                placeholder='Add on name'
                                textContentType='organizationName'/>
                                {errors.name && <InputError>{errors.name.message?.toString()}</InputError>}
                            </YStack>
                            <YStack>
                                <CurrencyInput
                                    control={control}
                                    label="Price"
                                    name="price"
                                    placeholder='0'
                                    textContentType="none"
                                    keyboardType="numeric"
                                    />
                                {errors.price && <InputError>{errors.price.message?.toString()}</InputError>}
                            </YStack>
                            <YStack>
                                <Input
                                    control={control}
                                    label="Duration (minutes)"
                                    name="duration"
                                    placeholder='0'
                                    textContentType="none"
                                    keyboardType="numeric"
                                    />
                                {errors.duration && <InputError>{errors.duration.message?.toString()}</InputError>}
                            </YStack>
                            <YStack>
                                <Switch
                                    control={control}
                                    label="Enabled"
                                    name="enabled"
                                    defaultValue={true}
                                    />
                                {errors.enabled && <InputError>{errors.enabled.message?.toString()}</InputError>}
                            </YStack>
                        </YStack>
                        <SubmitButton onPress={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
                            Add add on
                        </SubmitButton>
                    </YStack>
                </Form>
            </DismissKeyboard>
        </KeyboardAvoidingView>
    )
  }