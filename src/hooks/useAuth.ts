import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { onAuthChange, signInWithGoogle, signOut, isEmailAllowed } from "@/lib/auth";

interface AuthState {
    user: User | null;
    loading: boolean;
    isAllowed: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
}

/**
 * Hook for managing authentication state
 */
export function useAuth(): AuthState {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthChange((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSignIn = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error("Sign in failed:", error);
            throw error;
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Sign out failed:", error);
            throw error;
        }
    };

    return {
        user,
        loading,
        isAllowed: isEmailAllowed(user?.email),
        signIn: handleSignIn,
        signOut: handleSignOut,
    };
}
