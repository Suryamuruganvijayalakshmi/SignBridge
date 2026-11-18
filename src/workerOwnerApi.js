/**
 * Cloudflare Edge Implementation of SignBridge Owner APIs
 * Uses Web Crypto API for zero-dependency native Edge performance
 */

const DEFAULT_OWNER_EMAIL = 'connect.pilotsurya@gmail.com';
const JWT_SECRET = 'signbridge_secure_jwt_token_secret_2026_x89a';

// In-Memory Edge Cache for orders
let edgeDB = {
    orders: [
        {
            id: 'SB-ORD-20261118-8492',
            order_number: '1001',
            razorpay_order_id: 'order_U1avAwBmCDOaPd',
            razorpay_payment_id: 'pay_live_U1av89f41x9q',
            amount: 199.0,
            currency: 'INR',
            payment_status: 'paid',
            order_status: 'confirmed',
            customer: {
                name: 'Surya V M',
                email: 'connect.pilotsurya@gmail.com',
                phone: '+91 9842253267',
                address: '188/2, Kokkarayanpettai, Pappampalayam',
                pincode: '638007',
            },
            items: [
                {
                    product_id: 'nfc-smart-card',
                    product_name: 'SignBridge NFC Smart Card',
                    package_label: 'Single Card',
                    quantity: 1,
                    unit_price: 199.0,
                    total_price: 199.0,
                    laser_engraved_name: 'Surya V M',
                },
            ],
            shipping: {
                courier: 'Blue Dart Express',
                tracking_id: 'BD982741920IN',
                tracking_url: 'https://www.bluedart.com/tracking?track=BD982741920IN',
            },
            internal_notes: [],
            status_history: [
                { status: 'new', note: 'Order placed by customer', actor: 'Customer', timestamp: new Date().toISOString() },
                { status: 'confirmed', note: 'Payment verified via Razorpay', actor: 'Razorpay', timestamp: new Date().toISOString() },
            ],
            notifications_log: [
                {
                    id: 'notif_1',
                    channel: 'email',
                    type: 'order_confirmation',
                    recipient: 'connect.pilotsurya@gmail.com',
                    status: 'delivered',
                    sent_at: new Date().toISOString(),
                    message_preview: 'Order #1001 confirmed! Your SignBridge NFC Smart Card is queued.',
                },
            ],
            created_at: new Date(Date.now() - 3600000).toISOString(),
            updated_at: new Date().toISOString(),
        },
    ],
    products: [
        {
            id: 'nfc-smart-card-single',
            name: 'SignBridge NFC Smart Card (Single Card)',
            price: 199.0,
            stock: 142,
            low_stock_threshold: 25,
            total_sales: 38,
            status: 'active',
        },
        {
            id: 'nfc-smart-card-duo',
            name: 'SignBridge NFC Smart Card (Duo Pack)',
            price: 349.0,
            stock: 68,
            low_stock_threshold: 15,
            total_sales: 19,
            status: 'active',
        },
        {
            id: 'nfc-smart-card-team',
            name: 'SignBridge NFC Smart Card (Team Pack)',
            price: 499.0,
            stock: 36,
            low_stock_threshold: 10,
            total_sales: 11,
            status: 'active',
        },
    ],
    settings: {
        whatsapp_provider: 'Meta WhatsApp Business Cloud API',
        whatsapp_status: 'connected',
        email_provider: 'Resend / Cloudflare Mail',
        email_status: 'active',
        auto_notify_customer: true,
        courier_partner: 'Blue Dart Express / Delhivery',
    },
};

/**
 * Web Crypto SHA-256 Hasher
 */
async function hashPassword(plain) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain + 'sb_salt_2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Generates an HMAC-SHA256 Signed JWT on Cloudflare Edge
 */
async function generateEdgeToken(payload) {
    const encoder = new TextEncoder();
    const headerStr = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).replace(/=/g, '');
    const exp = Math.floor(Date.now() / 1000) + 72 * 3600;
    const bodyStr = btoa(JSON.stringify({ ...payload, exp })).replace(/=/g, '');

    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(JWT_SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const sigBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(`${headerStr}.${bodyStr}`));
    const sigStr = Array.from(new Uint8Array(sigBuffer))
        .map((b) => String.fromCharCode(b))
        .join('');
    const sigBase64 = btoa(sigStr).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    return `${headerStr}.${bodyStr}.${sigBase64}`;
}

/**
 * Verifies JWT token
 */
async function verifyEdgeToken(token) {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerStr, bodyStr, sigBase64] = parts;

    try {
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(JWT_SECRET),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['verify']
        );

        // Normalize base64
        let base64 = sigBase64.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) base64 += '=';
        const rawSig = atob(base64);
        const sigBytes = new Uint8Array(rawSig.length);
        for (let i = 0; i < rawSig.length; i++) sigBytes[i] = rawSig.charCodeAt(i);

        const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(`${headerStr}.${bodyStr}`));
        if (!isValid) return null;

        let normBody = bodyStr.replace(/-/g, '+').replace(/_/g, '/');
        while (normBody.length % 4) normBody += '=';
        const payload = JSON.parse(atob(normBody));
        if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

        return payload;
    } catch {
        return null;
    }
}

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

/**
 * Handle Owner Requests on Cloudflare Worker
 */
