/**
 * Cloudflare Worker Entry Point for SignBridge
 * Handles Razorpay API endpoints and delegates static assets to env.ASSETS
 */

import { handleOwnerApi, recordEdgeOrder } from './workerOwnerApi.js';

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // Handle CORS Preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                status: 204,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            });
        }

        // Endpoint: POST /api/create-order
        if (url.pathname === '/api/create-order' && request.method === 'POST') {
            const key_id = env.RAZORPAY_KEY_ID || 'rzp_live_U1aUQnurjyIrSG';
            const key_secret = env.RAZORPAY_KEY_SECRET || 'L63dYykbBRWOhm01DHn65w1X';

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
                const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
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

                const data = await rzpRes.json();

                if (!rzpRes.ok) {
                    return new Response(
                        JSON.stringify({
                            error: data.error?.description || data.error?.message || 'Razorpay order creation failed',
                        }),
                        {
                            status: rzpRes.status,
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

        // Endpoint: POST /api/verify-payment
        if (url.pathname === '/api/verify-payment' && request.method === 'POST') {
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

                // Web Crypto API HMAC-SHA256
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
                        JSON.stringify({
                            success: false,
                            error: 'Payment signature verification failed',
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

                recordEdgeOrder({
                    razorpay_order_id,
                    razorpay_payment_id,
                    amount: body.amount || 199.0,
                    customer: body.customer || {},
                    package_label: body.package_label || 'Single Card',
                    quantity: body.quantity || 1,
                });

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

        // Owner Order Portal & Razorpay Webhook APIs
        if (url.pathname.startsWith('/api/owner') || url.pathname === '/api/razorpay-webhook') {
            const ownerRes = await handleOwnerApi(request, env);
            if (ownerRes) return ownerRes;
        }

        // Delegate static files and client-side routes to Cloudflare Assets
        if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
            let assetResponse = await env.ASSETS.fetch(request);

            // Fallback for SPA client-side routes (e.g. /owner, /portal, /orders)
            if (assetResponse.status === 404 && !url.pathname.startsWith('/api') && !url.pathname.includes('.')) {
                assetResponse = await env.ASSETS.fetch(new Request(new URL('/', request.url), request));
            }

            const newHeaders = new Headers(assetResponse.headers);

            // Ensure Content-Security-Policy allows Razorpay iframe & scripts
            newHeaders.set(
                'Content-Security-Policy',
                "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://*.razorpay.com https://static.cloudflareinsights.com; frame-src 'self' https://checkout.razorpay.com https://api.razorpay.com https://*.razorpay.com https://*.rzp.io; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob: https://*.razorpay.com; media-src 'self' blob:; connect-src 'self' https: https://api.razorpay.com https://*.razorpay.com https://lumberjack.razorpay.com; frame-ancestors *;"
            );

            return new Response(assetResponse.body, {
                status: assetResponse.status,
                statusText: assetResponse.statusText,
                headers: newHeaders,
            });
        }

        return new Response('Not Found', { status: 404 });
    },
};

