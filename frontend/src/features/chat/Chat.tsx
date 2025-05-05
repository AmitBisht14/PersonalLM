interface ChatProps {
  summary: string | null;
}

export function Chat({ summary }: ChatProps) {
  return (
    <section className="h-full p-4">
      <h2 className="text-xl font-semibold mb-4 text-white">Summary</h2>
      <div className="bg-gray-800 rounded-lg p-4">
        {summary ? (
          <div className="whitespace-pre-wrap text-gray-100">{summary}</div>
        ) : (
          <div className="text-gray-400">No summary generated yet. Select a chapter and click "Generate Summary".</div>
        )}
      </div>
    </section>
  );
}
