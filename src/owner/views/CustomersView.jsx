import React, { useState, useEffect, useMemo } from 'react';
import { Users, Search, Mail, Phone, MapPin, IndianRupee, RefreshCw } from 'lucide-react';
import { useOwnerAuth } from '../OwnerAuthContext.jsx';

export default function CustomersView({ onSelectOrder }) {
    const { authFetch } = useOwnerAuth();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const loadCustomers = () => {
        setLoading(true);
        authFetch('/api/owner/customers')
            .then((res) => res.json())
            .then((data) => {
                if (data.customers) setCustomers(data.customers);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    const filteredCustomers = useMemo(() => {
        if (!searchTerm.trim()) return customers;
        const q = searchTerm.toLowerCase();
        return customers.filter(
            (c) =>
                (c.name && c.name.toLowerCase().includes(q)) ||
                (c.email && c.email.toLowerCase().includes(q)) ||
                (c.phone && c.phone.toLowerCase().includes(q)) ||
                (c.address && c.address.toLowerCase().includes(q))
        );
    }, [customers, searchTerm]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="owner-table-card">
                
                {/* Search & Actions */}
                <div className="owner-table-toolbar">
                    <div className="owner-search-wrap">
                        <Search size={15} className="owner-search-icon" />
                        <input
                            type="text"
                            className="owner-search-input"
                            placeholder="Search customers by name, email, phone, city..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={loadCustomers}
                        className="owner-btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
                    >
                        <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                        <span>Refresh Customers</span>
                    </button>
                </div>

                {/* Table */}
                <div className="owner-table-wrap">
                    <table className="owner-table">
                        <thead>
                            <tr>
                                <th>Customer Name</th>
                                <th>Contact Information</th>
                                <th>Default Shipping Address</th>
                                <th>Total Orders</th>
                                <th>Lifetime Value</th>
                                <th>Last Order Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                                        No customer records found.
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((cust, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e0e7ff', color: '#3730a3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px' }}>
                                                    {cust.name?.charAt(0) || 'C'}
                                                </div>
                                                <div>
                                                    <span style={{ fontWeight: 700 }}>{cust.name}</span>
                                                    <span style={{ display: 'block', fontSize: '11px', color: '#059669', fontWeight: 600 }}>
                                                        Verified Purchaser
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Mail size={11} color="#64748b" />
                                                    {cust.email}
                                                </span>
                                                <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b' }}>
                                                    <Phone size={11} color="#64748b" />
                                                    {cust.phone}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '12px', color: '#334155', maxWidth: '280px' }}>
                                                {cust.address ? `${cust.address}, PIN: ${cust.pincode}` : 'Standard Shipping'}
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 700 }}>
                                            <span className="owner-badge processing">
                                                {cust.orders_count} {cust.orders_count === 1 ? 'Order' : 'Orders'}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 800, color: '#059669', fontSize: '14px' }}>
                                            ₹{cust.total_spent.toFixed(2)}
                                        </td>
                                        <td style={{ fontSize: '11.5px', color: '#64748b' }}>
                                            {cust.last_order_date
                                                ? new Date(cust.last_order_date).toLocaleDateString('en-IN', {
                                                      day: 'numeric',
                                                      month: 'short',
                                                      year: 'numeric',
                                                  })
                                                : '—'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div style={{ padding: '12px 20px', borderTop: '1px solid var(--owner-border)', fontSize: '12px', color: '#64748b', background: '#fafbfc' }}>
                    Total Customers: <strong>{filteredCustomers.length}</strong>
                </div>
            </div>
        </div>
    );
}

