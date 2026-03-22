exports.handler = async function(event) {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    
    if (!GROQ_API_KEY) {
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'API anahtarı bulunamadı' })
        };
    }

    const { mood, lang } = JSON.parse(event.body);
    const isEn = lang === 'en';

    const systemPrompt = isEn
        ? 'You are a wise, compassionate and understanding friend. You only respond in English. You are warm and non-judgmental. Never use any other language in your response.'
        : 'Sen çok bilge, şefkatli ve anlayışlı bir dostsun. Yalnızca Türkçe yanıt veriyorsun. Yargılamadan, sıcak bir dille karşılık veriyorsun. Yanıtında kesinlikle başka dil kullanma.';

    const userPrompt = isEn
        ? `A person is currently feeling: "${mood}"

Please provide the following ONLY in English:

1. POEM: Write a sincere 4-6 line poem matching their mood.
2. UNDERSTANDING: Give a warm, non-judgmental response (2-3 sentences).
3. COLORS: Suggest 4 colors matching their mood. Format: "#HEX_CODE|Color Name" one per line.
4. ACTIVITY: Suggest 3 different activities from DIFFERENT categories below. Each on a new line starting with its emoji. Never repeat the same activity type. Choose from:
   - 🏃 Physical (walking, yoga, stretching)
   - 🧠 Mental (puzzle, reading, journaling)
   - 👥 Social (call a friend, join an event)
   - 🎨 Creative (drawing, music, writing)
   - 🧘 Relaxing (meditation, breathing, rest)
5. RISK: If the message contains dangerous expressions like suicide, death, self-harm write "YES", otherwise write "NO".

Format:
---
POEM:
[poem text]
---
UNDERSTANDING:
[understanding response]
---
COLORS:
[color1]
[color2]
[color3]
[color4]
---
ACTIVITY:
[activity 1]
[activity 2]
[activity 3]
---
RISK:
[YES/NO]
---`
        : `Bir kişinin şu anda hissettiği: "${mood}"

Lütfen aşağıdakileri YALNIZCA Türkçe olarak sağla:

1. ŞİİR: Ruh haline uygun, samimi ve 4-6 satırlık bir şiir yaz.
2. ANLAYIŞ: Kişinin duygularını yargılamadan, anlayışlı bir cevap ver (2-3 cümle).
3. RENKLER: Ruh haline uygun 4 renk öner. Format: "#HEX_KOD|Renk Adı" şeklinde. Renk adları Türkçe olsun.
4. AKTİVİTE: Aşağıdaki kategorilerden FARKLI 3 aktivite öner. Her biri yeni satırda ve emojisiyle başlasın. Aynı türde aktivite tekrar etme. Kategoriler:
   - 🏃 Fiziksel (yürüyüş, yoga, esneme)
   - 🧠 Zihinsel (bulmaca, okuma, yazma)
   - 👥 Sosyal (arkadaşla konuşma, etkinlik)
   - 🎨 Yaratıcı (çizim, müzik, içerik üretimi)
   - 🧘 Dinlendirici (meditasyon, nefes egzersizi)
5. RİSK: Mesajda intihar, ölüm, zarar gibi tehlikeli ifadeler varsa "EVET", yoksa "HAYIR" yaz.

Format:
---
ŞİİR:
[şiir metni]
---
ANLAYIŞ:
[anlayış cevabı]
---
RENKLER:
[renk1]
[renk2]
[renk3]
[renk4]
---
AKTİVİTE:
[aktivite 1]
[aktivite 2]
[aktivite 3]
---
RİSK:
[EVET/HAYIR]
---`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            max_tokens: 1000,
            temperature: 0.9
        })
    });

    const data = await response.json();
    
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
            result: data.choices[0].message.content 
        })
    };
};
