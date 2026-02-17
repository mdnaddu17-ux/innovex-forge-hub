import type {
  FileRecord,
  GoalRecord,
  PlatformState,
  ProjectRecord,
  Role,
  SessionRecord,
  UserRecord,
} from '@/types/domain';

const STORAGE_KEY = 'innovex.platform.state.v2';
const ACTIVE_SESSION_KEY = 'innovex.platform.activeSession';
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;

const listeners = new Set<() => void>();
const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('innovex-realtime') : null;
channel?.addEventListener('message', () => listeners.forEach((l) => l()));

function emitRealtime() {
  listeners.forEach((l) => l());
  channel?.postMessage({ type: 'state-change' });
}

function hashPassword(value: string) {
  return btoa(unescape(encodeURIComponent(value))).split('').reverse().join('');
}

function nowIso() {
  return new Date().toISOString();
}

function seedState(): PlatformState {
  const adminId = crypto.randomUUID();
  return {
    users: [
      {
        id: adminId,
        user_id: 'admin',
        password_hash: hashPassword('admin123'),
        name: 'Platform Admin',
        role: 'admin',
        created_at: nowIso(),
      },
    ],
    sessions: [],
    files: [],
    projects: [],
    goals: [],
    activityLogs: [],
  };
}

function loadState(): PlatformState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = seedState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  return JSON.parse(raw) as PlatformState;
}

function saveState(state: PlatformState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  emitRealtime();
}

function withState<T>(fn: (state: PlatformState) => T): T {
  const state = loadState();
  const result = fn(state);
  saveState(state);
  return result;
}

export function subscribeRealtime(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function listProjects() {
  return loadState().projects.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function getProject(id: string) {
  return loadState().projects.find((p) => p.id === id) ?? null;
}

export function createProject(input: Omit<ProjectRecord, 'id' | 'created_at' | 'updated_at'>) {
  return withState((state) => {
    const record: ProjectRecord = { ...input, id: crypto.randomUUID(), created_at: nowIso(), updated_at: nowIso() };
    state.projects.push(record);
    return record;
  });
}

export function deleteProject(id: string) {
  return withState((state) => {
    state.projects = state.projects.filter((p) => p.id !== id);
  });
}

export function listGoals() {
  return loadState().goals.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function createGoal(text: string, image_url: string) {
  return withState((state) => {
    const goal: GoalRecord = { id: crypto.randomUUID(), text, image_url, created_at: nowIso() };
    state.goals.push(goal);
    return goal;
  });
}

export function deleteGoal(id: string) {
  return withState((state) => {
    state.goals = state.goals.filter((g) => g.id !== id);
  });
}

export function listUsers() {
  return loadState().users;
}

export function createUser(input: { user_id: string; password: string; name: string; college?: string; role: Role }) {
  return withState((state) => {
    if (state.users.some((u) => u.user_id.toLowerCase() === input.user_id.toLowerCase())) {
      throw new Error('User already exists');
    }
    const user: UserRecord = {
      id: crypto.randomUUID(),
      user_id: input.user_id,
      password_hash: hashPassword(input.password),
      name: input.name,
      college: input.college,
      role: input.role,
      created_at: nowIso(),
    };
    state.users.push(user);
    return user;
  });
}

export function login(user_id: string, password: string) {
  return withState((state) => {
    const user = state.users.find((u) => u.user_id === user_id && u.password_hash === hashPassword(password));
    if (!user) return null;
    const session: SessionRecord = {
      token: crypto.randomUUID(),
      user_id: user.id,
      created_at: nowIso(),
      expires_at: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    };
    state.sessions = state.sessions.filter((s) => s.user_id !== user.id);
    state.sessions.push(session);
    localStorage.setItem(ACTIVE_SESSION_KEY, session.token);
    return { user, session };
  });
}

export function logout() {
  withState((state) => {
    const active = localStorage.getItem(ACTIVE_SESSION_KEY);
    state.sessions = state.sessions.filter((s) => s.token !== active);
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  });
}

export function restoreSession() {
  const state = loadState();
  const active = localStorage.getItem(ACTIVE_SESSION_KEY);
  if (!active) return null;
  const session = state.sessions.find((s) => s.token === active);
  if (!session) return null;
  if (new Date(session.expires_at).getTime() < Date.now()) {
    logout();
    return null;
  }
  const user = state.users.find((u) => u.id === session.user_id);
  return user ? { user, session } : null;
}

export function refreshSession() {
  return withState((state) => {
    const active = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!active) return null;
    const session = state.sessions.find((s) => s.token === active);
    if (!session) return null;
    session.expires_at = new Date(Date.now() + SESSION_TTL_MS).toISOString();
    return session;
  });
}

export function persistFile(file: File, owner_user_id: string, project_id?: string): Promise<FileRecord> {
  return new Promise((resolve) => {
    const storage_url = URL.createObjectURL(file);
    const result = withState((state) => {
      const record: FileRecord = {
        id: crypto.randomUUID(),
        owner_user_id,
        project_id,
        file_name: file.name,
        mime_type: file.type,
        size: file.size,
        storage_url,
        created_at: nowIso(),
      };
      state.files.push(record);
      return record;
    });
    resolve(result);
  });
}

export function dashboardStats() {
  const state = loadState();
  return {
    users: state.users.length,
    projects: state.projects.length,
    goals: state.goals.length,
    files: state.files.length,
  };
}
