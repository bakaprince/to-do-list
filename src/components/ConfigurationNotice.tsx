import React from 'react';

interface ConfigurationNoticeProps {
    message: string;
}

export const ConfigurationNotice: React.FC<ConfigurationNoticeProps> = ({ message }) => (
    <main className="min-h-screen bg-[#F7F3F0] px-6 py-16 text-[#3E362E]">
        <section className="mx-auto max-w-xl rounded-3xl border border-[#D9CFC4] bg-[#FDFCF9] p-8 shadow-sm">
            <h1 className="font-serif text-3xl italic text-[#2C332D]">Configuration needed</h1>
            <p className="mt-4 text-sm leading-relaxed text-[#8C7E6F]">{message}</p>
            <code className="mt-6 block rounded-xl bg-[#EAE3DC] p-4 text-xs text-[#3E362E]">
                VITE_FIREBASE_API_KEY=your-new-key
            </code>
        </section>
    </main>
);
