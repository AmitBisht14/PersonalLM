import { Logo } from './header/Logo';
import { TestConnection } from './header/TestConnection';
import Link from 'next/link';

export function Header() {
  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800">
      <div className="h-full max-w-screen-2xl mx-auto px-4 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <Link 
            href="/configuration" 
            className="px-4 py-2 text-sm text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
          >
            Configuration
          </Link>
          <TestConnection />
        </div>
      </div>
    </header>
  );
}
