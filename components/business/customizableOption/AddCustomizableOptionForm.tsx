import {
    YStack,
    Form,
  } from 'tamagui';

  import { useForm } from 'react-hook-form';
  import { yupResolver } from '@hookform/resolvers/yup';
  import * as yup from 'yup';

  import { useBusinessStore } from '@/utils/stores/businessStore';
  import DismissKeyboard from '../../utils/DismissKeyboard';
  import { Input, InputError, Picker } from '../../utils/form/inputs';
  import React, { useCallback } from 'react';
  import SubmitButton from '../../utils/form/SubmitButton';
  import { useTheme } from 'tamagui';
  import { useRouter } from 'expo-router';
  import KeyboardAvoidingView from '@/components/utils/KeyboardAvoidingView';
  import { CustomizableOptionType } from '../types';

  const schema = yup.object().shape({
    name: yup
      .string()
      .required('The service option name is required')
      .max(50, "The name exceeds the character limit of 50."),
    type: yup
      .string()
      .max(50, "The name exceeds the character limit of 50.")
      .required('Customization type is required')
      .oneOf(['numeric', 'text', 'boolean'], 'Invalid customization type')
      .default('text'),
    lowerBound: yup
      .number()
      .nullable()
      .default(null)
      .notRequired(),
    upperBound: yup
      .number()
      .nullable()
      .default(null)
      .notRequired(),
  });

  export function AddCustomizableOptionForm({ serviceId, serviceOptionId }: { serviceId: number, serviceOptionId: number }) {
    const router = useRouter();
    const { control, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm({
      resolver: yupResolver(schema),
      defaultValues: {
        lowerBound: null, // Explicitly set default value to null
        upperBound: null, // Explicitly set default value to null
      },
    });

    const type = watch('type');
    const theme = useTheme();
    const addCustomizableOption = useBusinessStore((state) => state.addCustomizableOption);

    const onSubmit = useCallback(async (data: {
      name: string, type: string, lowerBound?: number | null, upperBound?: number | null
    }) => {
      const { name, type, lowerBound, upperBound } = data;
      const { error } = await addCustomizableOption(
        name,
        type as CustomizableOptionType,
        type === 'numeric' ? lowerBound ?? null : null,
        type === 'numeric' ? upperBound ?? null : null,
        serviceOptionId,
        serviceId
      );
      if (error) console.log(error);
      else router.dismissTo(`/service/${serviceId}/serviceOption/${serviceOptionId}/customizableOptions`);
      reset();
    }, [addCustomizableOption, reset, router, serviceId, serviceOptionId]);

    return (
      <KeyboardAvoidingView>
        <DismissKeyboard>
          <Form alignItems="center" backgroundColor={theme.background.val}>
            <YStack
              alignItems="stretch"
              justifyContent="flex-start"
              marginTop="$14"
              minWidth="60%"
              width="100%"
              maxWidth="100%"
              height="100%"
              gap="$13"
              padding="$7"
              paddingVertical="$6"
              $gtSm={{
                paddingVertical: '$4',
                width: 400,
              }}
            >
              <YStack gap="$3">
                <YStack gap="$2">
                  <Input
                    control={control}
                    label="Name"
                    name="name"
                    placeholder='Color'
                    textContentType='organizationName'
                  />
                  {errors.name && <InputError>{errors.name.message?.toString()}</InputError>}
                </YStack>
                <YStack gap="$2">
                  <Picker
                    control={control}
                    label="Type"
                    name="type"
                    defaultValue={'text'}
                    items={[
                      { label: 'Number', value: 'numeric' },
                      { label: 'Text', value: 'text' },
                      { label: 'Yes / No', value: 'boolean' },
                    ]}
                  />
                  {errors.type && <InputError>{errors.type.message?.toString()}</InputError>}
                </YStack>
                {type === 'numeric' &&
                  <>
                    <YStack gap="$2">
                      <Input
                        control={control}
                        label="Minimum"
                        name="lowerBound"
                        placeholder='0'
                        textContentType='organizationName'
                        keyboardType="numeric"
                        defaultValue={null} // Ensure default value is null
                      />
                      {errors.lowerBound && <InputError>{errors.lowerBound.message?.toString()}</InputError>}
                    </YStack>
                    <YStack gap="$2">
                      <Input
                        control={control}
                        label="Maximum"
                        name="upperBound"
                        placeholder='10'
                        textContentType="none"
                        keyboardType="numeric"
                        defaultValue={null} // Ensure default value is null
                      />
                      {errors.upperBound && <InputError>{errors.upperBound.message?.toString()}</InputError>}
                    </YStack>
                  </>
                }
              </YStack>
              <SubmitButton onPress={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
                Add Customization
              </SubmitButton>
            </YStack>
          </Form>
        </DismissKeyboard>
      </KeyboardAvoidingView>
    );
  }