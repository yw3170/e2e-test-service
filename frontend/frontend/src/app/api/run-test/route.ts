import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const url = body.url;

  console.log('📡 /api/run-test called');
  console.log('🌐 URL:', url);

  try {
    const response = await fetch('http://localhost:8000/generate_test/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    console.log('✅ FastAPIレスポンス:', data);

    // 出力があるかチェック
    if (data.output) {
      return NextResponse.json({ output: data.output });
    } else if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 500 });
    } else {
      // 想定外のレスポンス構造だった場合
      return NextResponse.json(
        {
          error: '⚠️ FastAPIから予期しないレスポンス形式が返されました。',
          raw: data,
        },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error('❌ 通信エラー:', err);
    return NextResponse.json(
      { error: 'バックエンドとの通信に失敗しました。', detail: String(err) },
      { status: 500 }
    );
  }
}
