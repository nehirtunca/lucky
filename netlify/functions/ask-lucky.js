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

Please respond ONLY in English, in a warm and natural conversational tone — like a caring friend, not a robot.

1. POEM: Write a heartfelt 4-6 line poem that feels personal and genuine, matching their mood.

2. UNDERSTANDING: Respond with empathy and warmth, as if you're sitting right next to them. Use casual, friendly language. 2-3 sentences. Never say "I understand your feelings" in a robotic way.

3. COLORS: Suggest 4 colors that match their mood. Format: "#HEX_CODE|Color Name" one per line.

4. ACTIVITY: Suggest 3 activities from DIFFERENT categories below. Write them in a gentle, inviting way — like a friend suggesting something, not a doctor prescribing. Use natural language and small emojis. Never use commands.
   - 🏃 Physical (e.g. "Maybe a short walk outside could help clear your head 🌿")
   - 🧠 Mental (e.g. "If you feel like it, writing down your thoughts might feel good ✍️")
   - 👥 Social (e.g. "Reaching out to someone you trust could be really comforting 💛")
   - 🎨 Creative (e.g. "You could try doodling or listening to music that matches your mood 🎵")
   - 🧘 Relaxing (e.g. "Taking a few slow deep breaths might help more than you think 🧘")

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
        : `Biri şu an şunu hissediyor: "${mood}"

Lütfen YALNIZCA Türkçe olarak, sıcak ve doğal bir konuşma diliyle yanıt ver — bir robot gibi değil, anlayışlı bir arkadaş gibi.

1. ŞİİR: O anki ruh haline uygun, içten ve samimi 4-6 satırlık bir şiir yaz. Klişelerden kaçın.

2. ANLAYIŞ: Sanki yanında oturuyormuşsun gibi, sıcak ve samimi bir dille karşılık ver. 2-3 cümle. "Duygularını anlıyorum" gibi robotik ifadeler kullanma. Doğal ve empatik ol.

3. RENKLER: Ruh haline uygun 4 renk öner. Format: "#HEX_KOD|Renk Adı" şeklinde. Renk adları Türkçe olsun.

4. AKTİVİTE: Aşağıdaki kategorilerden FARKLI 3 aktivite öner. Bir arkadaşın öneri sunduğu gibi yaz — doğal, nazik ve samimi. Emir kipi kullanma. Küçük emoji kullanabilirsin.
   - 🏃 Fiziksel (örn: "Belki kısa bir yürüyüş iyi gelebilir, temiz hava bazen mucizeler yaratır 🌿")
   - 🧠 Zihinsel (örn: "İstersen aklındakileri bir kağıda dökmek rahatlatabilir ✍️")
   - 👥 Sosyal (örn: "Güvendiğin biriyle konuşmak şu an çok iyi gelebilir 💛")
   - 🎨 Yaratıcı (örn: "Serbest çizim yapmak ya da sevdiğin müziği açmak da güzel olabilir 🎵")
   - 🧘 Dinlendirici (örn: "Birkaç dakika sadece nefesine odaklanmayı denesene, şaşırabilirsin 🧘")

5. RİSK: Mesajda intihar, ölüm, kendine zarar verme gibi tehlikeli ifadeler varsa "EVET", yoksa "HAYIR" yaz.

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
            max_tokens: 1200,
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
