import { streamText, UIMessage } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
        model: openai('gpt-4o-mini'),
        system: 'You are a Jannik.',
        messages,
    });

    return result.toDataStreamResponse();
}