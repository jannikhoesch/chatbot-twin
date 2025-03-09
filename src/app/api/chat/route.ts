import { streamText, UIMessage } from 'ai';
import { openai } from '@ai-sdk/openai';
import { readFileSync } from 'fs';
import { join } from 'path';

const behaviorContent = readFileSync(join(process.cwd(), 'src/app/api/chat/behavior.txt'), 'utf-8');
const BEHAVIOR = { role: 'system', content: behaviorContent };

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();
    const updatedMessages = [BEHAVIOR, ...messages];

    const result = streamText({
        model: openai('gpt-4o-mini'),
        messages: updatedMessages,
    });

    return result.toDataStreamResponse();
}

