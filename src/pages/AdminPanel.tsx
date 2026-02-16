import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabaseAdmin } from '@/lib/supabase-admin';

const tabs = ['Create User', 'Goals', 'Projects'] as const;
type Tab = (typeof tabs)[number];

const inputClass =
  'w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Create User');
  const { toast } = useToast();

  // --- Create User state ---
  const [newUserId, setNewUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newCollege, setNewCollege] = useState('');
  const [newRole, setNewRole] = useState<'member' | 'admin'>('member');
  const [userLoading, setUserLoading] = useState(false);

  // --- Goals state ---
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDesc, setGoalDesc] = useState('');
  const [goalImage, setGoalImage] = useState('');
  const [goalLoading, setGoalLoading] = useState(false);
  const [goals, setGoals] = useState<{ id: string; text: string }[]>([]);

  // --- Projects state ---
  const [projects, setProjects] = useState<{ id: string; title: string }[]>([]);
  const [projLoading, setProjLoading] = useState(false);

  const loadGoals = useCallback(async () => {
    const { data } = await supabaseAdmin.from('goals').select('id, text').order('created_at', { ascending: true });
    setGoals(data ?? []);
  }, []);

  const loadProjects = useCallback(async () => {
    const { data } = await supabaseAdmin.from('projects').select('id, title').order('created_at', { ascending: false });
    setProjects(data ?? []);
  }, []);

  useEffect(() => {
    if (activeTab === 'Goals') loadGoals();
    if (activeTab === 'Projects') loadProjects();
  }, [activeTab, loadGoals, loadProjects]);

  // --- Create User handler ---
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserLoading(true);
    try {
      const { error } = await supabaseAdmin.from('users').insert({
        user_id: newUserId.toUpperCase(),
        password: newPassword,
        name: newName,
        college: newCollege || null,
        role: newRole,
      });
      if (error) throw error;
      toast({ title: 'User Created', description: `${newName} added as ${newRole}.` });
      setNewUserId('');
      setNewPassword('');
      setNewName('');
      setNewCollege('');
      setNewRole('member');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setUserLoading(false);
    }
  };

  // --- Add Goal handler ---
  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setGoalLoading(true);
    try {
      const text = goalDesc ? `${goalTitle} \u2014 ${goalDesc}` : goalTitle;
      const { error } = await supabaseAdmin.from('goals').insert({
        text,
        image_url: goalImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
      });
      if (error) throw error;
      toast({ title: 'Goal Added', description: 'New future goal published.' });
      setGoalTitle('');
      setGoalDesc('');
      setGoalImage('');
      loadGoals();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setGoalLoading(false);
    }
  };

  // --- Delete handlers ---
  const handleDeleteGoal = async (id: string) => {
    const { error } = await supabaseAdmin.from('goals').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Goal Deleted' });
      loadGoals();
    }
  };

  const handleDeleteProject = async (id: string) => {
    setProjLoading(true);
    const { error } = await supabaseAdmin.from('projects').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Project Deleted' });
      loadProjects();
    }
    setProjLoading(false);
  };

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="container mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold gradient-text glow-text mb-8 text-center">
            Admin Panel
          </h1>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 glass rounded-xl p-1 justify-center">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-lg font-display text-xs tracking-widest transition-all ${
                  activeTab === tab
                    ? 'bg-primary/15 text-primary glow-box'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="glass rounded-2xl p-8 glow-box">
            {/* === CREATE USER === */}
            {activeTab === 'Create User' && (
              <form onSubmit={handleCreateUser} className="space-y-5">
                <div>
                  <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">Name</label>
                  <input value={newName} onChange={(e) => setNewName(e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">User ID</label>
                  <input value={newUserId} onChange={(e) => setNewUserId(e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">Password</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">College</label>
                  <input value={newCollege} onChange={(e) => setNewCollege(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">Role</label>
                  <select value={newRole} onChange={(e) => setNewRole(e.target.value as 'member' | 'admin')} className={inputClass}>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <Button type="submit" variant="hero" className="w-full" size="lg" disabled={userLoading}>
                  {userLoading ? 'Creating...' : 'Create User'}
                </Button>
              </form>
            )}

            {/* === GOALS === */}
            {activeTab === 'Goals' && (
              <div className="space-y-8">
                <form onSubmit={handleAddGoal} className="space-y-5">
                  <div>
                    <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">Goal Title</label>
                    <input value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} className={inputClass} required />
                  </div>
                  <div>
                    <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">Description</label>
                    <textarea rows={3} value={goalDesc} onChange={(e) => setGoalDesc(e.target.value)} className={`${inputClass} resize-none`} required />
                  </div>
                  <div>
                    <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">Image URL (https)</label>
                    <input type="url" value={goalImage} onChange={(e) => setGoalImage(e.target.value)} className={inputClass} placeholder="https://..." />
                  </div>
                  <Button type="submit" variant="hero" className="w-full" size="lg" disabled={goalLoading}>
                    {goalLoading ? 'Adding...' : 'Add Goal'}
                  </Button>
                </form>

                {goals.length > 0 && (
                  <div>
                    <h3 className="font-display text-sm tracking-wider text-primary mb-3">Existing Goals</h3>
                    <ul className="space-y-2">
                      {goals.map((g) => (
                        <li key={g.id} className="flex items-center justify-between bg-muted/30 rounded-lg px-4 py-3">
                          <span className="text-sm text-foreground/80 truncate mr-4">{g.text}</span>
                          <button onClick={() => handleDeleteGoal(g.id)} className="text-destructive hover:text-destructive/80 transition-colors shrink-0">
                            <Trash2 size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* === PROJECTS === */}
            {activeTab === 'Projects' && (
              <div>
                <h3 className="font-display text-sm tracking-wider text-primary mb-4">Manage Projects</h3>
                {projLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : projects.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No projects found.</p>
                ) : (
                  <ul className="space-y-2">
                    {projects.map((p) => (
                      <li key={p.id} className="flex items-center justify-between bg-muted/30 rounded-lg px-4 py-3">
                        <span className="text-sm text-foreground/80 truncate mr-4">{p.title}</span>
                        <button onClick={() => handleDeleteProject(p.id)} className="text-destructive hover:text-destructive/80 transition-colors shrink-0">
                          <Trash2 size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;
