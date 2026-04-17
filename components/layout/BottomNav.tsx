// Bottom navigation bar
// components/layout/BottomNav.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2, Clock, Settings } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Inicio', icon: Home },
  { href: '/analytics', label: 'Análisis', icon: BarChart2 },
  { href: '/history', label: 'Historial', icon: Clock },
  { href: '/settings', label: 'Ajustes', icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 safe-bottom"
      style={{
        background: 'rgba(13, 13, 20, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-subtle)',
        zIndex: 40,
      }}
    >
      <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (pathname?.startsWith(href + '/') ?? false);
          return (
            <Link key={href} href={href} className="nav-item" data-active={isActive}
              style={{
                color: isActive ? '#A78BFA' : 'var(--text-muted)',
              }}
            >
              <span className={`nav-icon ${isActive ? 'active' : ''}`}
                style={{
                  background: isActive ? 'rgba(124,58,237,0.15)' : 'transparent',
                  color: isActive ? '#A78BFA' : 'var(--text-muted)',
                }}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </span>
              <span style={{ fontSize: '0.6875rem', fontWeight: isActive ? 600 : 500 }}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
