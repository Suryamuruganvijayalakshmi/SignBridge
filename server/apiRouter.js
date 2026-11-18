import {
    OWNER_CONFIG,
    hashPassword,
    generateToken,
    verifyToken,
    readDB,
    writeDB,
    saveOrder,
    getDashboardMetrics,
    getOrdersList,
    updateOrderStatus,
    updateOrderShipping,
    addOrderNote,
    handleRazorpayWebhook,
} from './orderStore.js';

/**
 * Helper to parse JSON body from incoming Node.js request
 */
export function parseRequestBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch {
                resolve({});
            }
        });
    });
}

/**
 * Helper to send JSON responses
 */
export function sendJSON(res, statusCode, data) {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end(JSON.stringify(data));
}

/**
 * Authentication middleware for owner endpoints
 */
export function authenticateOwner(req) {
    const authHeader = req.headers['authorization'] || '';
    if (!authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.slice(7).trim();
    return verifyToken(token);
}

/**
 * Main API request dispatcher
 */
export async function handleApiRequest(req, res) {
    const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = urlObj.pathname.replace(/\/+$/, '') || '/';
    const method = req.method;

    if (method === 'OPTIONS') {
        res.statusCode = 204;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return res.end();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 1. OWNER AUTHENTICATION ENDPOINTS
    // ─────────────────────────────────────────────────────────────────────────
    if (pathname === '/api/owner/login' && method === 'POST') {
        const body = await parseRequestBody(req);
        const { email, password } = body;

        if (!email || !password) {
            return sendJSON(res, 400, { error: 'Email and password are required' });
        }

        const inputHash = hashPassword(password);
        const ownerEmail = (OWNER_CONFIG.email || '').toLowerCase().trim();

        if (email.toLowerCase().trim() !== ownerEmail || inputHash !== OWNER_CONFIG.passwordHash) {
            return sendJSON(res, 401, { error: 'Invalid owner credentials' });
        }

        const token = generateToken({
            email: ownerEmail,
            role: 'owner',
            name: 'SignBridge Owner',
        });

        return sendJSON(res, 200, {
            success: true,
            token,
            user: {
                email: ownerEmail,
                name: 'SignBridge Authorized Owner',
                role: 'owner',
            },
        });
    }

    if (pathname === '/api/owner/forgot-password' && method === 'POST') {
        const body = await parseRequestBody(req);
        const { email } = body;

        // Secure response: always respond politely without leaking user existence
        return sendJSON(res, 200, {
            success: true,
            message: `If ${email} is the registered owner, a password reset protocol link has been dispatched to your authorized inbox.`,
        });
    }

    if (pathname === '/api/owner/me' && method === 'GET') {
        const auth = authenticateOwner(req);
        if (!auth) {
            return sendJSON(res, 401, { error: 'Unauthorized: Session expired or invalid' });
        }
        return sendJSON(res, 200, { success: true, user: auth });
    }

    if (pathname === '/api/owner/change-password' && method === 'POST') {
        const auth = authenticateOwner(req);
        if (!auth) {
            return sendJSON(res, 401, { error: 'Unauthorized' });
        }
        const body = await parseRequestBody(req);
        const { current_password, new_password } = body;

        if (!new_password || new_password.length < 8) {
            return sendJSON(res, 400, { error: 'New password must be at least 8 characters' });
        }

        if (hashPassword(current_password) !== OWNER_CONFIG.passwordHash) {
            return sendJSON(res, 400, { error: 'Current password does not match' });
        }

        OWNER_CONFIG.passwordHash = hashPassword(new_password);
        return sendJSON(res, 200, { success: true, message: 'Owner password changed successfully' });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. OWNER DASHBOARD & ORDERS (PROTECTED)
    // ─────────────────────────────────────────────────────────────────────────
    if (pathname.startsWith('/api/owner/')) {
        const auth = authenticateOwner(req);
        if (!auth) {
            return sendJSON(res, 401, { error: 'Unauthorized: Please log in to access the owner portal' });
        }

        // GET /api/owner/metrics
        if (pathname === '/api/owner/metrics' && method === 'GET') {
            const metrics = getDashboardMetrics();
            return sendJSON(res, 200, { success: true, metrics });
        }

        // GET /api/owner/orders
        if (pathname === '/api/owner/orders' && method === 'GET') {
            const status = urlObj.searchParams.get('status');
            const payment_status = urlObj.searchParams.get('payment_status');
            const search = urlObj.searchParams.get('search');
            const startDate = urlObj.searchParams.get('startDate');
            const endDate = urlObj.searchParams.get('endDate');

            const orders = getOrdersList({ status, payment_status, search, startDate, endDate });
            return sendJSON(res, 200, { success: true, orders, total: orders.length });
        }

        // GET /api/owner/orders/:id
        const orderMatch = pathname.match(/^\/api\/owner\/orders\/([^/]+)$/);
        if (orderMatch && method === 'GET') {
            const id = orderMatch[1];
            const db = readDB();
            const order = db.orders.find((o) => o.id === id || o.order_number === id);
            if (!order) {
                return sendJSON(res, 404, { error: 'Order not found' });
            }
            return sendJSON(res, 200, { success: true, order });
        }

        // PATCH /api/owner/orders/:id/status
        const statusMatch = pathname.match(/^\/api\/owner\/orders\/([^/]+)\/status$/);
        if (statusMatch && method === 'PATCH') {
            const id = statusMatch[1];
            const body = await parseRequestBody(req);
            const { status, note } = body;
            try {
                const updated = updateOrderStatus(id, status, auth.name || 'Owner', note);
                return sendJSON(res, 200, { success: true, order: updated });
            } catch (err) {
                return sendJSON(res, 400, { error: err.message });
            }
        }

        // PATCH /api/owner/orders/:id/shipping
        const shipMatch = pathname.match(/^\/api\/owner\/orders\/([^/]+)\/shipping$/);
        if (shipMatch && method === 'PATCH') {
            const id = shipMatch[1];
            const body = await parseRequestBody(req);
            try {
                const updated = updateOrderShipping(id, body);
                return sendJSON(res, 200, { success: true, order: updated });
            } catch (err) {
                return sendJSON(res, 400, { error: err.message });
            }
        }

        // POST /api/owner/orders/:id/notes
        const noteMatch = pathname.match(/^\/api\/owner\/orders\/([^/]+)\/notes$/);
        if (noteMatch && method === 'POST') {
            const id = noteMatch[1];
            const body = await parseRequestBody(req);
            if (!body.text || !body.text.trim()) {
                return sendJSON(res, 400, { error: 'Note text cannot be empty' });
            }
            try {
                const note = addOrderNote(id, body.text.trim(), auth.name || 'Owner');
                return sendJSON(res, 200, { success: true, note });
            } catch (err) {
                return sendJSON(res, 400, { error: err.message });
            }
        }

        // POST /api/owner/orders/:id/notify
        const notifyMatch = pathname.match(/^\/api\/owner\/orders\/([^/]+)\/notify$/);
        if (notifyMatch && method === 'POST') {
            const id = notifyMatch[1];
            const body = await parseRequestBody(req);
            const db = readDB();
            const order = db.orders.find((o) => o.id === id || o.order_number === id);
            if (!order) return sendJSON(res, 404, { error: 'Order not found' });

            const newNotif = {
                id: `notif_${Date.now()}`,
                channel: body.channel || 'whatsapp',
                type: body.type || 'custom_update',
                recipient: body.channel === 'email' ? order.customer?.email : order.customer?.phone,
                status: 'delivered',
                sent_at: new Date().toISOString(),
                message_preview: body.message || `Status update for SignBridge Order #${order.order_number}`,
            };

            order.notifications_log = order.notifications_log || [];
            order.notifications_log.unshift(newNotif);
            writeDB(db);

            return sendJSON(res, 200, { success: true, notification: newNotif });
        }

        // GET /api/owner/products
        if (pathname === '/api/owner/products' && method === 'GET') {
            const db = readDB();
            return sendJSON(res, 200, { success: true, products: db.products || [] });
        }

        // PATCH /api/owner/products/:id
        const productMatch = pathname.match(/^\/api\/owner\/products\/([^/]+)$/);
        if (productMatch && method === 'PATCH') {
            const id = productMatch[1];
            const body = await parseRequestBody(req);
            const db = readDB();
            const product = db.products.find((p) => p.id === id);
            if (!product) return sendJSON(res, 404, { error: 'Product not found' });

            if (body.stock !== undefined) product.stock = Number(body.stock);
            if (body.price !== undefined) product.price = Number(body.price);
            if (body.status !== undefined) product.status = body.status;

            writeDB(db);
            return sendJSON(res, 200, { success: true, product });
        }

        // GET /api/owner/customers
        if (pathname === '/api/owner/customers' && method === 'GET') {
            const db = readDB();
            const customerMap = new Map();

            (db.orders || []).forEach((o) => {
                const email = o.customer?.email || 'unknown';
                if (!customerMap.has(email)) {
                    customerMap.set(email, {
                        name: o.customer?.name || 'Customer',
                        email,
                        phone: o.customer?.phone || '',
                        address: o.customer?.address || '',
                        pincode: o.customer?.pincode || '',
                        orders_count: 0,
                        total_spent: 0,
                        last_order_date: o.created_at,
                        orders: [],
                    });
                }
                const c = customerMap.get(email);
                c.orders_count += 1;
                c.total_spent += Number(o.amount) || 0;
                c.orders.push({
                    id: o.id,
                    order_number: o.order_number,
                    amount: o.amount,
                    date: o.created_at,
                    status: o.order_status,
                });
            });

            return sendJSON(res, 200, { success: true, customers: Array.from(customerMap.values()) });
        }

        // GET /api/owner/notifications
        if (pathname === '/api/owner/notifications' && method === 'GET') {
            const db = readDB();
            const allNotifs = [];
            (db.orders || []).forEach((o) => {
                (o.notifications_log || []).forEach((n) => {
                    allNotifs.push({
                        ...n,
                        order_id: o.id,
                        order_number: o.order_number,
                        customer_name: o.customer?.name,
                    });
                });
            });

            allNotifs.sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at));
            return sendJSON(res, 200, { success: true, notifications: allNotifs });
        }

        // GET /api/owner/settings & POST /api/owner/settings
        if (pathname === '/api/owner/settings') {
            const db = readDB();
            if (method === 'GET') {
                return sendJSON(res, 200, {
                    success: true,
                    settings: db.settings || {},
                    owner_email: OWNER_CONFIG.email,
                });
            }
            if (method === 'POST') {
                const body = await parseRequestBody(req);
                db.settings = { ...db.settings, ...body };
                writeDB(db);
                return sendJSON(res, 200, { success: true, settings: db.settings });
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 3. RAZORPAY WEBHOOK ENDPOINT
    // ─────────────────────────────────────────────────────────────────────────
    if (pathname === '/api/razorpay-webhook' && method === 'POST') {
        const body = await parseRequestBody(req);
        const event = body.event;
        const payload = body.payload;

        const result = handleRazorpayWebhook(event, payload);
        return sendJSON(res, 200, result);
    }

    return false; // Not handled by this router
}

