import React from 'react';
import { Task, TaskFilter, PriorityFilter } from '../types';
import { CheckCircle2, Circle, ListFilter, Search } from 'lucide-react';

interface TaskStatsProps {
    tasks: Task[];
    activeFilter: TaskFilter;
    onFilterChange: (filter: TaskFilter) => void;
    priorityFilter: PriorityFilter;
    onPriorityFilterChange: (priority: PriorityFilter) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export const TaskStats: React.FC<TaskStatsProps> = ({
    tasks,
    activeFilter,
    onFilterChange,
    priorityFilter,
    onPriorityFilterChange,
    searchQuery,
    onSearchChange,
}) => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const active = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div className="space-y-4">
            {/* Metrics Bar */}
            <div className="bg-white border border-[#EAE3DC] rounded-[28px] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-6">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A68A73] block">
                                Harvested
                            </span>
                            <div className="flex items-baseline gap-1.5 mt-0.5">
                                <span className="text-2xl font-serif italic text-[#2C332D]">{completed}</span>
                                <span className="text-xs text-[#8C7E6F] font-medium">of {total} done</span>
                            </div>
                        </div>
                        <div className="h-9 w-px bg-[#EAE3DC]" />
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A68A73] block">
                                Nourishing
                            </span>
                            <span className="text-2xl font-serif italic text-[#5D6D5E] mt-0.5 block">{active}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className="text-xs font-bold text-[#5D6D5E]">{percentage}% Complete</span>
                        <div className="w-28 sm:w-36 h-2.5 bg-[#EAE3DC] rounded-full overflow-hidden border border-[#D9CFC4]/60">
                            <div
                                className="h-full bg-[#5D6D5E] rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Filter controls & Search */}
                <div className="flex flex-col items-stretch gap-3 border-t border-[#EAE3DC] pt-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Status Tabs */}
                    <div className="flex w-full items-center gap-1.5 overflow-x-auto rounded-2xl border border-[#EAE3DC] bg-[#F7F3F0] p-1.5 sm:w-auto">
                        <button
                            id="filter-all-btn"
                            onClick={() => onFilterChange('all')}
                            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${activeFilter === 'all'
                                    ? 'bg-white text-[#2C332D] shadow-xs border border-[#D9CFC4]/50'
                                    : 'text-[#8C7E6F] hover:text-[#2C332D]'
                                }`}
                        >
                            All Garden ({total})
                        </button>
                        <button
                            id="filter-active-btn"
                            onClick={() => onFilterChange('active')}
                            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${activeFilter === 'active'
                                    ? 'bg-white text-[#5D6D5E] shadow-xs border border-[#D9CFC4]/50'
                                    : 'text-[#8C7E6F] hover:text-[#2C332D]'
                                }`}
                        >
                            Active ({active})
                        </button>
                        <button
                            id="filter-completed-btn"
                            onClick={() => onFilterChange('completed')}
                            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${activeFilter === 'completed'
                                    ? 'bg-white text-[#A68A73] shadow-xs border border-[#D9CFC4]/50'
                                    : 'text-[#8C7E6F] hover:text-[#2C332D]'
                                }`}
                        >
                            Harvested ({completed})
                        </button>
                    </div>

                    {/* Search and Priority Filter */}
                    <div className="flex w-full items-center gap-2.5 sm:w-auto">
                        {/* Search Input */}
                        <div className="relative min-w-0 flex-1 sm:w-48 sm:flex-none">
                            <Search className="w-3.5 h-3.5 text-[#8C7E6F] absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                id="task-search-input"
                                type="text"
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                placeholder="Search tasks..."
                                className="w-full text-xs pl-9 pr-3.5 py-2 bg-[#FDFCF9] border border-[#D9CFC4] rounded-2xl outline-none focus:bg-white focus:border-[#5D6D5E] text-[#3E362E] placeholder:text-[#8C7E6F]/60 transition-colors"
                            />
                        </div>

                        {/* Priority Filter */}
                        <select
                            id="priority-filter-select"
                            value={priorityFilter}
                            onChange={(e) => onPriorityFilterChange(e.target.value as PriorityFilter)}
                            className="text-xs py-2 px-3 bg-[#FDFCF9] border border-[#D9CFC4] rounded-2xl outline-none text-[#3E362E] font-medium focus:border-[#5D6D5E] cursor-pointer"
                        >
                            <option value="all">All Priorities</option>
                            <option value="high">High Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="low">Low Priority</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};
