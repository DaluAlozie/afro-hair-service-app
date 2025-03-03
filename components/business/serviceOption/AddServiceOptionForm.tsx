import {
    YStack,
    Form,
  } from 'tamagui'

  import { useForm } from 'react-hook-form';
  import { yupResolver } from '@hookform/resolvers/yup';
  import * as yup from 'yup';

  import { useBusinessStore } from '@/utils/stores/businessStore';
  import DismissKeyboard from '../../utils/DismissKeyboard';
  import { Input, Switch, InputError } from '../../utils/form/inputs';
  import React, { useCallback } from 'react';
  import SubmitButton from '../../utils/form/SubmitButton';
  import { useTheme  } from 'tamagui';
  import { useRouter } from 'expo-router';
import KeyboardAvoidingView from '@/components/utils/KeyboardAvoidingView';

  const schema = yup.object().shape({
    name: yup
      .string()
      .required('The service option name is required')
      .max(50, "The name exceeds the character limit of 50."),
    description: yup
      .string()
      .required('A description of the service option is required')
      .max(50, "The description exceeds the character limit of 50."),
    enabled: yup
        .boolean()
        .required('Please enable or disable the service option')
  });

  export function AddServiceOptionForm({serviceId}: {serviceId: number}) {
    const router = useRouter();
    const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
      resolver: yupResolver(schema),
    });

    const theme = useTheme();
    const addServiceOption = useBusinessStore((state) => state.addServiceOption)
    const onSubmit = useCallback(async (data: {
        name: string, description: string, enabled: boolean
    }) => {
      const { name, description, enabled } = data;
      const { error } = await addServiceOption(name, description, enabled, serviceId)
      if (error) console.log(error);
      else router.dismissTo(`/service/${serviceId}`);
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
                padding="$7"
                $gtSm={{
                 maxWidth: 400,
                }}
              >
                <YStack gap="$3" width={"100%"}>
                    <YStack gap="$2">
                        <Input
                        control={control}
                        label="Service Option Name"
                        name="name"
                        placeholder='Service Name'
                        textContentType='organizationName'/>
                        {errors.name && <InputError>{errors.name.message?.toString()}</InputError>}
                    </YStack>
                    <YStack>
                        <Input
                            control={control}
                            label=" Description"
                            name="description"
                            placeholder='Description of the service option'
                            textContentType="organizationName"
                            />
                        {errors.description && <InputError>{errors.description.message?.toString()}</InputError>}
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
                    Add Service Option
                </SubmitButton>
              </YStack>
            </Form>
          </DismissKeyboard>
        </KeyboardAvoidingView>
    )
  }