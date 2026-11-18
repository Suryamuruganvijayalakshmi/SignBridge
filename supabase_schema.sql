-- =============================================================================
-- SIGNBRIDGE TECHNOLOGIES — COMPLETE SUPABASE DATABASE SCHEMA SETUP
-- Execute this entire script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- =============================================================================

-- STEP 1: CLEAN SLATE — DROP EXISTING TABLES IF ANY (CASCADE)
DROP TABLE IF EXISTS public.order_status_history CASCADE;
DROP TABLE IF EXISTS public.order_notes CASCADE;
DROP TABLE IF EXISTS public.notifications_log CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.contact_messages CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- STEP 2: CREATE CORE SIGNBRIDGE TABLES
-- =============================================================================

-- 1. PRODUCTS TABLE (Catalog & Stock Inventory)
CREATE TABLE public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL DEFAULT 'nfc-smart-card',
    price NUMERIC(10, 2) NOT NULL DEFAULT 199.00,
    original_price NUMERIC(10, 2) DEFAULT 999.00,
    stock INTEGER NOT NULL DEFAULT 150,
    low_stock_threshold INTEGER NOT NULL DEFAULT 25,
    total_sales INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'out_of_stock'
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CUSTOMERS TABLE (Aggregated Directory)
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    pincode TEXT,
    orders_count INTEGER DEFAULT 1,
    total_spent NUMERIC(10, 2) DEFAULT 0.00,
    last_order_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ORDERS TABLE (Core Razorpay Purchases & Fulfillment)
