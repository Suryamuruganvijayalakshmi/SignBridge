import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const OwnerAuthContext = createContext(null);

export function OwnerAuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('sb_owner_token') || null);
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('sb_owner_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('sb_owner_token');
        localStorage.removeItem('sb_owner_user');
    }, []);

    // Authenticated fetch wrapper that attaches Bearer token and intercepts 401
    const authFetch = useCallback(async (url, options = {}) => {
        const currentToken = localStorage.getItem('sb_owner_token');
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
            ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
        };

        const res = await fetch(url, { ...options, headers });
        if (res.status === 401) {
            logout();
            throw new Error('Owner session expired. Please log in again.');
        }
        return res;
    }, [logout]);

    // Check token validity on startup
    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        authFetch('/api/owner/me')
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error('Token verification failed');
            })
            .then((data) => {
                if (data.user) {
                    setUser(data.user);
                    localStorage.setItem('sb_owner_user', JSON.stringify(data.user));
                }
            })
            .catch(() => {
                logout();
            })
            .finally(() => {
                setLoading(false);
            });
    }, [token, authFetch, logout]);

    const login = async (ownerId, password) => {
        const res = await fetch('/api/owner/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: ownerId, email: ownerId, password }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
            throw new Error(data.error || 'Authentication failed');
        }

        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('sb_owner_token', data.token);
        localStorage.setItem('sb_owner_user', JSON.stringify(data.user));
        return data;
    };

    return (
        <OwnerAuthContext.Provider
            value={{
                isAuthenticated: !!token && !!user,
                token,
                user,
                loading,
                login,
                logout,
                authFetch,
            }}
        >
            {children}
        </OwnerAuthContext.Provider>
    );
}

export function useOwnerAuth() {
    const context = useContext(OwnerAuthContext);
    if (!context) {
        throw new Error('useOwnerAuth must be used within an OwnerAuthProvider');
    }
    return context;
}

