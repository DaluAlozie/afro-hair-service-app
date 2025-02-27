import { formatLocation } from '@/components/business/businessLocation/utils';
import { calculateDistance } from '@/components/explore/utils';
import SubmitButton from '@/components/utils/form/SubmitButton';
import { useLocations } from '@/hooks/business/useLocations';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { useBookingStore } from '@/utils/stores/bookingStore';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, Text, useWindowDimensions } from 'react-native';
import { useTheme, View } from 'tamagui';

export default function SelectLocation() {
  const businessId = useBookingStore((state) => state.business?.id);
  const theme = useTheme();
  const router = useRouter();

  const { locations } = useLocations(businessId);
  const { currentLocation } = useCurrentLocation();
  const latitude = currentLocation?.coords.latitude || 0;
  const longitude = currentLocation?.coords.longitude || 0;

  const { height } = useWindowDimensions();

  // Sort locations by distance
  useMemo(() => locations.sort((a, b) =>
    calculateDistance(latitude, longitude, a.latitude, a.longitude) -
    calculateDistance(latitude, longitude, b.latitude, b.longitude)
  ), [locations]);

  useEffect(() => {
    if (!locations.length) return;
    setSelectedLocationId(locations[0].id);
  }, [locations]);

  // State to manage the selected location
  const [selectedLocationId, setSelectedLocationId] = useState(locations[0]?.id || undefined);

  const handleSubmit = useCallback(() => {
    if (!selectedLocationId) return;
    const location = locations.find((loc) => loc.id == selectedLocationId);
    useBookingStore.setState({ location });
    router.push('/booking/selectTime');
  }, [selectedLocationId]);

  return (
    <View
      style={{
        backgroundColor: theme.background.val,
        width: '100%',
        paddingHorizontal: 20,
        height: height,
        alignSelf: 'center',
        justifyContent: 'space-between',
        paddingTop: 40,
        paddingBottom: 150,
      }}
    >
      <View>
        <Text style={{
          alignSelf: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: theme.color.val,
          fontWeight: 700,
          fontSize: 20,
          }}>
            Select a Location
        </Text>
        <Picker
          mode="dialog"
          itemStyle={{ fontSize: 16}}
          selectedValue={selectedLocationId}
          onValueChange={(itemValue) => setSelectedLocationId(itemValue)}
          style={[{ color: theme.color.val },Platform.OS === 'ios' ? { fontSize: 16 } : {}]}
          dropdownIconColor={theme.color.val}
        >
          {locations.length === 0 && (
            <Picker.Item label="No locations available" value={undefined} enabled={false}/>
          )}
          {locations.map((location) => (
            <Picker.Item key={location.id} label={formatLocation(location)} value={location.id} />
          ))}
        </Picker>
      </View>
      <View height={50}>
        <SubmitButton onPress={handleSubmit} isSubmitting={false}>
          Continue
        </SubmitButton>
      </View>
    </View>
  );
}