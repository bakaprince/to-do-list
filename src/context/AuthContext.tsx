import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    signInWithGoogle: () => Promise<void>;
    signOutUser: () => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setLoading(false);

            if (currentUser && currentUser.uid && currentUser.email) {
                const userPath = `users/${currentUser.uid}`;
                try {
                    await setDoc(
                        doc(db, 'users', currentUser.uid),
                        {
                            uid: currentUser.uid,
                            displayName: currentUser.displayName || 'User',
                            email: currentUser.email,
                            photoURL: currentUser.photoURL || '',
                            lastLoginAt: new Date().toISOString(),
                        },
                        { merge: true }
                    );
                } catch (err) {
                    // Log using the standard pattern but don't prevent user from viewing tasks
                    console.warn('Could not sync user profile to Firestore:', err);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        setError(null);
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err: unknown) {
            console.error('Google Sign-In failed:', err);
            if (err instanceof Error) {
                // Provide friendly messages for popup closed or canceled
                if (err.message.includes('auth/unauthorized-domain')) {
                    setError(
                        `This app's current address is not authorized for Google sign-in. Add ${window.location.hostname} in Firebase Console under Authentication > Settings > Authorized domains, then reload the app.`
                    );
                } else if (err.message.includes('auth/popup-closed-by-user')) {
                    setError('Sign-in cancelled. The popup was closed before completing.');
                } else if (err.message.includes('auth/cancelled-popup-request')) {
                    setError('Sign-in cancelled due to multiple open attempts.');
                } else {
                    setError(err.message || 'Failed to sign in with Google. Please try again.');
                }
            } else {
                setError('Failed to sign in with Google.');
            }
        }
    };

    const signOutUser = async () => {
        setError(null);
        try {
            await signOut(auth);
        } catch (err: unknown) {
            console.error('Sign out error:', err);
            setError(err instanceof Error ? err.message : 'Failed to sign out.');
        }
    };

    const clearError = () => setError(null);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                signInWithGoogle,
                signOutUser,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
