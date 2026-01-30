"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Wand2 } from "lucide-react";

const CATEGORIES = [
    { id: "essay", label: "에세이" },
    { id: "news", label: "뉴스기사" },
    { id: "sns", label: "SNS 업로드용" },
];

const MOCK_ITEMS = Array.from({ length: 9 }).map((_, i) => ({
    id: i,
    url: `https://picsum.photos/seed/${i + 10}/400/400`,
    style: CATEGORIES[i % 3].id,
}));

export default function Gallery() {
    const [activeTab, setActiveTab] = useState("essay");

    const filteredItems = MOCK_ITEMS.filter((item) => item.style === activeTab);

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
                                onClick={() => setActiveTab(cat.id)}
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
                            <div className="relative group overflow-hidden rounded-3xl bg-white p-4 shadow-xl border border-gray-100">
                                <div className="aspect-square relative rounded-2xl overflow-hidden bg-gray-100">
                                    <img
                                        src="https://picsum.photos/seed/main/1000/1000"
                                        alt="Original"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-primary" />
                                        AI 선별 원본
                                    </div>
                                </div>
                                <div className="mt-6 p-2">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">프롬프트 예시</h3>
                                    <p className="text-gray-500 leading-relaxed italic border-l-4 border-primary pl-4">
                                        "제주도 푸른 바다를 배경으로 한 평화로운 오후의 감각적인 에세이 스타일"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Grid (Right) */}
                    <div className="lg:col-span-7">
                        <div className="flex items-center gap-2 mb-6">
                            <Wand2 className="w-5 h-5 text-primary" />
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">AI 보정 및 스토리 결과물</span>
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
                                        className="aspect-square bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all group cursor-pointer"
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
                    </div>
                </div>
            </div>
        </section>
    );
}
