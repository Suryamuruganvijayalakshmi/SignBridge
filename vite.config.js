import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRazorpayOrder, verifyPaymentSignature } from './server/razorpay.js';
import { saveOrder } from './server/orderStore.js';
import { handleApiRequest } from './server/apiRouter.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function razorpayDevApiPlugin() {
  const attachMiddleware = (server) => {
    server.middlewares.use(async (req, res, next) => {
      const url = req.url ? req.url.split('?')[0].replace(/\/+$/, '') : '';

      // Endpoint: GET /api/razorpay-checkout.js (Local fallback)
      if (req.method === 'GET' && (url === '/api/razorpay-checkout.js' || url === '/checkout.js')) {
        const filePath = path.resolve(__dirname, 'public/checkout.js');
        if (fs.existsSync(filePath)) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/javascript');
          return res.end(fs.readFileSync(filePath));
        }
      }

      // Endpoint: POST /api/create-order
      if (req.method === 'POST' && (url === '/api/create-order' || url === '/api/create-order/')) {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', async () => {
          try {
            const data = body ? JSON.parse(body) : {};
            const { amount, currency, receipt, notes } = data;

            if (!amount || Number(amount) < 100) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ error: 'Amount must be at least 100 paise (₹1)' }));
            }

            const order = await createRazorpayOrder({ amount, currency, receipt, notes });
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(order));
          } catch (err) {
            console.error('[Vite /api/create-order Error]:', err);
            const statusCode = err.statusCode || 500;
            res.statusCode = statusCode;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Failed to create order' }));
          }
        });
        return;
      }

      // Endpoint: POST /api/verify-payment
      if (req.method === 'POST' && (url === '/api/verify-payment' || url === '/api/verify-payment/')) {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            const data = body ? JSON.parse(body) : {};
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

            if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              return res.end(
                JSON.stringify({
                  success: false,
                  error: 'Missing required parameters: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required',
                })
              );
            }

            const result = verifyPaymentSignature({
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
            });

            if (!result.isValid) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              return res.end(
                JSON.stringify({
                  success: false,
                  error: result.error || 'Payment signature verification failed',
                })
              );
            }

            // Save order in database store
            let savedOrder = null;
            try {
              savedOrder = saveOrder({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                amount: data.amount || 199.0,
                currency: data.currency || 'INR',
                customer: data.customer || {},
                package_label: data.package_label || 'Single Card',
                quantity: data.quantity || 1,
                payment_status: 'paid',
                order_status: 'confirmed',
              });
            } catch (saveErr) {
              console.error('[SaveOrder Error]:', saveErr);
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: true,
                message: 'Payment verified successfully',
                payment_id: razorpay_payment_id,
                order_id: razorpay_order_id,
                internal_order_id: savedOrder?.id,
                order_number: savedOrder?.order_number,
              })
            );
          } catch (err) {
            console.error('[Vite /api/verify-payment Error]:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message || 'Internal server error' }));
          }
        });
        return;
      }

      // Owner Order Portal & Razorpay Webhook APIs
      if (url.startsWith('/api/owner') || url === '/api/razorpay-webhook') {
        const handled = await handleApiRequest(req, res);
        if (handled !== false) return;
      }

      next();
    });
  };

  return {
    name: 'razorpay-dev-api',
    configureServer(server) {
      attachMiddleware(server);
    },
    configurePreviewServer(server) {
      attachMiddleware(server);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    razorpayDevApiPlugin(),
    {
      name: 'spa-404-fallback',
      closeBundle() {
        try {
          const distDir = path.resolve(__dirname, 'dist');
          const indexPath = path.join(distDir, 'index.html');
          const fallbackPath = path.join(distDir, '404.html');
          if (fs.existsSync(indexPath)) {
            fs.copyFileSync(indexPath, fallbackPath);
          }
        } catch (e) {
          // ignore error if dist is not yet created
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  },
  server: {
    host: true,
    allowedHosts: true,
  },
});
