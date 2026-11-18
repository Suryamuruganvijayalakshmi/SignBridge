export async function onRequestPost(context) {
    const { request, env } = context;

    const key_id = env.RAZORPAY_KEY_ID;
    const key_secret = env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
        return new Response(
            JSON.stringify({ error: 'Server configuration error: Razorpay credentials missing' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        const body = await request.json();
        const { amount, currency = 'INR', receipt, notes = {} } = body;

        const numAmount = Number(amount);
        if (isNaN(numAmount) || numAmount < 100) {
            return new Response(
                JSON.stringify({ error: 'Amount must be at least 100 paise (₹1)' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const basicAuth = btoa(`${key_id}:${key_secret}`);
        const response = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${basicAuth}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: Math.round(numAmount),
                currency: currency.toUpperCase(),
                receipt: receipt || `rcpt_${Date.now()}`,
                notes,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return new Response(
                JSON.stringify({ error: data.error?.description || data.error?.message || 'Razorpay order creation failed' }),
                { status: response.status, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({
                order_id: data.id,
                amount: data.amount,
                currency: data.currency,
                receipt: data.receipt,
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (err) {
        return new Response(
            JSON.stringify({ error: err.message || 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

