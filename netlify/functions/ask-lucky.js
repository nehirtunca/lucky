exports.handler = async function(event) {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    
    if (!GROQ_API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'API anahtarı bulunamadı' })
        };
    }

    const { mood } = JSON.parse(event.body);

    const prompt = `Bir kişinin şu anda hissettiği: "${mood}"

Lütfen aşağıdakileri Türkçe olarak sağla:

1. ŞİİR: Ruh haline uygun, samimi ve 4-6 satırlık bir şiir yaz.
2. ANLAYIŞ: Kişinin duygularını yargılamadan, anlayışlı bir cevap ver (2-3 cümle).
3. RENKLER: Ruh haline uygun 4 renk öner. Format: "#HEX_KOD|Renk Adı" şeklinde.
4. AKTİVİTE: Ruh haline uygun, kısa bir aktivite öner (1-2 cümle).
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
[aktivite önerisi]
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
                {
                    role: 'system',
                    content: 'Sen çok bilge, şefkatli ve anlayışlı bir dostsun. Türkçe yanıt veriyorsun. Yargılamadan, sıcak bir dille karşılık veriyorsun.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 1000,
            temperature: 0.8
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
