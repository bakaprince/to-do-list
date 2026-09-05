# Security Specification: To-Do List Application

This document describes the rules in `firestore.rules`. The browser app uses Google-authenticated users and stores active task data under `/users/{userId}/tasks/{taskId}`. The `/tasks/{taskId}` rules remain defined as defense-in-depth for direct task documents, but the current client does not write to that collection.

## 1. Data Invariants
- Only authenticated users can access application data.
- Each authenticated user profile is stored at `/users/{userId}` and can only be read or changed by that user.
- An authenticated user can delete only their own profile document.
- Each task belongs to exactly one authenticated user identified by `userId` which must match `request.auth.uid`.
- Users cannot create tasks assigned to other users (`userId != request.auth.uid`).
- Users cannot read, list, update, or delete tasks belonging to other users.
- Subcollections under `/users/{userId}/tasks/{taskId}` ensure path-level structural isolation.
- Top-level `/tasks/{taskId}` enforces `userId == request.auth.uid` on list queries and document reads/writes.
- Task status changes and title updates preserve `userId` and `createdAt` immutability.
- Field boundaries and string length constraints prevent resource exhaustion attacks.
- Task titles are trimmed by the client and limited to 200 characters; descriptions are trimmed and limited to 1,000 characters.
- Supported priority values are `low`, `medium`, and `high`.

## 2. The "Dirty Dozen" Payloads (Designed to Fail)
1. **Unauthenticated Read**: Attempting to read tasks without an auth token (`request.auth == null`). Expected: `PERMISSION_DENIED`.
2. **Cross-User Path Access**: User A accessing `/users/userB/tasks/task1`. Expected: `PERMISSION_DENIED`.
3. **Spoofed Owner Creation**: Creating a task with `userId: "attackerId"` while logged in as `victimId`. Expected: `PERMISSION_DENIED`.
4. **Shadow Field Injection**: Creating a task with an unwhitelisted field `isAdmin: true` or `verified: true`. Expected: `PERMISSION_DENIED`.
5. **Path ID Poisoning**: Document ID with special characters or exceeding length limit (`../`, `<script>`, 200-char string). Expected: `PERMISSION_DENIED`.
6. **Immortal Field Mutation**: Updating an existing task and altering `userId` or `createdAt`. Expected: `PERMISSION_DENIED`.
7. **Title Boundary Overflow**: Sending a task title exceeding 200 characters or empty string (`""`). Expected: `PERMISSION_DENIED`.
8. **Description Boundary Overflow**: Sending a description exceeding 1,000 characters. Expected: `PERMISSION_DENIED`.
9. **Blanket Query Scraping**: Attempting a collection list query without filtering by `userId == request.auth.uid`. Expected: `PERMISSION_DENIED`.
10. **Cross-User Modification**: User A sending an update to a task document belonging to User B. Expected: `PERMISSION_DENIED`.
11. **Cross-User Deletion**: User A attempting to delete User B's task document. Expected: `PERMISSION_DENIED`.
12. **Type Poisoning**: Sending `completed: "true"` (string instead of boolean) or `completed: 1`. Expected: `PERMISSION_DENIED`.
13. **Priority Injection**: Sending `priority: "super-urgent"` (outside enum `['low', 'medium', 'high']`). Expected: `PERMISSION_DENIED`.

## 3. Enforcement Strategy
- Global default deny on all unmatched paths: `match /{document=**} { allow read, write: if false; }`.
- `isValidId(id)` helper guarding all document ID path variables.
- `isValidTask(data, userId)` helper enforcing schema, data types, string length bounds, and identity matching.
- Immutability assertions on `userId` and `createdAt`.
- Strict action-based update gates verifying `affectedKeys().hasOnly(...)`.

## 4. Operational Security
- Keep `VITE_FIREBASE_API_KEY` in `.env.local`; `.env.local` must never be committed.
- Treat a committed Firebase key as exposed: rotate or restrict it before rewriting Git history and pushing again.
- Add only hostnames, without ports, to Firebase Authentication's authorized-domain list.
- Review Firestore usage and authentication activity in the Firebase Console.
- Account deletion removes the user's task subcollection, profile document, and Firebase Auth account. Recent authentication may be required by Firebase.
