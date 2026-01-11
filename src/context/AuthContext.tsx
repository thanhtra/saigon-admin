'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { get, post } from '@/utils/request';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/common/enum';
import { LOGOUT_FLAG } from '@/common/const';

export type AuthContextType = {
    user: any;
    loading: boolean;
    login: (phone: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const didInitRef = useRef(false);

    /**
     * ---------------- FETCH CURRENT USER ----------------
     */
    const fetchMe = async (): Promise<boolean> => {
        try {
            const res = await get('/auth/me');

            if (res.success && res.result?.role === UserRole.Admin) {
                setUser(res.result);
                return true;
            }

            setUser(null);
            return false;
        } catch {
            setUser(null);
            return false;
        }
    };

    /**
     * ---------------- INIT AUTH ----------------
     */
    useEffect(() => {
        if (didInitRef.current) return;
        didInitRef.current = true;

        /**
         * 🔒 Đã bị force logout từ interceptor
         */
        if (typeof window !== 'undefined' && localStorage.getItem(LOGOUT_FLAG)) {
            setUser(null);
            setLoading(false);
            router.replace('/login');
            return;
        }

        fetchMe().then(isValid => {
            if (!isValid) {
                router.replace('/login');
            }
            setLoading(false);
        });
    }, []);

    /**
     * ---------------- LOGIN ----------------
     */
    const login = async (phone: string, password: string): Promise<boolean> => {
        try {
            const res = await post('/auth/login', { phone, password });
            if (!res.success) return false;

            localStorage.removeItem(LOGOUT_FLAG);

            const isValid = await fetchMe();
            if (!isValid) return false;

            return true;
        } catch {
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * ---------------- LOGOUT ----------------
     */
    const logout = async () => {
        try {
            await post('/auth/logout', {});
        } finally {
            localStorage.setItem(LOGOUT_FLAG, '1');
            setUser(null);
            router.replace('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * ✅ Hook duy nhất dùng bên ngoài
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return context;
};
