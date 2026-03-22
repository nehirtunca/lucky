let currentLang = 'tr';

const translations = {
    tr: {
        subtitle: 'Ruh Hâlin Benim Rehberim',
        label: 'Şu an nasıl hissediyorsun?',
        placeholder: 'Duygularını buraya yaz... (Örn: Bugün çok yoruldum, kendimi bunalmış hissediyorum.)',
        submitBtn: "LUCKY'e Anlat",
        titlePoem: '🎭 Şiir',
        titleResponse: '💬 Anlayış',
        titlePalette: '🎨 Renk Paleti',
        titleActivity: '🌟 Aktivite Önerisi',
        riskTitle: '⚠️ Destek Alabilirsin',
        riskText: 'Zor zamanlar geçiriyorsan lütfen yardım istemekten çekinme:',
        supportText: 'Türkiye Psikolojik Destek Hattı — 7/24 Açık',
        supportMessage: 'Yalnız olmadığını bilmeni istiyorum. 💙',
        loadingText: 'LUCKY seni dinliyor...',
        footerText: 'LUCKY — Yapay Zekâ ile Desteklenmektedir',
        alertEmpty: 'Lütfen duygularını yaz.',
        alertError: 'Bir hata oluştu. Lütfen tekrar dene.',
        systemPrompt: 'Sen çok bilge, şefkatli ve anlayışlı bir dostsun. Yalnızca Türkçe yanıt veriyorsun. Yargılamadan, sıcak bir dille karşılık veriyorsun. Yanıtında kesinlikle başka dil kullanma.',
        userPrompt: (mood) => `Bir kişinin şu anda hissettiği: "${mood}"

Lütfen aşağıdakileri YALNIZCA Türkçe olarak sağla:

1. ŞİİR: Ruh haline uygun, samimi ve 4-6 satırlık bir şiir yaz.
2. ANLAYIŞ: Kişinin duygularını yargılamadan, anlayışlı bir cevap ver (2-3 cümle).
3. RENKLER: Ruh haline uygun 4 renk öner. Format: "#HEX_KOD|Renk Adı" şeklinde. Renk adları Türkçe olsun.
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
---`
    },
    en: {
        subtitle: 'Your Mood Is My Guide',
        label: 'How are you feeling right now?',
        placeholder: 'Write your feelings here... (e.g. I feel overwhelmed today, nothing seems to go right.)',
        submitBtn: 'Tell LUCKY',
        titlePoem: '🎭 Poem',
        titleResponse: '💬 Understanding',
        titlePalette: '🎨 Color Palette',
        titleActivity: '🌟 Activity Suggestion',
        riskTitle: '⚠️ You Can Get Support',
        riskText: 'If you are going through a hard time, please do not hesitate to ask for help:',
        supportText: 'Crisis Support Line — Available 24/7',
        supportMessage: 'I want you to know you are not alone. 💙',
        loadingText: 'LUCKY is listening...',
        footerText: 'LUCKY — Powered by AI',
        alertEmpty: 'Please write how you feel.',
        alertError: 'Something went wrong. Please try again.',
        systemPrompt: 'You are a wise, compassionate and understanding friend. You only respond in English. You are warm and non-judgmental. Never use any other language in your response.',
        userPrompt: (mood) => `A person is currently feeling: "${mood}"

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
    }
};

function setLang(lang) {
    currentLang = lang;
    const t = translations[lang];

    document.getElementById('subtitle').textContent = t.subtitle;
    document.getElementById('label-text').textContent = t.label;
    document.getElementById('mood-input').placeholder = t.placeholder;
    document.getElementById('submit-btn').textContent = t.submitBtn;
    document.getElementById('title-poem').textContent = t.titlePoem;
    document.getElementById('title-response').textContent = t.titleResponse;
    document.getElementById('title-palette').textContent = t.titlePalette;
    document.getElementById('title-activity').textContent = t.titleActivity;
    document.getElementById('risk-title').textContent = t.riskTitle;
    document.getElementById('risk-text').textContent = t.riskText;
    document.getElementById('support-text').textContent = t.supportText;
    document.getElementById('support-message').textContent = t.supportMessage;
    document.getElementById('loading-text').textContent = t.loadingText;
    document.getElementById('footer-text').textContent = t.footerText;

    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    document.documentElement.lang = lang;
}

const moodInput = document.getElementById('mood-input');
const submitBtn = document.getElementById('submit-btn');
const charCount = document.getElementById('char-count');
const resultsSection = document.getElementById('results');
const riskAlert = document.getElementById('risk-alert');
const loadingDiv = document.getElementById('loading');

moodInput.addEventListener('input', updateCharCount);
submitBtn.addEventListener('click', handleSubmit);
moodInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') handleSubmit();
});

function updateCharCount() {
    charCount.textContent = moodInput.value.length;
}

async function handleSubmit() {
    const mood = moodInput.value.trim();
    const t = translations[currentLang];
    if (!mood) { alert(t.alertEmpty); return; }

    showLoading(true);
    resultsSection.classList.add('hidden');
    riskAlert.classList.add('hidden');

    try {
        const response = await fetch('/.netlify/functions/ask-lucky', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mood, lang: currentLang })
        });
        const data = await response.json();
        displayResults(parseResponse(data.result));
    } catch (error) {
        console.error('Hata:', error);
        alert(t.alertError);
    } finally {
        showLoading(false);
    }
}

function parseResponse(text) {
    const isEn = currentLang === 'en';
    const sections = text.split('---').map(s => s.trim());
    const result = { poem: '', response: '', colors: [], activity: '', hasRisk: false };
    sections.forEach(section => {
        if (section.includes('ŞİİR:') || section.includes('POEM:'))
            result.poem = section.replace('ŞİİR:', '').replace('POEM:', '').trim();
        else if (section.includes('ANLAYIŞ:') || section.includes('UNDERSTANDING:'))
            result.response = section.replace('ANLAYIŞ:', '').replace('UNDERSTANDING:', '').trim();
        else if (section.includes('RENKLER:') || section.includes('COLORS:'))
            result.colors = parseColors(section.replace('RENKLER:', '').replace('COLORS:', '').trim());
        else if (section.includes('AKTİVİTE:') || section.includes('ACTIVITY:'))
            result.activity = section.replace('AKTİVİTE:', '').replace('ACTIVITY:', '').trim();
        else if (section.includes('RİSK:') || section.includes('RISK:'))
            result.hasRisk = section.replace('RİSK:', '').replace('RISK:', '').trim().toUpperCase().includes(isEn ? 'YES' : 'EVET');
    });
    return result;
}

function parseColors(colorText) {
    const colors = [];
    colorText.split('\n').filter(l => l.trim()).forEach(line => {
        const hex = line.match(/#[0-9A-Fa-f]{6}/)?.[0] || '#D4A5D4';
        const name = line.split('|')[1]?.trim() || 'Color';
        colors.push({ hex, name });
    });
    while (colors.length < 4) colors.push({ hex: '#D4A5D4', name: 'Color' });
    return colors.slice(0, 4);
}

function displayResults(result) {
    document.getElementById('poem-result').textContent = result.poem;
    document.getElementById('response-result').textContent = result.response;
    const paletteDiv = document.getElementById('palette-result');
    paletteDiv.innerHTML = '';
    result.colors.forEach(color => {
        const box = document.createElement('div');
        box.className = 'color-box';
        box.style.backgroundColor = color.hex;
        box.textContent = color.name;
        paletteDiv.appendChild(box);
    });
    document.getElementById('activity-result').textContent = result.activity;
    if (result.hasRisk) riskAlert.classList.remove('hidden');
    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showLoading(show) {
    loadingDiv.classList.toggle('hidden', !show);
    submitBtn.disabled = show;
}