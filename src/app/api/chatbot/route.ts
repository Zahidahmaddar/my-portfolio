import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import connectDB from '@/lib/db';
import ChatbotKnowledge from '@/lib/models/chatbotKnowledge';
import SiteSettings from '@/lib/models/siteSettings';

const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

// Default fallback information
const DEFAULT_INFO = `
You are an AI assistant representing Zahid Farooq, a Software Engineer. Here's information about him:

PERSONAL INFO:
- Name: Zahid Farooq
- Role: Software Engineer
- Location: Based in India
- Passionate about creating modern, responsive web applications with beautiful user experiences and robust backend solutions

SKILLS & EXPERTISE:
- Frontend Development: React, Next.js, TypeScript, Tailwind CSS, JavaScript, HTML5, CSS3
- UI/UX Design: Figma, Adobe Creative Suite, Responsive Design, Modern UI trends
- Design Trends: Glassmorphism, Neumorphism, Dark Mode, Custom Animations

PROJECTS & EXPERIENCE:
- Built a modern portfolio website with advanced features like custom cursor, dark mode, parallax scrolling
- Developed hotel booking websites with responsive design
- Created AI-powered chatbots and admission systems
- Experience with admin dashboards and content management
- Proficient in database design and API development

CONTACT INFO:
- GitHub: Available in portfolio
- LinkedIn: Available in portfolio  
- Email: Available through contact form on portfolio
- Resume: Available for download on portfolio

PERSONALITY & APPROACH:
- Passionate about turning complex problems into simple, beautiful solutions
- Focuses on modern web technologies and best practices
- Believes in creating beautiful user experiences
- Always learning and adapting to new technologies
- Professional yet approachable

Please answer questions about Zahid in a friendly, professional manner. If asked about specific technical details not mentioned here, you can provide general information about the technologies he uses. Always encourage visitors to check out his projects or contact him directly for more detailed discussions.
`;

async function getSystemPrompt(): Promise<string> {
  try {
    await connectDB();
    const entries = await ChatbotKnowledge.find();
    if (entries.length === 0) return DEFAULT_INFO;

    const knowledgeText = entries
      .map((e: { title: string; content: string }) => `${e.title}:\n${e.content}`)
      .join('\n\n');

    return `You are an AI assistant representing Zahid Farooq. Use the following knowledge to answer questions about him in a friendly, professional manner.\n\n${knowledgeText}\n\nIf asked about something not covered above, provide general helpful information and encourage visitors to use the contact form for detailed discussions.`;
  } catch {
    return DEFAULT_INFO;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!process.env.NVIDIA_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'NVIDIA API key not configured' },
        { status: 500 }
      );
    }

    const systemPrompt = await getSystemPrompt();

    // Get model from DB settings
    let modelName = 'meta/llama-3.1-8b-instruct';
    try {
      const settings = await SiteSettings.findOne();
      if (settings?.aiModel) modelName = settings.aiModel;
    } catch {
      // use default
    }

    const messages = [
      {
        role: 'system' as const,
        content: systemPrompt
      },
      ...conversationHistory.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      })),
      {
        role: 'user' as const,
        content: message
      }
    ];

    const completion = await client.chat.completions.create({
      model: modelName,
      messages: messages,
      max_tokens: 512,
      temperature: 0.7,
      top_p: 0.9,
      stream: false,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    return NextResponse.json({
      success: true,
      message: aiResponse
    });

  } catch (error: unknown) {
    console.error('Chatbot API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to process chatbot request';
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage
      },
      { status: 500 }
    );
  }
}
