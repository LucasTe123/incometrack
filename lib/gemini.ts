// lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function parseVentasConIA(dictado: string) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    Extrae los montos de ventas del siguiente texto: "${dictado}".
    Responde ÚNICAMENTE en formato JSON puro, sin texto extra, con esta estructura:
    {"cash": number, "qr": number, "card": number}
    Si no se menciona alguno, pon 0.
  `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
}