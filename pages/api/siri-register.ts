import type { NextApiRequest, NextApiResponse } from 'next';
import { parseVentasConIA } from '@/lib/gemini'; // El que configuramos antes
import { entrySchema, siriRequestSchema } from '@/lib/validators';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

    try {
        // 1. Validar la entrada del Atajo
        const { texto, userId, token } = siriRequestSchema.parse(req.body);
        // Temporalmente, cambia la línea de validación por esto:
        console.log("Token recibido:", token);
        console.log("Token esperado:", process.env.SIRI_SECRET_TOKEN);
        // Seguridad simple: Verifica un token secreto que tú pongas en tus variables de Netlify
        if (token !== process.env.SIRI_SECRET_TOKEN) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        // 2. Gemini procesa el texto
        const aiResult = await parseVentasConIA(texto);

        // 3. Validar los números que sacó la IA usando tu entrySchema
        const entryData = entrySchema.parse({
            date: new Date().toISOString().split('T')[0], // Fecha actual YYYY-MM-DD
            cash: aiResult.cash,
            card: aiResult.card,
            qr: aiResult.qr,
        });

        // 4. Guardar en Firestore
        const total = entryData.cash + entryData.card + entryData.qr;
        await addDoc(collection(db, 'entries'), {
            userId,
            ...entryData,
            total,
            createdAt: Timestamp.now(),
            method: 'Siri_AI'
        });

        return res.status(200).json({ success: true, total });

    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: 'Error en validación o proceso de IA' });
    }
}