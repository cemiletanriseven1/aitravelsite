// app/about/page.tsx
"use client";

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const AboutPage = () => {
    const sectionRefs = useRef<(HTMLElement | null)[]>([]);
    const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());

    const cloudName = "dhafbeuse"; 
    const imgStory = `https://res.cloudinary.com/${cloudName}/image/upload/v1/ai-travel-story_rgcsme`;
    const imgVision = `https://res.cloudinary.com/${cloudName}/image/upload/v1/vision-travel_gpytn4`;
    const bgIstanbul = `https://res.cloudinary.com/${cloudName}/image/upload/v1/istanbul-ayasofya_grvcgi`; 
    const bgWorldMap = `https://res.cloudinary.com/${cloudName}/image/upload/v1/ankara-tarih_nycqou`;

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const index = parseInt(entry.target.id.split('-')[1]);
                    if (entry.isIntersecting) {
                        setVisibleSections(prev => new Set(prev).add(index));
                    }
                });
            },
            { root: null, rootMargin: '0px', threshold: 0.3 }
        );

        sectionRefs.current.forEach((section) => { if (section) observer.observe(section); });

        return () => {
            sectionRefs.current.forEach(section => { if (section) observer.unobserve(section); });
        };
    }, []);

    const fadeIn = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    };

    const staggerContainer = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.2 } },
    };

    return (
  <div className="min-h-screen py-8 pt-24 bg-background text-foreground transition-colors duration-300">

            <div className="max-w-7xl mx-auto px-6">

                {/* Hero Section */}
                <motion.section
                    className="text-center mb-20"
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                >
                    {/* BAŞLIK: Light -> SİYAH, Dark -> BEYAZ */}
                    <h1 className="text-6xl font-extrabold text-foreground leading-tight mb-4">
  <span className="text-orange-600 dark:text-orange-500">AI</span> TRAVEL: Seyahatinizi Yeniden Tanımlıyoruz
</h1>

                    
                    {/* AÇIKLAMA: Light -> SİYAH, Dark -> GRİ */}
                    <p className="text-xl text-neutral-700 dark:text-neutral-300 max-w-3xl mx-auto mb-8">

  Yapay zekanın gücüyle, sadece bir tatil değil, kişiselleştirilmiş bir keşif sunuyoruz.
</p>


                    <Link href="/" passHref>
                        <motion.button
                            className="bg-orange-600 text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-orange-700 transition-colors shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Hemen Rotanı Oluştur
                        </motion.button>
                    </Link>
                </motion.section>

                {/* Hikayemiz Section */}
                <motion.section
                    id="section-0"
                    ref={el => sectionRefs.current[0] = el}
                    className="mb-20 py-10 bg-neutral-100 dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden relative transition-colors"
                    variants={fadeIn}
                    initial="hidden"
                    animate={visibleSections.has(0) ? "visible" : "hidden"}
                >
                    <div className="absolute inset-0 bg-cover bg-center opacity-10 blur-sm" style={{ backgroundImage: `url(${bgIstanbul})` }}></div>
                    <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
                        <h2 className="text-5xl font-extrabold text-orange-600 dark:text-orange-400 mb-6">Hikayemiz</h2>
                        {/* PARAGRAF: Light -> SİYAH, Dark -> GRİ */}
                        <p className="text-md text-black dark:text-gray-200 leading-relaxed mb-6 max-w-2xl mx-auto">
                            Her seyahat bir hikayedir. Biz de AI TRAVEL olarak, bu hikayeleri sıradanlıktan çıkarıp, unutulmaz maceralara dönüştürmek için yola çıktık. Teknolojinin ve insan merakının kesişim noktasında, size özel anlar yaratma tutkusuyla doğduk. Amacımız, gezginlerin planlama yükünü hafifletirken, her anı dolu dolu yaşamalarını sağlamak.
                        </p>
                        <img
                            src={imgStory}
                            alt="AI Travel Story"
                            className="w-full max-w-lg mx-auto rounded-xl shadow-xl mt-8 border border-white/10 transform transition-transform duration-700 hover:scale-[1.02]"
                        />
                    </div>
                </motion.section>

                {/* Vizyonumuz Section */}
                <motion.section
                    id="section-1"
                    ref={el => sectionRefs.current[1] = el}
                    className="mb-20 py-16 grid md:grid-cols-2 gap-12 items-center"
                    variants={fadeIn}
                    initial="hidden"
                    animate={visibleSections.has(1) ? "visible" : "hidden"}
                >
                    <div>
                        {/* BAŞLIK: Light -> SİYAH, Dark -> BEYAZ */}
                        <h2 className="text-5xl font-extrabold text-foreground mb-6">
  <span className="text-orange-600 dark:text-orange-500">Vizyonumuz:</span> Herkese Özel Seyahat
</h2>

                        {/* PARAGRAF: Light -> SİYAH, Dark -> GRİ */}
                        <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                            Sıradan turistik rotaların ötesine geçerek, her gezginin ilgi alanlarına, bütçesine ve zamanına en uygun, benzersiz rotalar oluşturmak. Yapay zekanın derin öğrenme yetenekleriyle, herkesin kendi "rüya" seyahatini keşfetmesini sağlamak.
                        </p>
                        {/* ALT PARAGRAF: Light -> SİYAH, Dark -> GRİ */}
                        <p className="text-md text-foreground/70">
                            Gelecekte seyahat deneyimini kişiselleştirmenin, keşfetmenin ve hatırlamanın en kolay yolu olmak istiyoruz.
                        </p>
                    </div>
                    <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-white/10">
                        <img
                            src={imgVision}
                            alt="Vision Travel"
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    </div>
                </motion.section>

                {/* Değerlerimiz Section */}
                <motion.section
                    id="section-2"
                    ref={el => sectionRefs.current[2] = el}
                    className="mb-20 py-16 bg-neutral-100 dark:bg-neutral-900 rounded-3xl shadow-2xl relative transition-colors"
                    variants={fadeIn}
                    initial="hidden"
                    animate={visibleSections.has(2) ? "visible" : "hidden"}
                >
                    <div className="absolute inset-0 bg-cover bg-center opacity-10 blur-sm" style={{ backgroundImage: `url(${bgWorldMap})` }}></div>
                    <div className="relative z-10 max-w-5xl mx-auto text-center">
                        <h2 className="text-5xl font-extrabold text-orange-600 dark:text-orange-400 mb-12">Değerlerimiz</h2>
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                            variants={staggerContainer}
                            initial="hidden"
                            animate={visibleSections.has(2) ? "visible" : "hidden"}
                        >
                            {/* KARTLAR: Başlıklar ve Metinler Light -> SİYAH */}
                            <motion.div variants={fadeIn} className="bg-white dark:bg-neutral-800 p-8 rounded-xl border border-neutral-200 dark:border-white/10 hover:border-orange-500 transition-all shadow-md">
                                <h3 className="text-3xl font-bold text-black dark:text-white mb-4">Kişiselleştirme</h3>
                                <p className="text-black dark:text-gray-300">Her gezginin benzersiz olduğunu biliyor, rotalarımızı size özel tasarlıyoruz.</p>
                            </motion.div>
                            <motion.div variants={fadeIn} className="bg-white dark:bg-neutral-800 p-8 rounded-xl border border-neutral-200 dark:border-white/10 hover:border-orange-500 transition-all shadow-md">
                                <h3 className="text-3xl font-bold text-black dark:text-white mb-4">Keşif</h3>
                                <p className="text-black dark:text-gray-300">Sizi bilinmeyene götüren, heyecan verici ve orijinal deneyimler sunuyoruz.</p>
                            </motion.div>
                            <motion.div variants={fadeIn} className="bg-white dark:bg-neutral-800 p-8 rounded-xl border border-neutral-200 dark:border-white/10 hover:border-orange-500 transition-all shadow-md">
                                <h3 className="text-3xl font-bold text-black dark:text-white mb-4">Kullanım Kolaylığı</h3>
                                <p className="text-black dark:text-gray-300">Karmaşık planlamayı yapay zekaya bırakın, siz sadece anın tadını çıkarın.</p>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Ekibimiz Section */}
                <motion.section
                    id="section-3"
                    ref={el => sectionRefs.current[3] = el}
                    className="text-center py-16"
                    variants={fadeIn}
                    initial="hidden"
                    animate={visibleSections.has(3) ? "visible" : "hidden"}
                >
                    {/* BAŞLIK: Light -> SİYAH, Dark -> BEYAZ */}
                    <h2 className="text-5xl font-extrabold text-foreground mb-8">Ekibimiz</h2>

                    {/* PARAGRAF: Light -> SİYAH, Dark -> GRİ */}
                    <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
                        Tutkulu gezginler, deneyimli yazılımcılar ve yapay zeka uzmanlarından oluşan ekibimizle, hayallerinizdeki seyahatleri gerçeğe dönüştürüyoruz.
                    </p>
                    <div className="flex justify-center gap-8 mt-10">
                        <motion.div
                            className="bg-neutral-100 dark:bg-neutral-800 w-32 h-32 rounded-full flex items-center justify-center text-neutral-500 dark:text-gray-400 text-sm border border-neutral-200 dark:border-white/10"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            Geliştirici A
                        </motion.div>
                        <motion.div
                            className="bg-neutral-100 dark:bg-neutral-800 w-32 h-32 rounded-full flex items-center justify-center text-neutral-500 dark:text-gray-400 text-sm border border-neutral-200 dark:border-white/10"
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            Geliştirici B
                        </motion.div>
                    </div>
                </motion.section>

            </div>
        </div>
    );
};

export default AboutPage;