import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { uploadImage } from '@/lib/uploadImage';
import { Upload, X, Trash2, Eye, EyeOff } from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';

const tabs = ['Create User', 'Goals', 'Projects'] as const;
type Tab = (typeof tabs)[number];

interface DbProject {
  id: string;
  title: string;
  description: string;
  image_url: string;
  components: string;
  source_code: string;
  created_at: string;
}

interface DbGoal {
  id: string;
  text: string;
  image_url: string;
  created_at: string;
}

const inputClass =
  'w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Create User');
  const { toast } = useToast();

  // Create User state
  const [newUserId, setNewUserId] = useState('');
  const [newUserPwd, setNewUserPwd] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserCollege, setNewUserCollege] = useState('');
  const [newUserRole, setNewUserRole] = useState<'member' | 'admin'>('member');
  const [creatingUser, setCreatingUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Goals state
  const [goalText, setGoalText] = useState('');
  const [goalImageFile, setGoalImageFile] = useState<File | null>(null);
  const [goalImagePreview, setGoalImagePreview] = useState<string | null>(null);
  const goalFileRef = useRef<HTMLInputElement>(null);
  const [addingGoal, setAddingGoal] = useState(false);
  const [goals, setGoals] = useState<DbGoal[]>([]);

  // Projects state
  const [projects, setProjects] = useState<DbProject[]>([]);

  // Fetch goals and projects
  useEffect(() => {
    fetchGoals();
    fetchProjects();
  }, []);

  const fetchGoals = async () => {
    const { data } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setGoals(data);
  };

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setProjects(data);
  };

  // Create user handler
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingUser(true);
    try {
      const { error } = await supabase.from('users').insert({
        user_id: newUserId,
        password: newUserPwd,
        name: newUserName,
        college: newUserCollege,
        role: newUserRole,
      });
      if (error) throw error;
      toast({ title: 'User Created', description: 'New engineer added to the system.' });
      setNewUserId('');
      setNewUserPwd('');
      setNewUserName('');
      setNewUserCollege('');
      setNewUserRole('member');
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setCreatingUser(false);
    }
  };

  // Goal image handler
  const handleGoalImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
      toast({ title: 'Invalid file', description: 'Image only, max 2MB.', variant: 'destructive' });
      return;
    }
    setGoalImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setGoalImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Add goal handler
  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!goalText.trim() || !goalImageFile) {
      toast({ title: 'Missing Fields', description: 'Goal text and image are both required.', variant: 'destructive' });
      return;
    }

    setAddingGoal(true);
    try {
      const imageUrl = await uploadImage(goalImageFile);

      const { error } = await supabase.from('goals').insert({
        text: goalText.trim(),
        image_url: imageUrl,
        created_at: new Date().toISOString(),
      });
      if (error) throw error;
      toast({ title: 'Goal Added', description: 'New future goal published.' });
      setGoalText('');
      setGoalImageFile(null);
      setGoalImagePreview(null);
      if (goalFileRef.current) goalFileRef.current.value = '';
      fetchGoals();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setAddingGoal(false);
    }
  };

  // Delete handlers
  const handleDeleteGoal = async (id: string) => {
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Goal Deleted' });
      fetchGoals();
    }
  };

  const handleDeleteProject = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Project Deleted' });
      fetchProjects();
    }
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
            {activeTab === 'Create User' && (
              <form onSubmit={handleCreateUser} className="space-y-5">
                <div>
                  <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">User ID</label>
                  <input className={inputClass} value={newUserId} onChange={(e) => setNewUserId(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`${inputClass} pr-12`}
                      value={newUserPwd}
                      onChange={(e) => setNewUserPwd(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">Name</label>
                  <input className={inputClass} value={newUserName} onChange={(e) => setNewUserName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">College</label>
                  <input className={inputClass} value={newUserCollege} onChange={(e) => setNewUserCollege(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">Role</label>
                  <select className={inputClass} value={newUserRole} onChange={(e) => setNewUserRole(e.target.value as 'member' | 'admin')}>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <Button type="submit" variant="hero" className="w-full" size="lg" disabled={creatingUser}>
                  {creatingUser ? 'Creating...' : 'Create User'}
                </Button>
              </form>
            )}

            {activeTab === 'Goals' && (
              <div className="space-y-8">
                <form onSubmit={handleAddGoal} className="space-y-5">
                  <div>
                    <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">Goal Text</label>
                    <textarea rows={3} className={`${inputClass} resize-none`} value={goalText} onChange={(e) => setGoalText(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">Goal Image</label>
                    {!goalImagePreview ? (
                      <button
                        type="button"
                        onClick={() => goalFileRef.current?.click()}
                        className="w-full flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary/50 hover:text-primary/80 transition-all"
                      >
                        <Upload size={24} />
                        <span className="text-sm font-display tracking-wider">Upload image</span>
                      </button>
                    ) : (
                      <div className="relative rounded-xl overflow-hidden border border-border">
                        <img src={goalImagePreview} alt="Preview" className="w-full h-36 object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setGoalImageFile(null);
                            setGoalImagePreview(null);
                            if (goalFileRef.current) goalFileRef.current.value = '';
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                    <input ref={goalFileRef} type="file" accept="image/*" onChange={handleGoalImage} className="hidden" />
                  </div>
                  <Button type="submit" variant="hero" className="w-full" size="lg" disabled={addingGoal}>
                    {addingGoal ? 'Adding...' : 'Add Goal'}
                  </Button>
                </form>

                {goals.length > 0 && (
                  <div>
                    <h3 className="font-display text-sm tracking-wider text-primary mb-4">Existing Goals</h3>
                    <div className="space-y-3">
                      {goals.map((g) => (
                        <div key={g.id} className="flex items-center gap-3 glass rounded-lg p-3">
                          {g.image_url && (
                            <ImageWithFallback src={g.image_url} alt="" className="w-12 h-12 rounded object-cover flex-shrink-0" />
                          )}
                          <p className="text-sm text-foreground/80 flex-1 line-clamp-2">{g.text}</p>
                          <button onClick={() => handleDeleteGoal(g.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Projects' && (
              <div>
                <h3 className="font-display text-sm tracking-wider text-primary mb-4">Manage Projects</h3>
                {projects.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No projects yet.</p>
                ) : (
                  <div className="space-y-3">
                    {projects.map((p) => (
                      <div key={p.id} className="flex items-center gap-3 glass rounded-lg p-3">
                        {p.image_url && (
                          <ImageWithFallback src={p.image_url} alt={p.title ?? ''} className="w-12 h-12 rounded object-cover flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-display text-primary truncate">{p.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{p.description}</p>
                        </div>
                        <button onClick={() => handleDeleteProject(p.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
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
