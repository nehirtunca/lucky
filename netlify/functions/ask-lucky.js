exports.handler = async function(event) {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    
    if (!GROQ_API_KEY) {
        return {
            statusCode: 500,
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
4. ACTIVITY: Suggest a short activity matching their mood (1-2 sentences).
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
[activity suggestion]
---
RISK:
[YES/NO]
---`
        : `Bir kişinin şu anda hissettiği: "${mood}"

Lütfen aşağıdakileri YALNIZCA Türkçe olarak sağla:

1. ŞİİR: Ruh haline uygun, samimi ve 4-6 satırlık bir şiir yaz.
2. ANLAYIŞ: Kişinin duygularını yargılamadan, anlayışlı bir cevap ver (2-3 cümle).
3. RENKLER: Ruh haline uygun 4 renk öner. Format: "#HEX_KOD|Renk Adı" şeklinde. Renk adları Türkçe olsun.
4. AKTİVİTE: Ruh haline uygun, kısa bir aktiv