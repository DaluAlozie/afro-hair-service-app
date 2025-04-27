// Create a new Expo SDK client

import { supabase } from "./supabase.ts"

export type ExtraNotificationData = {
    url: string
    type: "newAppointment" | "appointmentCancelled" | "appointmentRescheduled"  | "newReview" | "newTimeSlots"
}

export async function sendNotification(title: string, message: string, extra_data: ExtraNotificationData, recipient_id: string) {
    if (!(!!recipient_id && !!title && !!message)) {
        return Response.json({ error: 'Missing required fields' }, { status: 400, headers: { 'Content-Type': 'application/json' } })
    }
    const { data: pushTokens, error } = await supabase
        .from('PushNotificationTokens')
        .select('token')
        .eq('user_id', recipient_id)

    if (error || !pushTokens) {
        return Response.json({ error: 'Failed to get push tokens' }, { status: 500, headers: { 'Content-Type': 'application/json' } })
    }

    // Create the messages that you want to send to clients
    // const messages = [];
    for (const pushToken of pushTokens.map((t: { token: unknown; }) => t.token)) {

        // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Deno.env.get("EXPO_ACCESS_TOKEN")}`
            },
            body: JSON.stringify({
                to: pushToken,
                sound: 'default',
                title: title,
                body: message,
                channelId: 'default',
                data: extra_data,
            }),
        });
    }
    return Response.json({}, { status: 200, headers: { 'Content-Type': 'application/json' } })
}