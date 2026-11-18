-- =============================================================================
-- SignBridge Owner Order Management System — Supabase PostgreSQL Schema
-- Execute in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- =============================================================================

-- 1. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 199.00,
    currency TEXT NOT NULL DEFAULT 'INR',
    payment_status TEXT NOT NULL DEFAULT 'paid', -- 'paid', 'pending', 'failed', 'refunded'
    order_status TEXT NOT NULL DEFAULT 'confirmed', -- 'new', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'
    
    -- Customer Information
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address TEXT,
    shipping_pincode TEXT,

    -- Product Information
    product_name TEXT DEFAULT 'SignBridge NFC Smart Card',
    package_label TEXT DEFAULT 'Single Card',
    quantity INTEGER DEFAULT 1,
    laser_engraved_name TEXT,

    -- Shipping & Fulfillment Details
    courier_partner TEXT,
    tracking_id TEXT,
    tracking_url TEXT,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,

    -- JSON Metadata
    items JSONB DEFAULT '[]'::jsonb,
    shipping JSONB DEFAULT '{}'::jsonb,
    internal_notes JSONB DEFAULT '[]'::jsonb,
    status_history JSONB DEFAULT '[]'::jsonb,
    notifications_log JSONB DEFAULT '[]'::jsonb,

    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Indexes for high-speed search and filtering
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_rzp_order ON public.orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_rzp_payment ON public.orders(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 3. Products & Stock Inventory Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 199.00,
    original_price NUMERIC(10, 2),
    stock INTEGER NOT NULL DEFAULT 100,
    low_stock_threshold INTEGER NOT NULL DEFAULT 20,
    total_sales INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert Default SignBridge NFC Card Offerings
INSERT INTO public.products (id, name, slug, price, original_price, stock, low_stock_threshold, total_sales, status)
VALUES 
    ('nfc-smart-card-single', 'SignBridge NFC Smart Card (Single Card)', 'nfc-smart-card', 199.00, 999.00, 142, 25, 38, 'active'),
    ('nfc-smart-card-duo', 'SignBridge NFC Smart Card (Duo Pack)', 'nfc-smart-card', 349.00, 1998.00, 68, 15, 19, 'active'),
    ('nfc-smart-card-team', 'SignBridge NFC Smart Card (Team Pack)', 'nfc-smart-card', 499.00, 2997.00, 36, 10, 11, 'active')
ON CONFLICT (id) DO NOTHING;

-- 4. Row Level Security (RLS) Policies
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read of active products
CREATE POLICY "Allow public read active products"
    ON public.products FOR SELECT
    USING (status = 'active');

-- Service role / owner has full access to orders
CREATE POLICY "Owner full access orders"
    ON public.orders FOR ALL
    USING (true);
