import { Task } from '../types';

export function calculateCompletionStreak(tasks: Task[], now = new Date()): number {
    const completedDates = new Set(
        tasks
            .filter((task) => task.completedAt)
            .map((task) => new Date(task.completedAt as string).toISOString().slice(0, 10)),
    );
    if (!completedDates.size) return 0;

    const cursor = new Date(now);
    const today = cursor.toISOString().slice(0, 10);
    if (!completedDates.has(today)) cursor.setUTCDate(cursor.getUTCDate() - 1);
    if (!completedDates.has(cursor.toISOString().slice(0, 10))) return 0;

    let streak = 0;
    while (completedDates.has(cursor.toISOString().slice(0, 10))) {
        streak += 1;
        cursor.setUTCDate(cursor.getUTCDate() - 1);
    }
    return streak;
}
