import React, { useCallback } from "react";
import { Appointment } from "@/components/business/types";
import { AppointmentSummary } from "@/hooks/business/useAppointmentSummaries";
import { useTheme, View, XStack } from "tamagui";
import { Text, StyleSheet, Platform } from "react-native";
import { formatDateDifference, hasPast, isToday, isTomorrow } from "../utils";
import Status from "@/assets/icons/status";
import Pulse from "@/components/utils/ui/Pulse";
import { formatDate } from "@/components/business/availability/utils";
import { formatTime } from "@/components/business/booking/BookingDetails";
import emptyProfile from "@/assets/images/empty-profile.png";
import { Image } from "expo-image";
import { UseThemeResult } from "@tamagui/core";
import CustomerRescheduleButton from "./RescheduleButton";
import CustomerCancelButton from "./CancelButton";
import Pressable from "@/components/utils/Pressable";
import * as Linking from 'expo-linking';

interface AppointmentItemProps {
    appointment: Appointment;
    summary: AppointmentSummary | undefined
}

export const AppointmentItem = ({ appointment, summary }: AppointmentItemProps) => {
    if (!summary) {
      return null;
    }
    const theme = useTheme();
    const styles = makeStyles(theme);

    const profilePicture = `${process.env.EXPO_PUBLIC_BUSINESS_PROFILE_BASE_URL}/${summary.business_owner_id}/profilePicture.png`;
    const location = [
      summary.flat_number ? "Flat " + summary.flat_number : undefined,
      summary.street_address,
      summary.locality,
      summary.city,
      summary.postcode,
    ]
      .filter(Boolean)
      .filter((x) => x?.trim() !== "")
      .join(', ');

    // Extract add-ons from the appointment
    const addOns = Array.from(summary.add_ons.values() || []);

    const openMaps = useCallback(() => {
      const lat = summary.latitude;
      const lng = summary.longitude;
      const scheme = Platform.select({
        ios: summary.street_address ? `maps://?q=${location}` : `maps://?q=${location}&ll=${lat},${lng}`,
        android: `geo:${lat},${lng}?q=${lat},${lng}(${location})`,
      });
      if (scheme) {
        Linking.openURL(scheme).catch(err =>
          console.error('Error opening map: ', err),
        );
      }
    }, [location, summary]);

    return (
      <View
        style={styles.container}
        height={"auto"}
        opacity={hasPast(appointment.start_time) || summary.cancelled ? 0.5 : 1}>
        <XStack justifyContent="space-between" alignItems="flex-start" height={appointment.cancelled ? "100%" : "90%"}>
          {/* Left */}
          <View height={"100%"} justifyContent="space-between">
              <View>
              <Text style={styles.date}>{formatDate(appointment.start_time)}</Text>
              <Text style={styles.time}>{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</Text>
              <Pressable style={{ alignSelf: "flex-start" }} onPress={openMaps}>
                <Text style={styles.location}>{location}</Text>
              </Pressable>

              {/* Time & Service Details */}
              <XStack alignItems="center" justifyContent="space-between" marginTop={20}>
                  <View style={styles.detailsContainer}>
                  <XStack alignItems="flex-end" marginBottom={4}>
                      <XStack alignItems="flex-end">
                      <Text style={styles.style}>{summary.style} </Text>
                      <Text style={styles.service}>{summary.service}</Text>
                      </XStack>
                      <XStack alignItems="flex-end">
                      <Text style={styles.variant}> • {summary.variant}</Text>
                      </XStack>
                  </XStack>

                  {/* Display Add-ons */}
                  {addOns.length > 0 && (
                      <View marginTop={10} gap={5}>
                      <Text style={styles.addOnTitle}>Add-ons:</Text>
                      {addOns.map((addOn, index) => (
                          <Text key={index} style={styles.addOnText}>
                          • {addOn}
                          </Text>
                      ))}
                      </View>
                  )}
                  </View>
              </XStack>
              </View>

              {/* Total Price */}
              <XStack alignItems="flex-end" gap={10} height={50}>
                <Text style={{ color: theme.color.val, fontSize: 20, opacity: 0.9, fontWeight: "bold" }}>Total:</Text>
                <Text style={styles.price}>£{appointment.total_price.toFixed(2)}</Text>
              </XStack>
          </View>

          {/* Right */}
          <View alignItems="center" gap={10} paddingTop={10} height={"100%"} justifyContent="space-between">
              {isToday(appointment.start_time) && !hasPast(appointment.start_time) && !summary.cancelled && (
              <Pulse>
                  <XStack gap={4} alignItems="center">
                  <Status size={15} color={theme.orangeRed.val} />
                  <Text style={styles.timeAway}>{formatDateDifference(appointment.start_time)}</Text>
                  </XStack>
              </Pulse>
              )}
              {isTomorrow(appointment.start_time) && !summary.cancelled && (
              <Text style={[styles.timeAway, { opacity: 0.8, color: theme.color.val }]}>
                  {formatDateDifference(appointment.start_time)}
              </Text>
              )}
              {(((
              !isToday(appointment.start_time) && !isTomorrow(appointment.start_time)) || hasPast(appointment.start_time)) && !summary.cancelled && (
              <Text style={[styles.timeAway, { opacity: 0.5, color: theme.color.val, fontWeight: "normal" }]}>
                  {formatDateDifference(appointment.start_time)}
              </Text>
              ))}
              {summary.cancelled && (
              <Text style={[styles.timeAway, { color: theme.danger.val }]}>Cancelled</Text>
              )}
              <View>
                  <Text style={styles.business}>{summary.business}</Text>
                  <View height={70} width={70} borderWidth={3} borderColor={theme.secondaryAccent.val} borderRadius={100}>
                      <Image
                      style={{
                          borderRadius: 100,
                          flex: 1,
                          width: '100%',
                          backgroundColor: theme.background.val,
                      }}
                      source={{ uri: profilePicture }}
                      placeholder={emptyProfile}
                      contentFit="cover"
                      transition={400}
                      />
                  </View>
              </View>
          </View>
        </XStack>
        { !appointment.cancelled && !hasPast(appointment.start_time)  && (
        <XStack height={"10%"} width={"100%"} justifyContent="space-between" alignItems="flex-end" marginTop={10}>
          <CustomerRescheduleButton
              appointmentId={summary.id}
              businessId={appointment.business_id}
              startTime={summary.start_time}
              endTime={summary.end_time}
              ownerId={summary.business_owner_id}
            />
          <CustomerCancelButton
              appointmentId={summary.id}
              date={summary.start_time}
              ownerId={summary.business_owner_id}
            />
        </XStack>
        )}
      </View>
    );
  };

  // Styling for a Natural Agenda List
  const makeStyles = (theme: UseThemeResult) => StyleSheet.create({
    container: {
      backgroundColor: theme.background.val,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginBottom: 50,
      borderRadius: 8,
      borderWidth: 1,
      borderLeftWidth: 10,
      borderColor: theme.accent.val + '10',
      borderLeftColor: theme.accent.val,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      shadowColor: theme.shadowColor?.val || '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 2,
      justifyContent: 'space-between',
      paddingBottom: 20,
      minHeight: 250,
    },
    date: {
      fontSize: 23,
      fontWeight: 'bold',
      color: theme.color.val,
      marginBottom: 4,
      opacity: 0.9,
    },
    detailsContainer: {
      flexDirection: 'column',
      gap: 4,
    },
    style: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.color.val,
      opacity: 1, // Most prominent
    },
    service: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.color.val,
      opacity: 0.9,
    },
    timeAway: {
      fontSize: 14,
      fontWeight: 700,
      fontFamily: "comic-sans",
      color: theme.orangeRed.val,
      wordWrap: 'break-word',
    },
    business: {
      fontSize: 14,
      fontStyle: 'italic',
      color: theme.color.val,
      paddingBottom: 10,
      opacity: 0.7, // Less prominent
    },
    variant: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.color.val,
      opacity: 0.6, // Least prominent
    },
    location: {
      fontSize: 14,
      fontWeight: '400',
      color: theme.color.val,
      opacity: 0.5, // Subtle, non-distracting
      marginTop: 10,
    },
    time: {
      fontSize: 20,
      fontWeight: '500',
      color: theme.color.val,
      marginTop: 2,
      opacity: 0.7,
    },
    price: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.color.val,
    },
    addOnTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.color.val,
      marginBottom: 5,
    },
    addOnText: {
      fontSize: 14,
      color: theme.color.val,
      opacity: 0.8,
      marginLeft: 5,
    },
  });