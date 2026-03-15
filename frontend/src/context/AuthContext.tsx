"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
    user_id: string;
    email: string;
    role: string;
    full_name?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    checkSession: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    checkSession: () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkSession = React.useCallback(() => {
        try {
            let token = localStorage.getItem('auth_token');

            // Fallback to cookie
            if (!token) {
                const cookies = document.cookie.split(';').reduce((acc, cookie) => {
                    const [key, value] = cookie.trim().split('=');
                    acc[key] = value;
                    return acc;
                }, {} as { [key: string]: string });
                token = cookies['token'];
            }

            if (token) {
                const decoded: any = jwtDecode(token);
                // Check expiry
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser({
                        user_id: decoded.user_id || decoded.id || decoded.sub,
                        email: decoded.email,
                        role: decoded.role,
                        full_name: decoded.full_name || decoded.name
                    });

                    // Ensure it's in local storage if we found it in cookie (sync)
                    if (!localStorage.getItem('auth_token')) {
                        localStorage.setItem('auth_token', token);
                    }
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Session check failed", error);
            setUser(null);
            localStorage.removeItem('auth_token'); // Clear invalid token
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = React.useCallback(() => {
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        localStorage.removeItem('auth_token');
        setUser(null);
        window.location.href = '/login';
    }, []);

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    const value = React.useMemo(() => ({
        user,
        isLoading,
        checkSession,
        logout
    }), [user, isLoading, checkSession, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
