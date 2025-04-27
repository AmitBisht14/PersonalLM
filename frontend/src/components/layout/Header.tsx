import { Logo } from './header/Logo';
import { TestConnection } from './header/TestConnection';

export function Header() {
  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800">
      <div className="h-full max-w-screen-2xl mx-auto px-4 flex items-center justify-between">
        <Logo />
        <TestConnection />
      </div>
    </header>
  );
}
