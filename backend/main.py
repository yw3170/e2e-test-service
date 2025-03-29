from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import subprocess, os
import openai

# .env を読み込む
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate_test/")
async def generate_test(request: Request):
    data = await request.json()
    url = data["url"]
    print(f"✅ リクエスト受信: {url}")

    prompt = f"""
    以下のURLに対する基本的なCypress E2Eテストコードを、**JavaScriptコードのみで**返してください。
    解説やマークダウン記法は不要です。出力はCypressのテストコード本体のみとしてください。

    URL: {url}
    """

    try:
        print("🟡 GPTにリクエスト送信中...")
        completion = openai.chat.completions.create(
            model="gpt-4o-mini-2024-07-18",
            messages=[
                {"role": "system", "content": "あなたはCypressのテストコードを生成するAIです。"},
                {"role": "user", "content": prompt}
            ]
        )
        print("🟢 GPTからのレスポンス受信")

        script = completion.choices[0].message.content
        print("📄 スクリプト生成完了")

        path = "./cypress/e2e/generated_test.cy.js"
        os.makedirs(os.path.dirname(path), exist_ok=True)

        with open(path, "w") as f:
            f.write(script)
        print(f"💾 テストファイル書き込み完了: {path}")

        print("⚙️ Cypressテスト実行中...")
        result = subprocess.run(
            ["npx", "cypress", "run", "--spec", path],
            capture_output=True,
            text=True
        )
        print("✅ Cypress 実行完了")

        print("📝 Cypress 実行出力:\n", result.stdout)
        print("❗ 標準エラー出力:\n", result.stderr)

        if result.stdout.strip():
            return {"output": result.stdout}
        else:
            return {
                "error": "Cypress出力が空、またはエラーが発生しました",
                "stderr": result.stderr
            }

    except Exception as e:
        print(f"❌ エラー発生: {e}")
        return {"error": str(e)}
