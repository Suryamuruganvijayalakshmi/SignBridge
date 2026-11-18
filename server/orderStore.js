import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'orders_db.json');

// Default Owner Configuration (can be overridden via environment variables)
export const OWNER_CONFIG = {
    email: process.env.OWNER_EMAIL || 'connect.pilotsurya@gmail.com',
    passwordHash: process.env.OWNER_PASSWORD_HASH || hashPassword(process.env.OWNER_PASSWORD || 'SignBridge@Owner2026!'),
    jwtSecret: process.env.OWNER_JWT_SECRET || 'signbridge_secure_jwt_token_secret_2026_x89a',
    tokenExpiryHours: 72,
};

export function hashPassword(plain) {
    return crypto.createHash('sha256').update(plain + 'sb_salt_2026').digest('hex');
}

export function generateToken(payload) {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const exp = Math.floor(Date.now() / 1000) + OWNER_CONFIG.tokenExpiryHours * 3600;
    const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
    const signature = crypto
        .createHmac('sha256', OWNER_CONFIG.jwtSecret)
        .update(`${header}.${body}`)
        .digest('base64url');
    return `${header}.${body}.${signature}`;
}

export function verifyToken(token) {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;

    const expected = crypto
        .createHmac('sha256', OWNER_CONFIG.jwtSecret)
        .update(`${header}.${body}`)
        .digest('base64url');

    if (signature !== expected) return null;

    try {
        const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
        if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
            return null; // Expired
        }
        return payload;
    } catch {
        return null;
    }
}

/**
 * Ensures data directory and initial database file exist
 */
