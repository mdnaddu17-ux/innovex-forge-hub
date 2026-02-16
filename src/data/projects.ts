import { supabase } from '@/lib/supabase';

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  components: string;
  video: string;
  sourceCode: string;
  uploadedBy?: string;
}

interface DbProject {
  id: string;
  title: string;
  description: string;
  image_url: string;
  components: string | null;
  video_link: string | null;
  source_code: string | null;
  uploaded_by: string | null;
}

function mapRow(row: DbProject): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.image_url,
    components: row.components ?? '',
    video: row.video_link ?? '',
    sourceCode: row.source_code ?? '',
    uploadedBy: row.uploaded_by ?? undefined,
  };
}

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error.message);
    return [];
  }

  return (data as DbProject[]).map(mapRow);
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return mapRow(data as DbProject);
}
