import { useEffect, useState } from 'react';
import { collection, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Friend, Task, Priority, TaskVisibility } from '../types';

export function useSharedTasks(friends: Friend[]) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!friends.length) {
            setTasks([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const taskGroups = new Map<string, Task[]>();
        const unsubscribers = friends.map((friend) => {
            const sharedQuery = query(
                collection(db, 'users', friend.uid, 'tasks'),
                where('visibility', '==', 'friends'),
                orderBy('createdAt', 'desc'),
                limit(100),
            );

            return onSnapshot(sharedQuery, (snapshot) => {
                taskGroups.set(friend.uid, snapshot.docs.map((taskDocument) => {
                    const data = taskDocument.data();
                    return {
                        id: taskDocument.id,
                        title: data.title || '',
                        description: data.description || '',
                        completed: Boolean(data.completed),
                        priority: (data.priority as Priority) || 'medium',
                        visibility: (data.visibility as TaskVisibility) || 'private',
                        userId: data.userId || friend.uid,
                        createdAt: data.createdAt || new Date().toISOString(),
                        updatedAt: data.updatedAt,
                    };
                }));
                setTasks(Array.from(taskGroups.values()).flat().sort((first, second) => second.createdAt.localeCompare(first.createdAt)));
                setLoading(false);
            });
        });

        return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
    }, [friends]);

    return { tasks, loading };
}
