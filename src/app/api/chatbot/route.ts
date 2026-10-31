import { NextRequest, NextResponse } from 'next/server';
import { buildSystemPrompt, ChatMessage, getModelChain, openReply } from '@/lib/chat';
import { clientIp, hit } from '@/lib/rateLimit';

export const maxDuration = 60;

const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY = 8;
const MAX_HISTORY_MESSAGE_LENGTH = 2000;

const UNAVAILABLE = 'The assistant is unavailable right now. You can still reach Zahid through the contact form.';

function cleanHistory(history: unknown): ChatMessage[] {
  if (!Array.isArray(history)) return [];
  return history
    .filter(
      (m): m is { role: string; content: string } =>
        !!m && typeof m.content === 'string' && m.content.trim() !== '' && (m.role === 'user' || m.role === 'assistant')
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content.slice(0, MAX_HISTORY_MESSAGE_LENGTH),
    }));
}

// POST - Answer a visitor's question, streamed as plain text
export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
  }

  const message = typeof body?.message === 'string' ? body.message.trim() : '';

  if (!message) {
    return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { success: false, error: `Keep questions under ${MAX_MESSAGE_LENGTH} characters` },
      { status: 400 }
    );
  }

  if (!hit(`chat:${clientIp(request)}`, 20, 60 * 1000)) {
    return NextResponse.json(
      { success: false, error: 'Too many questions at once. Try again in a minute.' },
      { status: 429 }
    );
  }

  if (!process.env.NVIDIA_API_KEY) {
    console.error('NVIDIA_API_KEY is not configured');
    return NextResponse.json({ success: false, error: UNAVAILABLE }, { status: 503 });
  }

  try {
    const [systemPrompt, { chain }] = await Promise.all([buildSystemPrompt(), getModelChain()]);

    const reply = await openReply(
      chain,
      [
        { role: 'system', content: systemPrompt },
        ...cleanHistory(body.conversationHistory),
        { role: 'user', content: message },
      ],
      request.signal
    );

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode(reply.first));
      },
      async pull(controller) {
        try {
          const { value, done } = await reply.rest.next();
          if (done) {
            controller.close();
            reply.close();
            return;
          }
          const text = value.choices[0]?.delta?.content;
          if (text) controller.enqueue(encoder.encode(text));
        } catch (error) {
          console.error('Chat stream failed:', error);
          controller.error(error);
          reply.close();
        }
      },
      cancel() {
        reply.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json({ success: false, error: UNAVAILABLE }, { status: 503 });
  }
}
