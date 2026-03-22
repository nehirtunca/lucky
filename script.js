// Erişilebilirlik Fonksiyonları
function openModal() {
    document.getElementById('accessibility-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('accessibility-modal').style.display = 'none';
}

function applyAccessibility() {
    const body = document.body;
    body.classList.toggle('large-font', document.getElementById('opt-font').checked);
    body.classList.toggle('high-contrast', document.getElementById('opt-contrast').checked);
    body.classList.toggle('reduce-motion', document.getElementById('opt-anim').checked);
    body.classList.toggle('simple-ui', document.getElementById('opt-simple').checked);
    body.classList.toggle('screen-reader', document.getElementById('opt-reader').checked);
    closeModal();
}

// Mini Destek Kartları
const supportCards = {
    tr: {
        anxiety: [
            { text: "Kaygı bazen çok ağır gelebilir. İstersen birlikte kısa bir nefes egzersizi yapabiliriz 🌿", action: "Nefes egzersizi", type: "breath" },
            { text: "Şu an bunaltıcı hissedebilir. Küçük bir mola vermek iyi gelebilir 💛", action: "Tamam", type: "close" },
            { text: "Kaygıyla baş etmek zor. Ama şu an burada ve güvende olduğunu hatırlatmak istedim 🤍", action: "Teşekkürler", type: "close" }
        ],
        sadness: [
            { text: "Üzgün hissetmek tamamen normal. Biraz zaman ayırman iyi gelebilir 🌧️", action: "Tamam", type: "close" },
            { text: "Bazen sadece oturup hissetmek yeterli. Acele etmene gerek yok 💙", action: "Anladım", type: "close" },
            { text: "Zor günler geçiyor gibi görünüyor. İstersen nefes egzersizi deneyelim mi? 🌿", action: "Deneyelim", type: "breath" }
        ],
        stress: [
            { text: "Stres çok yorucu olabilir. Birkaç dakika durup nefes almak iyi gelebilir 🧘", action: "Nefes egzersizi", type: "breath" },
            { text: "Her şeyi bir anda çözmek zorunda değilsin. Adım adım ilerleyebilirsin 🌱", action: "Tamam", type: "close" },
            { text: "Şu an çok yoğunsun gibi görünüyor. Küçük bir mola hak ediyorsun 💛", action: "Anladım", type: "close" }
        ]
    },
    en: {
        anxiety: [
            { text: "Anxiety can feel really heavy sometimes. Want to try a short breathing exercise together? 🌿", action: "Let's breathe", type: "breath" },
            { text: "It's okay to feel overwhelmed. Taking a small break might help 💛", action: "Okay", type: "close" },
            { text: "You're doing your best, and that's enough. You're safe right now 🤍", action: "Thank you", type: "close" }
        ],
        sadness: [
            { text: "Feeling sad is completely valid. Give yourself some time 🌧️", action: "Okay", type: "close" },
            { text: "Sometimes just sitting with your feelings is enough. No rush 💙", action: "Got it", type: "close" },
            { text: "Tough days happen. Want to try a breathing exercise? 🌿", action: "Let's try", type: "breath" }
        ],
        stress: [
            { text: "Stress can be exhausting. A few minutes of breathing might help 🧘", action: "Breathing exercise", type: "breath" },
            { text: "You don't have to solve everything at once. One step at a time 🌱", action: "Okay", type: "close" },
            { text: "Looks like you're carrying a lot right now. You deserve a small break 💛", action: "Got it", type: "close" }
        ]
    }
};

let lastShownCard = null;
let breathingInterval = null;

function detectSupportType(text) {
    const lower = text.toLowerCase();
    const anxietyWords = ['kaygı', 'endişe', 'korku', 'panik', 'anxiety', 'worried', 'scared', 'panic', 'nervous'];
    const sadWords = ['üzgün', 'mutsuz', 'ağlamak', 'yas', 'özlem', 'sad', 'cry', 'miss', 'depressed', 'lonely'];
    const stressWords = ['stres', 'yorgun', 'bunalmış', 'baskı', 'stress', 'tired', 'overwhelmed', 'pressure', 'exhausted'];

    if (anxietyWords.some(w => lower.includes(w))) return 'anxiety';
    if (sadWords.some(w => lower.includes(w))) return 'sadness';
    if (stressWords.some(w => lower.includes(w))) return 'stress';
    return null;
}

function showSupportCard(mood) {
    if (document.body.classList.contains('reduce-motion')) return;
    
    const type = detectSupportType(mood);
    if (!type) return;

    const cards = supportCards[currentLang][type];
    let card;
    do {
        card = cards[Math.floor(Math.random() * cards.length)];
    } while (card === lastShownCard && cards.length > 1);
    lastShownCard = card;

    document.getElementById('support-card-text').textContent = card.text;
    const btn = document.getElementById('support-card-action');
    btn.textContent = card.action;
    btn.dataset.type = card.type;

    const supportCard = document.getElementById('support-card');
    supportCard.classList.remove('hidden');

    setTimeout(() => {
        if (!supportCard.classList.contains('hidden')) {
            closeSupportCard();
        }
    }, 12000);
}

function closeSupportCard() {
    document.getElementById('support-card').classList.add('hidden');
}

function handleSupportAction() {
    const type = document.getElementById('support-card-action').dataset.type;
    closeSupportCard();
    if (type === 'breath') {
        openBreathExercise();
    }
}

// Nefes Egzersizi
function openBreathExercise() {
    document.getElementById('breath-popup').classList.remove('hidden');
    const t = currentLang === 'tr';
    document.getElementById('breath-title').textContent = t ? '🌿 Birlikte Nefes Alalım' : '🌿 Let\'s Breathe Together';
    document.getElementById('breath-text').textContent = t ? 'Hazır mısın?' : 'Ready?';
    document.getElementById('breath-instruction').textContent = t 
        ? 'Başlatmak için butona bas. 4 saniye nefes al, 4 saniye tut, 4 saniye ver.' 
        : 'Press start. Inhale for 4 seconds, hold for 4, exhale for 4.';
    document.getElementById('breath-start-btn').textContent = t ? 'Başlat' : 'Start';
}

function closeBreathExercise() {
    document.getElementById('breath-popup').classList.add('hidden');
    if (breathingInterval) {
        clearInterval(breathingInterval);
        breathingInterval = null;
    }
}

function startBreathing() {
    const circle = document.getElementById('breath-circle');
    const text = document.getElementById('breath-text');
    const btn = document.getElementById('breath-start-btn');
    const t = currentLang === 'tr';
    
    btn.style.display = 'none';
    let phase = 0;
    const phases = t 
        ? ['Nefes al... 🌬️', 'Tut... ⏸️', 'Nefes ver... 🌿', 'Tut... ⏸️']
        : ['Inhale... 🌬️', 'Hold... ⏸️', 'Exhale... 🌿', 'Hold... ⏸️'];
    
    const classes = ['inhale', '', 'exhale', ''];

    function runPhase() {
        circle.className = 'breath-circle ' + classes[phase];
        text.textContent = phases[phase];
        phase = (phase + 1) % 4;
    }

    runPhase();
    breathingInterval = setInterval(runPhase, 4000);

    setTimeout(() => {
        closeBreathExercise();
        btn.style.display = 'block';
    }, 48000);
}

// Duygu Efektleri
function detectMoodType(text) {
    const positive = ['mutlu', 'sevinç', 'harika', 'güzel', 'umutlu', 'heyecanlı', 'neşeli', 'iyi', 'mükemmel', 'happy', 'excited', 'great', 'wonderful', 'hopeful', 'joy'];
    const negative = ['üzgün', 'mutsuz', 'stres', 'kaygı', 'kötü', 'yorgun', 'bunalmış', 'endişe', 'korku', 'ağlamak', 'sad', 'stressed', 'anxious', 'tired', 'overwhelmed', 'scared'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positive.filter(w => lowerText.includes(w)).length;
    const negativeCount = negative.filter(w => lowerText.includes(w)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
}

function triggerMoodEffect(moodType) {
    if (document.body.classList.contains('reduce-motion')) return;

    const body = document.body;
    body.classList.remove('mood-positive', 'mood-negative', 'mood-neutral');
    body.classList.add(`mood-${moodType}`);

    const count = moodType === 'positive' ? 30 : moodType === 'negative' ? 40 : 15;
    for (let i = 0; i < count; i++) {
        setTimeout(() => createParticle(moodType), i * 80);
    }
}

function createParticle(moodType) {
    const particle = document.createElement('div');
    particle.classList.add('particle', `particle-${moodType}`);

    if (moodType === 'positive') {
        const emojis = ['🌸', '✨', '🌟', '💫', '🎉', '🌺', '💛', '🌈'];
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        particle.style.fontSize = `${Math.random() * 16 + 12}px`;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.bottom = '0';
        particle.style.animationDuration = `${Math.random() * 1.5 + 1}s`;
    } else if (moodType === 'negative') {
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = '0';
        particle.style.animationDuration = `${Math.random() * 1.5 + 0.8}s`;
        particle.style.opacity = `${Math.random() * 0.4 + 0.2}`;
    } else {
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 50}vh`;
        particle.style.animationDuration = `${Math.random() * 2 + 2}s`;
    }

    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 3000);
}

// Dil Sistemi
let currentLang = 'tr';

const translations = {
    tr: {
        modalTitle: 'Deneyiminizi kişiselleştirmek ister misiniz?',
        modalSubtitle: 'Bu adımı atlayabilirsiniz. Ayarlar daha sonra da değiştirilebilir.',
        optFont: '🔤 Yazı boyutunu büyüt',
        optContrast: '🌗 Yüksek kontrast modu',
        optAnim: '⏸️ Animasyonları azalt',
        optSimple: '🧩 Basitleştirilmiş arayüz',
        optReader: '🔊 Ekran okuyucu modu',
        modalSkip: 'Atla',
        modalApply: 'Uygula',
        subtitle: 'Ruh Hâlin Benim Rehberim',
        label: 'Şu an nasıl hissediyorsun?',
        placeholder: 'Duygularını buraya yaz... (Örn: Bugün çok yoruldum, kendimi bunalmış hissediyorum.)',
        submitBtn: "LUCKY'e Anlat",
        titlePoem: '🎭 Şiir',
        titleResponse: '💬 Anlayış',
        titlePalette: '🎨 Renk Paleti',
        titleActivity: '🌟 Aktivite Önerileri',
        riskTitle: '⚠️ Destek Alabilirsin',
        riskText: 'Zor zamanlar geçiriyorsan lütfen yardım istemekten çekinme:',
        supportText: 'Türkiye Psikolojik Destek Hattı — 7/24 Açık',
        supportMessage: 'Yalnız olmadığını bilmeni istiyorum. 💙',
        loadingText: 'LUCKY seni dinliyor...',
        footerText: 'LUCKY — Yapay Zekâ ile Desteklenmektedir',
        alertEmpty: 'Lütfen duygularını yaz.',
        alertError: 'Bir hata oluştu. Lütfen tekrar dene.',
    },
    en: {
        modalTitle: 'Would you like to personalize your experience?',
        modalSubtitle: 'You can skip this step. Settings can be changed later.',
        optFont: '🔤 Increase font size',
        optContrast: '🌗 High contrast mode',
        optAnim: '⏸️ Reduce animations',
        optSimple: '🧩 Simplified interface',
        optReader: '🔊 Screen reader mode',
        modalSkip: 'Skip',
        modalApply: 'Apply',
        subtitle: 'Your Mood Is My Guide',
        label: 'How are you feeling right now?',
        placeholder: 'Write your feelings here... (e.g. I feel overwhelmed today, nothing seems to go right.)',
        submitBtn: 'Tell LUCKY',
        titlePoem: '🎭 Poem',
        titleResponse: '💬 Understanding',
        titlePalette: '🎨 Color Palette',
        titleActivity: '🌟 Activity Suggestions',
        riskTitle: '⚠️ You Can Get Support',
        riskText: 'If you are going through a hard time, please do not hesitate to ask for help:',
        supportText: 'Crisis Support Line — Available 24/7',
        supportMessage: 'I want you to know you are not alone. 💙',
        loadingText: 'LUCKY is listening...',
        footerText: 'LUCKY — Powered by AI',
        alertEmpty: 'Please write how you feel.',
        alertError: 'Something went wrong. Please try again.',
    }
};

function setLang(lang, e) {
    currentLang = lang;
    const t = translations[lang];

    document.getElementById('modal-title').textContent = t.modalTitle;
    document.querySelector('.modal-subtitle').textContent = t.modalSubtitle;
    document.querySelector('label[for="opt-font"] span').textContent = t.optFont;
    document.querySelector('label[for="opt-contrast"] span').textContent = t.optContrast;
    document.querySelector('label[for="opt-anim"] span').textContent = t.optAnim;
    document.querySelector('label[for="opt-simple"] span').textContent = t.optSimple;
    document.querySelector('label[for="opt-reader"] span').textContent = t.optReader;
    document.querySelector('.modal-skip').textContent = t.modalSkip;
    document.querySelector('.modal-apply').textContent = t.modalApply;

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
    if (e && e.target) e.target.classList.add('active');
    document.documentElement.lang = lang;
}

// DOM Elements
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

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeSupportCard();
        closeBreathExercise();
    }
});

function updateCharCount() {
    charCount.textContent = moodInput.value.length;
}

async function handleSubmit() {
    const mood = moodInput.value.trim();
    const t = translations[currentLang];
    if (!mood) { alert(t.alertEmpty); return; }

    const moodType = detectMoodType(mood);
    triggerMoodEffect(moodType);

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

        // Destek kartını göster
        setTimeout(() => showSupportCard(mood), 2000);

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
        const name = line.split('|')[1]?.trim() || 'Renk';
        colors.push({ hex, name });
    });
    while (colors.length < 4) colors.push({ hex: '#D4A5D4', name: 'Renk' });
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
        box.setAttribute('aria-label', `Renk: ${color.name}`);
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
