const API_KEY ='AIzaSyAxFjsJEDt4oq3GavS5nvJqc-2Ox1q5oXg'; // Buraya kendi anahtarını yapıştır!
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

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
    if (!mood) { alert('Lütfen duygularını yaz'); return; }
    if (!API_KEY || API_KEY === 'YOUR_GEMINI_API_KEY') {
        alert('Lütfen API anahtarını ekle!'); return;
    }
    showLoading(true);
    resultsSection.classList.add('hidden');
    riskAlert.classList.add('hidden');
    try {
        const response = await callGeminiAPI(mood);
        displayResults(response);
    } catch (error) {
        console.error('API Error:', error);
        alert('Bir hata oluştu. İnternet bağlantını kontrol et.');
    } finally {
        showLoading(false);
    }
}

async function callGeminiAPI(mood) {
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

    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    const data = await response.json();
    return parseResponse(data.candidates[0].content.parts[0].text);
}

function parseResponse(text) {
    const sections = text.split('---').map(s => s.trim());
    const result = { poem: '', response: '', colors: [], activity: '', hasRisk: false };
    sections.forEach(section => {
        if (section.includes('ŞİİR:')) result.poem = section.replace('ŞİİR:', '').trim();
        else if (section.includes('ANLAYIŞ:')) result.response = section.replace('ANLAYIŞ:', '').trim();
        else if (section.includes('RENKLER:')) result.colors = parseColors(section.replace('RENKLER:', '').trim());
        else if (section.includes('AKTİVİTE:')) result.activity = section.replace('AKTİVİTE:', '').trim();
        else if (section.includes('RİSK:')) result.hasRisk = section.replace('RİSK:', '').trim().toUpperCase().includes('EVET');
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
document.addEventListener('mousemove', (e) => {
    document.body.style.setProperty('--mx', e.clientX + 'px');
    document.body.style.setProperty('--my', e.clientY + 'px');
    const glow = document.querySelector('body::before');
});