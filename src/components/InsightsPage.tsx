import React from 'react';
import { BarChart3, CheckCircle2, Circle, Flag, ListTodo, Target } from 'lucide-react';
import { Task, Priority } from '../types';
import { calculateCompletionStreak } from '../lib/streak';

interface InsightsPageProps {
    tasks: Task[];
}

const priorityLabels: Record<Priority, string> = {
    high: 'High priority',
    medium: 'Medium priority',
    low: 'Low priority',
};

export const InsightsPage: React.FC<InsightsPageProps> = ({ tasks }) => {
    const completed = tasks.filter((task) => task.completed).length;
    const active = tasks.length - completed;
    const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
    const priorities = (['high', 'medium', 'low'] as Priority[]).map((priority) => ({
        priority,
        count: tasks.filter((task) => (task.priority || 'medium') === priority).length,
    }));
    const latestCompleted = tasks
        .filter((task) => task.completed)
        .sort((first, second) => second.createdAt.localeCompare(first.createdAt))[0];
    const streak = calculateCompletionStreak(tasks);

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="border-b border-[#EAE3DC] pb-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A68A73]">Personal overview</p>
                <h2 className="mt-2 text-3xl font-serif italic text-[#2C332D] sm:text-4xl">Your progress, at a glance</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#8C7E6F]">
                    A quiet snapshot of what you have finished, what still needs attention, and where your focus is going.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard icon={<ListTodo className="h-4 w-4" />} label="Total tasks" value={tasks.length} detail="Across your garden" />
                <MetricCard icon={<Circle className="h-4 w-4" />} label="In progress" value={active} detail="Ready for attention" />
                <MetricCard icon={<CheckCircle2 className="h-4 w-4" />} label="Completed" value={`${completionRate}%`} detail={`${completed} task${completed === 1 ? '' : 's'} finished`} />
                <MetricCard icon={<BarChart3 className="h-4 w-4" />} label="Streak" value={`${streak} day${streak === 1 ? '' : 's'}`} detail="Consecutive completion days" />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <section className="rounded-[28px] border border-[#EAE3DC] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A68A73]">Momentum</p>
                            <h3 className="mt-2 text-2xl font-serif italic text-[#2C332D]">Completion rhythm</h3>
                        </div>
                        <Target className="h-5 w-5 text-[#5D6D5E]" />
                    </div>
                    <div className="mt-8 flex items-end gap-3">
                        <span className="text-6xl font-serif italic text-[#5D6D5E]">{completionRate}%</span>
                        <span className="mb-2 text-xs text-[#8C7E6F]">of your current list is complete</span>
                    </div>
                    <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#EAE3DC]">
                        <div className="h-full rounded-full bg-[#5D6D5E] transition-all duration-500" style={{ width: `${completionRate}%` }} />
                    </div>
                    <p className="mt-4 text-xs leading-relaxed text-[#8C7E6F]">
                        {tasks.length === 0 ? 'Add your first task to start tracking your rhythm.' : active === 0 ? 'Everything on your list is complete. Nice work.' : `${active} task${active === 1 ? '' : 's'} remain${active === 1 ? 's' : ''} in your active list.`}
                    </p>
                </section>

                <section className="rounded-[28px] border border-[#EAE3DC] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A68A73]">Distribution</p>
                            <h3 className="mt-2 text-2xl font-serif italic text-[#2C332D]">Priority balance</h3>
                        </div>
                        <Flag className="h-5 w-5 text-[#A68A73]" />
                    </div>
                    <div className="mt-7 space-y-5">
                        {priorities.map(({ priority, count }) => {
                            const percentage = tasks.length ? Math.round((count / tasks.length) * 100) : 0;
                            return (
                                <div key={priority}>
                                    <div className="mb-2 flex items-center justify-between text-xs">
                                        <span className="font-semibold text-[#3E362E]">{priorityLabels[priority]}</span>
                                        <span className="text-[#8C7E6F]">{count}</span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-[#EAE3DC]">
                                        <div className={`h-full rounded-full ${priority === 'high' ? 'bg-[#A68A73]' : priority === 'medium' ? 'bg-[#8C7E6F]' : 'bg-[#5D6D5E]'}`} style={{ width: `${percentage}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>

            <section className="rounded-[28px] border border-[#D9CFC4] bg-[#F0F4F2] p-6 sm:p-7">
                <div className="flex items-start gap-3">
                    <BarChart3 className="mt-0.5 h-5 w-5 shrink-0 text-[#5D6D5E]" />
                    <div>
                        <h3 className="text-lg font-serif italic text-[#2C332D]">A small reflection</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-[#3E362E]">
                            {latestCompleted ? `Your latest completed task was “${latestCompleted.title}”. Keep the next step small and concrete.` : 'Choose one task to finish next. Small completed steps create the clearest momentum.'}
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

function MetricCard({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string | number; detail: string }) {
    return (
        <section className="rounded-[24px] border border-[#EAE3DC] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-2 text-[#5D6D5E]">{icon}<span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A68A73]">{label}</span></div>
            <div className="mt-4 text-3xl font-serif italic text-[#2C332D]">{value}</div>
            <p className="mt-1 text-xs text-[#8C7E6F]">{detail}</p>
        </section>
    );
}
