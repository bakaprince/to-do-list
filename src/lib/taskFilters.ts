import { Task, TaskFilter, PriorityFilter } from '../types';

export function filterTasks(
    tasks: Task[],
    activeFilter: TaskFilter,
    priorityFilter: PriorityFilter,
    searchQuery: string,
): Task[] {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
        if (activeFilter === 'active' && task.completed) return false;
        if (activeFilter === 'completed' && !task.completed) return false;

        if (priorityFilter !== 'all' && (task.priority || 'medium') !== priorityFilter) {
            return false;
        }

        if (normalizedQuery) {
            const matchesTitle = task.title.toLowerCase().includes(normalizedQuery);
            const matchesDescription = task.description?.toLowerCase().includes(normalizedQuery);
            if (!matchesTitle && !matchesDescription) return false;
        }

        return true;
    });
}
