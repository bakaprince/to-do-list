import React, { useState } from 'react';
import { Bell, Check, Copy, Eye, Link2, Trophy, UserMinus, Users } from 'lucide-react';
import { Challenge, Friend, Reminder, Task } from '../types';

interface FriendsPageProps {
    friendCode: string;
    friends: Friend[];
    sharedTasks: Task[];
    loading: boolean;
    error: string | null;
    onAddFriend: (code: string) => Promise<void>;
    onRemoveFriend: (uid: string) => Promise<void>;
    reminders: Reminder[];
    challenges: Challenge[];
    onRemind: (ownerId: string, taskId: string) => Promise<void>;
    onCreateChallenge: (friendId: string, title: string) => Promise<void>;
    onToggleChallenge: (challenge: Challenge) => Promise<void>;
}

export const FriendsPage: React.FC<FriendsPageProps> = ({
    friendCode,
    friends,
    sharedTasks,
    loading,
    error,
    onAddFriend,
    onRemoveFriend,
    reminders,
    challenges,
    onRemind,
    onCreateChallenge,
    onToggleChallenge,
}) => {
    const [code, setCode] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [challengeTitle, setChallengeTitle] = useState('');
    const [challengeFriend, setChallengeFriend] = useState('');
    const [actionMessage, setActionMessage] = useState<string | null>(null);

    const copyCode = async () => {
        await navigator.clipboard.writeText(friendCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    const handleAddFriend = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage(null);
        try {
            await onAddFriend(code);
            setCode('');
            setMessage('Friend added. Shared tasks will appear below.');
        } catch (addError) {
            setMessage(addError instanceof Error ? addError.message : 'Could not add friend.');
        }
    };

    const handleChallenge = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await onCreateChallenge(challengeFriend, challengeTitle);
            setChallengeTitle('');
            setActionMessage('Challenge created for both of you.');
        } catch (challengeError) {
            setActionMessage(challengeError instanceof Error ? challengeError.message : 'Could not create challenge.');
        }
    };

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="border-b border-[#EAE3DC] pb-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A68A73]">Shared space</p>
                <h2 className="mt-2 text-3xl font-serif italic text-[#2C332D] sm:text-4xl">Friends</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#8C7E6F]">
                    Connect with a code, then choose which individual tasks your friends can see. Private tasks always stay private.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <section className="rounded-[28px] border border-[#EAE3DC] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] sm:p-7">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F0F4F2] text-[#5D6D5E]"><Link2 className="h-5 w-5" /></div>
                        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A68A73]">Your code</p><h3 className="text-xl font-serif italic text-[#2C332D]">Invite a friend</h3></div>
                    </div>
                    <p className="mt-5 text-xs leading-relaxed text-[#8C7E6F]">Share this code with someone you trust. They can enter it to create a mutual connection.</p>
                    <div className="mt-5 flex items-center gap-2 rounded-2xl border border-[#D9CFC4] bg-[#F7F3F0] p-2 pl-4">
                        <strong className="flex-1 font-mono text-lg tracking-[0.18em] text-[#2C332D]">{friendCode || '--------'}</strong>
                        <button type="button" onClick={copyCode} disabled={!friendCode} className="inline-flex items-center gap-1.5 rounded-xl bg-[#5D6D5E] px-3 py-2 text-xs font-semibold text-white disabled:opacity-40" title="Copy friend code">
                            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                    <form onSubmit={handleAddFriend} className="mt-6 border-t border-[#EAE3DC] pt-5">
                        <label className="text-xs font-semibold text-[#3E362E]" htmlFor="friend-code-input">Enter a friend code</label>
                        <div className="mt-2 flex gap-2">
                            <input id="friend-code-input" value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} maxLength={8} placeholder="AB12CD34" className="min-w-0 flex-1 rounded-xl border border-[#D9CFC4] bg-[#FDFCF9] px-3 py-2.5 text-sm tracking-wider text-[#3E362E] outline-none focus:border-[#5D6D5E]" />
                            <button type="submit" className="rounded-xl bg-[#5D6D5E] px-4 py-2 text-xs font-semibold text-white">Connect</button>
                        </div>
                    </form>
                    {(message || error) && <p className="mt-3 text-xs font-semibold text-[#A68A73]">{message || error}</p>}
                </section>

                <section className="rounded-[28px] border border-[#EAE3DC] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] sm:p-7">
                    <div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><Users className="h-5 w-5 text-[#5D6D5E]" /><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A68A73]">Your circle</p><h3 className="text-xl font-serif italic text-[#2C332D]">{friends.length} friend{friends.length === 1 ? '' : 's'}</h3></div></div></div>
                    {loading ? <p className="mt-8 text-sm text-[#8C7E6F]">Loading your circle...</p> : friends.length === 0 ? <p className="mt-8 rounded-2xl border border-dashed border-[#D9CFC4] p-6 text-center text-sm text-[#8C7E6F]">Your circle is empty. Share your code to begin.</p> : <div className="mt-6 space-y-3">{friends.map((friend) => <div key={friend.uid} className="flex items-center gap-3 rounded-2xl border border-[#EAE3DC] bg-[#FDFCF9] p-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#A68A73] text-xs font-bold text-white">{friend.displayName.charAt(0).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#2C332D]">{friend.displayName}</p><p className="truncate text-xs text-[#8C7E6F]">{friend.email}</p></div><button type="button" onClick={() => onRemoveFriend(friend.uid)} className="rounded-xl p-2 text-[#8C7E6F] hover:bg-[#FAF5F2] hover:text-[#A68A73]" title={`Remove ${friend.displayName}`}><UserMinus className="h-4 w-4" /></button></div>)}</div>}
                </section>
            </div>

            <section className="rounded-[28px] border border-[#D9CFC4] bg-[#F0F4F2] p-6 sm:p-7">
                <div className="flex items-start gap-3"><Eye className="mt-0.5 h-5 w-5 shrink-0 text-[#5D6D5E]" /><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A68A73]">Shared with you</p><h3 className="mt-1 text-2xl font-serif italic text-[#2C332D]">Friend tasks</h3></div></div>
                {sharedTasks.length === 0 ? <p className="mt-5 text-sm text-[#8C7E6F]">No friends have shared tasks yet. When they choose “Friends” on a task, it will appear here.</p> : <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">{sharedTasks.map((task) => <article key={`${task.userId}-${task.id}`} className="rounded-2xl border border-[#D9CFC4] bg-white p-4"><div className="flex items-start gap-3"><div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#5D6D5E]" /><div className="min-w-0 flex-1"><h4 className={`text-sm font-semibold text-[#2C332D] ${task.completed ? 'line-through opacity-60' : ''}`}>{task.title}</h4>{task.description && <p className="mt-1 text-xs text-[#8C7E6F]">{task.description}</p>}<p className="mt-3 text-[11px] text-[#8C7E6F]">{task.priority || 'medium'} priority</p></div><button type="button" onClick={async () => { await onRemind(task.userId, task.id); setActionMessage('Reminder sent.'); }} className="rounded-xl p-2 text-[#8C7E6F] hover:bg-[#FAF5F2] hover:text-[#A68A73]" title="Remind your friend"><Bell className="h-4 w-4" /></button></div></article>)}</div>}
            </section>

            <section className="rounded-[28px] border border-[#EAE3DC] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] sm:p-7">
                <div className="flex items-start gap-3"><Trophy className="mt-0.5 h-5 w-5 text-[#A68A73]" /><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A68A73]">Together</p><h3 className="mt-1 text-2xl font-serif italic text-[#2C332D]">Collaborative challenges</h3></div></div>
                <form onSubmit={handleChallenge} className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
                    <input value={challengeTitle} onChange={(event) => setChallengeTitle(event.target.value)} placeholder="Challenge title" maxLength={200} className="rounded-xl border border-[#D9CFC4] bg-[#FDFCF9] px-3 py-2.5 text-sm text-[#3E362E] outline-none focus:border-[#5D6D5E]" />
                    <select value={challengeFriend} onChange={(event) => setChallengeFriend(event.target.value)} className="rounded-xl border border-[#D9CFC4] bg-[#FDFCF9] px-3 py-2.5 text-sm text-[#3E362E] outline-none focus:border-[#5D6D5E]"><option value="">Choose a friend</option>{friends.map((friend) => <option key={friend.uid} value={friend.uid}>{friend.displayName}</option>)}</select>
                    <button type="submit" className="rounded-xl bg-[#A68A73] px-4 py-2.5 text-xs font-semibold text-white">Start challenge</button>
                </form>
                {challenges.length === 0 ? <p className="mt-5 text-sm text-[#8C7E6F]">Create one shared goal and both of you can mark your own progress.</p> : <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">{challenges.map((challenge) => <article key={challenge.id} className="rounded-2xl border border-[#EAE3DC] bg-[#FDFCF9] p-4"><h4 className="text-sm font-semibold text-[#2C332D]">{challenge.title}</h4><div className="mt-3 flex items-center justify-between gap-3"><span className="text-xs text-[#8C7E6F]">{Object.values(challenge.completedBy).filter(Boolean).length}/{challenge.participantIds.length} completed</span><button type="button" onClick={() => onToggleChallenge(challenge)} className="rounded-xl bg-[#5D6D5E] px-3 py-1.5 text-xs font-semibold text-white">{challenge.completedBy[challenge.participantIds[0]] && challenge.completedBy[challenge.participantIds[1]] ? 'Complete' : 'Mark mine done'}</button></div></article>)}</div>}
                {actionMessage && <p className="mt-3 text-xs font-semibold text-[#5D6D5E]">{actionMessage}</p>}
            </section>

            <section className="rounded-[28px] border border-[#D9CFC4] bg-[#FAF5F2] p-6 sm:p-7">
                <div className="flex items-start gap-3"><Bell className="mt-0.5 h-5 w-5 text-[#A68A73]" /><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A68A73]">Nudges</p><h3 className="mt-1 text-2xl font-serif italic text-[#2C332D]">Reminders for you</h3></div></div>
                {reminders.length === 0 ? <p className="mt-5 text-sm text-[#8C7E6F]">No reminders right now.</p> : <div className="mt-5 space-y-2">{reminders.map((reminder) => <p key={reminder.id} className="rounded-xl border border-[#D9CFC4] bg-white p-3 text-sm text-[#3E362E]"><strong>{reminder.senderName}</strong> reminded you about a shared task.</p>)}</div>}
            </section>
        </div>
    );
};
