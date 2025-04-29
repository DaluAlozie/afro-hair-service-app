import { sendNotification } from "../_utils/sendNotification.ts";

Deno.serve(async (req: Request) => {

    const { headers } = req;
    if (headers.get('API-KEY') !== Deno.env.get("APP_API_KEY")) {
        return Response.json({ error: 'Unauthorized' }, { status: 401, headers: { 'Content-Type': 'application/json' } })
    }
    const { title, message, extra_data, recipient_id } = await req.json();
    return await sendNotification(title, message, extra_data, recipient_id)
})