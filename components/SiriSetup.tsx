// components/SiriSetup.tsx
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function SiriSetup() {
  const [userId, setUserId] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  
  // Tu enlace del atajo de iCloud (¡El nuevo, que solo pide el ID!)
  const ENLACE_ATAJO = "https://www.icloud.com/shortcuts/e24bc6c2bbce4e35bcc564982e5e38c1"; 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  const copiarID = () => {
    if (userId) {
      navigator.clipboard.writeText(userId);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  if (!userId) return null;

  return (
    <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 max-w-md mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-gray-800">
        🎙️ Conectar con Siri
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Instala el atajo para registrar ventas con tu voz. Solo necesitas copiar tu ID de sincronización:
      </p>

      <div className="mb-6">
        <div className="flex bg-gray-50/50 rounded-xl p-3 border border-gray-100 items-center justify-between">
          <code className="text-sm text-gray-600 truncate mr-3">{userId}</code>
          <button 
            onClick={copiarID}
            className="text-blue-500 font-medium text-sm px-4 py-1.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            {copiado ? '¡Copiado!' : 'Copiar ID'}
          </button>
        </div>
      </div>

      <a 
        href={ENLACE_ATAJO}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center bg-black text-white font-medium py-3.5 rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
      >
        Descargar Atajo
      </a>
    </div>
  );
}