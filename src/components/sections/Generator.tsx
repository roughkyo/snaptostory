"use client";

import { useState } from "react";
import { ImagePlus, Sparkles, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const STYLES = [
    { id: "essay", label: "에세이" },
    { id: "news", label: "뉴스기사" },
    { id: "sns", label: "SNS 업로드용" },
];

export default function Generator() {
    const [style, setStyle] = useState("essay");
    const [intensity, setIntensity] = useState("mid");
    const [prompt, setPrompt] = useState("");

    return (
        <section id="ai-story" className="py-20 px-4 bg-white">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="glass-card rounded-4xl p-8 md:p-14"
                >
                    <div className="space-y-10">
                        {/* Wide Text Input Area */}
                        <div className="relative group">
                            <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">
                                스토리 키워드 및 배경
                            </label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="오늘의 여행지, 기분, 강조하고 싶은 순간을 적어주세요..."
                                className="w-full h-40 bg-gray-50/50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 p-6 text-lg text-gray-900 placeholder-gray-400 resize-none transition-all"
                            />

                            {/* Photo Upload Icon */}
                            <button className="absolute bottom-6 right-6 flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 hover:border-primary/30 transition-colors group">
                                <ImagePlus className="w-5 h-5 text-primary" />
                                <span className="text-sm font-semibold text-gray-600">사진 10장 업로드</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Intensity Dropdown */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-400 ml-1">보정 강도</label>
                                <div className="relative">
                                    <select
                                        value={intensity}
                                        onChange={(e) => setIntensity(e.target.value)}
                                        className="w-full appearance-none bg-gray-50/50 rounded-xl px-4 py-4 text-gray-900 font-medium focus:ring-2 focus:ring-primary/20 border-none transition-all cursor-pointer"
                                    >
                                        <option value="low">하 (자연스럽게)</option>
                                        <option value="mid">중 (화사하게)</option>
                                        <option value="high">상 (시네마틱)</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Style Selection */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-400 ml-1">문서 스타일</label>
                                <div className="flex bg-gray-50/50 p-1 rounded-xl gap-1">
                                    {STYLES.map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => setStyle(s.id)}
                                            className={`flex-1 py-3 px-3 rounded-lg text-sm font-bold transition-all ${style === s.id
                                                ? "bg-white text-primary shadow-sm"
                                                : "text-gray-400 hover:text-gray-600"
                                                }`}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Action Button */}
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-primary-gradient text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/20 transition-all"
                        >
                            <Sparkles className="w-6 h-6 text-white" />
                            스토리 및 보정본 생성하기
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
