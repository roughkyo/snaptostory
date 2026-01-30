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

    const [result, setResult] = useState<{ story: string; bestImages: { preview: string }[]; reason?: string } | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFiles(files);
        }
    };

    const compressImage = async (file: File): Promise<File> => {
        // 10MB 이하인 경우 그대로 반환
        if (file.size <= 10 * 1024 * 1024) return file;

        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // 최대 가로/세로 2500px로 축소 (비율 유지)
                    const MAX_SIZE = 2500;
                    if (width > height) {
                        if (width > MAX_SIZE) {
                            height *= MAX_SIZE / width;
                            width = MAX_SIZE;
                        }
                    } else {
                        if (height > MAX_SIZE) {
                            width *= MAX_SIZE / height;
                            height = MAX_SIZE;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        if (blob) {
                            const newFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            resolve(newFile);
                        } else {
                            resolve(file);
                        }
                    }, 'image/jpeg', 0.8); // 80% 품질로 압축
                };
            };
        });
    };

    const handleFiles = async (selectedFiles: File[]) => {
        if (images.length + selectedFiles.length > 10) {
            setError("최대 10장까지만 업로드 가능합니다.");
            return;
        }

        setIsLoading(true); // 압축 중 로딩 표시
        try {
            const processedImages = await Promise.all(
                selectedFiles.map(async (file) => {
                    const processedFile = await compressImage(file);
                    return {
                        file: processedFile,
                        preview: URL.createObjectURL(processedFile)
                    };
                })
            );

            setImages(prev => [...prev, ...processedImages]);
            setError(null);
        } catch (err) {
            setError("이미지 처리 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

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
                bestImages: data.bestImages,
                reason: data.reason
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
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`group relative border-2 border-dashed rounded-3xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[200px] ${isDragging
                                    ? "border-primary bg-primary/5 scale-[1.02]"
                                    : images.length === 0
                                        ? "border-gray-200 hover:border-primary/50 bg-gray-50/50"
                                        : "border-primary/20 bg-white"
                                    }`}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(e) => handleFiles(Array.from(e.target.files || []))}
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

                            <div className="flex flex-col gap-12">
                                {/* Images Area (Top Horizontal Layout) */}
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {result.bestImages.map((img, idx) => (
                                            <div key={idx} className="glass-card rounded-4xl p-4 shadow-2xl overflow-hidden group h-fit">
                                                <div className="rounded-3xl overflow-hidden relative">
                                                    <img
                                                        src={img.preview}
                                                        alt={`Best moment ${idx + 1}`}
                                                        className="w-full h-auto transition-transform duration-1000 group-hover:scale-105"
                                                    />
                                                    <div className="absolute top-6 left-6">
                                                        <div className="bg-primary-gradient text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                                                            BEST 픽 {idx + 1}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* AI 선정 이유 */}
                                    {result.reason && (
                                        <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-primary/5 border border-primary/10 shadow-sm">
                                            <p className="text-gray-700 text-xl font-bold leading-relaxed text-center">
                                                <span className="text-primary block mb-2">✨ AI 선정 이유</span> {result.reason}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Story & Action Area (Bottom) */}
                                <div className="max-w-3xl mx-auto w-full space-y-12">
                                    <div className="relative px-8 pt-4">
                                        <span className="text-6xl text-primary/10 font-serif absolute -top-4 -left-2">“</span>
                                        <p className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed whitespace-pre-wrap text-center">
                                            {result.story?.replace(/<br\s*\/?>/gi, '\n') || ""}
                                        </p>
                                        <span className="text-6xl text-primary/10 font-serif absolute -bottom-8 -right-2">”</span>
                                    </div>

                                    <div className="pt-10 border-t border-gray-100 flex flex-wrap gap-4">
                                        <button
                                            onClick={async () => {
                                                try {
                                                    for (let i = 0; i < result.bestImages.length; i++) {
                                                        const response = await fetch(result.bestImages[i].preview);
                                                        const blob = await response.blob();
                                                        const url = window.URL.createObjectURL(blob);
                                                        const link = document.createElement('a');
                                                        link.href = url;
                                                        link.download = `snaptostory-${Date.now()}-${i + 1}.jpg`;
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        document.body.removeChild(link);
                                                        window.URL.revokeObjectURL(url);
                                                        await new Promise(r => setTimeout(r, 400));
                                                    }
                                                } catch (err) {
                                                    alert("이미지 저장 중 오류가 발생했습니다.");
                                                }
                                            }}
                                            className="flex-1 py-5 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl"
                                        >
                                            전체 이미지 소장하기
                                        </button>
                                        <button className="flex-1 py-5 border-2 border-primary/20 text-primary rounded-2xl font-black text-lg hover:bg-primary/5 transition-all shadow-sm">
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
