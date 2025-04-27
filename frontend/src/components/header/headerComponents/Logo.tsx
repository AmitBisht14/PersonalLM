import { BrainCircuit } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <BrainCircuit className="h-6 w-6 text-indigo-600" />
      <h1 className="text-xl font-semibold text-white">PersonalLM</h1>
    </div>
  );
}
