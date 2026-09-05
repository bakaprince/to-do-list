import { useCallback, useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDoc, onSnapshot, setDoc, writeBatch } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { Friend, FriendRequest } from '../types';

function validateUsername(value: string): string {
    const username = value.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
        throw new Error('Username must be 3-20 characters using letters, numbers, or underscores.');
    }
    return username;
}

export function useFriends() {
    const { user } = useAuth();
    const [username, setUsernameState] = useState('');
    const [friends, setFriends] = useState<Friend[]>([]);
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setUsernameState('');
            setFriends([]);
            setRequests([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const profileRef = doc(db, 'users', user.uid);
        const unsubscribeFriends = onSnapshot(collection(db, 'users', user.uid, 'friends'), (snapshot) => {
            setFriends(snapshot.docs.map((friendSnapshot) => friendSnapshot.data() as Friend));
            setLoading(false);
        }, () => {
            setError('Could not load your friends.');
            setLoading(false);
        });
        const unsubscribeRequests = onSnapshot(collection(db, 'users', user.uid, 'friendRequests'), (snapshot) => {
            setRequests(snapshot.docs.map((request) => ({ id: request.id, ...request.data() } as FriendRequest)));
        });

        getDoc(profileRef).then((profileSnapshot) => {
            const savedUsername = profileSnapshot.data()?.username as string | undefined;
            if (savedUsername) setUsernameState(savedUsername);
        }).catch(() => setError('Could not load your username.'));

        return () => {
            unsubscribeFriends();
            unsubscribeRequests();
        };
    }, [user]);

    const setUsername = useCallback(async (value: string) => {
        if (!user) throw new Error('Sign in before choosing a username.');
        const normalizedUsername = validateUsername(value);
        const usernameRef = doc(db, 'usernames', normalizedUsername);
        const existingUsername = await getDoc(usernameRef);
        if (existingUsername.exists() && existingUsername.data().uid !== user.uid) {
            throw new Error('That username is already taken.');
        }

        const batch = writeBatch(db);
        batch.set(usernameRef, { uid: user.uid });
        batch.set(doc(db, 'users', user.uid), { username: normalizedUsername }, { merge: true });
        await batch.commit();
        setUsernameState(normalizedUsername);
    }, [user]);

    const sendFriendRequest = useCallback(async (value: string) => {
        if (!user) throw new Error('Sign in before sending requests.');
        if (!username) throw new Error('Choose your username before adding friends.');
        const targetUsername = validateUsername(value);
        const targetSnapshot = await getDoc(doc(db, 'usernames', targetUsername));
        const targetUid = targetSnapshot.data()?.uid as string | undefined;
        if (!targetUid) throw new Error('No user found with that username.');
        if (targetUid === user.uid) throw new Error('You cannot add yourself.');
        if (friends.some((friend) => friend.uid === targetUid)) throw new Error('You are already friends.');

        await setDoc(doc(db, 'users', targetUid, 'friendRequests', user.uid), {
            fromUid: user.uid,
            fromUsername: username,
            fromDisplayName: user.displayName || 'User',
            fromEmail: user.email || '',
            toUid: targetUid,
            toUsername: targetUsername,
            createdAt: new Date().toISOString(),
        });
    }, [friends, user, username]);

    const respondToRequest = useCallback(async (request: FriendRequest, accept: boolean) => {
        if (!user) return;
        if (!accept) {
            await deleteDoc(doc(db, 'users', user.uid, 'friendRequests', request.fromUid));
            return;
        }
        if (!username) throw new Error('Choose your username before accepting requests.');
        const friend: Friend = {
            uid: request.fromUid,
            displayName: request.fromDisplayName,
            email: request.fromEmail,
            friendCode: '',
            username: request.fromUsername,
        };
        const reverseFriend: Friend = {
            uid: user.uid,
            displayName: user.displayName || 'User',
            email: user.email || '',
            friendCode: '',
            username,
        };
        const batch = writeBatch(db);
        batch.set(doc(db, 'users', user.uid, 'friends', request.fromUid), friend);
        batch.set(doc(db, 'users', request.fromUid, 'friends', user.uid), reverseFriend);
        batch.delete(doc(db, 'users', user.uid, 'friendRequests', request.fromUid));
        await batch.commit();
    }, [user, username]);

    const removeFriend = useCallback(async (friendId: string) => {
        if (!user) return;
        const batch = writeBatch(db);
        batch.delete(doc(db, 'users', user.uid, 'friends', friendId));
        batch.delete(doc(db, 'users', friendId, 'friends', user.uid));
        await batch.commit();
    }, [user]);

    return { username, friends, requests, loading, error, setUsername, sendFriendRequest, respondToRequest, removeFriend };
}
