export type Priority = 'low' | 'medium' | 'high';
export type TaskVisibility = 'private' | 'friends';

export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    priority?: Priority;
    visibility?: TaskVisibility;
    userId: string;
    createdAt: string;
    updatedAt?: string;
    completedAt?: string;
    challengeId?: string;
}

export interface UserProfile {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    lastLoginAt: string;
    friendCode?: string;
    username?: string;
}

export interface Friend {
    uid: string;
    displayName: string;
    email: string;
    friendCode: string;
    username?: string;
}

export interface FriendRequest {
    id: string;
    fromUid: string;
    fromUsername: string;
    fromDisplayName: string;
    fromEmail: string;
    toUid: string;
    toUsername?: string;
    createdAt: string;
}

export interface Reminder {
    id: string;
    ownerId: string;
    taskId: string;
    senderId: string;
    senderName: string;
    createdAt: string;
}

export interface Challenge {
    id: string;
    title: string;
    creatorId: string;
    participantIds: string[];
    completedBy: Record<string, boolean>;
    createdAt: string;
}

export type TaskFilter = 'all' | 'active' | 'completed';
export type PriorityFilter = 'all' | Priority;
