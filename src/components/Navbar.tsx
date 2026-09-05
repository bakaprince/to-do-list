import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Check, LogIn, LogOut, Cloud, ShieldCheck, Leaf } from 'lucide-react';

export const Navbar: React.FC = () => {
    const { user, error, signInWithGoogle, signOutUser, deleteAccount, loading } = useAuth();

    const handleDeleteAccount = async () => {
        if (!window.confirm('Delete your account and all of your tasks permanently?')) return;
        await deleteAccount();
    };

    return (
        <header className="border-b border-[#D9CFC4] bg-[#FDFCF9]/90 backdrop-blur-md sticky top-0 z-30 shadow-[0_2px_12px_rgba(62,54,46,0.04)]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
                {/* Brand identity */}
                <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 bg-[#5D6D5E] rounded-2xl flex items-center justify-center text-white font-serif font-bold text-lg shadow-inner">
                        <Leaf className="w-5 h-5 text-[#FAF5F2]" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="font-serif italic text-xl sm:text-2xl text-[#2C332D] tracking-tight">
                                Rooted
                            </h1>
                            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F0F4F2] text-[#5D6D5E] border border-[#D9CFC4]/50">
                                <Cloud className="w-3 h-3 text-[#5D6D5E]" />
                                Personal Cloud
                            </span>
                        </div>
                        <p className="text-xs text-[#8C7E6F] font-medium hidden sm:block">Per-user isolated natural rhythms</p>
                    </div>
                </div>

                {/* Auth / User controls */}
                <div className="flex items-center gap-3">
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
                                className="text-[11px] font-semibold text-[#A68A73] hover:text-[#8C5F46] transition-colors"
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
