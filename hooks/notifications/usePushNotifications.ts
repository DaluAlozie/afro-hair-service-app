import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { AuthProps } from '@/utils/stores/authStore';
import { supabaseClient } from '@/utils/auth/supabase';
import { Href } from 'expo-router';

export type ExtraNotificationData = {
  url: Href
  type: "newAppointment" | "appointmentCancelled" | "appointmentRescheduled"  | "newReview" | "newTimeSlots"
}

export default function usePushNotifications() {
  return {
    registerForPushNotifications: () => registerForPushNotificationsAsync(savePushNotificationToken),
    sendPushNotification,
    removePushNotificationToken
  };
}

async function registerForPushNotificationsAsync(saveToken: (token: string) => Promise<AuthProps>) {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      // EAS projectId is used here.
      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
          throw new Error('Project ID not found');
        }
        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
      } catch (e) {
        token = `${e}`;
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }
    if (token) {
      await saveToken(token);
    }
    return token;
}

async function sendPushNotification(title: string, message: string, extraData: ExtraNotificationData, recipientId: string) {
  const supabase = await supabaseClient;
  const response = await supabase.functions.invoke("send-push-notification", {
    body: JSON.stringify({
      title,
      message,
      extra_data: extraData,
      recipient_id: recipientId
    }),
    headers: {
        "API-KEY": process.env.EXPO_PUBLIC_WEB_API_KEY!,
    },
  });
  return response.data;
}

async function savePushNotificationToken(token: string) {
  const supabase = await supabaseClient;
  const user = await supabase.auth.getUser();
  if (!user || !user.data.user?.id) {
    console.error({ error: { message: "User not logged in" }});
    return {};
  }
  await supabase.from("PushNotificationTokens").delete().eq("token", token);

  const { error } = await supabase.from("PushNotificationTokens").upsert({ user_id: user.data.user?.id, token: token });
  if (error) {
    console.error(error);
    return error;
  }
  return {};
}

async function removePushNotificationToken() {
  const supabase = await supabaseClient;
  const user = await supabase.auth.getUser();
  if (!user || !user.data.user?.id) {
    console.error({ error: { message: "User not logged in" }});
    return {};
  }
  const { data, error } = await supabase.from("PushNotificationTokens").delete().eq("user_id", user.data.user?.id);
  if (error) {
    console.error(error);
    return error;
  }
  return data;
}