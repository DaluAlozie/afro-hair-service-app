import { stripe } from "../_utils/stripe.ts";
import { supabase } from "../_utils/supabase.ts";

Deno.serve(async (req: Request) => {

    const { headers } = req;
    if (headers.get('API-KEY') !== Deno.env.get("APP_API_KEY")) {
        return Response.json({ error: 'Unauthorized' }, { status: 401, headers: { 'Content-Type': 'application/json' } })
    }

    const { record } = await req.json();
    if (!record) {
        return Response.json({ error: 'No record provided' }, { status: 400, headers: { 'Content-Type': 'application/json' } })
    }
    if (!record.email) {
        return Response.json({ error: 'No email provided' }, { status: 400, headers: { 'Content-Type': 'application/json' } })
    }
    if (!record.id) {
        return Response.json({ error: 'No uid provided' }, { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    const customer = await stripe.customers.create({
        email: record.email,
    });

    if (!customer) {
        return Response.json({ error: 'Failed to create customer' }, { status: 500, headers: { 'Content-Type': 'application/json' } })
    }

    if (!customer) {
        return Response.json({ error: 'Failed to create customer' }, { status: 500, headers: { 'Content-Type': 'application/json' } })
    }

    const { error } = await supabase.from('Profile').upsert({
            id: record.id,
            stripe_customer_id: customer.id,
        }
    );
    if (error) {
        return Response.json({ error: 'Failed to create customer' }, { status: 500, headers: { 'Content-Type': 'application/json' } })
    }
    return Response.json({}, { status: 200, headers: { 'Content-Type': 'application/json' } })
})