import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function SiriSetup() {
  const [userId, setUserId] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  
  // ¡No olvides volver a pegar tu enlace aquí!
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
    <div 
      className="p-6 rounded-3xl relative overflow-hidden mb-6"
      style={{
        background: 'linear-gradient(135deg, rgba(61,26,120,0.3) 0%, rgba(30,16,101,0.3) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(124,58,237,0.2)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
      }}
    >
      {/* Luces de fondo estilo Apple */}
      <div style={{
        position: 'absolute', top: -30, right: -30,
        width: 120, height: 120, borderRadius: '50%',
        background: 'rgba(124,58,237,0.15)', pointerEvents: 'none',
      }} />

      <div className="relative z-10">
        <h2 className="text-lg font-bold mb-2 flex items-center gap-2 tracking-wide" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          🎙️ Conectar con Siri
        </h2>
        <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Instala el atajo para dictar tus ventas. Solo necesitas copiar tu ID de sincronización:
        </p>

        <div className="mb-6">
          <div className="flex bg-black/40 rounded-2xl p-3 border border-purple-500/20 items-center justify-between backdrop-blur-md">
            <code className="text-sm truncate mr-3 font-mono" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {userId}
            </code>
            <button 
              onClick={copiarID}
              className="font-semibold text-xs px-4 py-2 rounded-xl transition-all duration-300"
              style={{
                backgroundColor: copiado ? 'rgba(16, 185, 129, 0.15)' : 'rgba(124,58,237,0.15)',
                color: copiado ? '#34D399' : '#A78BFA',
                border: `1px solid ${copiado ? 'rgba(52, 211, 153, 0.3)' : 'rgba(124,58,237,0.3)'}`
              }}
            >
              {copiado ? '¡Copiado!' : 'Copiar ID'}
            </button>
          </div>
        </div>

        <a 
          href={ENLACE_ATAJO}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center font-bold py-3.5 rounded-2xl transition-all duration-300 hover:scale-[0.98]"
          style={{
            background: 'linear-gradient(to right, #7C3AED, #4F46E5)',
            color: 'white',
            boxShadow: '0 8px 20px rgba(124,58,237,0.3)'
          }}
        >
          Descargar Atajo
        </a>
      </div>
    </div>
  );
}