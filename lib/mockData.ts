export const newsData = [
    {
        id: 1,
        category: "Imtihonlar",
        title: "CEFR Multilevel 2026: Yangi formatda qanday o'zgarishlar kutilmoqda?",
        author: "Abdurauf Halimov",
        date: "23-Yanvar, 2026",
        readTime: "8 min",
        views: "12,450",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070",
        tags: ["CEFR", "Multilevel", "ENWIS", "Ta'lim", "Imtihon2026"],
        content: `
            <p><strong>2026-yil yanvar oyidan</strong> boshlab O'zbekistonda Multilevel imtihon tizimida bir qator muhim yangilanishlar joriy etilishi rejalashtirilgan. Ushbu o'zgarishlar nomzodlarning bilimini yanada obyektiv baholashga qaratilgan.</p>
            
            <p>Eski tizimda <s>faqatgina grammatikaga</s> e'tibor berilgan bo'lsa, yangi formatda <i>communicative competence</i> (muloqot ko'nikmasi) birinchi o'ringa chiqadi. Bu haqda <a href="https://uzbmb.uz" target="_blank" rel="noopener noreferrer">Bilimni baholash agentligi (UZBMB)</a> rasmiy bayonot berdi.</p>

            <h3>Listening qismidagi yangiliklar</h3>
            <p>Yangi formatda audiolarda nafaqat Britaniya, balki Avstraliya va Kanada aksentlari ham ko'proq ishlatiladi. Bu nomzoddan yanada kengroq eshitish ko'nikmasini talab qiladi. Shuningdek, audio fayllar formati quyidagicha kodlangan bo'ladi:</p>
            

            <blockquote>
                "Multilevel imtihonining asosiy maqsadi - nomzodning real hayotdagi muloqot darajasini aniqlashdir. Shuning uchun savollar yanada praktik xarakterga ega bo'ladi."
            </blockquote>

            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071" alt="ENWIS platformasida o'quv jarayoni" />

            <h3>Writing Task 2: Akademik tahlil</h3>
            <p>Endilikda insho mavzulari ko'proq <u>ijtimoiy va texnologik</u> muammolarga qaratiladi. Lug'at boyligi (Vocabulary) va mantiqiy bog'liqlik (Coherence) uchun beriladigan ballar ulushi oshirilgan.</p>
            
            <ul>
                <li><strong>Grammatik aniqlik:</strong> Murakkab gaplardan foydalanish;</li>
                <li><strong>Leksik boylik:</strong> <i>Synonyms</i> va <i>Academic collocations</i>;</li>
                <li><strong>Mantiqiy izchillik:</strong> Paragraflar o'rtasidagi bog'liqlik.</li>
            </ul>

            <p>Agar siz ushbu o'zgarishlarga tayyor bo'lmoqchi bo'lsangiz, <a href="/dashboard/test">ENWIS Simulator</a> tizimida yangilangan formatdagi testlarni topshirib ko'rishingiz mumkin. Bu tizim <code>AI v2.4</code> algoritmi asosida ishlaydi.</p>
        `
    },
    {
        id: 2,
        category: "Texnologiya",
        title: "Sun'iy intellekt Speaking darajasini aniqlashda 98% aniqlikka erishdi",
        author: "Malika Qodirova",
        date: "22-Yanvar, 2026",
        readTime: "5 min",
        views: "8,900",
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070",
        tags: ["AI", "Speaking", "Technology", "Future"],
        content: `
            <p>Zamonaviy texnologiyalar ta'lim sohasiga shiddat bilan kirib kelmoqda. Xususan, <b>AI-Speaking</b> tizimlari endi inson-imtihon oluvchilardan qolishmaydigan darajada aniq natija bermoqda.</p>
            
            <h3>Tizim qanday ishlaydi?</h3>
            <p>Algoritmlar nomzodning talaffuzi (<i>pronunciation</i>), ravonligi (<i>fluency</i>) va gap tuzilishidagi xatolarni soniyalar ichida tahlil qiladi. Tahlil natijalari <code>JSON</code> formatida quyidagicha saqlanadi:</p>
            
            <pre><code>{
  "score": 7.5,
  "fluency": "High",
  "accuracy": 0.98,
  "feedback": "Minor errors in prepositions"
}</code></pre>

            <p>Batafsil ma'lumotni <a href="https://openai.com" target="_blank">ushbu manba</a> orqali o'qishingiz mumkin. Hozirda tizim <u>beta-test</u> bosqichida va <s>xatolar soni</s> minimal darajaga tushirilgan.</p>
        `
    }
];

export const popularNews = [
    { id: 1, title: "Multilevel imtihonlari formati o'zgarmoqda: Nomzodlar uchun qo'llanma", time: "10:45", views: "5.4k" },
    { id: 3, title: "IELTS 7.0 ball olgan o'quvchilarga qanday imtiyozlar beriladi?", time: "09:20", views: "8.1k" },
    { id: 4, title: "Tramp Grenlandiyani sotib olmoqchi – AQSh tarixida nimalar bo'lgan?", time: "23:36", views: "12.0k" },
    { id: 2, title: "Sun'iy intellekt testlarda insonni o'rnini bosa oladimi?", time: "Kecha", views: "9.2k" }
];