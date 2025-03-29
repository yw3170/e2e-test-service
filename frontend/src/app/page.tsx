'use client';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRunTest = async () => {
    if (!url) return;

    setLoading(true);
    setResult('');

    const res = await fetch('/api/run-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.output) {
      setResult(data.output);
    } else if (data.error) {
      setResult(`❌ エラー: ${data.error}`);
    } else {
      setResult('⚠️ 予期せぬレスポンスです');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">AI自動E2Eテスト</h1>
          <p className="text-gray-400">URLを入力して、AIによる自動テストを実行します</p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8 border border-gray-700">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleRunTest}
              disabled={loading || !url}
              className={`px-6 py-2 rounded-md text-white font-medium transition-colors
                ${loading || !url
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {loading ? '実行中...' : 'テスト実行'}
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">テスト結果</h2>
          <pre className="bg-gray-900 rounded-md p-4 text-sm text-gray-300 whitespace-pre-wrap font-mono border border-gray-700">
            {loading ? 'テストを実行中です...' : result || 'テスト結果がここに表示されます'}
          </pre>
        </div>
      </div>
    </main>
  );
}
