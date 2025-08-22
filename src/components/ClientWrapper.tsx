'use client';

import dynamic from 'next/dynamic';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Import CustomCursor and Chatbot with dynamic import
const CustomCursor = dynamic(() => import('./CustomCursor'), {
  ssr: false,
});

const Chatbot = dynamic(() => import('./common/Chatbot'), {
  ssr: false,
});

export default function ClientWrapper({ children }: { children?: React.ReactNode }) {
  return (
    <ThemeProvider>
        <CustomCursor />
        <Chatbot />
        {children}
    </ThemeProvider>
  );
}
