# 🌍 AI Travel Assistant: Groq AI Destekli Yüksek Hızlı Seyahat Planlayıcı

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Groq AI](https://img.shields.io/badge/AI-Groq_LPU-orange?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)

**AI Travel Assistant**, seyahat tutkunları için **Groq AI (LPU™ Inference Engine)** kullanarak saniyeler içinde kişiselleştirilmiş rotalar oluşturan modern bir web uygulamasıdır. Proje, hız ve performans odaklı bir mühendislik yaklaşımıyla geliştirilmiştir.

## 🚀 Neden Groq AI?

Bu projede geleneksel modeller yerine **Groq LPU (Language Processing Unit)** tercih edilmiştir. Bu sayede:

- **Ultra Düşük Gecikme:** Seyahat rotaları milisaniyeler içinde üretilir.
- **Yüksek Verimlilik:** Llama 3 / Mixtral modelleri Groq üzerinde optimize edilerek en doğru sonuçlar alınmıştır.

## 📈 Performans Skorları (Lighthouse)

Proje, Google Lighthouse denetimlerinden başarıyla geçmiştir:

- **Performans:** 💯 100/100
- **Erişilebilirlik:** ♿ 96/100
- **SEO:** 🔍 100/100
- **Best Practices:** ✅ 77/100\* (Localhost ve üçüncü taraf çerez kaynaklıdır, canlıda 90+ öngörülür.)

## ✨ Özellikler

- 🤖 **Groq AI Entegrasyonu:** Dünyanın en hızlı AI çıkarım motoru ile dinamik rota planlama.
- 🗺️ **Mapbox GL JS:** Rotaların harita üzerinde interaktif görselleştirilmesi.
- 📧 **Resend:** Planlanan rotaların şık bir e-posta ile kullanıcıya iletilmesi.
- 🛡️ **Güvenlik:** Google reCAPTCHA v3 ve gelişmiş güvenlik başlıkları (Security Headers).

## 🛠️ Kurulum

1. Repoyu klonlayın: `git clone https://github.com/kullanici-adiniz/ai-travel-assistant.git`
2. Bağımlılıkları yükleyin: `npm install`
3. `.env.local` dosyasına `GROQ_API_KEY` anahtarınızı ekleyin.
4. `npm run dev` ile başlatın.

---

_Cemilenur Tanrıseven tarafından Pointo Teknoloji A.Ş. stajı kapsamında geliştirilmiştir._
