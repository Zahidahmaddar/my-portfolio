import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Information about Zahid Farooq for the chatbot
const MUZAMIL_INFO = `
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

Please answer questions about Muzamil in a friendly, professional manner. If asked about specific technical details not mentioned here, you can provide general information about the technologies he uses. Always encourage visitors to check out his projects or contact him directly for more detailed discussions.
`;

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Prepare conversation messages for OpenAI
    const messages = [
      {
        role: 'system' as const,
        content: MUZAMIL_INFO
      },
      // Add conversation history for context
      ...conversationHistory.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      })),
      {
        role: 'user' as const,
        content: message
      }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 300,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from OpenAI');
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
