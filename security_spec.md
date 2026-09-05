# Security Specification: To-Do List Application

## 1. Data Invariants
- Each task belongs to exactly one authenticated user identified by `userId` which must match `request.auth.uid`.
- Users cannot create tasks assigned to other users (`userId != request.auth.uid`).
- Users cannot read, list, update, or delete tasks belonging to other users.
- Subcollections under `/users/{userId}/tasks/{taskId}` ensure path-level structural isolation.
- Top-level `/tasks/{taskId}` enforces `userId == request.auth.uid` on list queries and document reads/writes.
- Task status changes and title updates preserve `userId` and `createdAt` immutability.
- Field boundaries and string length constraints prevent resource exhaustion attacks.

## 2. The "Dirty Dozen" Payloads (Designed to Fail)
1. **Unauthenticated Read**: Attempting to read tasks without an auth token (`request.auth == null`). Expected: `PERMISSION_DENIED`.
2. **Cross-User Path Access**: User A accessing `/users/userB/tasks/task1`. Expected: `PERMISSION_DENIED`.
3. **Spoofed Owner Creation**: Creating a task with `userId: "attackerId"` while logged in as `victimId`. Expected: `PERMISSION_DENIED`.
4. **Shadow Field Injection**: Creating a task with an unwhitelisted field `isAdmin: true` or `verified: true`. Expected: `PERMISSION_DENIED`.
5. **Path ID Poisoning**: Document ID with special characters or exceeding length limit (`../`, `<script>`, 200-char string). Expected: `PERMISSION_DENIED`.
6. **Immortal Field Mutation**: Updating an existing task and altering `userId` or `createdAt`. Expected: `PERMISSION_DENIED`.
7. **Title Boundary Overflow**: Sending a task title exceeding 200 characters or empty string (`""`). Expected: `PERMISSION_DENIED`.
8. **Blanket Query Scraping**: Attempting a collection list query without filtering by `userId == request.auth.uid`. Expected: `PERMISSION_DENIED`.
9. **Cross-User Modification**: User A sending an update to a task document belonging to User B. Expected: `PERMISSION_DENIED`.
10. **Cross-User Deletion**: User A attempting to delete User B's task document. Expected: `PERMISSION_DENIED`.
11. **Type Poisoning**: Sending `completed: "true"` (string instead of boolean) or `completed: 1`. Expected: `PERMISSION_DENIED`.
12. **Priority Injection**: Sending `priority: "super-urgent"` (outside enum `['low', 'medium', 'high']`). Expected: `PERMISSION_DENIED`.

## 3. Enforcement Strategy
- Global default deny on all unmatched paths: `match /{document=**} { allow read, write: if false; }`.
- `isValidId(id)` helper guarding all document ID path variables.
- `isValidTask(data, userId)` helper enforcing schema, data types, string length bounds, and identity matching.
- Immutability assertions on `userId` and `createdAt`.
- Strict action-based update gates verifying `affectedKeys().hasOnly(...)`.
