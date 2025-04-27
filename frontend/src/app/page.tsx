'use client';

import { Header } from '@/components/header/Header';
import { Body } from '@/components/body/Body';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <Body />
    </main>
  );
}