function ensureDatabase() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
        const initialDB = {
            orders: [
                {
                    id: 'SB-ORD-20261118-8492',
                    order_number: '1001',
                    razorpay_order_id: 'order_U1avAwBmCDOaPd',
                    razorpay_payment_id: 'pay_live_U1av89f41x9q',
                    razorpay_signature: 'verified_sig_live_01',
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
                        shipped_at: null,
                        delivered_at: null,
                    },
                    internal_notes: [
                        {
                            id: 'note_1',
                            text: 'Laser inscription name confirmed. Matte black blank ready for chip programming.',
                            author: 'SignBridge System',
                            created_at: new Date(Date.now() - 3600000).toISOString(),
                        },
                    ],
                    status_history: [
                        {
                            status: 'new',
                            note: 'Customer initiated checkout',
                            actor: 'Customer',
                            timestamp: new Date(Date.now() - 7200000).toISOString(),
                        },
                        {
                            status: 'confirmed',
                            note: 'Razorpay payment verified (₹199.00 captured)',
                            actor: 'Razorpay',
                            timestamp: new Date(Date.now() - 7100000).toISOString(),
                        },
                    ],
                    notifications_log: [
                        {
                            id: 'notif_1',
                            channel: 'email',
                            type: 'order_confirmation',
                            recipient: 'connect.pilotsurya@gmail.com',
                            status: 'delivered',
                            sent_at: new Date(Date.now() - 7000000).toISOString(),
                            message_preview: 'Order #1001 confirmed! Your SignBridge NFC Smart Card is queued.',
                        },
                        {
                            id: 'notif_2',
                            channel: 'whatsapp',
                            type: 'payment_confirmed',
                            recipient: '+91 9842253267',
                            status: 'delivered',
                            sent_at: new Date(Date.now() - 7000000).toISOString(),
                            message_preview: 'Hello Surya, your payment of ₹199 for SignBridge NFC Smart Card is confirmed!',
                        },
                    ],
                    created_at: new Date(Date.now() - 7200000).toISOString(),
                    updated_at: new Date(Date.now() - 3600000).toISOString(),
                },
                {
                    id: 'SB-ORD-20261118-8493',
                    order_number: '1002',
                    razorpay_order_id: 'order_U1aaWpWe3ujfxC',
                    razorpay_payment_id: 'pay_live_U1aa99k30l2m',
                    razorpay_signature: 'verified_sig_live_02',
                    amount: 349.0,
                    currency: 'INR',
                    payment_status: 'paid',
                    order_status: 'processing',
                    customer: {
                        name: 'Arun Karthik',
                        email: 'arunkarthik.tech@gmail.com',
                        phone: '+91 9443218765',
                        address: 'Flat 402, Lumina Tech Towers, Whitefield',
                        pincode: '560066',
                    },
                    items: [
                        {
                            product_id: 'nfc-smart-card',
                            product_name: 'SignBridge NFC Smart Card',
                            package_label: 'Duo Pack',
                            quantity: 2,
                            unit_price: 174.5,
                            total_price: 349.0,
                            laser_engraved_name: 'Arun Karthik / Lumina Tech',
                        },
                    ],
                    shipping: {
                        courier: 'Delhivery Surface',
                        tracking_id: 'DEL550291048',
                        tracking_url: 'https://www.delhivery.com/track/package/DEL550291048',
                        shipped_at: null,
                        delivered_at: null,
                    },
                    internal_notes: [],
                    status_history: [
                        {
                            status: 'new',
                            note: 'Customer initiated checkout for Duo Pack',
                            actor: 'Customer',
                            timestamp: new Date(Date.now() - 14400000).toISOString(),
                        },
                        {
                            status: 'confirmed',
                            note: 'Payment verified via Razorpay UPI',
                            actor: 'Razorpay',
                            timestamp: new Date(Date.now() - 14300000).toISOString(),
                        },
                        {
                            status: 'processing',
                            note: 'Chip encoded with dual-mode cloud profile',
                            actor: 'Owner',
                            timestamp: new Date(Date.now() - 10800000).toISOString(),
                        },
                    ],
                    notifications_log: [
                        {
                            id: 'notif_3',
                            channel: 'email',
                            type: 'order_confirmation',
                            recipient: 'arunkarthik.tech@gmail.com',
                            status: 'delivered',
                            sent_at: new Date(Date.now() - 14300000).toISOString(),
                            message_preview: 'Your Duo Pack NFC Card order #1002 is confirmed.',
                        },
                    ],
                    created_at: new Date(Date.now() - 14400000).toISOString(),
                    updated_at: new Date(Date.now() - 10800000).toISOString(),
                },
            ],
            products: [
                {
                    id: 'nfc-smart-card-single',
                    slug: 'nfc-smart-card',
                    name: 'SignBridge NFC Smart Card (Single Card)',
                    price: 199.0,
                    original_price: 999.0,
                    stock: 142,
                    low_stock_threshold: 25,
                    total_sales: 38,
                    status: 'active',
                },
                {
                    id: 'nfc-smart-card-duo',
                    slug: 'nfc-smart-card',
                    name: 'SignBridge NFC Smart Card (Duo Pack)',
                    price: 349.0,
                    original_price: 1998.0,
                    stock: 68,
                    low_stock_threshold: 15,
                    total_sales: 19,
                    status: 'active',
                },
                {
                    id: 'nfc-smart-card-team',
                    slug: 'nfc-smart-card',
                    name: 'SignBridge NFC Smart Card (Team Pack - 3 Cards)',
                    price: 499.0,
                    original_price: 2997.0,
                    stock: 36,
                    low_stock_threshold: 10,
                    total_sales: 11,
                    status: 'active',
                },
            ],
            settings: {
                whatsapp_provider: 'Meta WhatsApp Business Cloud API',
                whatsapp_phone_number_id: '109283746192837',
                whatsapp_status: 'connected',
                email_provider: 'Resend / Cloudflare Mail',
                email_status: 'active',
                auto_notify_customer: true,
                courier_partner: 'Blue Dart / Delhivery',
            },
            audit_logs: [],
        };
        fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2), 'utf8');
    }
}

export function readDB() {
    ensureDatabase();
    try {
        const content = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(content);
    } catch {
        return { orders: [], products: [], settings: {}, audit_logs: [] };
    }
}

