import { Brain } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Brain className="w-8 h-8 text-blue-500" />
      <span className="text-xl font-bold text-white">PersonalLM</span>
    </div>
  );
}
