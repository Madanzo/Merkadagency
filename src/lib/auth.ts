import {
    signInWithPopup,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    onAuthStateChanged,
    User,
} from "firebase/auth";
import { auth } from "./firebase";

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Whitelisted emails for admin access
// Add your admin emails here
const ALLOWED_EMAILS: string[] = [
    "camilo.reyna97@gmail.com",
    "camilo.reyna@merkadagency.com",
];

/**
 * Check if an email is allowed to access admin features
 */
export function isEmailAllowed(email: string | null | undefined): boolean {
    if (!email) return false;
    // If no emails are whitelisted, allow all (for development)
    if (ALLOWED_EMAILS.length === 0) return true;
    return ALLOWED_EMAILS.includes(email.toLowerCase());
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<User> {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
    await firebaseSignOut(auth);
}

/**
 * Get the current user
 */
export function getCurrentUser(): User | null {
    return auth.currentUser;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
}

// Re-export User type for convenience
export type { User };
