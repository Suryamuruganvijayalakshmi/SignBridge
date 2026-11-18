import React, { useState, useEffect, useCallback } from 'react';
import './owner.css';
import { OwnerAuthProvider, useOwnerAuth } from './OwnerAuthContext.jsx';
import OwnerLogin from './OwnerLogin.jsx';
import OwnerForgotPassword from './OwnerForgotPassword.jsx';
import OwnerSidebar from './OwnerSidebar.jsx';
import OwnerHeader from './OwnerHeader.jsx';
import OverviewView from './views/OverviewView.jsx';
import OrdersView from './views/OrdersView.jsx';
import OrderDetailsModal from './views/OrderDetailsModal.jsx';
import ProductsView from './views/ProductsView.jsx';
import CustomersView from './views/CustomersView.jsx';
import PaymentsView from './views/PaymentsView.jsx';
import NotificationsView from './views/NotificationsView.jsx';
import ReportsView from './views/ReportsView.jsx';
import SettingsView from './views/SettingsView.jsx';

function OwnerPortalContent() {
    const { isAuthenticated, loading, authFetch } = useOwnerAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [forgotOpen, setForgotOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Live data states
    const [metrics, setMetrics] = useState(null);
    const [orders, setOrders] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        if (!isAuthenticated) return;
        setRefreshing(true);
        try {
            const [metricsRes, ordersRes] = await Promise.all([
                authFetch('/api/owner/metrics'),
                authFetch('/api/owner/orders'),
            ]);

            const metricsData = await metricsRes.json();
            const ordersData = await ordersRes.json();

            if (metricsData.metrics) setMetrics(metricsData.metrics);
            if (ordersData.orders) setOrders(ordersData.orders);
        } catch (err) {
            console.error('Failed to load owner portal data:', err);
        } finally {
            setRefreshing(false);
        }
    }, [isAuthenticated, authFetch]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated, fetchData]);

    // Handle order update from modal
    const handleOrderUpdated = (updatedOrder) => {
        setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
        setSelectedOrder(updatedOrder);
        // Refresh metrics in background
        authFetch('/api/owner/metrics')
            .then((r) => r.json())
            .then((d) => d.metrics && setMetrics(d.metrics))
            .catch(() => {});
    };

    if (loading) {
        return (
            <div className="owner-login-viewport" style={{ color: '#64748b' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>Loading SignBridge Owner Session...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <>
                <OwnerLogin onForgotPassword={() => setForgotOpen(true)} />
                <OwnerForgotPassword isOpen={forgotOpen} onClose={() => setForgotOpen(false)} />
            </>
        );
    }

    return (
        <div className="owner-portal-root">
            {/* 1. Left Sidebar Navigation */}
            <OwnerSidebar activeTab={activeTab} onSelectTab={setActiveTab} />

            {/* 2. Main Workspace */}
            <div className="owner-main-container">
                <OwnerHeader activeTab={activeTab} onRefresh={fetchData} refreshing={refreshing} />

                <main className="owner-content-body">
                    {activeTab === 'overview' && (
                        <OverviewView
                            metrics={metrics}
                            orders={orders}
                            onSelectOrder={(ord) => setSelectedOrder(ord)}
                            onNavigateTab={(tab) => setActiveTab(tab)}
                        />
                    )}

                    {activeTab === 'orders' && (
                        <OrdersView
                            orders={orders}
                            onSelectOrder={(ord) => setSelectedOrder(ord)}
                        />
                    )}

                    {activeTab === 'products' && <ProductsView />}

                    {activeTab === 'customers' && (
                        <CustomersView onSelectOrder={(ord) => setSelectedOrder(ord)} />
                    )}

                    {activeTab === 'payments' && <PaymentsView orders={orders} />}

                    {activeTab === 'notifications' && <NotificationsView />}

                    {activeTab === 'reports' && (
                        <ReportsView metrics={metrics} orders={orders} />
                    )}

                    {activeTab === 'settings' && <SettingsView />}
                </main>
            </div>

            {/* 3. Deep Dive Order Details & Edit Modal */}
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    isOpen={!!selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onOrderUpdated={handleOrderUpdated}
                />
            )}
        </div>
    );
}

export default function OwnerApp() {
    return (
        <OwnerAuthProvider>
            <OwnerPortalContent />
        </OwnerAuthProvider>
    );
}
