import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

/**
 * 1단계: 여러 이미지 중 베스트 이미지 1-2개 선정
 */
export async function selectBestImages(imageDatas: { inlineData: { data: string, mimeType: string } }[]) {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
    당신은 전문 사진작가이자 큐레이터입니다. 
    제공된 여러 장의 사진들 중 구도, 색감, 감성을 고려하여 최고의 사진 1~2장을 골라주세요.
    반드시 다음 형식으로 답변해주세요:
    { "bestIndexes": [0, 1] } 
    (인덱스는 0부터 시작합니다)
  `;

    const result = await model.generateContent([prompt, ...imageDatas]);
    const response = await result.response;
    const text = response.text();

    try {
        return JSON.parse(text);
    } catch (e) {
        // 파싱 실패 시 기본값 반환
        return { bestIndexes: [0] };
    }
}

/**
 * 3단계: 사진 분석 후 스토리 생성
 */
export async function generateSnapToStory(imageData: { inlineData: { data: string, mimeType: string } }, userPrompt: string, style: string) {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const stylePrompts = {
        essay: "서정적이고 감성적인 에세이 형식",
        news: "객관적이면서도 생동감 넘치는 뉴스 문체",
        sns: "트렌디하고 공감을 자아내는 SNS 게시물 형태"
    };

    const prompt = `
    사용자 키워드: ${userPrompt}
    요청 스타일: ${stylePrompts[style as keyof typeof stylePrompts] || "자유 형식"}
    
    이 사진을 분석하여 사용자의 키워드와 분위기에 맞는 아주 감성적이고 몰입감 있는 이야기를 한글로 작성해주세요.
    이야기는 약 3-4문장 내외로 작성해주세요.
  `;

    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    return response.text();
}
