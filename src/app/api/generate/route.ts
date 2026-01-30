import { NextRequest, NextResponse } from "next/server";
import { generateFullSnapStory } from "@/lib/gemini";

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

        // 통합 단계: 베스트 이미지 선정 + 스토리 생성
        const fullStoryResult = await generateFullSnapStory(imageDatas, userPrompt, style);

        // 인덱스 유효성 검사 및 범위 제한 (0 ~ images.length - 1)
        const bestIndexes = (fullStoryResult.bestIndexes && Array.isArray(fullStoryResult.bestIndexes))
            ? fullStoryResult.bestIndexes
                .filter((idx: any) => typeof idx === 'number' && idx >= 0 && idx < imageDatas.length)
                .slice(0, 2)
            : [0, 1];

        // 만약 필터링 후 2개가 안 된다면 기본값으로 채움
        if (bestIndexes.length < 2) {
            if (!bestIndexes.includes(0)) bestIndexes.push(0);
            if (bestIndexes.length < 2 && !bestIndexes.includes(1)) bestIndexes.push(1);
            if (bestIndexes.length < 2) bestIndexes.push(0); // 정 안되면 0번이라도 중복해서 채움 (에러 방지)
        }

        const selectionReason = fullStoryResult.reason || "특별한 순간이 담긴 두 장의 사진을 선정해봤어요.";
        const story = fullStoryResult.story || "함께 나누는 소중한 시간들이 모여 오늘의 아름다운 기록이 되었습니다.";
        const cleanStory = story.replace(/<br\s*\/?>/gi, '\n').trim();

        // 2단계: 이미지 인핸싱 (선정된 2장 모두 수행)
        const cloudinary = require("cloudinary").v2;
        cloudinary.config({
            cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        const bestImagesResults = await Promise.all(bestIndexes.map(async (idx: number) => {
            const imageData = imageDatas[idx];
            let enhancedUrl = "";

            try {
                const uploadResult = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload(`data:${imageData.inlineData.mimeType};base64,${imageData.inlineData.data}`,
                        { folder: "snaptostory" },
                        (error: any, result: any) => {
                            if (error) reject(error);
                            else resolve(result);
                        });
                }) as any;

                const effectMap: Record<string, any[]> = {
                    low: [{ effect: "enhance" }],
                    mid: [{ effect: "improve" }],
                    high: [{ effect: "improve" }, { effect: "vibrance:50" }, { effect: "sharpen:100" }]
                };

                const selectedEffects = effectMap[intensity] || effectMap.mid;

                enhancedUrl = cloudinary.url(uploadResult.public_id, {
                    transformation: [...selectedEffects],
                    secure: true,
                });
            } catch (err) {
                console.error("Cloudinary Individual Error:", err);
            }

            return {
                preview: enhancedUrl || `data:${imageData.inlineData.mimeType};base64,${imageData.inlineData.data}`,
                original: `data:${imageData.inlineData.mimeType};base64,${imageData.inlineData.data}`
            };
        }));

        return NextResponse.json({
            bestImages: bestImagesResults,
            story: cleanStory,
            reason: selectionReason
        });

    } catch (error: any) {
        console.error("Processing Error:", error);
        return NextResponse.json({ error: error.message || "서버 처리 중 오류가 발생했습니다." }, { status: 500 });
    }
}