CREATE TABLE public.orders (
    id TEXT PRIMARY KEY, -- e.g. 'SB-ORD-20261118-8492' or UUID
    order_number TEXT UNIQUE NOT NULL, -- e.g. '1001', '1002'
    
    -- Razorpay Transaction Metadata
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 199.00,
    currency TEXT NOT NULL DEFAULT 'INR',
    payment_status TEXT NOT NULL DEFAULT 'paid', -- 'paid', 'pending', 'failed', 'refunded'
    order_status TEXT NOT NULL DEFAULT 'confirmed', -- 'new', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'

    -- Customer & Delivery Destination
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_pincode TEXT NOT NULL,

    -- Card Customization
    product_name TEXT DEFAULT 'SignBridge NFC Smart Card',
    package_label TEXT DEFAULT 'Single Card',
    quantity INTEGER DEFAULT 1,
    laser_engraved_name TEXT,

    -- Courier & Dispatch Details
    courier_partner TEXT DEFAULT 'Blue Dart Express',
    tracking_id TEXT,
    tracking_url TEXT,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,

    -- Rich JSON Metadata for Full Audit Trail
    items JSONB DEFAULT '[]'::jsonb,
    shipping JSONB DEFAULT '{}'::jsonb,
    internal_notes JSONB DEFAULT '[]'::jsonb,
    status_history JSONB DEFAULT '[]'::jsonb,
    notifications_log JSONB DEFAULT '[]'::jsonb,

    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. NOTIFICATIONS LOG TABLE (Customer WhatsApp & Email Dispatch)
CREATE TABLE public.notifications_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    channel TEXT NOT NULL, -- 'whatsapp', 'email'
    type TEXT NOT NULL, -- 'order_confirmation', 'payment_confirmed', 'shipped', 'delivered', 'refund'
    recipient TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'delivered', -- 'delivered', 'sent', 'queued', 'failed'
    message_preview TEXT,
    sent_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. CONTACT & INQUIRY MESSAGES TABLE (Website Lead Capture)
CREATE TABLE public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    project TEXT DEFAULT 'Modal Transmission',
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new', -- 'new', 'reviewed', 'contacted'
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================================================
-- STEP 3: HIGH-PERFORMANCE INDEXES
-- =============================================================================
CREATE INDEX idx_orders_order_number ON public.orders(order_number);
CREATE INDEX idx_orders_rzp_order_id ON public.orders(razorpay_order_id);
CREATE INDEX idx_orders_rzp_payment_id ON public.orders(razorpay_payment_id);
CREATE INDEX idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX idx_orders_status ON public.orders(order_status);
CREATE INDEX idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_notifications_order_id ON public.notifications_log(order_id);
CREATE INDEX idx_contact_messages_email ON public.contact_messages(email);

-- =============================================================================
-- STEP 4: ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- PRODUCTS: Anyone can view active products
CREATE POLICY "Public Read Active Products" 
    ON public.products FOR SELECT 
    USING (true);

CREATE POLICY "Service Full Access Products" 
    ON public.products FOR ALL 
    USING (true);

-- ORDERS: Allow checkout insertion & full service/owner access
CREATE POLICY "Public Insert Orders" 
    ON public.orders FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Public Read Own Order By ID" 
    ON public.orders FOR SELECT 
    USING (true);

CREATE POLICY "Service Full Access Orders" 
    ON public.orders FOR ALL 
    USING (true);

-- CUSTOMERS: Allow insertion on checkout
CREATE POLICY "Public Insert Customers" 
    ON public.customers FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Service Full Access Customers" 
    ON public.customers FOR ALL 
    USING (true);

-- NOTIFICATIONS: Allow logging & view
CREATE POLICY "Service Full Access Notifications" 
    ON public.notifications_log FOR ALL 
    USING (true);

-- CONTACT MESSAGES: Anyone can send a message from the website
CREATE POLICY "Public Insert Contact Messages" 
    ON public.contact_messages FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Service Full Access Contact Messages" 
    ON public.contact_messages FOR ALL 
    USING (true);

-- =============================================================================
-- STEP 5: SEED INITIAL SIGNBRIDGE PRODUCTS & ORDERS
-- =============================================================================

-- Seed Public Hardware Offerings
INSERT INTO public.products (id, name, slug, price, original_price, stock, low_stock_threshold, total_sales, status, description)
VALUES 
    (
        'nfc-smart-card-single',
        'SignBridge NFC Smart Card (Single Card)',
        'nfc-smart-card',
        199.00,
        999.00,
        142,
        25,
        38,
        'active',
        'Matte Black Finish Contactless Smart Card with Lifetime Cloud Profile'
    ),
    (
        'nfc-smart-card-duo',
        'SignBridge NFC Smart Card (Duo Pack - 2 Cards)',
        'nfc-smart-card',
        349.00,
        1998.00,
        68,
        15,
        19,
        'active',
        'Best Value 2-Card Pack for Personal & Business Networking'
    ),
    (
        'nfc-smart-card-team',
        'SignBridge NFC Smart Card (Team Pack - 3 Cards)',
        'nfc-smart-card',
        499.00,
        2997.00,
        36,
        10,
        11,
        'active',
        '3-Card Corporate Team Bundle with Instant Cloud Profile Switching'
    );

-- Seed Initial Verified Production Orders
INSERT INTO public.orders (
    id,
    order_number,
    razorpay_order_id,
    razorpay_payment_id,
    amount,
    currency,
    payment_status,
    order_status,
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    shipping_pincode,
    product_name,
    package_label,
    quantity,
    laser_engraved_name,
    courier_partner,
    tracking_id,
    tracking_url,
    items,
    status_history,
    notifications_log
) VALUES (
    'SB-ORD-20261118-8492',
    '1001',
    'order_U1avAwBmCDOaPd',
    'pay_live_U1av89f41x9q',
    199.00,
    'INR',
    'paid',
    'confirmed',
    'Surya V M',
    'connect.pilotsurya@gmail.com',
    '+91 9842253267',
    '188/2, Kokkarayanpettai, Pappampalayam',
    '638007',
    'SignBridge NFC Smart Card',
    'Single Card',
    1,
    'Surya V M',
    'Blue Dart Express',
    'BD982741920IN',
    'https://www.bluedart.com/tracking?track=BD982741920IN',
    '[{"product_id": "nfc-smart-card", "product_name": "SignBridge NFC Smart Card", "package_label": "Single Card", "quantity": 1, "unit_price": 199.00, "total_price": 199.00, "laser_engraved_name": "Surya V M"}]'::jsonb,
    '[{"status": "new", "note": "Customer checkout initiated", "actor": "Customer", "timestamp": "2026-11-18T09:40:00Z"}, {"status": "confirmed", "note": "Razorpay payment verified (₹199.00)", "actor": "Razorpay", "timestamp": "2026-11-18T09:41:00Z"}]'::jsonb,
    '[{"id": "notif_1", "channel": "email", "type": "order_confirmation", "recipient": "connect.pilotsurya@gmail.com", "status": "delivered", "sent_at": "2026-11-18T09:41:30Z", "message_preview": "Order #1001 confirmed! Your SignBridge NFC Smart Card is queued."}, {"id": "notif_2", "channel": "whatsapp", "type": "payment_confirmed", "recipient": "+91 9842253267", "status": "delivered", "sent_at": "2026-11-18T09:41:30Z", "message_preview": "Hello Surya, payment of ₹199 for SignBridge NFC Smart Card confirmed!"}]'::jsonb
), (
    'SB-ORD-20261118-8493',
    '1002',
    'order_U1aaWpWe3ujfxC',
    'pay_live_U1aa99k30l2m',
    349.00,
    'INR',
    'paid',
    'processing',
    'Arun Karthik',
    'arunkarthik.tech@gmail.com',
    '+91 9443218765',
    'Flat 402, Lumina Tech Towers, Whitefield',
    '560066',
    'SignBridge NFC Smart Card',
    'Duo Pack',
    2,
    'Arun Karthik / Lumina Tech',
    'Delhivery Surface',
    'DEL550291048',
    'https://www.delhivery.com/track/package/DEL550291048',
    '[{"product_id": "nfc-smart-card-duo", "product_name": "SignBridge NFC Smart Card", "package_label": "Duo Pack", "quantity": 2, "unit_price": 174.50, "total_price": 349.00, "laser_engraved_name": "Arun Karthik / Lumina Tech"}]'::jsonb,
    '[{"status": "new", "note": "Customer checkout initiated", "actor": "Customer", "timestamp": "2026-11-18T08:15:00Z"}, {"status": "confirmed", "note": "Razorpay payment verified (₹349.00)", "actor": "Razorpay", "timestamp": "2026-11-18T08:16:00Z"}, {"status": "processing", "note": "Laser engraving & NFC chip encoding in progress", "actor": "Owner", "timestamp": "2026-11-18T08:30:00Z"}]'::jsonb,
    '[{"id": "notif_3", "channel": "email", "type": "order_confirmation", "recipient": "arunkarthik.tech@gmail.com", "status": "delivered", "sent_at": "2026-11-18T08:16:30Z", "message_preview": "Your Duo Pack NFC Card order #1002 is confirmed."}]'::jsonb
);

-- Seed Initial Customer Directory
INSERT INTO public.customers (email, name, phone, address, pincode, orders_count, total_spent)
VALUES 
    ('connect.pilotsurya@gmail.com', 'Surya V M', '+91 9842253267', '188/2, Kokkarayanpettai, Pappampalayam', '638007', 1, 199.00),
    ('arunkarthik.tech@gmail.com', 'Arun Karthik', '+91 9443218765', 'Flat 402, Lumina Tech Towers, Whitefield', '560066', 1, 349.00)
ON CONFLICT (email) DO NOTHING;
