import type { NextApiRequest, NextApiResponse } from 'next';
import { parseVentasConIA } from '@/lib/gemini';
import { entrySchema, siriRequestSchema } from '@/lib/validators';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

    try {
        const { texto, userId, token } = siriRequestSchema.parse(req.body);

        if (token !== process.env.SIRI_SECRET_TOKEN) {
            console.error("Token incorrecto");
            return res.status(401).json({ error: 'No autorizado' });
        }

        const aiResult = await parseVentasConIA(texto);

        const entryData = entrySchema.parse({
            date: new Date().toISOString().split('T')[0],
            cash: aiResult.cash,
            card: aiResult.card,
            qr: aiResult.qr,
        });

        const total = entryData.cash + entryData.card + entryData.qr;
        await addDoc(collection(db, 'entries'), {
            userId,
            ...entryData,
            total,
            createdAt: Timestamp.now(),
            method: 'Siri_AI'
        });

        const mensajeParaSiri = `Listo. Registré ${aiResult.cash} en efectivo, ${aiResult.qr} en QR, y ${aiResult.card} en tarjeta.`;

        return res.status(200).json({
            success: true,
            total,
            mensaje: mensajeParaSiri
        });

    } catch (error: any) {
        console.error("DETALLE DEL ERROR:", error);
        return res.status(400).json({
            error: 'Error interno',
            detalle: error.message || error.toString()
        });
    }
}