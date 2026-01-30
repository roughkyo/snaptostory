"use client";

import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-block relative"
                    >
                        <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter">
                            스냅투스토리
                        </h1>
                        <span className="absolute -top-4 -right-12 md:-right-16 bg-primary-gradient text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full shadow-xl transform rotate-[30deg] border-2 border-white">
                            AI
                        </span>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-8 text-xl md:text-2xl text-gray-600 font-medium max-w-2xl mx-auto"
                    >
                        10장의 사진 중 최고의 순간을 선별하여
                        <br className="hidden md:block" /> 이야기를 입히다
                    </motion.p>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-60 animate-pulse"></div>
                <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl opacity-60"></div>
            </div>
        </section>
    );
}
