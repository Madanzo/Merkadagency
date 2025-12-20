import {
    signInWithPopup,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    onAuthStateChanged,
    User,
} from "firebase/auth";
import { auth } from "./firebase";

// Whitelisted admin emails
const ALLOWED_EMAILS = [
    "camilo.reyna97@gmail.com",
    "camilo.reyna@merkadagency.com",
];

const googleProvider = new GoogleAuthProvider();

function getAuth() {
    if (!auth) throw new Error("Firebase Auth not initialized");
    return auth;
}

/**
 * Sign in with Google
 */
export async function signIn(): Promise<User | null> {
    try {
        const result = await signInWithPopup(getAuth(), googleProvider);
        return result.user;
    } catch (error) {
        console.error("Sign in error:", error);
        return null;
    }
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
    try {
        await firebaseSignOut(getAuth());
    } catch (error) {
        console.error("Sign out error:", error);
    }
}

/**
 * Get current user
 */
export function getCurrentUser(): User | null {
    if (!auth) return null;
    return auth.currentUser;
}

/**
 * Check if user email is in whitelist
 */
export function isAllowedUser(user: User | null): boolean {
    if (!user?.email) return false;
    return ALLOWED_EMAILS.includes(user.email.toLowerCase());
}

/**
 * Subscribe to auth state changes
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
    if (!auth) {
        // Return no-op unsubscribe if auth not initialized
        callback(null);
        return () => { };
    }
    return onAuthStateChanged(auth, callback);
}
