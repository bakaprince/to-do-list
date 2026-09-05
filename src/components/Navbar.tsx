import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Check, LogIn, LogOut, Cloud, ShieldCheck, Leaf, Moon, Sun, LayoutDashboard, BarChart3, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export type AppView = 'tasks' | 'insights' | 'friends';

interface NavbarProps {
    activeView: AppView;
    onViewChange: (view: AppView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeView, onViewChange }) => {
    const { user, error, signInWithGoogle, signOutUser, deleteAccount, loading } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const handleDeleteAccount = async () => {
        if (!window.confirm('Delete your account and all of your tasks permanently?')) return;
        await deleteAccount();
    };

    return (
        <header className="border-b border-[#D9CFC4] bg-[#FDFCF9]/90 backdrop-blur-md sticky top-0 z-30 shadow-[0_2px_12px_rgba(62,54,46,0.04)]">
            <div className="w-full max-w-full md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-3 px-4 py-3 sm:h-18 sm:flex-nowrap sm:gap-y-0 sm:px-6 sm:py-0 lg:px-8">
                {/* Brand identity */}
                <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3.5">
                    <div className="h-9 w-9 shrink-0 rounded-2xl bg-[#5D6D5E] flex items-center justify-center text-white font-serif font-bold text-lg shadow-inner sm:h-10 sm:w-10">
                        <Leaf className="w-5 h-5 text-[#FAF5F2]" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="whitespace-nowrap font-serif italic text-lg text-[#2C332D] tracking-tight sm:text-2xl">
                                Baka To-do List
                            </h1>
                            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F0F4F2] text-[#5D6D5E] border border-[#D9CFC4]/50">
                                <Cloud className="w-3 h-3 text-[#5D6D5E]" />
                                Personal Cloud
                            </span>
                        </div>
                        <p className="text-xs text-[#8C7E6F] font-medium hidden sm:block">Simple tasks, organized your way</p>
                    </div>
                </div>

                {user && (
                    <nav className="hidden items-center gap-1 rounded-2xl border border-[#D9CFC4] bg-[#F7F3F0] p-1 md:flex" aria-label="Main navigation">
                        <button
                            type="button"
                            onClick={() => onViewChange('tasks')}
                            className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${activeView === 'tasks' ? 'bg-white text-[#2C332D] shadow-sm' : 'text-[#8C7E6F] hover:text-[#2C332D]'}`}
                        >
                            <LayoutDashboard className="h-3.5 w-3.5" />
                            Tasks
                        </button>
                        <button
                            type="button"
                            onClick={() => onViewChange('insights')}
                            className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${activeView === 'insights' ? 'bg-white text-[#2C332D] shadow-sm' : 'text-[#8C7E6F] hover:text-[#2C332D]'}`}
                        >
                            <BarChart3 className="h-3.5 w-3.5" />
                            Insights
                        </button>
                        <button
                            type="button"
                            onClick={() => onViewChange('friends')}
                            className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${activeView === 'friends' ? 'bg-white text-[#2C332D] shadow-sm' : 'text-[#8C7E6F] hover:text-[#2C332D]'}`}
                        >
                            <Users className="h-3.5 w-3.5" />
                            Friends
                        </button>
                    </nav>
                )}

                {user && (
                    <nav className="order-3 flex basis-full items-center justify-center gap-1 border-t border-[#EAE3DC] pt-2 md:hidden" aria-label="Mobile navigation">
                        <button
                            type="button"
                            onClick={() => onViewChange('tasks')}
                            className={`rounded-xl p-2 ${activeView === 'tasks' ? 'bg-[#F0F4F2] text-[#5D6D5E]' : 'text-[#8C7E6F]'}`}
                            aria-label="Tasks"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => onViewChange('insights')}
                            className={`rounded-xl p-2 ${activeView === 'insights' ? 'bg-[#F0F4F2] text-[#5D6D5E]' : 'text-[#8C7E6F]'}`}
                            aria-label="Insights"
                        >
                            <BarChart3 className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => onViewChange('friends')}
                            className={`rounded-xl p-2 ${activeView === 'friends' ? 'bg-[#F0F4F2] text-[#5D6D5E]' : 'text-[#8C7E6F]'}`}
                            aria-label="Friends"
                        >
                            <Users className="h-4 w-4" />
                        </button>
                    </nav>
                )}

                {/* Auth / User controls */}
                <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="theme-toggle inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#D9CFC4] bg-[#FDFCF9] text-[#5D6D5E] transition-colors hover:bg-[#F0F4F2]"
                        aria-label={theme === 'light' ? 'Switch to night mode' : 'Switch to light mode'}
                        title={theme === 'light' ? 'Switch to night mode' : 'Switch to light mode'}
                    >
                        {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    </button>
                    {error && user && (
                        <span className="max-w-56 text-right text-[11px] text-[#A68A73]" role="alert">
                            {error}
                        </span>
                    )}
                    {loading ? (
                        <div className="h-9 w-28 bg-[#EAE3DC] animate-pulse rounded-2xl" />
                    ) : user ? (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2.5 text-right">
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt={user.displayName || 'User Avatar'}
                                        referrerPolicy="no-referrer"
                                        className="w-9 h-9 rounded-full border-2 border-white shadow-xs object-cover"
                                    />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-[#A68A73] text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-xs">
                                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                )}
                                <div className="hidden md:block leading-tight text-left">
                                    <div className="text-xs font-bold text-[#2C332D] truncate max-w-[140px]">
                                        {user.displayName || 'User'}
                                    </div>
                                    <div className="text-[11px] text-[#8C7E6F] truncate max-w-[140px]">
                                        {user.email}
                                    </div>
                                </div>
                            </div>

                            <button
                                id="sign-out-button"
                                onClick={signOutUser}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-[#8C7E6F] hover:text-[#2C332D] bg-[#EAE3DC]/60 hover:bg-[#EAE3DC] border border-[#D9CFC4] rounded-xl transition-colors"
                                title="Sign out of your account"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Sign Out</span>
                            </button>
                            <button
                                id="delete-account-button"
                                onClick={handleDeleteAccount}
                                className="hidden text-[11px] font-semibold text-[#A68A73] hover:text-[#8C5F46] transition-colors sm:inline"
                                title="Permanently delete your account and tasks"
                            >
                                Delete account
                            </button>
                        </div>
                    ) : (
                        <button
                            id="google-signin-nav-button"
                            onClick={signInWithGoogle}
                            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#5D6D5E] hover:bg-[#4E5C4F] rounded-2xl shadow-md shadow-[#5D6D5E]/20 transition-all"
                        >
                            <LogIn className="w-3.5 h-3.5 text-[#FAF5F2]" />
                            <span>Google Sign-In</span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};
