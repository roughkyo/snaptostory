"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">
                            스냅투스토리
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex space-x-8">
                        <Link href="#ai-story" className="text-sm font-medium text-gray-500 hover:text-emerald-500 transition-colors">
                            AI 스토리 생성
                        </Link>
                        <Link href="#gallery" className="text-sm font-medium text-gray-500 hover:text-emerald-500 transition-colors">
                            내 갤러리
                        </Link>
                        <Link href="#pricing" className="text-sm font-medium text-gray-500 hover:text-emerald-500 transition-colors">
                            요금제
                        </Link>
                        <Link href="#history" className="text-sm font-medium text-gray-500 hover:text-emerald-500 transition-colors">
                            사용내역
                        </Link>
                    </nav>

                    {/* Start Button */}
                    <div className="hidden md:flex items-center">
                        <button className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all active:scale-95">
                            시작하기
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 animate-in slide-in-from-top duration-200">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="#ai-story" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-500 hover:bg-gray-50">
                            AI 스토리 생성
                        </Link>
                        <Link href="#gallery" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-500 hover:bg-gray-50">
                            내 갤러리
                        </Link>
                        <Link href="#pricing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-500 hover:bg-gray-50">
                            요금제
                        </Link>
                        <Link href="#history" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-500 hover:bg-gray-50">
                            사용내역
                        </Link>
                        <button className="w-full mt-2 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-emerald-500 hover:bg-emerald-600">
                            시작하기
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
