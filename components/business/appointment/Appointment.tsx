import React from "react";
import { useTheme, View, XStack } from "tamagui";
import { Text, StyleSheet } from "react-native";
import { Appointment } from "@/components/business/types";
import { AppointmentSummary } from "@/hooks/business/useAppointmentSummaries";
import { Fonts } from "@/constants/Fonts";
import { UseThemeResult } from "@tamagui/core";
import { formatTime } from "../booking/BookingDetails";
import { formatDateDifference, hasPast, isToday, isTomorrow } from "@/components/home/utils";
import Status from "@/assets/icons/status";
import Pulse from "@/components/utils/ui/Pulse";
import { Entypo } from "@expo/vector-icons";
import BusinessRescheduleButton from "./RescheduleButton";
import BusinessCancelButton from "./CancelButton";
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
  const l = addOns.length;
  const addedHeight = l < 3 ? l < 2 ? l < 1 ? 0 : 60 : 80 : 100;

  return (
    <>
    <Separator />
    <View
      style={styles.container}
      height={230+addedHeight}
      opacity={hasPast(appointment.start_time) || summary.cancelled ? 0.5 : 1}>
      <XStack justifyContent="space-between" alignItems="flex-start" height={summary.cancelled ? "100%": "85%"}>
        {/* Left */}
        <View height={"100%"} justifyContent="space-between">
          <View>
            <Text style={styles.time}>{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</Text>
            <Text style={styles.location} numberOfLines={1}>{location}</Text>

            {/* Time & Service Details */}
            <XStack alignItems="center" justifyContent="space-between" marginTop={15}>
              <View style={styles.detailsContainer}>
                <XStack alignItems="flex-end" marginBottom={4}>
                  <XStack alignItems="flex-end">
                    <Text numberOfLines={1} style={styles.serviceOption}>{summary.service_option} </Text>
                    <Text numberOfLines={1} style={styles.service}>{summary.service}</Text>
                  </XStack>
                  <XStack alignItems="flex-end">
                    <Text numberOfLines={1} style={styles.variant}> • {summary.variant}</Text>
                  </XStack>
                </XStack>

                {/* Display Add-ons */}
                <View>
                {addOns.length > 0 && (
                  <View marginTop={10} gap={1} height={60} width={"100%"} flexDirection="column">
                    <Text style={styles.addOnTitle}>Add-ons:</Text>
                    <View gap={3} flexWrap="wrap" height={60}  overflow="hidden" paddingTop={10}>
                    {addOns.map((addOn, index) => (
                      <XStack key={index} alignItems="center" gap={5} opacity={0.8}>
                        <Entypo name="plus" size={14} color={theme.color.val} />
                        <Text numberOfLines={1} style={styles.addOnText}>{addOn}</Text>
                      </XStack>
                    ))}
                    </View>
                  </View>
                )}
                </View>
              </View>
            </XStack>
          </View>

          {/* Total Price */}
          <XStack alignItems="center" gap={10}>
            <Text style={{ color: theme.color.val, fontSize: 16, opacity: 0.5 }}>Total:</Text>
            <Text style={styles.price}>£{appointment.total_price.toFixed(2)}</Text>
          </XStack>
        </View>

        {/* Right */}
        <View alignItems="center" gap={10} paddingTop={10} height={"90%"} justifyContent="space-between">
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
            <Text style={[styles.timeAway, { color: theme.danger.val, fontWeight: "normal" }]}>
              Cancelled
            </Text>
          )}
        </View>
      </XStack>
      { !appointment.cancelled && !hasPast(appointment.start_time)  && (
      <XStack height={"15%"} width={"100%"} justifyContent="space-between" alignItems="flex-end" marginTop={10}>
        <BusinessRescheduleButton
          appointmentId={summary.id}
          businessId={appointment.business_id}
          startTime={summary.start_time}
          endTime={summary.end_time}
          customerId={summary.business_owner_id}
        />
        <BusinessCancelButton
          appointmentId={summary.id}
          date={summary.start_time}
          customerId={appointment.customer_id}
        />
      </XStack>
      )}
    </View>
    </>
  );
};

export const Separator = () => {
  const theme = useTheme();
  return (
    <View height={1} width={"100%"} justifyContent="flex-start" alignItems="flex-start">
      <View height={1} width={"95%"} backgroundColor={theme.gray5.val} opacity={0.6} />
    </View>
  );
}

const makeStyles = (theme: UseThemeResult) =>
  StyleSheet.create({
    container: {
      width: '95%',
      backgroundColor: theme.background.val,
      marginBottom: 50,
      marginTop: 30,
      padding: 30,
      borderRadius: 10,
      justifyContent: 'space-between',
      borderLeftWidth: 10,
      borderLeftColor: theme.accent.val,
      borderColor: theme.accent.val+"10",
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
    },
    agenda: {
      backgroundColor: theme.background.val,
    },
    fadedText: {
      lineHeight: 30,
      fontSize: Fonts.contentAlt.fontSize,
      color: theme.gray8.val,
      textAlign: 'center',
    },
    emptyContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 100,
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
      maxWidth: 200,
    },
    service: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.color.val,
      opacity: 0.9,
      maxWidth: 200,
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
      opacity: 0.7,
    },
    variant: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.color.val,
      opacity: 0.6,
    },
    location: {
      fontSize: 14,
      fontWeight: '400',
      color: theme.color.val,
      opacity: 0.5,
      marginTop: 5,
    },
    time: {
      fontSize: 20,
      fontWeight: '500',
      color: theme.color.val,
      marginTop: 2,
      opacity: 0.7,
    },
    price: {
      fontSize: 16,
      opacity: 0.5,
      color: theme.color.val,
      alignSelf: 'flex-end',
    },
    addOnTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.color.val,
      opacity: 0.8,
    },
    addOnText: {
      fontSize: 12,
      color: theme.color.val,
      opacity: 0.8,
      marginLeft: 2,
      marginRight: 20,
      alignContent: 'center',
      justifyContent: 'center',
      maxWidth: 200,
      overflow: 'hidden',
    },
  });
