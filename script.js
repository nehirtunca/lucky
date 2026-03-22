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
    
    showLoading(true);
    resultsSection.classList.add('hidden');
    riskAlert.classList.add('hidden');
    
    try {
        const response = await fetch('/.netlify/functions/ask-lucky', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mood })
        });
        const data = await response.json();
        displayResults(parseResponse(data.result));
    } catch (error) {
        console.error('Hata:', error);
        alert('Bir hata oluştu. Lütfen tekrar dene.');
    } finally {
        showLoading(false);
    }
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
