import { readFileSync } from 'node:fs';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
    RulesTestEnvironment,
    assertFails,
    assertSucceeds,
    initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';

let testEnvironment: RulesTestEnvironment;

const task = {
    title: 'Test task',
    completed: false,
    userId: 'user-1',
    createdAt: '2026-01-01T00:00:00.000Z',
    priority: 'medium',
};

describe('Firestore security rules', () => {
    beforeAll(async () => {
        testEnvironment = await initializeTestEnvironment({
            projectId: 'collaborative-to-do-list-test',
            firestore: {
                rules: readFileSync('firestore.rules', 'utf8'),
            },
        });
    });

    afterEach(async () => {
        await testEnvironment.clearFirestore();
    });

    afterAll(async () => {
        await testEnvironment.cleanup();
    });

    it('allows an owner to create and read a valid task', async () => {
        const ownerDb = testEnvironment.authenticatedContext('user-1').firestore();
        const taskRef = doc(ownerDb, 'users/user-1/tasks/task-1');

        await assertSucceeds(setDoc(taskRef, task));
        await assertSucceeds(getDoc(taskRef));
    });

    it('rejects unauthenticated access', async () => {
        const anonymousDb = testEnvironment.unauthenticatedContext().firestore();
        const taskRef = doc(anonymousDb, 'users/user-1/tasks/task-1');

        await assertFails(getDoc(taskRef));
    });

    it('rejects cross-user writes and extra fields', async () => {
        const otherUserDb = testEnvironment.authenticatedContext('user-2').firestore();
        const taskRef = doc(otherUserDb, 'users/user-1/tasks/task-1');

        await assertFails(setDoc(taskRef, task));

        const ownerDb = testEnvironment.authenticatedContext('user-1').firestore();
        await assertFails(
            setDoc(doc(ownerDb, 'users/user-1/tasks/task-2'), {
                ...task,
                isAdmin: true,
            })
        );
    });

    it('allows an owner to delete their own profile', async () => {
        const ownerDb = testEnvironment.authenticatedContext('user-1').firestore();
        const profileRef = doc(ownerDb, 'users/user-1');

        await assertSucceeds(
            setDoc(profileRef, {
                uid: 'user-1',
                email: 'user@example.com',
                displayName: 'User',
                photoURL: '',
                lastLoginAt: '2026-01-01T00:00:00.000Z',
            })
        );
        await assertSucceeds(deleteDoc(profileRef));
    });
});
