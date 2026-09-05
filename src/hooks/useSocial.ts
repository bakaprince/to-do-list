import { useCallback, useEffect, useState } from 'react';
import { addDoc, collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { Challenge, Friend, Reminder, Task } from '../types';

export function useSocial(friends: Friend[], ownedTasks: Task[]) {
    const { user } = useAuth();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [reminders, setReminders] = useState<Reminder[]>([]);

    useEffect(() => {
        if (!user) {
            setChallenges([]);
            setReminders([]);
            return;
        }

        setReminders([]);

        const challengeQuery = query(collection(db, 'challenges'), where('participantIds', 'array-contains', user.uid));
        const unsubscribeChallenges = onSnapshot(challengeQuery, (snapshot) => {
            setChallenges(
                snapshot.docs
                    .map((challenge) => ({ id: challenge.id, ...challenge.data() } as Challenge))
                    .sort((first, second) => second.createdAt.localeCompare(first.createdAt)),
            );
        });

        const reminderGroups = new Map<string, Reminder[]>();
        const unsubscribeReminders = ownedTasks.map((task) => {
            const reminderQuery = query(collection(db, 'users', user.uid, 'tasks', task.id, 'reminders'), where('ownerId', '==', user.uid));
            return onSnapshot(reminderQuery, (snapshot) => {
                reminderGroups.set(task.id, snapshot.docs.map((reminder) => ({ id: reminder.id, ...reminder.data() } as Reminder)));
                setReminders(Array.from(reminderGroups.values()).flat());
            });
        });

        return () => {
            unsubscribeChallenges();
            unsubscribeReminders.forEach((unsubscribe) => unsubscribe());
        };
    }, [ownedTasks, user]);

    const sendReminder = useCallback(async (ownerId: string, taskId: string) => {
        if (!user || !friends.some((friend) => friend.uid === ownerId)) return;
        await addDoc(collection(db, 'users', ownerId, 'tasks', taskId, 'reminders'), {
            ownerId,
            taskId,
            senderId: user.uid,
            senderName: user.displayName || 'A friend',
            createdAt: new Date().toISOString(),
        });
    }, [friends, user]);

    const createChallenge = useCallback(async (friendId: string, title: string) => {
        if (!user) throw new Error('Sign in before creating a challenge.');
        const cleanTitle = title.trim();
        if (!cleanTitle) throw new Error('Challenge title cannot be empty.');
        if (!friends.some((friend) => friend.uid === friendId)) throw new Error('Choose a connected friend.');
        await addDoc(collection(db, 'challenges'), {
            title: cleanTitle.slice(0, 200),
            creatorId: user.uid,
            participantIds: [user.uid, friendId],
            completedBy: { [user.uid]: false, [friendId]: false },
            createdAt: new Date().toISOString(),
        });
    }, [friends, user]);

    const toggleChallenge = useCallback(async (challenge: Challenge) => {
        if (!user || !challenge.participantIds.includes(user.uid)) return;
        await updateDoc(doc(db, 'challenges', challenge.id), {
            [`completedBy.${user.uid}`]: !challenge.completedBy[user.uid],
        });
    }, [user]);

    return { challenges, reminders, sendReminder, createChallenge, toggleChallenge };
}
