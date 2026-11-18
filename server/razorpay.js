import Razorpay from 'razorpay';
import crypto from 'node:crypto';
import dotenv from 'dotenv';

dotenv.config();

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

/**
 * Returns an initialized Razorpay instance using environment credentials
 */
export function getRazorpayClient() {
    const id = process.env.RAZORPAY_KEY_ID || key_id;
    const secret = process.env.RAZORPAY_KEY_SECRET || key_secret;

    if (!id || !secret) {
        throw new Error('Razorpay credentials missing: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set');
    }

    return new Razorpay({
        key_id: id,
        key_secret: secret,
    });
}

/**
 * STEP 1: BACKEND - Create Order
 * Endpoint: POST /api/create-order
 * Request: { amount (paise), currency, receipt, notes }
 * Return: { order_id, amount, currency }
 * Minimum amount: 100 paise (₹1)
 */
export async function createRazorpayOrder({ amount, currency = 'INR', receipt, notes = {} }) {
    const numAmount = Number(amount);

    if (isNaN(numAmount) || numAmount < 100) {
        const err = new Error('Amount must be at least 100 paise (₹1)');
        err.statusCode = 400;
        throw err;
    }

    const client = getRazorpayClient();

    const options = {
        amount: Math.round(numAmount),
        currency: (currency || 'INR').toUpperCase(),
        receipt: receipt || `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        notes: typeof notes === 'object' && notes !== null ? notes : {},
    };

    try {
        const order = await client.orders.create(options);
        return {
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
        };
    } catch (apiError) {
        console.error('Razorpay API orders.create error:', apiError);
        const err = new Error(apiError.description || apiError.message || 'Razorpay API order creation failed');
        err.statusCode = apiError.statusCode || 500;
        throw err;
    }
}

/**
 * STEP 3: BACKEND - Verify Signature
 * Endpoint: POST /api/verify-payment
 * Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
 * Compare generated signature with razorpay_signature
 * Return success only if signatures match
 */
export function verifyPaymentSignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return {
            isValid: false,
            statusCode: 400,
            error: 'Missing required fields: razorpay_order_id, razorpay_payment_id, and razorpay_signature are all required',
        };
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || key_secret;
    if (!secret) {
        return {
            isValid: false,
            statusCode: 500,
            error: 'Server configuration error: RAZORPAY_KEY_SECRET is not configured',
        };
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
        return {
            isValid: false,
            statusCode: 400,
            error: 'Payment verification failed: Invalid payment signature (HMAC-SHA256 mismatch)',
        };
    }

    return {
        isValid: true,
        statusCode: 200,
        message: 'Payment signature verified successfully',
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
    };
}
