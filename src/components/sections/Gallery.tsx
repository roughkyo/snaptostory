"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Wand2, Quote } from "lucide-react";

const CATEGORIES = [
    { id: "essay", label: "에세이" },
    { id: "news", label: "뉴스기사" },
    { id: "sns", label: "SNS 업로드용" },
];

const SAMPLE_DATA = [
    {
        id: 1,
        url: "/samples/1.webp",
        story: "반짝이는 제주 바다의 윤슬을 보며 생각에 잠겼던 그날 오후. 시끄러운 도시의 소음은 사라지고, 오직 파도 소리와 내 숨소리만 들려왔다. 단순한 사진 한 장이지만, 그때의 평온함은 여전히 내 마음속에 살아있다.",
        style: "essay",
    },
    {
        id: 2,
        url: "/samples/2.webp",
        story: "시험 기간, 무겁게 내려앉은 도서관의 공기 속에서 연필 소리만이 정적을 깬다. 막막했던 한 페이지를 넘길 때마다 나는 조금씩 꿈에 가까워지고 있었다. 열정으로 뜨거웠던 그 시절의 기록.",
        style: "essay",
    },
    {
        id: 3,
        url: "/samples/3.webp",
        story: "무대 위 쏟아지는 조명과 심장을 울리는 베이스 소리. 좋아하는 가수의 목소리가 귓가를 맴돌 때, 나는 세상에서 가장 행복한 주인공이 된다. 꿈결 같았던 그 밤의 열기를 다시 느껴본다.",
        style: "news",
    },
    {
        id: 4,
        url: "/samples/4.webp",
        story: "파란 하늘 아래 울려 퍼지던 응원 소리와 아이들의 맑은 웃음소리. 한마음으로 달리고 응원하며 우리는 하나가 되었다. 가장 찬란하게 빛나던 시절의 한 페이지가 드론의 눈을 통해 영원히 기록되었다.",
        style: "sns",
    },
];

export default function Gallery() {
    const [activeTab, setActiveTab] = useState("essay");
    const [selectedImage, setSelectedImage] = useState(SAMPLE_DATA[0]);

    const filteredItems = SAMPLE_DATA.filter((item) => item.style === activeTab);

    return (
        <section id="gallery" className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
                        샘플 결과물 미리보기
                    </h2>

                    <div className="flex justify-center flex-wrap gap-2 md:gap-4 mt-8">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setActiveTab(cat.id);
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
                    <div className="lg:col-span-12 xl:col-span-5">
                        <div className="sticky top-24">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedImage.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="relative group overflow-hidden rounded-4xl glass-card p-6 md:p-8"
                                >
                                    <div className="aspect-square relative rounded-3xl overflow-hidden bg-gray-100 mb-8">
                                        <img
                                            src={selectedImage.url}
                                            alt="Selected Sample"
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                        />
                                        <div className="absolute top-6 left-6 bg-primary-gradient text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                                            <CheckCircle2 className="w-4 h-4" />
                                            스냅투스토리 완성
                                        </div>
                                    </div>

                                    <div className="relative pt-6 px-2">
                                        <Quote className="absolute top-0 left-0 w-8 h-8 text-primary/10 -translate-y-2" />
                                        <h3 className="text-2xl font-black text-primary mb-4 flex items-center gap-2">
                                            SnapToStory
                                        </h3>
                                        <p className="text-gray-600 text-lg leading-relaxed font-medium italic">
                                            {selectedImage.story}
                                        </p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Results Grid (Right) */}
                    <div className="lg:col-span-12 xl:col-span-7">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Wand2 className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <span className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Our Result</span>
                                <h4 className="text-xl font-bold text-gray-900">AI 보정 및 스토리 결과물</h4>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
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
                                        className={`aspect-square rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 relative group border-4 ${selectedImage.id === item.id
                                                ? "border-primary shadow-2xl shadow-primary/20 scale-[1.02]"
                                                : "border-transparent hover:border-primary/30 grayscale hover:grayscale-0"
                                            }`}
                                    >
                                        <img
                                            src={item.url}
                                            alt={`Sample ${item.id}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className={`absolute inset-0 bg-primary/10 transition-opacity duration-500 ${selectedImage.id === item.id ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className="mt-16 p-10 rounded-4xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-16 translate-x-16" />
                            <h4 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
                                <span className="w-1.5 h-8 bg-primary-gradient rounded-full"></span>
                                어떻게 작동하나요?
                            </h4>
                            <p className="text-gray-500 text-lg leading-relaxed font-medium">
                                업로드하신 사진들의 메타데이터와 시각적 특징을 분석하여, 단순한 설명을 넘어선 **감성적인 서사**를 자동으로 작성합니다.
                                오른쪽 갤러리의 사진들을 클릭하여 스냅투스토리가 들려주는 각기 다른 이야기들을 직접 확인해보세요.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
