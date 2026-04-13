// App Providers — wraps auth listener + offline sync at root
// components/AppProviders.tsx

'use client';

import { useAuthListener } from '@/hooks/useAuth';
import { useOfflineSync } from '@/hooks/useOfflineSync';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  useAuthListener();
  useOfflineSync();
  return <>{children}</>;
}