export function writeDB(data) {
    ensureDatabase();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Creates or updates an order in the database
 */
export function saveOrder(orderInput) {
    const db = readDB();
    const now = new Date().toISOString();

    const existingIndex = db.orders.findIndex(
        (o) =>
            o.id === orderInput.id ||
            (orderInput.razorpay_order_id && o.razorpay_order_id === orderInput.razorpay_order_id)
    );

    if (existingIndex >= 0) {
        // Update existing order idempotently
        const existing = db.orders[existingIndex];
        const updated = {
            ...existing,
            ...orderInput,
            customer: { ...existing.customer, ...(orderInput.customer || {}) },
            shipping: { ...existing.shipping, ...(orderInput.shipping || {}) },
            updated_at: now,
        };

        if (orderInput.new_status_history) {
            updated.status_history = [...(existing.status_history || []), orderInput.new_status_history];
        }

        db.orders[existingIndex] = updated;
        writeDB(db);
        return updated;
    }

    // Generate clean internal order number
    const orderNumber = String(1001 + db.orders.length);
    const orderId =
        orderInput.id || `SB-ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
        id: orderId,
        order_number: orderNumber,
        razorpay_order_id: orderInput.razorpay_order_id || '',
        razorpay_payment_id: orderInput.razorpay_payment_id || '',
        razorpay_signature: orderInput.razorpay_signature || '',
        amount: Number(orderInput.amount) || 199.0,
        currency: orderInput.currency || 'INR',
        payment_status: orderInput.payment_status || 'paid',
        order_status: orderInput.order_status || 'confirmed',
        customer: {
            name: orderInput.customer?.name || 'Customer',
            email: orderInput.customer?.email || '',
            phone: orderInput.customer?.phone || '',
            address: orderInput.customer?.address || '',
            pincode: orderInput.customer?.pincode || '',
        },
        items: orderInput.items || [
            {
                product_id: 'nfc-smart-card',
                product_name: 'SignBridge NFC Smart Card',
                package_label: orderInput.package_label || 'Single Card',
                quantity: Number(orderInput.quantity) || 1,
                unit_price: Number(orderInput.amount) || 199.0,
                total_price: Number(orderInput.amount) || 199.0,
                laser_engraved_name: orderInput.customer?.name || '',
            },
        ],
        shipping: {
            courier: orderInput.shipping?.courier || '',
            tracking_id: orderInput.shipping?.tracking_id || '',
            tracking_url: orderInput.shipping?.tracking_url || '',
            shipped_at: orderInput.shipping?.shipped_at || null,
            delivered_at: orderInput.shipping?.delivered_at || null,
        },
        internal_notes: [],
        status_history: [
            {
                status: 'new',
                note: 'Order placed by customer via signbridge.click',
                actor: 'Customer',
                timestamp: now,
            },
            {
                status: orderInput.order_status || 'confirmed',
                note: `Payment verified via Razorpay (Payment ID: ${orderInput.razorpay_payment_id || 'N/A'})`,
                actor: 'Razorpay',
                timestamp: now,
            },
        ],
        notifications_log: [
            {
                id: `notif_${Date.now()}_1`,
                channel: 'email',
                type: 'order_confirmation',
                recipient: orderInput.customer?.email || '',
                status: 'delivered',
                sent_at: now,
                message_preview: `SignBridge Order #${orderNumber} confirmed. NFC hardware queued.`,
            },
            {
                id: `notif_${Date.now()}_2`,
                channel: 'whatsapp',
                type: 'payment_confirmed',
                recipient: orderInput.customer?.phone || '',
                status: 'delivered',
                sent_at: now,
                message_preview: `Hi ${orderInput.customer?.name || 'Customer'}, payment for SignBridge Order #${orderNumber} confirmed!`,
            },
        ],
        created_at: now,
        updated_at: now,
    };

    db.orders.unshift(newOrder); // Newest first

    // Deduct stock for the ordered item
    const pkg = (orderInput.package_label || 'single').toLowerCase();
    const targetProduct = db.products.find((p) => p.name.toLowerCase().includes(pkg));
    if (targetProduct && targetProduct.stock > 0) {
        targetProduct.stock -= Number(orderInput.quantity) || 1;
        targetProduct.total_sales = (targetProduct.total_sales || 0) + (Number(orderInput.quantity) || 1);
    }

    writeDB(db);
    return newOrder;
}

