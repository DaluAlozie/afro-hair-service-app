import {
  YStack,
  Form
} from 'tamagui'

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useBusinessStore } from '@/utils/stores/businessStore';
import React, { useCallback, useEffect, useState } from 'react';
import { useTheme } from 'tamagui';
import { useRouter } from 'expo-router';
import DismissKeyboard from '@/components/utils/DismissKeyboard';
import { Input, InputError } from '@/components/utils/form/inputs';
import SubmitButton from '@/components/utils/form/SubmitButton';
import LocationSearch, { Address } from './LocationSearch';
import KeyboardAvoidingView from '@/components/utils/KeyboardAvoidingView';

const schema = yup.object().shape({
    streetAddress: yup
        .string()
        .required('The street address is required')
        .max(50, "The street address exceeds the character limit of 50."),
    flatNumber: yup
        .string()
        .max(50, "The flat number exceeds the character limit of 50."),
    city: yup
        .string()
        .required('The city is required')
        .max(50, "The city exceeds the character limit of 50."),
    postcode: yup
        .string()
        .required('The postcode is required')
        .max(50, "The postcode exceeds the character limit of 50."),
    country: yup
        .string()
        .required('The country is required')
        .max(50, "The country exceeds the character limit of 50."),
});

export function AddBusinessLocationForm() {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  const theme = useTheme();
  const addBusinessLocation = useBusinessStore((state) => state.addBusinessLocation)
  const [address, setAddress] = useState<Address|null>(null);
  const [resultsVisible, setResultsVisible] = useState(false);
  useEffect(() => {
    if (!address) return;

    if (address.streetAddress) setValue("streetAddress", address.streetAddress);
    if (address.city) setValue("city", address.city);
    if (address.postcode) setValue("postcode", address.postcode);
    if (address.country) setValue("country", address.country);
  }, [address])

  const onSubmit = useCallback(async (data: {
        streetAddress: string,
        flatNumber?: string | undefined,
        city: string,
        postcode: string,
        country: string
  }) => {
    if (!address) return;
    const { streetAddress, flatNumber, city, postcode, country } = data
    const { error } = await addBusinessLocation(
      streetAddress,
      flatNumber ?? null,
      city,
      postcode,
      country,
      address.longitude,
      address.latitude,
    );
    if (error)console.log(error);
    else router.dismissTo("/business/locations");
    reset()
  },[address]);

  return (
    <DismissKeyboard onPress={() => setResultsVisible(false)}>
      <KeyboardAvoidingView>
        <Form
          alignItems="center"
          alignSelf='center'
          backgroundColor={theme.background.val}
          justifyContent='flex-start'
          minWidth="60%"
          width="90%"
          height="100%"
          $gtSm={{
            width: 400,
          }}
          >
          <LocationSearch
            address={address}
            setAddress={(location: Address) => { setAddress(location) }}
            resultsVisible={resultsVisible}
            showResults={() => setResultsVisible(true)}
            hideResults={() => setResultsVisible(false)}
          />
          <YStack
            onFocus={() => setResultsVisible(false)}
            alignItems="stretch"
            justifyContent="flex-start"
            marginTop="$1"
            width="100%"
            height="100%"
            gap="$10"
            paddingVertical="$6"
          >
            <YStack gap="$3" width="100%">
              <YStack gap="$2">
              <Input
                control={control}
                label="Street Address"
                name="streetAddress"
                placeholder='Street Address'
                textContentType="streetAddressLine1"
                disabled={address === null}
                />
              {errors.streetAddress && <InputError>{errors.streetAddress.message?.toString()}</InputError>}
              </YStack>
              <YStack gap="$2">
              <Input
                control={control}
                label="Flat Number"
                name="flatNumber"
                placeholder='Flat Number'
                textContentType="fullStreetAddress"
                disabled={address === null}
                />
              {errors.flatNumber && <InputError>{errors.flatNumber.message?.toString()}</InputError>}
              </YStack>
              <YStack gap="$2">
              <Input
              control={control}
              label="City"
              name="city"
              placeholder='City'
              textContentType="addressCity"
              disabled={address === null}
              />
              {errors.city && <InputError>{errors.city.message?.toString()}</InputError>}
              </YStack>
              <YStack gap="$2">
                <Input
                  control={control}
                  label="Postcode"
                  name="postcode"
                  placeholder='Postcode'
                  textContentType='postalCode'
                  disabled={address === null}
                  />
                  {errors.postcode && <InputError>{errors.postcode.message?.toString()}</InputError>}
              </YStack>
              <YStack gap="$2">
                <Input
                  control={control}
                  label="Country"
                  name="country"
                  placeholder='Country'
                  textContentType="countryName"
                  disabled={address === null}
                  />
                  {errors.country && <InputError>{errors.country.message?.toString()}</InputError>}
              </YStack>
            </YStack>
            <SubmitButton onPress={handleSubmit(onSubmit)} isSubmitting={isSubmitting} disabled={address === null}>
              Add Location
            </SubmitButton>
          </YStack>
        </Form>
      </KeyboardAvoidingView>
    </DismissKeyboard>
  )
}