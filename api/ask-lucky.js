export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    
    if (!GROQ_API_KEY) {
        return res.status(500).json({ error: 'API anahtarı bulunamadı' });
    }

    const { mood, lang } = req.body;
    const isEn = lang === 'en';

    const systemPrompt = isEn
        ? `You are a warm, empathetic and understanding friend — not a therapist or a robot. 
You speak naturally, like a close friend would. You use casual, conversational language.
You only respond in English. Never use formal or robotic language.
Use gentle suggestions, never commands. Show genuine care and empathy.
You can use small emojis occasionally but don't overdo it.`
        : `Sen sıcak, empatik ve anlayışlı bir dostsun — terapist ya da robot değil.
Konuşma diline yakın, samimi ve doğal bir dille yazıyorsun.
Sanki yanında oturan yakın bir arkadaşın gibi hitap ediyorsun.
Yalnızca Türkçe yanıt veriyorsun. Resmi ve mekanik ifadelerden kaçın.
Öneri sunarken zorlamadan, nazikçe yaklaş. Emir kipi kullanma.
Zaman zaman küçük emoji kullanabilirsin ama abartma.`;

    const userPrompt = isEn
        ? `Someone is feeling: "${mood}"

Please respond ONLY in English, in a warm and natural conversational tone.

1. POEM: Write a heartfelt 4-6 line poem matching their mood.
2. UNDERSTANDING: Respond with empathy and warmth, 2-3 sentences.
3. COLORS: Suggest 4 colors. Format: "#HEX_CODE|Color Name" one per line.
4. ACTIVITY: Suggest 3 activities from DIFFERENT categories, written naturally like a friend suggesting something:
   - 🏃 Physical
   - 🧠 Mental
   - 👥 Social
   - 🎨 Creative
   - 🧘 Relaxing
5. RISK: "YES" if dangerous expressions, otherwise "NO".

Format:
---
POEM:
[poem text]
---
UNDERSTANDING:
[response]
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
        : `Biri şu an şunu hissediyor: "${mood}"

Lütfen YALNIZCA Türkçe, sıcak ve samimi bir dille yanıt ver.

1. ŞİİR: 4-6 satırlık içten bir şiir yaz.
2. ANLAYIŞ: Sanki yanında oturuyormuşsun gibi, 2-3 cümle.
3. RENKLER: 4 renk öner. Format: "#HEX_KOD|Renk Adı"
4. AKTİVİTE: FARKLI 3 kategoriden aktivite öner, arkadaşça bir dille:
   - 🏃 Fiziksel
   - 🧠 Zihinsel
   - 👥 Sosyal
   - 🎨 Yaratıcı
   - 🧘 Dinlendirici
5. RİSK: Tehlikeli ifadeler varsa "EVET", yoksa "HAYIR".

Format:
---
ŞİİR:
[şiir metni]
---
ANLAYIŞ:
[cevap]
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

    try {
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
                max_tokens: 1200,
                temperature: 0.9
            })
        });

        const data = await response.json();
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(200).json({ 
            result: data.choices[0].message.content 
        });
    } catch (error) {
        return res.status(500).json({ error: 'Bir hata oluştu' });
    }
}
