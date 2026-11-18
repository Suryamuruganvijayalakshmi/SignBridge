export async function onRequestPost(context) {
    return handleCreateOrder(context);
}

export async function onRequest(context) {
    if (context.request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    }
    if (context.request.method === 'POST') {
        return handleCreateOrder(context);
    }
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
}

async function handleCreateOrder(context) {
    const { request, env = {} } = context;

    const key_id = env.RAZORPAY_KEY_ID || 'rzp_test_U1a3GT1vwxWWir';
    const key_secret = env.RAZORPAY_KEY_SECRET || 'nod8Fc8Gorxw5Jxuc6uRhoi0';

    try {
        const body = await request.json();
        const { amount, currency = 'INR', receipt, notes = {} } = body;

        const numAmount = Number(amount);
        if (isNaN(numAmount) || numAmount < 100) {
            return new Response(
                JSON.stringify({ error: 'Amount must be at least 100 paise (₹1)' }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                }
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
                JSON.stringify({
                    error: data.error?.description || data.error?.message || 'Razorpay order creation failed',
                }),
                {
                    status: response.status,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                }
            );
        }

        return new Response(
            JSON.stringify({
                order_id: data.id,
                amount: data.amount,
                currency: data.currency,
                receipt: data.receipt,
                key_id,
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    } catch (err) {
        return new Response(
            JSON.stringify({ error: err.message || 'Internal server error' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    }
}
