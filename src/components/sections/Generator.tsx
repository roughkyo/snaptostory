"use client";

import { useState, useRef } from "react";
import { ImagePlus, Sparkles, ChevronDown, X, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STYLES = [
    { id: "essay", label: "에세이" },
    { id: "news", label: "뉴스기사" },
    { id: "sns", label: "SNS 업로드용" },
];

export default function Generator() {
    const [style, setStyle] = useState("essay");
    const [intensity, setIntensity] = useState("mid");
    const [prompt, setPrompt] = useState("");
    const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);

        if (images.length + selectedFiles.length > 10) {
            setError("최대 10장까지만 업로드 가능합니다.");
            return;
        }

        const newImages = selectedFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setImages(prev => [...prev, ...newImages]);
        setError(null);
    };

    const removeImage = (index: number) => {
        setImages(prev => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    const [result, setResult] = useState<{ story: string; preview: string } | null>(null);

    const handleGenerate = async () => {
        if (images.length < 5) {
            setError("최소 5장의 사진이 필요합니다.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const formData = new FormData();
            images.forEach((img) => formData.append("images", img.file));
            formData.append("prompt", prompt);
            formData.append("style", style);
            formData.append("intensity", intensity);

            const response = await fetch("/api/generate", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("API 요청 실패");

            const data = await response.json();
            setResult({
                story: data.story,
                preview: data.originalPreview // Cloudinary 연동 전까지 베스트 원본 표시
            });

            // 결과 섹션으로 스크롤
            setTimeout(() => {
                document.getElementById("result-section")?.scrollIntoView({ behavior: 'smooth' });
            }, 100);

        } catch (err) {
            setError("스토리 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="ai-story" className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="glass-card rounded-4xl p-8 md:p-14"
                >
                    <div className="space-y-10">
                        {/* Image Upload Area */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <label className="block text-sm font-black text-gray-400 ml-1 uppercase tracking-widest">
                                    Step 1. 사진 업로드 (5~10장)
                                </label>
                                <span className={`text-xs font-bold ${images.length < 5 ? 'text-orange-500' : 'text-primary'}`}>
                                    {images.length} / 10 장
                                </span>
                            </div>

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`group relative border-2 border-dashed rounded-3xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[200px] ${images.length === 0
                                    ? "border-gray-200 hover:border-primary/50 bg-gray-50/50"
                                    : "border-primary/20 bg-white"
                                    }`}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                />

                                {images.length === 0 ? (
                                    <>
                                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <ImagePlus className="w-8 h-8 text-primary" />
                                        </div>
                                        <p className="text-gray-500 font-bold">최고의 순간 10장을 선택해주세요</p>
                                        <p className="text-gray-400 text-sm mt-1">드래그하거나 클릭하여 업로드</p>
                                    </>
                                ) : (
                                    <div className="grid grid-cols-5 gap-3 w-full">
                                        {images.map((img, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden shadow-sm group/img">
                                                <img src={img.preview} alt="preview" className="w-full h-full object-cover" />
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                                                    className="absolute top-1 right-1 bg-black/50 hover:bg-black text-white p-1 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                        {images.length < 10 && (
                                            <div className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                                                <ImagePlus className="w-6 h-6 text-gray-300" />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Wide Text Input Area */}
                        <div className="relative group">
                            <label className="block text-sm font-black text-gray-400 mb-4 ml-1 uppercase tracking-widest">
                                Step 2. 스토리 배경 및 키워드
                            </label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="어디서 누구와 함께했나요? 강조하고 싶은 특별한 순간이 있다면 적어주세요."
                                className="w-full h-40 bg-gray-50/50 rounded-3xl border-none focus:ring-4 focus:ring-primary/10 p-8 text-lg text-gray-900 placeholder-gray-400 resize-none transition-all shadow-inner"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Intensity Dropdown */}
                            <div className="space-y-4">
                                <label className="block text-sm font-black text-gray-400 ml-1 uppercase tracking-widest">보정 강도 (Cloudinary)</label>
                                <div className="relative">
                                    <select
                                        value={intensity}
                                        onChange={(e) => setIntensity(e.target.value)}
                                        className="w-full appearance-none bg-gray-50/50 rounded-2xl px-6 py-5 text-gray-900 font-bold focus:ring-4 focus:ring-primary/10 border-none transition-all cursor-pointer shadow-sm"
                                    >
                                        <option value="low">하 (자연스러운 질감)</option>
                                        <option value="mid">중 (화사하고 선명하게)</option>
                                        <option value="high">상 (강렬한 시네마틱)</option>
                                    </select>
                                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Style Selection */}
                            <div className="space-y-4">
                                <label className="block text-sm font-black text-gray-400 ml-1 uppercase tracking-widest">문서 스타일 (Gemini)</label>
                                <div className="flex bg-gray-50/50 p-1.5 rounded-2xl gap-1 shadow-sm">
                                    {STYLES.map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => setStyle(s.id)}
                                            className={`flex-1 py-4 px-3 rounded-xl text-sm font-black transition-all ${style === s.id
                                                ? "bg-white text-primary shadow-md"
                                                : "text-gray-400 hover:text-gray-600"
                                                }`}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-2 p-4 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 font-bold text-sm"
                            >
                                <AlertCircle className="w-5 h-5" />
                                {error}
                            </motion.div>
                        )}

                        {/* Main Action Button */}
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading}
                            onClick={handleGenerate}
                            className={`w-full bg-primary-gradient text-white py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 transition-all ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:shadow-primary/40"
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    스토리 생성 중...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-6 h-6" />
                                    스토리 및 보정본 생성하기
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.div>

                {/* Result Area */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            id="result-section"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-20 space-y-10"
                        >
                            <div className="text-center">
                                <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
                                    당신만을 위한 <span className="text-primary-gradient">SnapToStory</span>
                                </h2>
                                <p className="text-gray-500 font-bold">AI가 선정한 베스트 순간과 소중한 기록입니다.</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                                <div className="glass-card rounded-4xl p-6 shadow-2xl overflow-hidden group">
                                    <div className="aspect-[4/5] rounded-3xl overflow-hidden relative">
                                        <img
                                            src={result.preview}
                                            alt="Best moment"
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute top-6 left-6 bg-primary-gradient text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                                            AI 베스트 피크
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8 p-6">
                                    <div className="relative">
                                        <span className="text-6xl text-primary/10 font-serif absolute -top-10 -left-6">“</span>
                                        <p className="text-2xl md:text-3xl font-black text-gray-800 leading-tight md:leading-snug">
                                            {result.story}
                                        </p>
                                        <span className="text-6xl text-primary/10 font-serif absolute -bottom-16 -right-6">”</span>
                                    </div>

                                    <div className="pt-10 border-t border-gray-100 flex flex-wrap gap-4">
                                        <button className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all">
                                            이미지 저장하기
                                        </button>
                                        <button className="flex-1 py-4 border-2 border-primary/20 text-primary rounded-2xl font-bold hover:bg-primary/5 transition-all">
                                            SNS 공유하기
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
