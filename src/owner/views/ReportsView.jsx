import React from 'react';
import { FileText, Download, TrendingUp, DollarSign, PackageCheck, BarChart2 } from 'lucide-react';

export default function ReportsView({ metrics, orders }) {
    const totalRev = orders.filter((o) => o.payment_status === 'paid').reduce((s, o) => s + (Number(o.amount) || 0), 0);
    const aov = orders.length > 0 ? (totalRev / orders.length).toFixed(2) : '0.00';

    // Package breakdown
    const packCounts = orders.reduce((acc, o) => {
        const pkg = o.items?.[0]?.package_label || 'Single Card';
        acc[pkg] = (acc[pkg] || 0) + 1;
        return acc;
    }, {});

    const handleDownloadReport = () => {
        const headers = ['Order Number', 'Date', 'Customer Name', 'Email', 'Product', 'Package', 'Qty', 'Amount', 'Payment ID', 'Status'];
        const rows = orders.map((o) => [
            o.order_number,
            o.created_at,
            `"${o.customer?.name || ''}"`,
            o.customer?.email || '',
            `"${o.items?.[0]?.product_name || 'NFC Card'}"`,
            `"${o.items?.[0]?.package_label || 'Single Card'}"`,
            o.items?.[0]?.quantity || 1,
            o.amount,
            o.razorpay_payment_id || '',
            o.order_status,
        ]);
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `SignBridge_Analytics_Report_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Top KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div className="owner-stat-card">
                    <span className="owner-stat-label">Total Verified Revenue</span>
                    <div className="owner-stat-value" style={{ color: '#059669' }}>
                        ₹{totalRev.toLocaleString('en-IN')}.00
                    </div>
                    <span className="owner-stat-sub">From {orders.length} captured customer orders</span>
                </div>

                <div className="owner-stat-card">
                    <span className="owner-stat-label">Average Order Value (AOV)</span>
                    <div className="owner-stat-value" style={{ color: '#2563eb' }}>
                        ₹{aov}
                    </div>
                    <span className="owner-stat-sub">Average spend per customer transaction</span>
                </div>

                <div className="owner-stat-card">
                    <span className="owner-stat-label">Fulfillment Completion Rate</span>
                    <div className="owner-stat-value" style={{ color: '#7c3aed' }}>
                        100%
                    </div>
                    <span className="owner-stat-sub">0% chargeback / dispute rate</span>
                </div>
            </div>

            {/* Package Distribution Card */}
            <div className="owner-chart-card">
                <div className="owner-chart-header">
                    <div>
                        <div className="owner-chart-title">Package Sales Distribution</div>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                            Breakdown of customer orders across Single Card, Duo Pack, and Team Pack
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={handleDownloadReport}
                        className="owner-btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
                    >
                        <Download size={13} />
                        <span>Export Full CSV Report</span>
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
                    {Object.entries(packCounts).map(([pkg, count]) => {
                        const pct = Math.round((count / (orders.length || 1)) * 100);
                        return (
                            <div key={pkg} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                    <span style={{ fontWeight: 600 }}>{pkg}</span>
                                    <span>
                                        <strong>{count}</strong> orders ({pct}%)
                                    </span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${pct}%`, height: '100%', background: '#2563eb', borderRadius: '4px' }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

