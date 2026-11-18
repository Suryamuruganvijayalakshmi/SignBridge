import React from 'react';
import { RefreshCw, ExternalLink, ShieldCheck } from 'lucide-react';

export default function OwnerHeader({ activeTab, onRefresh, refreshing }) {
    const titles = {
        overview: 'Dashboard Overview',
        orders: 'Order Management & Dispatch',
        products: 'Product Catalog & Inventory',
        customers: 'Customer Accounts & History',
        payments: 'Razorpay Transactions & Webhooks',
        notifications: 'Customer Notification Logs (WhatsApp & Email)',
        reports: 'Sales & Analytics Reports',
        settings: 'Owner Security & System Settings',
    };

    return (
        <header className="owner-topbar">
            <h1 className="owner-topbar-title">{titles[activeTab] || 'Dashboard'}</h1>

            <div className="owner-topbar-actions">
                <div className="owner-live-indicator">
                    <span className="owner-live-dot" />
                    <span>orders.signbridge.click · LIVE</span>
                </div>

                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={refreshing}
                    className="owner-btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}
                    title="Refresh Live Data"
                >
                    <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
                    <span>Refresh</span>
                </button>
            </div>
        </header>
    );
}

