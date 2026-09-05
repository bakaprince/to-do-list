import { describe, expect, it } from 'vitest';
import { filterTasks } from '../src/lib/taskFilters';
import { Task } from '../src/types';

const tasks: Task[] = [
    {
        id: 'one',
        title: 'Buy groceries',
        description: 'Fruit and vegetables',
        completed: false,
        priority: 'high',
        userId: 'user-1',
        createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
        id: 'two',
        title: 'Read a book',
        completed: true,
        priority: 'low',
        userId: 'user-1',
        createdAt: '2026-01-02T00:00:00.000Z',
    },
];

describe('filterTasks', () => {
    it('filters by status and priority', () => {
        expect(filterTasks(tasks, 'active', 'high', '')).toEqual([tasks[0]]);
        expect(filterTasks(tasks, 'completed', 'low', '')).toEqual([tasks[1]]);
    });

    it('searches titles and descriptions case-insensitively', () => {
        expect(filterTasks(tasks, 'all', 'all', 'VEGETABLES')).toEqual([tasks[0]]);
        expect(filterTasks(tasks, 'all', 'all', 'book')).toEqual([tasks[1]]);
    });
});
