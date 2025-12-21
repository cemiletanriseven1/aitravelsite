// components/Footer.tsx
import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-neutral-950 text-gray-400 py-12 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">

                {/* 1. Kısım: Logo ve Açıklama */}
                <div className="col-span-1 sm:col-span-2 md:col-span-2">
                    <Link href="/" className="flex items-center gap-2 text-2xl font-black text-white mb-4">
                        <span className="text-orange-500">AI</span> TRAVEL
                    </Link>
                    <p className="text-sm leading-relaxed max-w-xs">
                        Dünyanın en akıllı gezi planlayıcısı ile tanışın. Sizin için en iyi rotaları hazırlar, size sadece anın tadını çıkarmak kalır.
                    </p>
                </div>

                {/* 2. Kısım: Hızlı Linkler */}
                <div className="col-span-1">
                    <h3 className="text-lg font-bold text-white mb-4">HIZLI LİNKLER</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="/about" className="hover:text-orange-500 transition-colors">
                                Hakkımızda
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:text-orange-500 transition-colors">
                                Gizlilik Politikası
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:text-orange-500 transition-colors">
                                İletişim
                            </Link>
                        </li>
                        <li>
                            <Link href="/popular-routes" className="hover:text-orange-500 transition-colors">
                                Popüler Rotalar
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* 3. Kısım: Bizi Takip Et */}
                <div className="col-span-1">
                    <h3 className="text-lg font-bold text-white mb-4">BİZİ TAKİP ET</h3>
                    <div className="flex gap-4">
                        <Link href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                            <Instagram size={24} />
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                            <Twitter size={24} />
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                            <Facebook size={24} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Telif Hakkı */}
            <div className="mt-12 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} AI TRAVEL ASSISTANT – ENGINEERED FOR EXCELLENCE.
            </div>
        </footer>
    );
}