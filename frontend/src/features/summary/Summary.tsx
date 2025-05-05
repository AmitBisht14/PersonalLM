interface SummaryProps {
  summary: string | null;
}

export function Summary({ summary }: SummaryProps) {
  return (
    <section className="h-full p-4 flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-white flex-shrink-0">Summary</h2>
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <div className="bg-gray-800 rounded-lg p-4">
          {summary ? (
            <div className="whitespace-pre-wrap text-gray-100">{summary}</div>
          ) : (
            <div className="text-gray-400">No summary generated yet. Select a chapter and click "Generate Summary".</div>
          )}
        </div>
      </div>
    </section>
  );
}
