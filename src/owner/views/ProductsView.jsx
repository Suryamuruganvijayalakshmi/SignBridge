import React, { useState, useEffect } from 'react';
import { Layers, AlertTriangle, CheckCircle2, Edit2, Package, RefreshCw } from 'lucide-react';
import { useOwnerAuth } from '../OwnerAuthContext.jsx';

export default function ProductsView() {
    const { authFetch } = useOwnerAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [newStock, setNewStock] = useState('');
    const [saving, setSaving] = useState(false);

    const loadProducts = () => {
        setLoading(true);
        authFetch('/api/owner/products')
            .then((res) => res.json())
            .then((data) => {
                if (data.products) setProducts(data.products);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleSaveStock = async (e) => {
        e.preventDefault();
        if (!editingProduct) return;
        setSaving(true);
        try {
            const res = await authFetch(`/api/owner/products/${editingProduct.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ stock: Number(newStock) }),
            });
            const data = await res.json();
            if (data.product) {
                setProducts(products.map((p) => (p.id === data.product.id ? data.product : p)));
                setEditingProduct(null);
            }
        } catch (err) {
            alert(err.message || 'Failed to update stock');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Products Table Card */}
            <div className="owner-table-card">
                <div className="owner-table-toolbar">
                    <div>
                        <div style={{ fontSize: '15px', fontWeight: 700 }}>Hardware Catalog &amp; Stock Availability</div>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                            Inventory levels, package pricing, and cumulative customer sales
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={loadProducts}
                        className="owner-btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
                    >
                        <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                        <span>Refresh Stock</span>
                    </button>
                </div>

                <div className="owner-table-wrap">
                    <table className="owner-table">
                        <thead>
                            <tr>
                                <th>Product Item</th>
                                <th>Public Price</th>
                                <th>Available Stock</th>
                                <th>Inventory Status</th>
                                <th>Total Units Sold</th>
                                <th>Catalog Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((prod) => {
                                const isLowStock = prod.stock <= (prod.low_stock_threshold || 20);
                                return (
                                    <tr key={prod.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Package size={18} />
                                                </div>
                                                <div>
                                                    <span style={{ fontWeight: 700 }}>{prod.name}</span>
                                                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>
                                                        SKU: {prod.id}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 700, fontSize: '14px' }}>
                                            ₹{prod.price.toFixed(2)}
                                            {prod.original_price && (
                                                <span style={{ fontSize: '11px', color: '#94a3b8', textDecoration: 'line-through', marginLeft: '6px' }}>
                                                    ₹{prod.original_price}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <strong style={{ fontSize: '15px' }}>{prod.stock}</strong> units
                                        </td>
                                        <td>
                                            {isLowStock ? (
                                                <span className="owner-badge pending" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                    <AlertTriangle size={11} />
                                                    <span>Low Stock Alert (&le;{prod.low_stock_threshold})</span>
                                                </span>
                                            ) : (
                                                <span className="owner-badge paid" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                    <CheckCircle2 size={11} />
                                                    <span>In Stock</span>
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ fontWeight: 600 }}>{prod.total_sales || 0} cards</td>
                                        <td>
                                            <span className="owner-badge processing">
                                                {prod.status || 'Active'}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingProduct(prod);
                                                    setNewStock(String(prod.stock));
                                                }}
                                                className="owner-btn-secondary"
                                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', padding: '4px 10px' }}
                                            >
                                                <Edit2 size={12} />
                                                <span>Update Stock</span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Stock Modal */}
            {editingProduct && (
                <div className="owner-modal-backdrop" onClick={(e) => e.target === e.currentTarget && setEditingProduct(null)}>
                    <div className="owner-modal-card" style={{ maxWidth: '440px' }}>
                        <div className="owner-modal-header">
                            <span className="owner-modal-title">Update Stock: {editingProduct.name}</span>
                            <button
                                type="button"
                                onClick={() => setEditingProduct(null)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleSaveStock}>
                            <div className="owner-modal-body">
                                <div className="owner-field-group">
                                    <label className="owner-label">Current Stock</label>
                                    <input
                                        type="number"
                                        className="owner-input"
                                        value={newStock}
                                        onChange={(e) => setNewStock(e.target.value)}
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="owner-modal-footer">
                                <button
                                    type="button"
                                    onClick={() => setEditingProduct(null)}
                                    className="owner-btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="owner-btn-primary"
                                    style={{ width: 'auto' }}
                                >
                                    {saving ? 'Updating...' : 'Save Stock'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
