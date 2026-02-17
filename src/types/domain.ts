export type Role = 'admin' | 'creator' | 'viewer';
export type PublicRole = Role | 'guest';

export interface UserRecord {
  id: string;
  user_id: string;
  password_hash: string;
  name: string;
  college?: string;
  role: Role;
  created_at: string;
}

export interface SessionRecord {
  token: string;
  user_id: string;
  expires_at: string;
  created_at: string;
}

export interface FileRecord {
  id: string;
  project_id?: string;
  owner_user_id: string;
  file_name: string;
  mime_type: string;
  size: number;
  storage_url: string;
  created_at: string;
}

export interface ProjectRecord {
  id: string;
  owner_user_id: string;
  title: string;
  description: string;
  image_url: string;
  components: string;
  source_code: string;
  video_link?: string;
  created_at: string;
  updated_at: string;
}

export interface GoalRecord {
  id: string;
  text: string;
  image_url: string;
  created_at: string;
}

export interface ActivityLogRecord {
  id: string;
  actor_user_id: string;
  action: string;
  entity_type: 'user' | 'project' | 'goal' | 'file' | 'session';
  entity_id: string;
  created_at: string;
}

export interface PlatformState {
  users: UserRecord[];
  sessions: SessionRecord[];
  files: FileRecord[];
  projects: ProjectRecord[];
  goals: GoalRecord[];
  activityLogs: ActivityLogRecord[];
}
