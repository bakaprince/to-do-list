import React from 'react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <main className="min-h-screen bg-[#F7F3F0] px-6 py-16 text-[#3E362E]">
                    <section className="mx-auto max-w-xl rounded-3xl border border-[#D9CFC4] bg-[#FDFCF9] p-8 shadow-sm">
                        <h1 className="font-serif text-3xl italic text-[#2C332D]">Something went wrong</h1>
                        <p className="mt-4 text-sm leading-relaxed text-[#8C7E6F]">
                            The app could not render this page. Refresh the browser and check the browser console for details.
                        </p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-6 rounded-xl bg-[#5D6D5E] px-4 py-2 text-sm font-semibold text-white"
                        >
                            Reload app
                        </button>
                    </section>
                </main>
            );
        }

        return this.props.children;
    }
}
