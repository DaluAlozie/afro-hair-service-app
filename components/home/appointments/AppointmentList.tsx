import { Appointment } from "@/components/business/types";
import { AppointmentSummary } from "@/hooks/business/useAppointmentSummaries";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { RefreshControl, Text } from "react-native";
import { useTheme, View  } from "tamagui";
import { AppointmentItem } from "./Appointment";

interface AppointmentListProps {
    appointments: Appointment[];
    summaries: Map<number, AppointmentSummary>;
    refreshing: boolean;
    onRefresh: () => void | Promise<void>;
    emptyText: string;
    headerText?: string;
    headerComponent?: React.ReactNode;
  }

  export const AppointmentList = ({ appointments, summaries, refreshing, onRefresh, emptyText, headerText, headerComponent }: AppointmentListProps) => {
    const theme = useTheme();
    return (
      <FlashList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          return <AppointmentItem appointment={item} summary={summaries.get(item.id)} />
        }}
        collapsable={true}
        collapsableChildren={true}
        contentContainerStyle={{ paddingBottom: 100 }}
        estimatedItemSize={270}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={(
          <View marginTop={10}>
            { headerComponent }
            <Text style={{ marginTop: 10, marginBottom: 20,fontSize: 25, fontWeight: "bold", color: theme.color.val }}>
              {headerText}
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.color.val]} />
        }
        ListEmptyComponent={
          <View justifyContent="center" alignItems="center">
            <Text style={{ color: theme.color.val, fontSize: 16, opacity: 0.8 }}>
              {emptyText}
            </Text>
          </View>
        }
        extraData={[summaries, appointments]}
      />
    );
  };