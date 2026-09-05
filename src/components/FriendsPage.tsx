import React, { useState } from 'react';
import { Bell, Check, Eye, Send, Trophy, UserMinus, Users, X } from 'lucide-react';
import { Challenge, Friend, FriendRequest, Reminder, Task } from '../types';

interface FriendsPageProps {
    username: string;
    friends: Friend[];
    requests: FriendRequest[];
    sharedTasks: Task[];
    reminders: Reminder[];
    challenges: Challenge[];
    loading: boolean;
    error: string | null;
    onSetUsername: (username: string) => Promise<void>;
    onSendRequest: (username: string) => Promise<void>;
    onRespondRequest: (request: FriendRequest, accept: boolean) => Promise<void>;
    onRemoveFriend: (uid: string) => Promise<void>;
    onRemind: (ownerId: string, taskId: string) => Promise<void>;
    onCreateChallenge: (friendId: string, title: string) => Promise<void>;
    onToggleChallenge: (challenge: Challenge) => Promise<void>;
}

export const FriendsPage: React.FC<FriendsPageProps> = ({
    username, friends, requests, sharedTasks, reminders, challenges, loading, error,
    onSetUsername, onSendRequest, onRespondRequest, onRemoveFriend, onRemind,
    onCreateChallenge, onToggleChallenge,
}) => {
    const [usernameInput, setUsernameInput] = useState(username);
    const [searchUsername, setSearchUsername] = useState('');
    const [challengeTitle, setChallengeTitle] = useState('');
    const [challengeFriend, setChallengeFriend] = useState('');
    const [message, setMessage] = useState<string | null>(null);

    const runAction = async (action: () => Promise<void>, success: string) => {
        try { await action(); setMessage(success); } catch (actionError) { setMessage(actionError instanceof Error ? actionError.message : 'Something went wrong.'); }
    };

    const saveUsername = async (event: React.FormEvent) => {
        event.preventDefault();
        await runAction(() => onSetUsername(usernameInput), 'Username saved.');
    };

    const sendRequest = async (event: React.FormEvent) => {
        event.preventDefault();
        await runAction(() => onSendRequest(searchUsername), 'Friend request sent.');
        setSearchUsername('');
    };

    const createChallenge = async (event: React.FormEvent) => {
        event.preventDefault();
        await runAction(() => onCreateChallenge(challengeFriend, challengeTitle), 'Challenge created.');
        setChallengeTitle('');
    };

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="border-b border-[#EAE3DC] pb-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A68A73]">Shared space</p>
                <h2 className="mt-2 text-3xl font-serif italic text-[#2C332D] sm:text-4xl">Friends</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#8C7E6F]">Find people by username, choose which tasks to share, and build challenges together.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <section className="rounded-[28px] border border-[#EAE3DC] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] sm:p-7">
                    <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F0F4F2] text-[#5D6D5E]"><Users className="h-5 w-5" /></div><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A68A73]">Your identity</p><h3 className="text-xl font-serif italic text-[#2C332D]">Choose a username</h3></div></div>
                    <p className="mt-5 text-xs leading-relaxed text-[#8C7E6F]">Your username is how friends find you. Use 3-20 lowercase letters, numbers, or underscores.</p>
                    <form onSubmit={saveUsername} className="mt-5 flex gap-2"><input value={usernameInput} onChange={(event) => setUsernameInput(event.target.value.toLowerCase())} disabled={Boolean(username)} placeholder="your_username" maxLength={20} className="min-w-0 flex-1 rounded-xl border border-[#D9CFC4] bg-[#FDFCF9] px-3 py-2.5 text-sm text-[#3E362E] outline-none focus:border-[#5D6D5E]" /><button type="submit" disabled={Boolean(username)} className="rounded-xl bg-[#5D6D5E] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">{username ? 'Saved' : 'Save'}</button></form>
                    <form onSubmit={sendRequest} className="mt-6 border-t border-[#EAE3DC] pt-5"><label htmlFor="friend-username-input" className="text-xs font-semibold text-[#3E362E]">Find a friend</label><div className="mt-2 flex gap-2"><input id="friend-username-input" value={searchUsername} onChange={(event) => setSearchUsername(event.target.value.toLowerCase())} placeholder="friend_username" maxLength={20} className="min-w-0 flex-1 rounded-xl border border-[#D9CFC4] bg-[#FDFCF9] px-3 py-2.5 text-sm text-[#3E362E] outline-none focus:border-[#5D6D5E]" /><button type="submit" disabled={!username} className="inline-flex items-center gap-1.5 rounded-xl bg-[#5D6D5E] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"><Send className="h-3.5 w-3.5" />Request</button></div></form>
                    {(message || error) && <p className="mt-3 text-xs font-semibold text-[#A68A73]">{message || error}</p>}
                </section>

                <section className="rounded-[28px] border border-[#EAE3DC] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] sm:p-7">
                    <div className="flex items-center gap-3"><Bell className="h-5 w-5 text-[#A68A73]" /><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A68A73]">Requests</p><h3 className="text-xl font-serif italic text-[#2C332D]">{requests.length} pending</h3></div></div>
                    {requests.length === 0 ? <p className="mt-8 rounded-2xl border border-dashed border-[#D9CFC4] p-6 text-center text-sm text-[#8C7E6F]">No pending friend requests.</p> : <div className="mt-6 space-y-3">{requests.map((request) => <div key={request.id} className="flex items-center gap-3 rounded-2xl border border-[#EAE3DC] bg-[#FDFCF9] p-3"><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#2C332D]">{request.fromDisplayName}</p><p className="truncate text-xs text-[#8C7E6F]">@{request.fromUsername}</p></div><button type="button" onClick={() => runAction(() => onRespondRequest(request, true), 'Friend request accepted.')} className="rounded-xl bg-[#5D6D5E] p-2 text-white" title="Accept"><Check className="h-4 w-4" /></button><button type="button" onClick={() => runAction(() => onRespondRequest(request, false), 'Friend request declined.')} className="rounded-xl border border-[#D9CFC4] p-2 text-[#8C7E6F]" title="Decline"><X className="h-4 w-4" /></button></div>)}</div>}
                </section>
            </div>

            <section className="rounded-[28px] border border-[#EAE3DC] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] sm:p-7"><div className="flex items-center gap-3"><Users className="h-5 w-5 text-[#5D6D5E]" /><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A68A73]">Your circle</p><h3 className="text-xl font-serif italic text-[#2C332D]">{friends.length} friend{friends.length === 1 ? '' : 's'}</h3></div></div>{loading ? <p className="mt-6 text-sm text-[#8C7E6F]">Loading your circle...</p> : <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">{friends.map((friend) => <div key={friend.uid} className="flex items-center gap-3 rounded-2xl border border-[#EAE3DC] bg-[#FDFCF9] p-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#A68A73] text-xs font-bold text-white">{friend.displayName.charAt(0).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#2C332D]">{friend.displayName}</p><p className="truncate text-xs text-[#8C7E6F]">@{friend.username || 'friend'}</p></div><button type="button" onClick={() => onRemoveFriend(friend.uid)} className="rounded-xl p-2 text-[#8C7E6F] hover:text-[#A68A73]" title="Remove friend"><UserMinus className="h-4 w-4" /></button></div>)}</div>}</section>

            <section className="rounded-[28px] border border-[#D9CFC4] bg-[#F0F4F2] p-6 sm:p-7"><div className="flex items-start gap-3"><Eye className="mt-0.5 h-5 w-5 text-[#5D6D5E]" /><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A68A73]">Shared with you</p><h3 className="mt-1 text-2xl font-serif italic text-[#2C332D]">Friend tasks</h3></div></div>{sharedTasks.length === 0 ? <p className="mt-5 text-sm text-[#8C7E6F]">No shared tasks yet.</p> : <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">{sharedTasks.map((task) => <article key={`${task.userId}-${task.id}`} className="rounded-2xl border border-[#D9CFC4] bg-white p-4"><div className="flex items-start gap-3"><div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#5D6D5E]" /><div className="min-w-0 flex-1"><h4 className={`text-sm font-semibold text-[#2C332D] ${task.completed ? 'line-through opacity-60' : ''}`}>{task.title}</h4>{task.description && <p className="mt-1 text-xs text-[#8C7E6F]">{task.description}</p>}</div><button type="button" onClick={() => runAction(() => onRemind(task.userId, task.id), 'Reminder sent.')} className="rounded-xl p-2 text-[#8C7E6F] hover:text-[#A68A73]" title="Remind your friend"><Bell className="h-4 w-4" /></button></div></article>)}</div>}</section>

            <section className="rounded-[28px] border border-[#EAE3DC] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] sm:p-7"><div className="flex items-start gap-3"><Trophy className="mt-0.5 h-5 w-5 text-[#A68A73]" /><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A68A73]">Together</p><h3 className="mt-1 text-2xl font-serif italic text-[#2C332D]">Collaborative challenges</h3></div></div><form onSubmit={createChallenge} className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]"><input value={challengeTitle} onChange={(event) => setChallengeTitle(event.target.value)} placeholder="Challenge title" maxLength={200} className="rounded-xl border border-[#D9CFC4] bg-[#FDFCF9] px-3 py-2.5 text-sm text-[#3E362E] outline-none focus:border-[#5D6D5E]" /><select value={challengeFriend} onChange={(event) => setChallengeFriend(event.target.value)} className="rounded-xl border border-[#D9CFC4] bg-[#FDFCF9] px-3 py-2.5 text-sm text-[#3E362E]"><option value="">Choose a friend</option>{friends.map((friend) => <option key={friend.uid} value={friend.uid}>{friend.displayName}</option>)}</select><button type="submit" className="rounded-xl bg-[#A68A73] px-4 py-2.5 text-xs font-semibold text-white">Start challenge</button></form>{challenges.length > 0 && <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">{challenges.map((challenge) => <article key={challenge.id} className="rounded-2xl border border-[#EAE3DC] bg-[#FDFCF9] p-4"><h4 className="text-sm font-semibold text-[#2C332D]">{challenge.title}</h4><div className="mt-3 flex items-center justify-between gap-3"><span className="text-xs text-[#8C7E6F]">{Object.values(challenge.completedBy).filter(Boolean).length}/2 completed</span><button type="button" onClick={() => onToggleChallenge(challenge)} className="rounded-xl bg-[#5D6D5E] px-3 py-1.5 text-xs font-semibold text-white">Mark mine done</button></div></article>)}</div>}</section>

            <section className="rounded-[28px] border border-[#D9CFC4] bg-[#FAF5F2] p-6 sm:p-7"><div className="flex items-start gap-3"><Bell className="mt-0.5 h-5 w-5 text-[#A68A73]" /><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A68A73]">Nudges</p><h3 className="mt-1 text-2xl font-serif italic text-[#2C332D]">Reminders for you</h3></div></div>{reminders.length === 0 ? <p className="mt-5 text-sm text-[#8C7E6F]">No reminders right now.</p> : <div className="mt-5 space-y-2">{reminders.map((reminder) => <p key={reminder.id} className="rounded-xl border border-[#D9CFC4] bg-white p-3 text-sm text-[#3E362E]"><strong>{reminder.senderName}</strong> reminded you about a shared task.</p>)}</div>}</section>
        </div>
    );
};
