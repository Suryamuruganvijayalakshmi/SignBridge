import React from 'react';
import {
    ShoppingBag,
    Calendar,
    Clock,
    RotateCw,
    Truck,
    CheckCircle2,
    XCircle,
    IndianRupee,
    CreditCard,
    AlertTriangle,
    ArrowUpRight,
    Package
} from 'lucide-react';

export default function OverviewView({ metrics, orders, onSelectOrder, onNavigateTab }) {
    if (!metrics) return null;

    const statCards = [
        {
            label: 'Total Orders',
            value: metrics.totalOrders,
            sub: 'All time customer orders',
            icon: ShoppingBag,
            color: '#2563eb',
            bg: '#eff6ff',
        },
        {
            label: "Today's Orders",
            value: metrics.todayOrders,
            sub: 'Placed in last 24h',
            icon: Calendar,
            color: '#059669',
            bg: '#ecfdf5',
        },
        {
            label: 'Total Revenue',
            value: `₹${Number(metrics.totalRevenue || 0).toLocaleString('en-IN')}`,
            sub: 'Net collected payments',
            icon: IndianRupee,
            color: '#059669',
            bg: '#ecfdf5',
        },
        {
            label: 'Successful Payments',
            value: metrics.successfulPayments,
            sub: 'Razorpay captured',
            icon: CreditCard,
            color: '#2563eb',
            bg: '#eff6ff',
        },
        {
            label: 'Pending Orders',
            value: metrics.pendingOrders,
            sub: 'Awaiting fulfillment',
            icon: Clock,
            color: '#d97706',
            bg: '#fffbeb',
        },
        {
            label: 'Processing Orders',
            value: metrics.processingOrders,
            sub: 'Laser engraving & encoding',
            icon: RotateCw,
            color: '#3b82f6',
            bg: '#eff6ff',
        },
        {
            label: 'Shipped Orders',
            value: metrics.shippedOrders,
            sub: 'In transit with courier',
            icon: Truck,
            color: '#7c3aed',
            bg: '#f5f3ff',
        },
        {
            label: 'Delivered Orders',
            value: metrics.deliveredOrders,
            sub: 'Customer received',
            icon: CheckCircle2,
            color: '#059669',
            bg: '#ecfdf5',
        },
        {
            label: 'Cancelled Orders',
            value: metrics.cancelledOrders,
            sub: 'Refunded / Voided',
            icon: XCircle,
            color: '#dc2626',
            bg: '#fef2f2',
        },
        {
            label: 'Failed / Pending Payments',
            value: metrics.failedOrPendingPayments,
            sub: 'Abandoned / Incomplete',
            icon: AlertTriangle,
            color: '#dc2626',
            bg: '#fef2f2',
        },
    ];

    const maxRev = Math.max(...(metrics.dailySales || []).map((d) => d.revenue || 0), 100);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* 1. 10 Key Metrics Grid */}
            <div className="owner-stats-grid">
                {statCards.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="owner-stat-card">
                            <div className="owner-stat-top">
                                <span className="owner-stat-label">{stat.label}</span>
                                <div
                                    className="owner-stat-icon-wrap"
                                    style={{ background: stat.bg, color: stat.color }}
                                >
                                    <Icon size={16} />
                                </div>
                            </div>
                            <div className="owner-stat-value">{stat.value}</div>
                            <span className="owner-stat-sub">{stat.sub}</span>
                        </div>
                    );
                })}
            </div>

            {/* 2. Charts & Sales Trend Card */}
            <div className="owner-chart-card">
                <div className="owner-chart-header">
                    <div>
                        <div className="owner-chart-title">7-Day Daily Sales &amp; Revenue Trends</div>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                            Daily order volume and net verified revenue from Razorpay
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => onNavigateTab('reports')}
                        className="owner-btn-secondary"
                        style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                        <span>Full Report</span>
                        <ArrowUpRight size={13} />
                    </button>
                </div>

                <div className="owner-chart-bars-wrap">
                    {(metrics.dailySales || []).map((day, idx) => {
                        const heightPct = Math.max(12, Math.round(((day.revenue || 0) / maxRev) * 100));
                        return (
                            <div key={idx} className="owner-chart-bar-col">
                                <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 600 }}>
                                    ₹{day.revenue}
                                </span>
                                <div
                                    className="owner-chart-bar-fill"
                                    style={{ height: `${heightPct}%` }}
                                    title={`${day.date}: ₹${day.revenue} (${day.orders} orders)`}
                                />
                                <span className="owner-chart-bar-label">{day.day}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 3. Recent Orders Quick Table */}
            <div className="owner-table-card">
                <div className="owner-table-toolbar">
                    <div>
                        <div style={{ fontSize: '15px', fontWeight: 700 }}>Recent Customer Orders</div>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                            Latest incoming purchases from signbridge.click
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => onNavigateTab('orders')}
                        className="owner-btn-secondary"
                        style={{ fontSize: '12px' }}
                    >
                        View All Orders ({orders.length})
                    </button>
                </div>

                <div className="owner-table-wrap">
                    <table className="owner-table">
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Customer</th>
                                <th>Product</th>
                                <th>Amount</th>
                                <th>Payment</th>
                                <th>Order Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.slice(0, 5).map((order) => (
                                <tr key={order.id}>
                                    <td>
                                        <strong style={{ fontFamily: 'var(--owner-font-mono)' }}>
                                            #{order.order_number || order.id.slice(-4)}
                                        </strong>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: 600 }}>{order.customer?.name}</span>
                                            <span style={{ fontSize: '11px', color: '#64748b' }}>{order.customer?.email}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span>{order.items?.[0]?.product_name || 'NFC Smart Card'}</span>
                                            <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600 }}>
                                                {order.items?.[0]?.package_label || 'Single Card'} (Qty: {order.items?.[0]?.quantity || 1})
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: 700 }}>₹{Number(order.amount).toFixed(2)}</td>
                                    <td>
                                        <span className={`owner-badge ${order.payment_status}`}>
                                            {order.payment_status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`owner-badge ${order.order_status}`}>
                                            {order.order_status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            onClick={() => onSelectOrder(order)}
                                            className="owner-btn-secondary"
                                            style={{ padding: '4px 10px', fontSize: '11.5px' }}
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
