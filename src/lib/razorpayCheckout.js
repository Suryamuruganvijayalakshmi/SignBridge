/**
 * Razorpay Standard Web Checkout Integration Helper
 */

export function loadRazorpayScript() {
    return new Promise((resolve) => {
        if (typeof window !== 'undefined' && window.Razorpay) {
            resolve(true);
            return;
        }

        const loadScriptTag = (url) => {
            return new Promise((res) => {
                const script = document.createElement('script');
                script.src = url;
                script.async = true;
                script.onload = () => {
                    if (typeof window !== 'undefined' && window.Razorpay) {
                        res(true);
                    } else {
                        res(false);
                    }
                };
                script.onerror = () => res(false);
                document.body.appendChild(script);
            });
        };

        (async () => {
            // Check if existing script tag in DOM is still loading
            for (let i = 0; i < 4; i++) {
                if (typeof window !== 'undefined' && window.Razorpay) {
                    resolve(true);
                    return;
                }
                await new Promise((r) => setTimeout(r, 120));
            }

            // 1. Try local same-origin bundle (bypasses ad-blockers and CDN blocks)
            let loaded = await loadScriptTag('/checkout.js');
            if (loaded) {
                resolve(true);
                return;
            }

            // 2. Try official Razorpay CDN
            loaded = await loadScriptTag('https://checkout.razorpay.com/v1/checkout.js');
            if (loaded) {
                resolve(true);
                return;
            }

            // 3. Try backend proxy
            loaded = await loadScriptTag('/api/razorpay-checkout.js');
            if (loaded) {
                resolve(true);
                return;
            }

            resolve(false);
        })();
    });
}

/**
 * Initiates Razorpay checkout flow:
 * 1. Calls POST /api/create-order
 * 2. Opens Razorpay Modal with order_id
 * 3. On success, calls POST /api/verify-payment with HMAC-SHA256 signature
 */
export async function initiateRazorpayPayment({
    amount, // in paise, minimum 100
    currency = 'INR',
    name = 'SignBridge',
    description = 'SignBridge NFC Smart Card',
    receipt,
    notes = {},
    prefill = {},
    onSuccess,
    onFailure,
    onDismiss,
}) {
    // 1. Ensure Razorpay SDK is loaded
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded || !window.Razorpay) {
        throw new Error('Razorpay gateway could not be loaded. Please disable any ad-blockers (like Brave Shields/uBlock) for this site or refresh the page.');
    }

    // 2. Step 1: Call Backend to Create Order
    const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            amount,
            currency,
            receipt: receipt || `rcpt_${Date.now()}`,
            notes,
        }),
    });

    if (!orderRes.ok) {
        const errorData = await orderRes.json().catch(() => ({}));
        throw new Error(errorData.error || `Order creation failed (HTTP ${orderRes.status})`);
    }

    const orderData = await orderRes.json();
    const { order_id } = orderData;

    if (!order_id) {
        throw new Error('Invalid order response: order_id was not returned from backend');
    }

    // Resolve public key ID from backend order response or client environment
    const keyId = orderData.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!keyId) {
        throw new Error('Razorpay Key ID missing. Please verify RAZORPAY_KEY_ID in .env.');
    }

    // 3. Step 2 & 3: Open Razorpay Modal & Verify on Success
    return new Promise((resolve, reject) => {
        const options = {
            key: keyId,
            amount: orderData.amount,
            currency: orderData.currency || 'INR',
            name,
            description,
            image: '/signbridge-emblem.webp',
            order_id,
            prefill: {
                name: prefill.name || '',
                email: prefill.email || '',
                contact: prefill.contact || '',
            },
            notes: {
                ...notes,
                product: 'NFC Smart Card',
            },
            theme: {
                color: '#18181b', // SignBridge Onyx Theme
            },
            modal: {
                ondismiss: () => {
                    if (onDismiss) onDismiss();
                    resolve({ status: 'dismissed', message: 'Payment window was closed by user.' });
                },
            },
            handler: async (response) => {
                // Razorpay returns razorpay_payment_id, razorpay_order_id, razorpay_signature
                try {
                    const verifyRes = await fetch('/api/verify-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }),
                    });

                    const verifyData = await verifyRes.json();

                    if (!verifyRes.ok || !verifyData.success) {
                        const err = new Error(verifyData.error || 'Payment signature verification failed');
                        if (onFailure) onFailure(err);
                        reject(err);
                        return;
                    }

                    const result = {
                        status: 'success',
                        paymentId: response.razorpay_payment_id,
                        orderId: response.razorpay_order_id,
                        signature: response.razorpay_signature,
                        message: verifyData.message || 'Payment verified successfully',
                    };

                    if (onSuccess) onSuccess(result);
                    resolve(result);
                } catch (verifyErr) {
                    if (onFailure) onFailure(verifyErr);
                    reject(verifyErr);
                }
            },
        };

        const rzp = new window.Razorpay(options);

        rzp.on('payment.failed', (failedResponse) => {
            const err = new Error(
                failedResponse.error?.description ||
                failedResponse.error?.reason ||
                'Payment processing failed'
            );
            err.code = failedResponse.error?.code;
            err.source = failedResponse.error?.source;
            err.step = failedResponse.error?.step;
            if (onFailure) onFailure(err);
            reject(err);
        });

        rzp.open();
    });
}

