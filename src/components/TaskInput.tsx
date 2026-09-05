import React, { useState } from 'react';
import { Priority, TaskVisibility } from '../types';
import { Plus, AlignLeft, Flag } from 'lucide-react';

interface TaskInputProps {
    onAddTask: (title: string, priority: Priority, description?: string, visibility?: TaskVisibility) => Promise<void>;
    disabled?: boolean;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onAddTask, disabled }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Priority>('medium');
    const [visibility, setVisibility] = useState<TaskVisibility>('private');
    const [showDescription, setShowDescription] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const cleanTitle = title.trim();
        if (!cleanTitle) {
            setValidationError('Please enter a task title to nourish.');
            return;
        }
        if (cleanTitle.length > 200) {
            setValidationError('Task title cannot exceed 200 characters.');
            return;
        }

        setValidationError(null);
        setSubmitting(true);
        try {
            await onAddTask(cleanTitle, priority, description.trim() || undefined, visibility);
            setTitle('');
            setDescription('');
            setShowDescription(false);
            setPriority('medium');
            setVisibility('private');
        } catch (err: unknown) {
            setValidationError(err instanceof Error ? err.message : 'Failed to add task.');
        } finally {
            setSubmitting(false);
        }
    };

    const priorityOptions: { value: Priority; label: string; dotColor: string }[] = [
        { value: 'low', label: 'Low', dotColor: 'bg-[#5D6D5E]' },
        { value: 'medium', label: 'Medium', dotColor: 'bg-[#8C7E6F]' },
        { value: 'high', label: 'High', dotColor: 'bg-[#A68A73]' },
    ];

    return (
        <form
            id="task-create-form"
            onSubmit={handleSubmit}
            className="bg-white border border-[#EAE3DC] rounded-[28px] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all focus-within:border-[#5D6D5E]/60 focus-within:shadow-[0_4px_24px_rgba(93,109,94,0.08)]"
        >
            <div className="flex flex-col gap-3.5">
                {/* Main task title input */}
                <div className="flex items-center gap-3">
                    <input
                        id="task-title-input"
                        type="text"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            if (validationError) setValidationError(null);
                        }}
                        placeholder="Add a new task to nourish..."
                        maxLength={200}
                        disabled={disabled || submitting}
                        className="w-full text-base sm:text-lg text-[#2C332D] placeholder:text-[#8C7E6F]/60 bg-transparent outline-none font-medium"
                    />

                    <button
                        id="task-submit-button"
                        type="submit"
                        disabled={disabled || submitting || !title.trim()}
                        className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#5D6D5E] text-white text-xs font-semibold hover:bg-[#4E5C4F] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-[#5D6D5E]/20 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">+ Add Task</span>
                    </button>
                    <label className="inline-flex items-center gap-2 text-xs font-medium text-[#8C7E6F]">
                        <span>Visibility</span>
                        <select
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value as TaskVisibility)}
                            className="rounded-xl border border-[#D9CFC4] bg-[#FDFCF9] px-2.5 py-1.5 text-xs text-[#3E362E] outline-none focus:border-[#5D6D5E]"
                            aria-label="Task visibility"
                        >
                            <option value="private">Private</option>
                            <option value="friends">Friends</option>
                        </select>
                    </label>
                </div>

                {/* Optional Description Input */}
                {showDescription && (
                    <div className="pt-2 border-t border-[#EAE3DC]">
                        <textarea
                            id="task-description-input"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add optional notes or botanical details (up to 1,000 characters)..."
                            maxLength={1000}
                            rows={2}
                            className="w-full text-xs text-[#3E362E] placeholder:text-[#8C7E6F]/60 bg-[#FDFCF9] border border-[#D9CFC4] rounded-xl p-3 outline-none resize-none focus:bg-white focus:border-[#5D6D5E] transition-colors"
                        />
                    </div>
                )}

                {/* Toolbar: Priority selector & Add description toggle */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#F7F3F0]">
                    <div className="flex items-center gap-2.5">
                        <span className="text-[11px] uppercase tracking-wider font-bold text-[#A68A73] flex items-center gap-1">
                            <Flag className="w-3 h-3 text-[#A68A73]" />
                            Priority:
                        </span>
                        <div className="inline-flex rounded-xl bg-[#F7F3F0] p-1 border border-[#EAE3DC]">
                            {priorityOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setPriority(opt.value)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${priority === opt.value
                                            ? 'bg-white text-[#2C332D] shadow-xs border border-[#D9CFC4]/50'
                                            : 'text-[#8C7E6F] hover:text-[#2C332D]'
                                        }`}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full ${opt.dotColor}`} />
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowDescription(!showDescription)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8C7E6F] hover:text-[#2C332D] transition-colors py-1.5 px-3 rounded-xl hover:bg-[#F7F3F0]"
                    >
                        <AlignLeft className="w-3.5 h-3.5" />
                        <span>{showDescription ? 'Hide details' : 'Add details'}</span>
                    </button>
                </div>

                {validationError && (
                    <div className="text-xs text-[#A68A73] font-semibold pt-1">
                        {validationError}
                    </div>
                )}
            </div>
        </form>
    );
};