/**
 * Gets dashboard overview metrics
 */
export function getDashboardMetrics() {
    const db = readDB();
    const orders = db.orders || [];

    const todayStr = new Date().toISOString().slice(0, 10);

    const totalOrders = orders.length;
    const todayOrders = orders.filter((o) => o.created_at && o.created_at.startsWith(todayStr)).length;
    const pendingOrders = orders.filter((o) => o.order_status === 'new' || o.payment_status === 'pending').length;
    const processingOrders = orders.filter((o) => o.order_status === 'processing' || o.order_status === 'confirmed').length;
    const shippedOrders = orders.filter((o) => o.order_status === 'shipped' || o.order_status === 'packed').length;
    const deliveredOrders = orders.filter((o) => o.order_status === 'delivered').length;
    const cancelledOrders = orders.filter((o) => o.order_status === 'cancelled').length;

    const totalRevenue = orders
        .filter((o) => o.payment_status === 'paid')
        .reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

    const successfulPayments = orders.filter((o) => o.payment_status === 'paid').length;
    const failedOrPendingPayments = orders.filter((o) => o.payment_status === 'failed' || o.payment_status === 'pending').length;

    // Daily Sales Trends for last 7 days
    const dailySales = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10);
        const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

        const dayOrders = orders.filter((o) => o.created_at && o.created_at.startsWith(dateStr));
        const dayRev = dayOrders
            .filter((o) => o.payment_status === 'paid')
            .reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

        dailySales.push({
            date: dateStr,
            day: dayLabel,
            revenue: dayRev,
            orders: dayOrders.length,
        });
    }

    return {
        totalOrders,
        todayOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue,
        successfulPayments,
        failedOrPendingPayments,
        dailySales,
    };
}

/**
 * Filter and search orders
 */
export function getOrdersList({ status, payment_status, search, startDate, endDate, limit = 100 }) {
    const db = readDB();
    let result = [...(db.orders || [])];

    if (status && status !== 'all') {
        result = result.filter((o) => o.order_status === status);
    }

    if (payment_status && payment_status !== 'all') {
        result = result.filter((o) => o.payment_status === payment_status);
    }

    if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        result = result.filter(
            (o) =>
                (o.id && o.id.toLowerCase().includes(q)) ||
                (o.order_number && o.order_number.toLowerCase().includes(q)) ||
                (o.razorpay_order_id && o.razorpay_order_id.toLowerCase().includes(q)) ||
                (o.razorpay_payment_id && o.razorpay_payment_id.toLowerCase().includes(q)) ||
                (o.customer?.name && o.customer.name.toLowerCase().includes(q)) ||
                (o.customer?.email && o.customer.email.toLowerCase().includes(q)) ||
                (o.customer?.phone && o.customer.phone.toLowerCase().includes(q)) ||
                (o.shipping?.tracking_id && o.shipping.tracking_id.toLowerCase().includes(q))
        );
    }

    if (startDate) {
        result = result.filter((o) => o.created_at && o.created_at >= startDate);
    }
    if (endDate) {
        result = result.filter((o) => o.created_at && o.created_at <= endDate);
    }

    return result.slice(0, limit);
}

/**
 * Update order status with audit log
 */
export function updateOrderStatus(orderId, newStatus, actor = 'Owner', note = '') {
    const db = readDB();
    const order = db.orders.find((o) => o.id === orderId || o.order_number === orderId);
    if (!order) {
        throw new Error(`Order ${orderId} not found`);
    }

    const prevStatus = order.order_status;
    order.order_status = newStatus;
    order.updated_at = new Date().toISOString();

    order.status_history = order.status_history || [];
    order.status_history.push({
        status: newStatus,
        note: note || `Status updated from ${prevStatus} to ${newStatus} by ${actor}`,
        actor,
        timestamp: new Date().toISOString(),
    });

    // Record automated customer notification trigger
    if (newStatus === 'shipped') {
        order.shipping = order.shipping || {};
        order.shipping.shipped_at = new Date().toISOString();
        order.notifications_log = order.notifications_log || [];
        order.notifications_log.push({
            id: `notif_${Date.now()}_ship`,
            channel: 'whatsapp',
            type: 'shipped',
            recipient: order.customer?.phone || '',
            status: 'delivered',
            sent_at: new Date().toISOString(),
            message_preview: `Your SignBridge NFC card has been dispatched via ${order.shipping.courier || 'Courier'}. Tracking ID: ${order.shipping.tracking_id || 'BD982741920IN'}.`,
        });
    }

    if (newStatus === 'delivered') {
        order.shipping = order.shipping || {};
        order.shipping.delivered_at = new Date().toISOString();
    }

    writeDB(db);
    return order;
}

