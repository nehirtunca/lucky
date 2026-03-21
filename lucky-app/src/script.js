// script.js

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("feelingForm");
    const responseContainer = document.getElementById("response");
    const poemContainer = document.getElementById("poem");
    const colorPaletteContainer = document.getElementById("colorPalette");
    const activityContainer = document.getElementById("activity");
    const supportLine = document.getElementById("supportLine");

    form.addEventListener("submit", async function(event) {
        event.preventDefault();
        const feelingInput = document.getElementById("feelingInput").value;

        // Fetch response from Gemini API
        const response = await fetchGeminiResponse(feelingInput);
        responseContainer.innerText = response;

        // Generate a mood-specific poem
        const poem = generatePoem(feelingInput);
        poemContainer.innerText = poem;

        // Suggest a color palette
        const colorPalette = suggestColorPalette(feelingInput);
        colorPaletteContainer.innerHTML = colorPalette.map(color => `<div style="background-color: ${color}; width: 50px; height: 50px; display: inline-block;"></div>`).join('');

        // Recommend a small activity
        const activity = suggestActivity(feelingInput);
        activityContainer.innerText = activity;

        // Display support line
        supportLine.innerText = "Risky expressions? Call 182/112 for support.";
    });

    async function fetchGeminiResponse(feeling) {
        const response = await fetch('YOUR_GEMINI_API_ENDPOINT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_API_KEY'
            },
            body: JSON.stringify({ feeling })
        });
        const data = await response.json();
        return data.response; // Adjust based on actual API response structure
    }

    function generatePoem(feeling) {
        // Simple poem generation logic based on feeling
        return `When I feel ${feeling},\nThe world seems bright,\nWith colors and light,\nEverything feels right.`;
    }

    function suggestColorPalette(feeling) {
        // Simple color palette suggestion based on feeling
        const palettes = {
            happy: ['#FFDDC1', '#FFABAB', '#FFC3A0'],
            sad: ['#A0C4FF', '#B9FBC0', '#FDE74C'],
            angry: ['#FF677D', '#D4A5A5', '#392F5A'],
            calm: ['#B9FBC0', '#A0C4FF', '#FFABAB']
        };
        return palettes[feeling] || ['#FFFFFF']; // Default to white if feeling not found
    }

    function suggestActivity(feeling) {
        const activities = {
            happy: "Go for a walk in the park.",
            sad: "Watch a feel-good movie.",
            angry: "Try some deep breathing exercises.",
            calm: "Read a book or meditate."
        };
        return activities[feeling] || "Take a moment to relax.";
    }
});