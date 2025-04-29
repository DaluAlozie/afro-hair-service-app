import { stripe } from "../_utils/stripe.ts";

Deno.serve(async (req: Request) => {
    const { headers } = req;
    if (headers.get('API-KEY') !== Deno.env.get("APP_API_KEY")) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { customer_id, amount, currency } = await req.json();
    if (!customer_id) {
        return Response.json({ error: 'No customer_id provided' }, { status: 400, headers: { 'Content-Type': 'application/json' } })
    }
    if (!amount) {
        return Response.json({ error: 'No amount provided' }, { status: 400, headers: { 'Content-Type': 'application/json' } })
    }
    if (!currency) {
        return Response.json({ error: 'No currency provided' }, { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    const customer = await stripe.customers.retrieve(customer_id);

    if (!customer) {
        return Response.json({ error: 'Failed to retrieve customer' }, { status: 500, headers: { 'Content-Type': 'application/json' } })
    }

    const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: '2020-08-27' }
    );
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        customer: customer.id,
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter
        // is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
            enabled: true,
        },
    });

    return Response.json({
        paymentIntentId: paymentIntent.id,
        paymentIntentClientSecret: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        publishableKey: Deno.env.get("STRIPE_PUBLISHABLE_KEY"),
    }, { status: 200, headers: { 'Content-Type': 'application/json' } })
})