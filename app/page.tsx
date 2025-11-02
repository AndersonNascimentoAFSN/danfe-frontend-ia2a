import { Navbar } from '@/components/layout';
import { H2, Paragraph } from '@/components/ui';
import { Chat } from '@/components/chat';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar logo="DANFE IA" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className='w-full'>
          <H2 className="mb-8 text-center">AI Chat Assistant</H2>
          <div className="max-w-4xl mx-auto">
            <Chat
              title="Talk to AI"
              welcomeMessage="Hi! I'm your AI assistant. How can I help you today?"
            />
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <Paragraph>
            Built with Next.js, Tailwind CSS, and Vercel AI SDK
          </Paragraph>
        </div>
      </footer>
    </div>
  );
}
