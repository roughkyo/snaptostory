"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Wand2 } from "lucide-react";

const CATEGORIES = [
    { id: "essay", label: "에세이" },
    { id: "news", label: "뉴스기사" },
    { id: "sns", label: "SNS 업로드용" },
];

const SAMPLE_DATA = [
    {
        id: 1,
        url: "/samples/1.webp",
        prompt: "제주도 푸른 바다를 배경으로 한 평화로운 오후의 감각적인 에세이 스타일",
        style: "essay",
    },
    {
        id: 2,
        url: "/samples/2.webp",
        prompt: "학교 도서관에서 열공중인 남학생, 실제사진, 느낌있게, 포커싱",
        style: "essay",
    },
    {
        id: 3,
        url: "/samples/3.webp",
        prompt: "공연장에서 가수 공연을 관람중인 여학생 뒷모습, 고화질",
        style: "news",
    },
    {
        id: 4,
        url: "/samples/4.webp",
        prompt: "한국의 중학교, 체육대회, 행복한 여러명의 학생들, 드론 촬영기법",
        style: "sns",
    },
];

export default function Gallery() {
    const [activeTab, setActiveTab] = useState("essay");
    const [selectedImage, setSelectedImage] = useState(SAMPLE_DATA[0]);

    // 해당 카테고리의 이미지들 필터링
    const filteredItems = SAMPLE_DATA.filter((item) => item.style === activeTab);

    return (
        <section id="gallery" className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
                        샘플 결과물 미리보기
                    </h2>

                    {/* Tabs */}
                    <div className="flex justify-center flex-wrap gap-2 md:gap-4 mt-8">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setActiveTab(cat.id);
                                    // 탭 변경 시 해당 카테고리의 첫 번째 이미지로 선택 변경
                                    const firstOfCat = SAMPLE_DATA.find((item) => item.style === cat.id);
                                    if (firstOfCat) setSelectedImage(firstOfCat);
                                }}
                                className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${activeTab === cat.id
                                        ? "bg-primary-gradient text-white shadow-lg shadow-primary/20"
                                        : "bg-gray-50 text-gray-400 border border-gray-100 hover:border-primary/20 hover:text-primary"
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Original View (Left) */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedImage.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.4 }}
                                    className="relative group overflow-hidden rounded-3xl bg-white p-4 shadow-xl border border-gray-100"
                                >
                                    <div className="aspect-square relative rounded-2xl overflow-hidden bg-gray-100">
                                        <img
                                            src={selectedImage.url}
                                            alt="Selected Sample"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-primary" />
                                            AI 선별 결과
                                        </div>
                                    </div>
                                    <div className="mt-6 p-2">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 font-sans">적용된 프롬프트</h3>
                                        <p className="text-gray-500 leading-relaxed italic border-l-4 border-primary pl-4 min-h-[3rem] flex items-center">
                                            "{selectedImage.prompt}"
                                        </p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Results Grid (Right) */}
                    <div className="lg:col-span-7">
                        <div className="flex items-center gap-2 mb-6">
                            <Wand2 className="w-5 h-5 text-primary" />
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                                AI 보정 및 스토리 결과물
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredItems.map((item, idx) => (
                                    <motion.div
                                        key={`${activeTab}-${item.id}`}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                                        onClick={() => setSelectedImage(item)}
                                        className={`aspect-square bg-white rounded-2xl overflow-hidden shadow-md border-2 transition-all group cursor-pointer ${selectedImage.id === item.id
                                                ? "border-primary shadow-lg shadow-primary/10"
                                                : "border-transparent hover:border-primary/20 hover:shadow-xl"
                                            }`}
                                    >
                                        <img
                                            src={item.url}
                                            alt={`Sample ${item.id}`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className="mt-12 p-8 rounded-3xl bg-gray-50/50 border border-gray-100">
                            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-2 h-6 bg-primary rounded-full"></span>
                                다른 스타일 구경하기
                            </h4>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                이미지 그리드에서 사진을 클릭하면 해당 사진에 사용된 상세 프롬프트를 왼쪽에서 확인하실 수 있습니다.
                                스냅투스토리는 여러분의 사진에 가장 잘 어울리는 이야기를 자동으로 생성합니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