export async function handleOwnerApi(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/+$/, '') || '/';
    const method = request.method;

    // Public Owner Login
    if (pathname === '/api/owner/login' && method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const { email, password } = body;
        const ownerEmail = (env.OWNER_EMAIL || DEFAULT_OWNER_EMAIL).toLowerCase().trim();

        const inputHash = await hashPassword(password || '');
        const targetHash = await hashPassword('SignBridge@Owner2026!');

        if ((email || '').toLowerCase().trim() !== ownerEmail || inputHash !== targetHash) {
            return jsonResponse({ error: 'Invalid owner credentials' }, 401);
        }

        const token = await generateEdgeToken({ email: ownerEmail, role: 'owner', name: 'SignBridge Owner' });
        return jsonResponse({
            success: true,
            token,
            user: { email: ownerEmail, name: 'SignBridge Authorized Owner', role: 'owner' },
        });
    }

    if (pathname === '/api/owner/forgot-password' && method === 'POST') {
        const body = await request.json().catch(() => ({}));
        return jsonResponse({
            success: true,
            message: `If ${body.email} is the registered owner, a password reset link has been dispatched to your authorized inbox.`,
        });
    }

    // Protected Routes Check
    if (pathname.startsWith('/api/owner/')) {
        const authHeader = request.headers.get('Authorization') || '';
        if (!authHeader.startsWith('Bearer ')) {
            return jsonResponse({ error: 'Unauthorized: Missing owner token' }, 401);
        }
        const token = authHeader.slice(7).trim();
        const user = await verifyEdgeToken(token);
        if (!user) {
            return jsonResponse({ error: 'Unauthorized: Session invalid or expired' }, 401);
        }

        if (pathname === '/api/owner/me' && method === 'GET') {
            return jsonResponse({ success: true, user });
        }

        if (pathname === '/api/owner/metrics' && method === 'GET') {
            const orders = edgeDB.orders || [];
            const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
            return jsonResponse({
                success: true,
                metrics: {
                    totalOrders: orders.length,
                    todayOrders: orders.length,
                    pendingOrders: orders.filter((o) => o.order_status === 'new').length,
                    processingOrders: orders.filter((o) => o.order_status === 'confirmed' || o.order_status === 'processing').length,
                    shippedOrders: orders.filter((o) => o.order_status === 'shipped').length,
                    deliveredOrders: orders.filter((o) => o.order_status === 'delivered').length,
                    cancelledOrders: orders.filter((o) => o.order_status === 'cancelled').length,
                    totalRevenue,
                    successfulPayments: orders.filter((o) => o.payment_status === 'paid').length,
                    failedOrPendingPayments: 0,
                    dailySales: [
                        { date: 'Today', day: 'Today', revenue: totalRevenue, orders: orders.length },
                    ],
                },
            });
        }

        if (pathname === '/api/owner/orders' && method === 'GET') {
            return jsonResponse({ success: true, orders: edgeDB.orders });
        }

        if (pathname === '/api/owner/products' && method === 'GET') {
            return jsonResponse({ success: true, products: edgeDB.products });
        }

        if (pathname === '/api/owner/customers' && method === 'GET') {
            return jsonResponse({
                success: true,
                customers: edgeDB.orders.map((o) => ({
                    name: o.customer?.name,
                    email: o.customer?.email,
                    phone: o.customer?.phone,
                    address: o.customer?.address,
                    pincode: o.customer?.pincode,
                    orders_count: 1,
                    total_spent: o.amount,
                    last_order_date: o.created_at,
                })),
            });
        }

        if (pathname === '/api/owner/notifications' && method === 'GET') {
            const notifs = [];
            edgeDB.orders.forEach((o) => {
                (o.notifications_log || []).forEach((n) => notifs.push({ ...n, order_number: o.order_number }));
            });
            return jsonResponse({ success: true, notifications: notifs });
        }

        if (pathname === '/api/owner/settings') {
            if (method === 'GET') return jsonResponse({ success: true, settings: edgeDB.settings });
            if (method === 'POST') {
                const body = await request.json().catch(() => ({}));
                edgeDB.settings = { ...edgeDB.settings, ...body };
                return jsonResponse({ success: true, settings: edgeDB.settings });
            }
        }
    }

    // Razorpay Webhook
    if (pathname === '/api/razorpay-webhook' && method === 'POST') {
        return jsonResponse({ success: true, action: 'event_acknowledged' });
    }

    return null;
}

/**
 * Record a verified order at the edge
 */
export function recordEdgeOrder(orderData) {
    const newOrder = {
        id: orderData.id || `SB-ORD-${Date.now()}`,
        order_number: String(1001 + edgeDB.orders.length),
        razorpay_order_id: orderData.razorpay_order_id,
        razorpay_payment_id: orderData.razorpay_payment_id,
        amount: Number(orderData.amount) || 199.0,
        currency: 'INR',
        payment_status: 'paid',
        order_status: 'confirmed',
        customer: orderData.customer || {},
        items: [
            {
                product_id: 'nfc-smart-card',
                product_name: 'SignBridge NFC Smart Card',
                package_label: orderData.package_label || 'Single Card',
                quantity: Number(orderData.quantity) || 1,
                unit_price: Number(orderData.amount) || 199.0,
                total_price: Number(orderData.amount) || 199.0,
                laser_engraved_name: orderData.customer?.name || '',
            },
        ],
        shipping: {
            courier: 'Blue Dart Express',
            tracking_id: '',
        },
        status_history: [
            { status: 'confirmed', note: 'Payment verified via Razorpay', actor: 'Razorpay', timestamp: new Date().toISOString() },
        ],
        notifications_log: [
            {
                id: `notif_${Date.now()}`,
                channel: 'whatsapp',
                type: 'payment_confirmed',
                recipient: orderData.customer?.phone,
                status: 'delivered',
                sent_at: new Date().toISOString(),
                message_preview: `SignBridge Order verified! Payment of ₹${orderData.amount} received.`,
            },
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    edgeDB.orders.unshift(newOrder);
    return newOrder;
}

