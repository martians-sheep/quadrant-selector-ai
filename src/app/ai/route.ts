import { type NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
  throw new Error("GOOGLE_API_KEY is not set in the environment variables");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function POST(request: NextRequest) {
  const { x, y, documentA } = await request.json();
  console.log("Received request with x:", x, "y:", y);

  const prompt = `
  以下の文書Aを解説してください。解説の対象者のレベルはX=${x}、具体性のレベルはY=${y}です。
  XとYの値は-1から1の範囲で指定され、これらの値に基づいて適切な解説を提供してください。
  
  1. 対象者レベル（X軸）の調整:
     -1: 幼児レベル（2-3歳）
     -0.75: 幼稚園児レベル（4-5歳）
     -0.5: 小学校低学年レベル（6-8歳）
     -0.25: 小学校高学年レベル（9-12歳）
     0: 一般的な成人レベル
     0.25: 大学生レベル
     0.5: 業界初心者レベル
     0.75: 業界経験者レベル
     1: 専門家・研究者レベル
  
  2. 具体性レベル（Y軸）の調整:
     -1: 極めて抽象的、概念的
     -0.5: やや抽象的、理論寄り
     0: バランスの取れた説明
     0.5: やや具体的、実践寄り
     1: 非常に具体的、実装指向
  
  3. 文章構造の調整:
     - 文章の長さ: X値が低いほど短く、高いほど長く
     - 段落数: X値が低いほど少なく、高いほど多く
     - 使用する語彙レベル:
       X ≤ -0.75: 幼児向け語彙（500語程度）
       -0.75 < X ≤ -0.25: 小学生向け語彙（2000語程度）
       -0.25 < X ≤ 0.25: 一般的な成人向け語彙（8000語程度）
       0.25 < X ≤ 0.75: 大学卒業レベルの語彙（20000語程度）
       0.75 < X: 専門家レベルの語彙（制限なし、専門用語を積極的に使用）
  
  4. 具体性の調整:
     - 具体例の数: Y値が低いほど少なく、高いほど多く
     - 数値データの使用: Y値が高いほど、具体的な数値やデータを多く含める
     - 比喩の使用:
       Y ≤ -0.75: 比喩は使用せず、非常に単純な言葉で説明
       -0.75 < Y ≤ -0.25: 1つだけ非常に簡単な比喩を使用
       -0.25 < Y ≤ 0.25: 2-3の適度な比喩を使用
       0.25 < Y ≤ 0.75: 複数の詳細な比喩を使用
       0.75 < Y: 複雑で重層的な比喩を多用、専門的なアナロジーも含める
  
  5. フォーマットの調整:
     - X ≤ -0.75: 絵や図を多用し、文字は最小限に
     - -0.75 < X ≤ -0.25: 簡単な箇条書きと短い文章を使用
     - -0.25 < X ≤ 0.25: 短い段落と簡単な箇条書きを混在
     - 0.25 < X ≤ 0.75: 標準的な段落構成に加え、小見出しを使用
     - 0.75 < X: 詳細な目次、章立て、脚注を含む学術的な構成
     - Y ≤ -0.75: 極めて抽象的な1つの概念図のみ
     - -0.75 < Y ≤ -0.25: 抽象的な概念図やフローチャートを1-2個含める
     - -0.25 < Y ≤ 0.25: 2-3の簡単な図表を含める
     - 0.25 < Y ≤ 0.75: 複数の詳細な図表とケーススタディを含める
     - 0.75 < Y: 具体的なコード例、実装手順、詳細な技術仕様、データ分析結果を含める
  
  6. トーンと文体の調整:
     X軸:
     -1: 極めてシンプルで親しみやすい、歌や遊びの要素を含む
     -0.5: とてもフレンドリーで励ますような口調
     0: ニュートラルで客観的な文体
     0.5: フォーマルでやや硬い文体
     1: 非常に学術的で厳密な文体、専門用語を多用
     Y軸:
     -1: 極めて哲学的で抽象的なトーン
     -0.5: 概念的で理論寄りのトーン
     0: バランスの取れた説明的なトーン
     0.5: 実践的でハウツー的なトーン
     1: 極めて技術的で実装指向のトーン、具体的な手順やコードを多用
  
  これらの指針に厳密に従って、文書Aの内容を解説してください。解説が完成したら、以下のJSON形式で結果を返してください：
  
  {
    "x": ${x},
    "y": ${y},
    "explanation": "ここに生成された解説を入れてください"
  }
  
  文書A:
  ${documentA}
  `;

  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const processStream = async () => {
    try {
      // 最初に x と y の値を送信
      await writer.write(
        encoder.encode(`data: ${JSON.stringify({ x, y })}\n\n`)
      );

      const result = await model.generateContentStream(prompt);

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          await writer.write(
            encoder.encode(
              `data: ${JSON.stringify({ explanation: chunkText })}\n\n`
            )
          );
        }
      }

      await writer.write(encoder.encode("event: done\ndata: \n\n"));
    } catch (error) {
      console.error("Error:", error);
      await writer.write(
        encoder.encode(
          `data: ${JSON.stringify({
            error: "Error occurred while generating AI response.",
          })}\n\n`
        )
      );
    } finally {
      await writer.close();
    }
  };

  processStream();

  return new NextResponse(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