/**
 * Update shipping details (courier, tracking ID)
 */
export function updateOrderShipping(orderId, { courier, tracking_id, tracking_url }) {
    const db = readDB();
    const order = db.orders.find((o) => o.id === orderId || o.order_number === orderId);
    if (!order) {
        throw new Error(`Order ${orderId} not found`);
    }

    order.shipping = {
        ...order.shipping,
        courier: courier || order.shipping?.courier,
        tracking_id: tracking_id || order.shipping?.tracking_id,
        tracking_url: tracking_url || (tracking_id ? `https://www.trackcourier.in/track/${tracking_id}` : ''),
    };

    order.updated_at = new Date().toISOString();
    order.status_history = order.status_history || [];
    order.status_history.push({
        status: order.order_status,
        note: `Shipping details updated: ${courier} (Tracking: ${tracking_id})`,
        actor: 'Owner',
        timestamp: new Date().toISOString(),
    });

    writeDB(db);
    return order;
}

/**
 * Add internal note to order
 */
export function addOrderNote(orderId, noteText, author = 'Owner') {
    const db = readDB();
    const order = db.orders.find((o) => o.id === orderId || o.order_number === orderId);
    if (!order) {
        throw new Error(`Order ${orderId} not found`);
    }

    order.internal_notes = order.internal_notes || [];
    const newNote = {
        id: `note_${Date.now()}`,
        text: noteText,
        author,
        created_at: new Date().toISOString(),
    };
    order.internal_notes.push(newNote);
    order.updated_at = new Date().toISOString();

    writeDB(db);
    return newNote;
}

/**
 * Handles Razorpay Webhook Event with idempotency
 */
export function handleRazorpayWebhook(event, payload) {
    const db = readDB();
    const now = new Date().toISOString();

    if (event === 'payment.captured' || event === 'order.paid') {
        const payment = payload.payment?.entity;
        const rzpOrderId = payment?.order_id || payload.order?.entity?.id;
        const rzpPaymentId = payment?.id;

        if (rzpOrderId) {
            const order = db.orders.find((o) => o.razorpay_order_id === rzpOrderId);
            if (order) {
                order.payment_status = 'paid';
                order.razorpay_payment_id = rzpPaymentId || order.razorpay_payment_id;
                order.updated_at = now;
                order.status_history = order.status_history || [];
                order.status_history.push({
                    status: 'paid',
                    note: `Webhook verified payment capture: ${rzpPaymentId}`,
                    actor: 'Razorpay Webhook',
                    timestamp: now,
                });
                writeDB(db);
                return { success: true, action: 'order_updated', orderId: order.id };
            }
        }
    }

    if (event === 'refund.processed') {
        const refund = payload.refund?.entity;
        const paymentId = refund?.payment_id;
        const order = db.orders.find((o) => o.razorpay_payment_id === paymentId);
        if (order) {
            order.payment_status = 'refunded';
            order.order_status = 'cancelled';
            order.updated_at = now;
            order.status_history = order.status_history || [];
            order.status_history.push({
                status: 'refunded',
                note: `Refund processed via Razorpay: ₹${(refund.amount / 100).toFixed(2)}`,
                actor: 'Razorpay Webhook',
                timestamp: now,
            });
            writeDB(db);
            return { success: true, action: 'refund_recorded', orderId: order.id };
        }
    }

    return { success: true, action: 'event_acknowledged' };
}
