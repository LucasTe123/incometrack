// lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function parseVentasConIA(dictado: string) {
    // Usamos gemini-1.5-flash por ser más rápido y estable
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Extrae los montos de ventas del siguiente texto: "${dictado}".
    Responde ÚNICAMENTE en formato JSON puro, sin texto extra, con esta estructura:
    {"cash": number, "qr": number, "card": number}
    Si no se menciona alguno, pon 0.
  `;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    // Limpiamos las etiquetas de Markdown que añade la IA para evitar el error de "Unexpected token"
    const cleanedText = rawText.replace(/```json/gi, '').replace(/```/gi, '').trim();

    return JSON.parse(cleanedText);
}