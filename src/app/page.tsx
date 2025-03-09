'use client';

import { useChat } from '@ai-sdk/react';
import { MemoizedMarkdown } from '@/app/components/memoized-markdown';

export default function Page() {
    const { messages, input, setInput, append } = useChat();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Append the user message
        append({ content: input, role: 'user' });

        // Send the message to the backend to get a response
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages: [...messages, { content: input, role: 'user' }] }),
        });

        const aiMessage = await response.text();
        append({ content: aiMessage, role: 'assistant' });
    };

    return (
        <div className="bg-black min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-white shadow-2xl rounded-lg p-6 flex flex-col h-full">
                <img src="/jannik.png" alt="Jannik" className="mb-4 mx-auto w-24 h-24 rounded-full" />
                <h1 className="text-3xl font-extrabold mb-4 text-center text-black">Ask Jannik</h1>

                <div className="flex-1 border p-4 overflow-y-auto bg-gray-100 rounded-lg shadow-inner">
                    {messages.map((message, index) => (
                        <div key={index} className={`mb-4 p-2 rounded-lg ${message.role === 'user' ? 'user-message' : 'ai-message'}`}>
                            <b className="block font-semibold">{message.role === 'user' ? 'You' : 'Jannik'}</b>
                            <div>
                                <MemoizedMarkdown content={message.content} id={`message-${index}`} />
                            </div>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="flex mt-4">
                    <input
                        type="text"
                        value={input}
                        onChange={event => setInput(event.target.value)}
                        onKeyDown={async event => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                append({ content: input, role: 'user' });
                                setInput('');
                            }
                        }}
                        className="flex-1 border p-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-black"
                        placeholder="Ask something..."
                    />
                    <button
                        type="submit"
                        className="ml-2 p-2 bg-gray-700 text-white rounded-r-lg hover:bg-gray-800 transition-colors"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}