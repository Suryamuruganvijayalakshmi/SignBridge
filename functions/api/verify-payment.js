export async function onRequestPost(context) {
    return handleVerifyPayment(context);
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
        return handleVerifyPayment(context);
    }
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
}

async function handleVerifyPayment(context) {
    const { request, env = {} } = context;

    const key_secret = env.RAZORPAY_KEY_SECRET || 'L63dYykbBRWOhm01DHn65w1X';

    try {
        const body = await request.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Missing required parameters: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required',
                }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                }
            );
        }

        // Web Crypto HMAC-SHA256
        const encoder = new TextEncoder();
        const keyData = encoder.encode(key_secret);
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );

        const dataToSign = encoder.encode(`${razorpay_order_id}|${razorpay_payment_id}`);
        const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, dataToSign);

        const signatureArray = Array.from(new Uint8Array(signatureBuffer));
        const expectedSignature = signatureArray.map((b) => b.toString(16).padStart(2, '0')).join('');

        if (expectedSignature !== razorpay_signature) {
            return new Response(
                JSON.stringify({ success: false, error: 'Payment signature verification failed' }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Payment verified successfully',
                payment_id: razorpay_payment_id,
                order_id: razorpay_order_id,
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
            JSON.stringify({ success: false, error: err.message || 'Internal server error' }),
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
