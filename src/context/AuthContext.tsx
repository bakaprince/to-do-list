import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    onAuthStateChanged,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    signOut,
    deleteUser,
} from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, setDoc, writeBatch } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    signInWithGoogle: () => Promise<void>;
    signOutUser: () => Promise<void>;
    deleteAccount: () => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getRedirectResult(auth).catch((err: unknown) => {
            if (err instanceof Error && !err.message.includes('auth/no-auth-event')) {
                setError(err.message || 'Google sign-in could not be completed.');
            }
        });

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
                } else if (err.message.includes('auth/popup-blocked')) {
                    setError('Opening Google sign-in in this tab...');
                    await signInWithRedirect(auth, googleProvider);
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

    const deleteAccount = async () => {
        setError(null);
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        try {
            const tasksSnapshot = await getDocs(collection(db, 'users', currentUser.uid, 'tasks'));
            const taskReferences = tasksSnapshot.docs.map((taskDocument) => taskDocument.ref);

            for (let index = 0; index < taskReferences.length; index += 500) {
                const batch = writeBatch(db);
                taskReferences.slice(index, index + 500).forEach((taskReference) => batch.delete(taskReference));
                await batch.commit();
            }

            await deleteDoc(doc(db, 'users', currentUser.uid));
            await deleteUser(currentUser);
        } catch (err: unknown) {
            console.error('Account deletion failed:', err);
            if (err instanceof Error && err.message.includes('auth/requires-recent-login')) {
                setError('For security, sign out and sign in again before deleting your account.');
            } else {
                setError(err instanceof Error ? err.message : 'Failed to delete your account.');
            }
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
                deleteAccount,
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
