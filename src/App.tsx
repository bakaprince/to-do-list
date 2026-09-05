import React, { useState, useMemo, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useTasks } from './hooks/useTasks';
import { Navbar } from './components/Navbar';
import { AuthGate } from './components/AuthGate';
import { TaskInput } from './components/TaskInput';
import { TaskStats } from './components/TaskStats';
import { TaskList } from './components/TaskList';
import { ConfigurationNotice } from './components/ConfigurationNotice';
import { Priority, TaskFilter, PriorityFilter } from './types';
import { firebaseConfigError, testConnection } from './lib/firebase';
import { filterTasks } from './lib/taskFilters';
import { AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

function Dashboard() {
    const { user } = useAuth();
    const {
        tasks,
        loading,
        error: syncError,
        addTask,
        toggleTask,
        deleteTask,
        updateTask,
    } = useTasks();

    const [activeFilter, setActiveFilter] = useState<TaskFilter>('all');
    const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

    // Test Firestore connection on initial boot as mandated by Firebase skill
    useEffect(() => {
        testConnection();
    }, []);

    const filteredTasks = useMemo(() => {
        return filterTasks(tasks, activeFilter, priorityFilter, searchQuery);
    }, [tasks, activeFilter, priorityFilter, searchQuery]);

    const handleAddTask = async (title: string, priority: Priority, description?: string) => {
        await addTask(title, priority, description);
        setFeedbackMessage('Task created and saved to cloud.');
        setTimeout(() => setFeedbackMessage(null), 3000);
    };

    const handleResetFilters = () => {
        setActiveFilter('all');
        setPriorityFilter('all');
        setSearchQuery('');
    };

    const hasFilterActive =
        activeFilter !== 'all' || priorityFilter !== 'all' || searchQuery.trim() !== '';

    return (
        <div className="min-h-screen bg-[#F7F3F0] text-[#3E362E] flex flex-col font-sans antialiased selection:bg-[#5D6D5E]/20 selection:text-[#2C332D]">
            <Navbar />

            <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
                {!user ? (
                    <AuthGate />
                ) : (
                    <div className="space-y-6 sm:space-y-8">
                        {/* Daily Rhythms Header & Feedback */}
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#EAE3DC]">
                            <div>
                                <h2 className="text-3xl sm:text-4xl font-serif italic text-[#2C332D] leading-tight">
                                    Daily Rhythms
                                </h2>
                                <p className="text-sm text-[#8C7E6F] mt-1.5 font-medium flex items-center gap-2">
                                    <span>
                                        You have{' '}
                                        <span className="text-[#5D6D5E] font-bold">
                                            {tasks.filter((t) => !t.completed).length} tasks
                                        </span>{' '}
                                        to nourish today
                                    </span>
                                    <span className="text-[#D9CFC4]">•</span>
                                    <span className="inline-flex items-center gap-1 text-xs text-[#5D6D5E]">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        Isolated Garden
                                    </span>
                                </p>
                            </div>

                            {feedbackMessage && (
                                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#5D6D5E] bg-[#F0F4F2] border border-[#5D6D5E]/30 px-3.5 py-1.5 rounded-full shadow-xs">
                                    <CheckCircle2 className="w-4 h-4 text-[#5D6D5E]" />
                                    {feedbackMessage}
                                </div>
                            )}
                        </div>

                        {/* Error alerts */}
                        {syncError && (
                            <div className="p-4 rounded-2xl bg-[#FAF5F2] border border-[#A68A73]/30 text-xs text-[#8C7E6F] flex items-start gap-2.5">
                                <AlertCircle className="w-4 h-4 text-[#A68A73] shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold text-[#3E362E]">Synchronization Notice: </span>
                                    {syncError}
                                </div>
                            </div>
                        )}

                        {/* Input Component */}
                        <TaskInput onAddTask={handleAddTask} />

                        {/* Stats & Filter Toolbar */}
                        {tasks.length > 0 && (
                            <TaskStats
                                tasks={tasks}
                                activeFilter={activeFilter}
                                onFilterChange={setActiveFilter}
                                priorityFilter={priorityFilter}
                                onPriorityFilterChange={setPriorityFilter}
                                searchQuery={searchQuery}
                                onSearchChange={setSearchQuery}
                            />
                        )}

                        {/* Task Items List */}
                        <TaskList
                            tasks={filteredTasks}
                            loading={loading}
                            onToggle={toggleTask}
                            onDelete={deleteTask}
                            onUpdate={updateTask}
                            hasFilterActive={hasFilterActive}
                            onResetFilters={handleResetFilters}
                        />

                        {/* Garden Policy Security Card Banner */}
                        <div className="bg-[#5D6D5E] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 overflow-hidden relative shadow-lg shadow-[#5D6D5E]/15 mt-10">
                            <div className="relative z-10 max-w-lg">
                                <h4 className="text-xl font-serif italic tracking-wide">Secure Garden Policy</h4>
                                <p className="text-xs sm:text-sm text-white/85 mt-1.5 leading-relaxed font-light">
                                    Your tasks are strictly protected by Firebase Firestore Security Rules. Only your authenticated Google account can view, modify, or harvest your personal items.
                                </p>
                            </div>
                            <div className="w-36 h-36 bg-white/10 rounded-full absolute -right-10 -bottom-10 blur-2xl pointer-events-none" />
                            <div className="w-24 h-24 bg-[#A68A73]/30 rounded-full absolute right-14 top-2 blur-xl pointer-events-none" />
                            <div className="text-3xl sm:text-4xl opacity-40 font-serif italic font-light relative z-10 hidden sm:block select-none">
                                Private
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-[#D9CFC4] bg-[#EAE3DC]/40 py-6 text-center text-xs text-[#8C7E6F]">
                <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <span className="font-serif italic text-sm text-[#2C332D]">Rooted • Collaborative To-Do</span>
                    <span className="text-[#8C7E6F]">Strict User Isolation & Realtime Firestore Cloud</span>
                </div>
            </footer>
        </div>
    );
}

export default function App() {
    if (firebaseConfigError) {
        return <ConfigurationNotice message={firebaseConfigError} />;
    }

    return (
        <AuthProvider>
            <Dashboard />
        </AuthProvider>
    );
}
