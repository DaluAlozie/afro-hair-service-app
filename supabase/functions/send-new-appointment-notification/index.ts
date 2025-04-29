import { sendNotification } from "../_utils/sendNotification.ts";
import { supabase } from "../_utils/supabase.ts";


Deno.serve(async (req: Request) =>  {

    const { headers } = req;
    if (headers.get('API-KEY') !== Deno.env.get("APP_API_KEY")) {
        return Response.json({ error: 'Unauthorized' }, { status: 401, headers: { 'Content-Type': 'application/json' } })
    }
    const { record } = await req.json();
    if (!record) {
        return Response.json({ error: 'No record provided' }, { status: 400, headers: { 'Content-Type': 'application/json' } })
    }
    const { data, error } = await supabase
        .from('Business')
        .select('owner_id')
        .eq('id', record.business_id)
        .limit(1);
    if (error || !data) {
        return Response.json({ error: 'Failed to find business' }, { status: 500, headers: { 'Content-Type': 'application/json' }})
    }
    const { owner_id } = data[0];
    await sendNotification(
        'New appointment',
        'You have a new appointment', {
        url: `/(business)/appointments?appointmentId=${record.id}&date=${new Date(record.start_time).toISOString().split('T')[0]}`,
        type: 'newAppointment'
    }, owner_id)
    return Response.json({}, { status: 200, headers: { 'Content-Type': 'application/json' }})
})

