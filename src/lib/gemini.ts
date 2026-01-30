import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

/**
 * 통합 단계: 베스트 이미지 선정 + 스토리 생성을 한 번의 API 호출로 처리 (Quota 절약)
 */
export async function generateFullSnapStory(imageDatas: { inlineData: { data: string, mimeType: string } }[], userPrompt: string, style: string) {
  // 사용자가 요청한 최신 gemini-2.5-flash 모델 적용
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const stylePrompts = {
    essay: "서정적이고 감성적인 에세이 형식",
    news: "객관적이면서도 생동감 넘치는 뉴스 문체",
    sns: "트렌디하고 공감을 자아내는 SNS 게시물 형태"
  };

  const prompt = `
    당신은 사람들의 소중한 순간을 기록하는 전문 사진작가이자 감성 작가입니다.
    제공된 여러 장의 사진들 중 다음 두 가지 미션을 한 번의 답변으로 수행해주세요.

    미션 1: 베스트 사진 2장 선정
    - 사진들 중 특별한 순간, 많은 인원, 행복한 표정을 기준으로 서로 다른 매력의 2장을 골라주세요.
    - 선정한 이유를 친구처럼 따뜻하고 다정하게 한 문장으로 설명해주세요.

    미션 2: 감성 스토리 작성 (첫 번째 베스트 사진 기준)
    - 사용자 키워드: ${userPrompt}
    - 요청 스타일: ${stylePrompts[style as keyof typeof stylePrompts] || "자유 형식"}
    - 사진의 분위기와 키워드에 맞춰 3-4문장 내외의 몰입감 있는 이야기를 작성해주세요.
    - 가독성을 위해 문장 사이나 포인트에서 적절한 줄바꿈(\\n)을 포함해주세요.

    반드시 다음 JSON 형식으로만 답변해주세요:
    { 
      "bestIndexes": [첫번째_인덱스, 두번째_인덱스], 
      "reason": "사진 선정 이유 (한 문장)",
      "story": "감성 스토리 내용 (줄바꿈 포함)"
    } 
    (인덱스는 0부터 시작하며, 반드시 서로 다른 2개의 인덱스를 포함해야 합니다)
  `;

  const result = await model.generateContent([prompt, ...imageDatas]);
  const response = await result.response;
  const text = response.text();

  try {
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("Gemini Unified API Parse Error:", text);
    return {
      bestIndexes: [0, 1],
      reason: "특별한 순간이 담긴 사진들을 골라봤어요.",
      story: "함께 나누는 소중한 시간들이 모여 오늘의 아름다운 기록이 되었습니다."
    };
  }
}
