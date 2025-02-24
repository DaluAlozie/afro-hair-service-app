import React from "react";
import { Appointment } from "@/components/business/types";
import { AppointmentSummary } from "@/hooks/business/useAppointmentSummaries";
import { useTheme, useWindowDimensions, View, XStack } from "tamagui";
import { Text, StyleSheet } from "react-native";
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
    const { height } = useWindowDimensions();

    const profilePicture = `${process.env.EXPO_PUBLIC_BUSINESS_PROFILE_BASE_URL}/${summary.business_owner_id}/profilePicture.png`;
    const location = [
      summary.flat_number ? "Flat " + summary.flat_number : undefined,
      summary.street_address,
      summary.locality,
      summary.city,
      summary.postal_code,
    ]
      .filter(Boolean)
      .join(', ');

    // Extract add-ons from the appointment
    const addOns = Array.from(summary.add_ons.values() || []);

    return (
      <View
        style={styles.container}
        height={height * 0.7}
        opacity={hasPast(appointment.start_time) || summary.cancelled ? 0.5 : 1}>
        <XStack justifyContent="space-between" alignItems="flex-start" height={appointment.cancelled ? "100%" : "95%"}>
          {/* Left */}
          <View height={"100%"} justifyContent="space-between">
              <View>
              <Text style={styles.date}>{formatDate(appointment.start_time)}</Text>
              <Text style={styles.time}>{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</Text>
              <Text style={styles.location}>{location}</Text>

              {/* Time & Service Details */}
              <XStack alignItems="center" justifyContent="space-between" marginTop={20}>
                  <View style={styles.detailsContainer}>
                  <XStack alignItems="flex-end" marginBottom={4}>
                      <XStack alignItems="flex-end">
                      <Text style={styles.serviceOption}>{summary.service_option} </Text>
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
              <XStack alignItems="center" gap={10}>
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
                  <View height={70} width={70} borderWidth={1} borderColor={theme.color.val} borderRadius={100}>
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
        { !appointment.cancelled && (
        <XStack height={"5%"} width={"100%"} justifyContent="space-between" alignItems="flex-end" marginTop={10}>
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
      marginBottom: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderLeftWidth: 4,
      borderColor: theme.borderColor.val,
      borderLeftColor: theme.borderColor.val,
      shadowColor: theme.shadowColor?.val || '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 2,
      justifyContent: 'space-between',
      paddingBottom: 20,
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
    serviceOption: {
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
      alignSelf: 'flex-end',
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
  