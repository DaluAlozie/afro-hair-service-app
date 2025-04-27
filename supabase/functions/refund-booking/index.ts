import { stripe } from "../_utils/stripe.ts";

Deno.serve(async (req: Request) => {
    const { headers } = req;
    if (headers.get('API-KEY') !== Deno.env.get("APP_API_KEY")) {
        return Response.json({ error: 'Unauthorized' }, { status: 401, headers: { 'Content-Type': 'application/json' } })
    }

    const { payment_intent_id } = await req.json();
    if (!payment_intent_id) {
        return Response.json({ error: 'No payment intent provided' }, { status: 400, headers: { 'Content-Type': 'application/json' } })
    }
    const refund = await stripe.refunds.create({
        payment_intent: payment_intent_id,
    });
    if (!refund) {
        return Response.json({ error: 'Failed to refund payment' }, { status: 500, headers: { 'Content-Type': 'application/json' } })
    }
    return Response.json({}, { status: 200, headers: { 'Content-Type': 'application/json' }})
    
})