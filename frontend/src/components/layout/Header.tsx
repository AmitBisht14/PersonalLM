'use client';

import { Logo } from './header/Logo';
import { TestConnection } from './header/TestConnection';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();
  const isConfigPage = pathname === '/main/configuration';
  const isYoutubePage = pathname === '/main/youtube';

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800">
      <div className="h-full max-w-screen-2xl mx-auto px-4 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          {isConfigPage || isYoutubePage ? (
            <Link 
              href="/main/home" 
              className="px-4 py-2 text-sm text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-md transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          ) : (
            <>
              <Link 
                href="/main/configuration" 
                className="px-4 py-2 text-sm text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
              >
                Configuration
              </Link>
              <Link 
                href="/main/youtube" 
                className="px-4 py-2 text-sm text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-md transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                YouTube API
              </Link>
            </>
          )}
          <TestConnection />
        </div>
      </div>
    </header>
  );
}
