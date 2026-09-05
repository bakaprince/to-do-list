import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfigTemplate from '../../firebase-applet-config.json';

const firebaseApiKey = import.meta.env.VITE_FIREBASE_API_KEY;

if (!firebaseApiKey) {
    throw new Error('Missing VITE_FIREBASE_API_KEY. Copy .env.example to .env.local and add your Firebase web API key.');
}

const firebaseConfig = {
    ...firebaseConfigTemplate,
    apiKey: firebaseApiKey,
};

// Initialize Firebase App singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: Initialize Firestore with explicit databaseId from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Auth instance & Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Firestore Error diagnostics as specified in Firebase Skill
export enum OperationType {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    LIST = 'list',
    GET = 'get',
    WRITE = 'write',
}

export interface FirestoreErrorInfo {
    error: string;
    operationType: OperationType;
    path: string | null;
    authInfo: {
        userId?: string | null;
        email?: string | null;
        emailVerified?: boolean | null;
        isAnonymous?: boolean | null;
        tenantId?: string | null;
        providerInfo?: {
            providerId?: string | null;
            email?: string | null;
        }[];
    };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
    const errInfo: FirestoreErrorInfo = {
        error: error instanceof Error ? error.message : String(error),
        authInfo: {
            userId: auth.currentUser?.uid,
            email: auth.currentUser?.email,
            emailVerified: auth.currentUser?.emailVerified,
            isAnonymous: auth.currentUser?.isAnonymous,
            tenantId: auth.currentUser?.tenantId,
            providerInfo: auth.currentUser?.providerData?.map(provider => ({
                providerId: provider.providerId,
                email: provider.email,
            })) || [],
        },
        operationType,
        path,
    };
    console.error('Firestore Error:', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
}

// Connection check on boot
export async function testConnection(): Promise<boolean> {
    try {
        await getDocFromServer(doc(db, 'test', 'connection'));
        return true;
    } catch (error: unknown) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
            console.warn('Firebase client appears offline or config unverified:', error.message);
            return false;
        }
        // Expected permission-denied on non-existent test document is healthy online response
        return true;
    }
}
