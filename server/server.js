import http from 'node:http';
import { createRazorpayOrder, verifyPaymentSignature } from './razorpay.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;

function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

const server = http.createServer(async (req, res) => {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const url = req.url.split('?')[0];

    // Endpoint: POST /api/create-order
    if (req.method === 'POST' && url === '/api/create-order') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', async () => {
            try {
                const data = body ? JSON.parse(body) : {};
                const { amount, currency, receipt, notes } = data;

                if (!amount || Number(amount) < 100) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Amount must be at least 100 paise (₹1)' }));
                    return;
                }

                const order = await createRazorpayOrder({ amount, currency, receipt, notes });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(order));
            } catch (err) {
                console.error('[API /api/create-order Error]:', err);
                const statusCode = err.statusCode || 500;
                res.writeHead(statusCode, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message || 'Failed to create order' }));
            }
        });
        return;
    }

    // Endpoint: POST /api/verify-payment
    if (req.method === 'POST' && url === '/api/verify-payment') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const data = body ? JSON.parse(body) : {};
                const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

                if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(
                        JSON.stringify({
                            success: false,
                            error: 'Missing required parameters: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required',
                        })
                    );
                    return;
                }

                const result = verifyPaymentSignature({
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature,
                });

                if (!result.isValid) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(
                        JSON.stringify({
                            success: false,
                            error: result.error || 'Payment signature verification failed',
                        })
                    );
                    return;
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(
                    JSON.stringify({
                        success: true,
                        message: 'Payment verified successfully',
                        payment_id: razorpay_payment_id,
                        order_id: razorpay_order_id,
                    })
                );
            } catch (err) {
                console.error('[API /api/verify-payment Error]:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message || 'Internal server error' }));
            }
        });
        return;
    }

    // Default 404 for other routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
    console.log(`Razorpay API Server running on port ${PORT}`);
});
