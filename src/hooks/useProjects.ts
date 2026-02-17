import { useEffect, useMemo, useState } from 'react';
import { listProjects, subscribeRealtime } from '@/services/platformStore';

export function useProjects() {
  const [projects, setProjects] = useState(() => listProjects());
  useEffect(() => subscribeRealtime(() => setProjects(listProjects())), []);

  return useMemo(
    () => ({
      projects,
      featuredProjects: projects.slice(0, 3),
    }),
    [projects],
  );
}
