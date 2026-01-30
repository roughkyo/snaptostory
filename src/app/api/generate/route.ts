import { NextRequest, NextResponse } from "next/server";
import { selectBestImages, generateSnapToStory } from "@/lib/gemini";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const images = formData.getAll("images") as File[];
        const userPrompt = formData.get("prompt") as string;
        const style = formData.get("style") as string;
        const intensity = formData.get("intensity") as string;

        if (images.length < 5) {
            return NextResponse.json({ error: "최소 5장의 사진이 필요합니다." }, { status: 400 });
        }

        // 파일 데이터를 base64로 변환 (Gemini 전송용)
        const imageDatas = await Promise.all(
            images.map(async (file) => {
                const bytes = await file.arrayBuffer();
                const base64 = Buffer.from(bytes).toString("base64");
                return {
                    inlineData: {
                        data: base64,
                        mimeType: file.type,
                    },
                };
            })
        );

        // 1단계: 베스트 이미지 선정
        const bestResult = await selectBestImages(imageDatas);
        const bestIndex = bestResult.bestIndexes[0] || 0;
        const bestImageData = imageDatas[bestIndex];

        // 2단계: 이미지 인핸싱 (Cloudinary)
        // TODO: Cloudinary 업로드 및 인핸싱 로직 추가 예정
        // 현재는 원본 base64를 그대로 사용하거나 모의 처리
        let enhancedImageUrl = "";

        // 3단계: 스토리 생성
        const story = await generateSnapToStory(bestImageData, userPrompt, style);

        return NextResponse.json({
            bestIndex,
            story,
            // enhancedImageUrl: "...", 
            originalPreview: `data:${bestImageData.inlineData.mimeType};base64,${bestImageData.inlineData.data}`
        });

    } catch (error: any) {
        console.error("Processing Error:", error);
        return NextResponse.json({ error: error.message || "서버 처리 중 오류가 발생했습니다." }, { status: 500 });
    }
}
