import { Priority } from '../types';

export const MAX_TITLE_LENGTH = 200;
export const MAX_DESCRIPTION_LENGTH = 1000;

export function normalizeTaskTitle(title: string): string {
    const normalizedTitle = title.trim();
    if (!normalizedTitle) throw new Error('Task title cannot be empty.');
    if (normalizedTitle.length > MAX_TITLE_LENGTH) {
        throw new Error(`Task title cannot exceed ${MAX_TITLE_LENGTH} characters.`);
    }
    return normalizedTitle;
}

export function normalizeTaskDescription(description: string): string {
    const normalizedDescription = description.trim();
    if (normalizedDescription.length > MAX_DESCRIPTION_LENGTH) {
        throw new Error(`Task description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.`);
    }
    return normalizedDescription;
}

export function isPriority(value: string): value is Priority {
    return value === 'low' || value === 'medium' || value === 'high';
}
