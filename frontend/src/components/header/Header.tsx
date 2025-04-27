import { Logo } from './headerComponents/Logo';
import { TestConnection } from './headerComponents/TestConnection';

export function Header() {
  return (
    <header className="w-full border-b bg-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Logo />
        <TestConnection />
      </div>
    </header>
  );
}
