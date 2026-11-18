import React from 'react';
import {
    LayoutDashboard,
    ShoppingBag,
    Layers,
    Users,
    CreditCard,
    Bell,
    FileText,
    Settings,
    LogOut,
    Shield
} from 'lucide-react';
import { useOwnerAuth } from './OwnerAuthContext.jsx';

const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'products', label: 'Products', icon: Layers },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
];

export default function OwnerSidebar({ activeTab, onSelectTab }) {
    const { user, logout } = useOwnerAuth();

    return (
        <aside className="owner-sidebar">
            {/* Brand Header */}
            <div className="owner-sidebar-brand">
                <img
                    src="/signbridge-emblem.webp"
                    alt="SignBridge Emblem"
                    className="owner-sidebar-logo"
                />
                <div>
                    <div className="owner-sidebar-brand-name">SignBridge</div>
                    <span className="owner-sidebar-brand-sub">Owner Portal</span>
                </div>
            </div>

            {/* Navigation List */}
            <nav className="owner-nav-list" aria-label="Owner navigation">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => onSelectTab(item.id)}
                            className={`owner-nav-item ${isActive ? 'is-active' : ''}`}
                        >
                            <Icon size={17} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* User Profile & Logout */}
            <div className="owner-sidebar-footer">
                <div className="owner-user-info">
                    <div className="owner-avatar">
                        <Shield size={16} />
                    </div>
                    <div className="owner-user-text">
                        <span className="owner-user-name" title={user?.email}>
                            {user?.name || 'Owner'}
                        </span>
                        <span className="owner-user-role">Authorized Admin</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={logout}
                    className="owner-nav-item"
                    style={{ width: 'auto', padding: '6px 8px', color: '#dc2626' }}
                    title="Logout from portal"
                    aria-label="Logout"
                >
                    <LogOut size={16} />
                </button>
            </div>
        </aside>
    );
}
