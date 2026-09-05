import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
    limit,
    deleteField,
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Task, Priority, TaskVisibility } from '../types';
import { normalizeTaskDescription, normalizeTaskTitle } from '../lib/taskValidation';

const MAX_TASKS_PER_USER = 100;

export function useTasks() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [actionInProgress, setActionInProgress] = useState<boolean>(false);

    // Real-time synchronization with Firestore
    useEffect(() => {
        if (!user || !user.uid) {
            setTasks([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        const tasksCollectionPath = `users/${user.uid}/tasks`;
        const tasksColRef = collection(db, 'users', user.uid, 'tasks');
        const tasksQuery = query(tasksColRef, orderBy('createdAt', 'desc'), limit(MAX_TASKS_PER_USER));

        const unsubscribe = onSnapshot(
            tasksQuery,
            (snapshot) => {
                const loadedTasks: Task[] = [];
                snapshot.forEach((docSnap) => {
                    const data = docSnap.data();
                    loadedTasks.push({
                        id: docSnap.id,
                        title: data.title || '',
                        description: data.description || '',
                        completed: Boolean(data.completed),
                        priority: (data.priority as Priority) || 'medium',
                        visibility: (data.visibility as TaskVisibility) || 'private',
                        userId: data.userId || user.uid,
                        createdAt: data.createdAt || new Date().toISOString(),
                        updatedAt: data.updatedAt,
                        completedAt: data.completedAt,
                        challengeId: data.challengeId,
                    });
                });
                setTasks(loadedTasks);
                setLoading(false);
            },
            (err) => {
                console.error('Error in tasks onSnapshot listener:', err);
                setError('Failed to sync tasks from cloud database.');
                setLoading(false);
                try {
                    handleFirestoreError(err, OperationType.GET, tasksCollectionPath);
                } catch {
                    // Handled and logged
                }
            }
        );

        return () => unsubscribe();
    }, [user]);

    // Add Task with strict validation constraints
    const addTask = useCallback(
        async (title: string, priority: Priority = 'medium', description: string = '', visibility: TaskVisibility = 'private') => {
            if (!user) throw new Error('User must be signed in to add tasks.');

            const cleanTitle = normalizeTaskTitle(title);
            const cleanDesc = normalizeTaskDescription(description);

            const tasksCollectionRef = collection(db, 'users', user.uid, 'tasks');
            const newTaskDoc = doc(tasksCollectionRef);
            const taskPath = `users/${user.uid}/tasks/${newTaskDoc.id}`;

            const payload: {
                title: string;
                completed: boolean;
                userId: string;
                createdAt: string;
                priority: Priority;
                visibility: TaskVisibility;
                description?: string;
            } = {
                title: cleanTitle,
                completed: false,
                userId: user.uid,
                createdAt: new Date().toISOString(),
                priority,
                visibility,
            };

            if (cleanDesc) {
                payload.description = cleanDesc;
            }

            setActionInProgress(true);
            try {
                await setDoc(newTaskDoc, payload);
            } catch (err) {
                handleFirestoreError(err, OperationType.CREATE, taskPath);
            } finally {
                setActionInProgress(false);
            }
        },
        [user]
    );

    // Toggle Task Completion status
    const toggleTask = useCallback(
        async (id: string, currentCompleted: boolean) => {
            if (!user) return;
            const taskPath = `users/${user.uid}/tasks/${id}`;
            const taskDocRef = doc(db, 'users', user.uid, 'tasks', id);

            try {
                await updateDoc(taskDocRef, {
                    completed: !currentCompleted,
                    updatedAt: new Date().toISOString(),
                    completedAt: currentCompleted ? deleteField() : new Date().toISOString(),
                });
            } catch (err) {
                handleFirestoreError(err, OperationType.UPDATE, taskPath);
            }
        },
        [user]
    );

    // Delete Task
    const deleteTask = useCallback(
        async (id: string) => {
            if (!user) return;
            const taskPath = `users/${user.uid}/tasks/${id}`;
            const taskDocRef = doc(db, 'users', user.uid, 'tasks', id);

            try {
                await deleteDoc(taskDocRef);
            } catch (err) {
                handleFirestoreError(err, OperationType.DELETE, taskPath);
            }
        },
        [user]
    );

    // Edit Task Title and Priority
    const updateTask = useCallback(
        async (id: string, updates: { title?: string; priority?: Priority; description?: string; visibility?: TaskVisibility }) => {
            if (!user) return;
            const taskPath = `users/${user.uid}/tasks/${id}`;
            const taskDocRef = doc(db, 'users', user.uid, 'tasks', id);

            const payload: Record<string, unknown> = {
                updatedAt: new Date().toISOString(),
            };

            if (updates.title !== undefined) {
                const cleanTitle = normalizeTaskTitle(updates.title);
                payload.title = cleanTitle;
            }

            if (updates.priority !== undefined) {
                payload.priority = updates.priority;
            }

            if (updates.description !== undefined) {
                const cleanDesc = normalizeTaskDescription(updates.description);
                payload.description = cleanDesc;
            }

            if (updates.visibility !== undefined) {
                payload.visibility = updates.visibility;
            }

            try {
                await updateDoc(taskDocRef, payload);
            } catch (err) {
                handleFirestoreError(err, OperationType.UPDATE, taskPath);
            }
        },
        [user]
    );

    return {
        tasks,
        loading,
        error,
        actionInProgress,
        addTask,
        toggleTask,
        deleteTask,
        updateTask,
    };
}
