// lib/gemini.ts

export async function parseVentasConIA(dictado: string) {
    const prompt = `
    Extrae los montos de ventas del siguiente texto: "${dictado}".
    Responde ÚNICAMENTE en formato JSON puro, sin texto extra, con esta estructura:
    {"cash": number, "qr": number, "card": number}
    Si no se menciona alguno, pon 0.
  `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://luminous-tartufo-314a0e.netlify.app", // Tu URL para OpenRouter
            "X-Title": "IncomeTrack"
        },
        body: JSON.stringify({
            model: "google/gemini-2.0-flash-001", // Modelo exacto en OpenRouter
            messages: [{ role: "user", content: prompt }]
        })
    });

    // ... (arriba queda igual, el fetch)

    const data = await response.json();

    // --- ESTO ES LO NUEVO PARA DEBUGEAR ---
    // Si OpenRouter manda un error oficial, lo mostramos en la pantalla
    if (data.error) {
        throw new Error(`OpenRouter dice: ${data.error.message || JSON.stringify(data.error)}`);
    }

    if (!data.choices || !data.choices[0]) {
        // Si manda algo raro que no es error pero tampoco texto, mostramos qué es
        throw new Error(`Respuesta rara: ${JSON.stringify(data)}`);
    }
    // --------------------------------------

    const rawText = data.choices[0].message.content;

    // Limpiamos las etiquetas de Markdown
    const cleanedText = rawText.replace(/```json/gi, '').replace(/```/gi, '').trim();

    return JSON.parse(cleanedText);
}