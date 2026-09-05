import React, { useState } from 'react';
import { Task, Priority } from '../types';
import {
  Check,
  Trash2,
  Edit3,
  X,
  Save,
  Calendar,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, currentCompleted: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, updates: { title?: string; priority?: Priority; description?: string }) => Promise<void>;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPriority, setEditPriority] = useState<Priority>(task.priority || 'medium');
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [showDetails, setShowDetails] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSaveEdit = async () => {
    const cleanTitle = editTitle.trim();
    if (!cleanTitle) return;
    setIsUpdating(true);
    try {
      await onUpdate(task.id, {
        title: cleanTitle,
        priority: editPriority,
        description: editDescription.trim() || undefined,
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update task:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditPriority(task.priority || 'medium');
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } catch (err) {
      console.error('Failed to delete task:', err);
      setIsDeleting(false);
    }
  };

  const priorityStyles: Record<Priority, { label: string; bg: string; text: string }> = {
    high: {
      label: 'High',
      bg: 'bg-[#FAF5F2] border-[#A68A73]/30',
      text: 'text-[#A68A73]',
    },
    medium: {
      label: 'Medium',
      bg: 'bg-[#F7F3F0] border-[#D9CFC4]',
      text: 'text-[#8C7E6F]',
    },
    low: {
      label: 'Low',
      bg: 'bg-[#F0F4F2] border-[#5D6D5E]/25',
      text: 'text-[#5D6D5E]',
    },
  };

  const currentPriority = task.priority || 'medium';
  const badge = priorityStyles[currentPriority];

  const formattedDate = (() => {
    try {
      const d = new Date(task.createdAt);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  })();

  return (
    <div
      id={`task-item-${task.id}`}
      className={`group rounded-[28px] p-5 sm:p-6 transition-all duration-200 ${
        task.completed
          ? 'bg-[#F7F3F0]/60 border border-dashed border-[#D9CFC4] opacity-75'
          : 'bg-white border border-[#EAE3DC] hover:border-[#D9CFC4] shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
      }`}
    >
      {isEditing ? (
        <div className="space-y-3.5">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full text-base font-medium text-[#2C332D] border border-[#D9CFC4] rounded-xl p-2.5 outline-none focus:border-[#5D6D5E] bg-white"
            maxLength={200}
            autoFocus
          />

          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Add description..."
            maxLength={1000}
            rows={2}
            className="w-full text-xs text-[#3E362E] border border-[#D9CFC4] rounded-xl p-2.5 outline-none focus:border-[#5D6D5E] bg-[#FDFCF9]"
          />

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setEditPriority(p)}
                  className={`text-xs px-3 py-1 rounded-xl capitalize font-medium border transition-all ${
                    editPriority === p
                      ? 'bg-[#5D6D5E] text-white border-[#5D6D5E]'
                      : 'bg-[#F7F3F0] text-[#8C7E6F] border-[#EAE3DC] hover:bg-[#EAE3DC]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCancelEdit}
                disabled={isUpdating}
                className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl text-[#8C7E6F] hover:text-[#2C332D] hover:bg-[#F7F3F0] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isUpdating || !editTitle.trim()}
                className="inline-flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-xl bg-[#5D6D5E] text-white font-semibold hover:bg-[#4E5C4F] transition-colors shadow-xs disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Checkbox Toggle Button */}
          <button
            id={`toggle-task-${task.id}`}
            type="button"
            onClick={() => onToggle(task.id, task.completed)}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 border-2 shrink-0 cursor-pointer ${
              task.completed
                ? 'bg-[#5D6D5E] border-[#5D6D5E] text-white shadow-xs'
                : 'border-[#5D6D5E] hover:bg-[#5D6D5E]/10 bg-white'
            }`}
            aria-label={task.completed ? 'Mark task incomplete' : 'Mark task completed'}
          >
            {task.completed && <Check className="w-4 h-4 stroke-[2.5]" />}
          </button>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                onClick={() => onToggle(task.id, task.completed)}
                className={`text-base font-semibold cursor-pointer break-words transition-colors ${
                  task.completed
                    ? 'line-through text-[#8C7E6F] select-none font-serif italic'
                    : 'text-[#2C332D] hover:text-[#5D6D5E]'
                }`}
              >
                {task.title}
              </span>

              {/* Priority Pill */}
              <span
                className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badge.bg} ${badge.text}`}
              >
                {badge.label}
              </span>
            </div>

            {/* Optional description preview */}
            {task.description && (
              <div className="mt-1">
                {showDetails ? (
                  <p className="whitespace-pre-wrap leading-relaxed mt-1.5 text-xs text-[#3E362E] bg-[#FDFCF9] p-2.5 rounded-xl border border-[#EAE3DC]">
                    {task.description}
                  </p>
                ) : (
                  <p className="line-clamp-1 text-xs text-[#8C7E6F] font-medium">{task.description}</p>
                )}
              </div>
            )}

            {/* Footer Metadata */}
            <div className="mt-2 flex items-center gap-3 text-[11px] text-[#8C7E6F]">
              {formattedDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#A68A73]" />
                  {task.completed ? `Completed ${formattedDate}` : formattedDate}
                </span>
              )}
              {task.description && (
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center gap-0.5 text-[#8C7E6F] hover:text-[#2C332D] transition-colors font-medium"
                >
                  {showDetails ? (
                    <>
                      <span>Less</span>
                      <ChevronUp className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      <span>Details</span>
                      <ChevronDown className="w-3 h-3" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
            <button
              id={`edit-task-${task.id}`}
              onClick={() => setIsEditing(true)}
              className="p-2 text-[#8C7E6F] hover:text-[#5D6D5E] hover:bg-[#F0F4F2] rounded-xl transition-colors cursor-pointer"
              title="Edit task"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              id={`delete-task-${task.id}`}
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-[#D9CFC4] hover:text-[#A68A73] hover:bg-[#FAF5F2] rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
