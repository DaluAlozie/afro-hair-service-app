import { useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export function useNotificationObserver() {
  const redirect = useCallback((notification: Notifications.Notification) => {
    const url = notification.request.content.data?.url;
    if (url) {
      router.push(url);
    }
  }, [router]);

  const handleNotification = useCallback(() => {
    Notifications.getLastNotificationResponseAsync()
      .then(response => {
        if (!response?.notification) {
          return;
        }
        redirect(response?.notification);
      });
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      redirect(response.notification);
    });
    return () => {
      subscription.remove();
    };
  }, [redirect]);

  return { handleNotification };
}