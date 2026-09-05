import React from 'react';
import { Task, Priority } from '../types';
import { TaskItem } from './TaskItem';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, FilterX, Loader2, Sprout } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onToggle: (id: string, currentCompleted: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, updates: { title?: string; priority?: Priority; description?: string }) => Promise<void>;
  hasFilterActive: boolean;
  onResetFilters: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading,
  onToggle,
  onDelete,
  onUpdate,
  hasFilterActive,
  onResetFilters,
}) => {
  if (loading) {
    return (
      <div className="bg-white border border-[#EAE3DC] rounded-[32px] p-12 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <Loader2 className="w-8 h-8 text-[#5D6D5E] animate-spin mx-auto mb-3" />
        <p className="text-sm font-serif italic text-[#2C332D]">Nourishing your garden from Firebase...</p>
        <p className="text-xs text-[#8C7E6F] mt-1 font-medium">Fetching isolated Firestore records</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    if (hasFilterActive) {
      return (
        <div className="bg-white border border-[#EAE3DC] rounded-[32px] p-12 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="w-14 h-14 rounded-2xl bg-[#F7F3F0] border border-[#D9CFC4] flex items-center justify-center mx-auto mb-4 text-[#A68A73]">
            <FilterX className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif italic text-[#2C332D] mb-1.5">No matching tasks in view</h3>
          <p className="text-xs text-[#8C7E6F] font-medium mb-5 max-w-sm mx-auto">
            Try adjusting your search keyword, priority, or category filter to discover other tasks.
          </p>
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-[#D9CFC4] hover:bg-[#F7F3F0] text-[#3E362E] text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      );
    }

    return (
      <div className="bg-white border border-[#EAE3DC] rounded-[32px] p-12 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="w-14 h-14 rounded-2xl bg-[#EAE3DC] border border-[#D9CFC4] flex items-center justify-center mx-auto mb-4 text-[#5D6D5E] shadow-inner">
          <Sprout className="w-7 h-7" />
        </div>
        <h3 className="text-2xl font-serif italic text-[#2C332D] mb-1.5">Your garden is clear</h3>
        <p className="text-xs text-[#8C7E6F] font-medium max-w-sm mx-auto leading-relaxed">
          Add your first task above to establish your daily rhythms. Every task is isolated in Firestore and updated in real time.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      <AnimatePresence initial={false}>
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            <TaskItem
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
