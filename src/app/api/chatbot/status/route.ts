import { NextRequest, NextResponse } from 'next/server';
import { ChatUnavailableError, getModelChain, openReply } from '@/lib/chat';
import { isAuthenticated } from '@/utils/auth';

export const maxDuration = 60;

// GET - Check which model is really answering (admin only)
export async function GET(request: NextRequest) {
  const user = isAuthenticated(request);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.NVIDIA_API_KEY) {
    return NextResponse.json({
      success: true,
      data: { ok: false, configured: null, served: null, reason: 'NVIDIA_API_KEY is not set on the server.' },
    });
  }

  const { configured, chain } = await getModelChain();

  try {
    const reply = await openReply(chain, [{ role: 'user', content: 'Reply with the word OK.' }], request.signal);
    reply.close();
    return NextResponse.json({
      success: true,
      data: { ok: true, configured, served: reply.model },
    });
  } catch (error) {
    if (!(error instanceof ChatUnavailableError)) console.error('Chatbot status check failed:', error);
    return NextResponse.json({
      success: true,
      data: { ok: false, configured, served: null, reason: 'None of the models answered. Check the API key and try another model.' },
    });
  }
}
