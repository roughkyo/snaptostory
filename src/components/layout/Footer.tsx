import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-8">
                        지금 바로 시작해보세요
                    </h2>
                    <button className="inline-flex items-center gap-2 px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xl rounded-2xl shadow-xl shadow-emerald-200 transition-all active:scale-95 group">
                        바로 시작하기
                        <ArrowUpRight className="w-6 h-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-10 border-t border-gray-100 gap-8">
                    <div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                            스냅투스토리
                        </span>
                        <p className="mt-2 text-sm text-gray-500 font-medium">
                            10장의 사진으로 그려내는 당신만의 특별한 서사
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-x-10 gap-y-4">
                        <Link href="/terms" className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">
                            이용약관
                        </Link>
                        <Link href="/privacy" className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">
                            개인정보처리방침
                        </Link>
                        <Link href="/contact" className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">
                            제휴문의
                        </Link>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-xs font-bold text-gray-300 tracking-widest uppercase">
                        © 2026 스냅투스토리. All rights reserved. made by yangphago with antigravity
                    </p>
                </div>
            </div>
        </footer>
    );
}
