import { useEffect, useState } from 'react';
import { subscribeRealtime } from '@/services/platformStore';

export function useRealtime() {
  const [lastEventAt, setLastEventAt] = useState(Date.now());
  useEffect(() => subscribeRealtime(() => setLastEventAt(Date.now())), []);
  return { lastEventAt };
}
