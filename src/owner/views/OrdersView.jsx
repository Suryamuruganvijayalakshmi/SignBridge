import React, { useState, useMemo } from 'react';
import {
    Search,
    Download,
    Eye,
    ChevronDown,
    Calendar,
    Filter,
    Package,
    Truck,
    CheckCircle2
} from 'lucide-react';

const STATUS_FILTERS = [
    { id: 'all', label: 'All Orders' },
    { id: 'new', label: 'New' },
    { id: 'confirmed', label: 'Payment Success' },
    { id: 'processing', label: 'Processing' },
    { id: 'packed', label: 'Packed' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
];

export default function OrdersView({ orders, onSelectOrder }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('');

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            // Status match
            if (statusFilter !== 'all') {
                if (statusFilter === 'confirmed') {
                    if (order.payment_status !== 'paid') return false;
                } else if (order.order_status !== statusFilter) {
                    return false;
                }
            }

            // Date match
            if (dateFilter && (!order.created_at || !order.created_at.startsWith(dateFilter))) {
                return false;
            }

            // Search term match
            if (searchTerm.trim()) {
                const q = searchTerm.toLowerCase();
                const matchNumber = order.order_number && order.order_number.toLowerCase().includes(q);
                const matchId = order.id && order.id.toLowerCase().includes(q);
                const matchRzpOrder = order.razorpay_order_id && order.razorpay_order_id.toLowerCase().includes(q);
                const matchRzpPay = order.razorpay_payment_id && order.razorpay_payment_id.toLowerCase().includes(q);
                const matchName = order.customer?.name && order.customer.name.toLowerCase().includes(q);
                const matchEmail = order.customer?.email && order.customer.email.toLowerCase().includes(q);
                const matchPhone = order.customer?.phone && order.customer.phone.toLowerCase().includes(q);
                const matchTracking = order.shipping?.tracking_id && order.shipping.tracking_id.toLowerCase().includes(q);

                if (!matchNumber && !matchId && !matchRzpOrder && !matchRzpPay && !matchName && !matchEmail && !matchPhone && !matchTracking) {
                    return false;
                }
            }

            return true;
        });
    }, [orders, statusFilter, dateFilter, searchTerm]);

    const handleExportCSV = () => {
        const headers = ['Order Number', 'Order ID', 'Customer Name', 'Email', 'Phone', 'Address', 'Pincode', 'Product', 'Package', 'Qty', 'Amount (INR)', 'Payment Status', 'Order Status', 'Courier', 'Tracking ID', 'Order Date'];
        const rows = filteredOrders.map((o) => [
            o.order_number || '',
            o.id || '',
            `"${o.customer?.name || ''}"`,
            o.customer?.email || '',
            `"${o.customer?.phone || ''}"`,
            `"${(o.customer?.address || '').replace(/"/g, '""')}"`,
            o.customer?.pincode || '',
            `"${o.items?.[0]?.product_name || 'NFC Smart Card'}"`,
            `"${o.items?.[0]?.package_label || 'Single Card'}"`,
            o.items?.[0]?.quantity || 1,
            o.amount || 199,
            o.payment_status || 'paid',
            o.order_status || 'new',
            `"${o.shipping?.courier || ''}"`,
            o.shipping?.tracking_id || '',
            o.created_at || '',
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `SignBridge_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="owner-table-card">
                
                {/* Table Toolbar & Search */}
                <div className="owner-table-toolbar">
                    <div className="owner-search-wrap">
                        <Search size={15} className="owner-search-icon" />
                        <input
                            type="text"
                            className="owner-search-input"
                            placeholder="Search by Order #, Customer, Email, Phone, AWB..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={14} color="#64748b" />
                            <input
                                type="date"
                                className="owner-input"
                                style={{ padding: '6px 10px', fontSize: '12px' }}
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                            {dateFilter && (
                                <button
                                    type="button"
                                    onClick={() => setDateFilter('')}
                                    style={{ background: 'none', border: 'none', fontSize: '11px', color: '#64748b', cursor: 'pointer' }}
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleExportCSV}
                            className="owner-btn-secondary"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '7px 13px' }}
                        >
                            <Download size={13} />
                            <span>Export CSV</span>
                        </button>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div style={{ padding: '10px 20px', borderBottom: '1px solid var(--owner-border)', background: '#fafbfc' }}>
                    <div className="owner-filter-tabs">
                        {STATUS_FILTERS.map((f) => (
                            <button
                                key={f.id}
                                type="button"
                                onClick={() => setStatusFilter(f.id)}
                                className={`owner-tab-btn ${statusFilter === f.id ? 'is-active' : ''}`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table Content */}
                <div className="owner-table-wrap">
                    <table className="owner-table">
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Customer Details</th>
                                <th>Product &amp; Qty</th>
                                <th>Amount</th>
                                <th>Payment ID</th>
                                <th>Order Status</th>
                                <th>Shipping Courier</th>
                                <th>Date &amp; Time</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                                        No customer orders match the selected filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
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
                                                <span style={{ fontSize: '11px', color: '#64748b' }}>{order.customer?.phone}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 600 }}>{order.items?.[0]?.product_name}</span>
                                                <span style={{ fontSize: '11px', color: '#2563eb' }}>
                                                    {order.items?.[0]?.package_label || 'Single Card'} (Qty: {order.items?.[0]?.quantity || 1})
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 700 }}>₹{Number(order.amount).toFixed(2)}</td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span className={`owner-badge ${order.payment_status}`} style={{ width: 'fit-content' }}>
                                                    {order.payment_status}
                                                </span>
                                                <code style={{ fontSize: '10px', color: '#64748b', marginTop: '2px', fontFamily: 'var(--owner-font-mono)' }}>
                                                    {order.razorpay_payment_id || 'N/A'}
                                                </code>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`owner-badge ${order.order_status}`}>
                                                {order.order_status}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '12px' }}>{order.shipping?.courier || 'Unassigned'}</span>
                                                {order.shipping?.tracking_id && (
                                                    <span style={{ fontSize: '10.5px', color: '#2563eb', fontFamily: 'var(--owner-font-mono)' }}>
                                                        {order.shipping.tracking_id}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '11.5px', color: '#64748b', whiteSpace: 'nowrap' }}>
                                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button
                                                type="button"
                                                onClick={() => onSelectOrder(order)}
                                                className="owner-btn-secondary"
                                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', padding: '4px 10px' }}
                                            >
                                                <Eye size={12} />
                                                <span>Manage</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div style={{ padding: '12px 20px', borderTop: '1px solid var(--owner-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748b', background: '#fafbfc' }}>
                    <span>Showing <strong>{filteredOrders.length}</strong> of <strong>{orders.length}</strong> total orders</span>
                </div>
            </div>
        </div>
    );
}
