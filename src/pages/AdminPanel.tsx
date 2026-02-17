import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { uploadImage } from '@/lib/uploadImage';
import { createGoal, createUser, dashboardStats, deleteGoal, deleteProject, listGoals, listProjects } from '@/services/platformStore';
import { useRealtime } from '@/hooks/useRealtime';

const AdminPanel = () => {
  const { toast } = useToast();
  const { lastEventAt } = useRealtime();
  const [newUserId, setNewUserId] = useState('');
  const [newUserPwd, setNewUserPwd] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'creator' | 'viewer' | 'admin'>('creator');
  const [goalText, setGoalText] = useState('');
  const [goalImageFile, setGoalImageFile] = useState<File | null>(null);
  const goals = useMemo(() => listGoals(), [lastEventAt]);
  const projects = useMemo(() => listProjects(), [lastEventAt]);
  const stats = useMemo(() => dashboardStats(), [lastEventAt]);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      createUser({ user_id: newUserId, password: newUserPwd, name: newUserName, role: newUserRole });
      toast({ title: 'User Created' });
      setNewUserId(''); setNewUserPwd(''); setNewUserName('');
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalImageFile) return;
    const image_url = await uploadImage(goalImageFile, 'admin');
    createGoal(goalText, image_url);
    setGoalText('');
    setGoalImageFile(null);
  };

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="container mx-auto max-w-5xl space-y-8">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-4xl font-display">Admin Control Panel</motion.h1>
        <div className="grid md:grid-cols-4 gap-4">{Object.entries(stats).map(([k,v]) => <div key={k} className="glass p-4 rounded-xl"><p>{k}</p><p className="text-2xl">{v}</p></div>)}</div>
        <form onSubmit={handleCreateUser} className="glass p-6 rounded-xl space-y-3">
          <h2>Create User</h2>
          <input className="w-full" placeholder="User ID" value={newUserId} onChange={(e)=>setNewUserId(e.target.value)} required />
          <input className="w-full" placeholder="Password" value={newUserPwd} onChange={(e)=>setNewUserPwd(e.target.value)} required />
          <input className="w-full" placeholder="Name" value={newUserName} onChange={(e)=>setNewUserName(e.target.value)} required />
          <select value={newUserRole} onChange={(e)=>setNewUserRole(e.target.value as 'creator'|'viewer'|'admin')}><option value="creator">Creator</option><option value="viewer">Viewer</option><option value="admin">Admin</option></select>
          <Button type="submit">Create User</Button>
        </form>
        <form onSubmit={handleAddGoal} className="glass p-6 rounded-xl space-y-3">
          <h2>Add Goal</h2>
          <textarea className="w-full" value={goalText} onChange={(e)=>setGoalText(e.target.value)} required />
          <input type="file" accept="image/*" onChange={(e)=>setGoalImageFile(e.target.files?.[0] ?? null)} required />
          <Button type="submit">Add Goal</Button>
        </form>
        <div className="glass p-6 rounded-xl"><h2>Project Moderation</h2>{projects.map((p)=><div key={p.id} className="flex justify-between"><span>{p.title}</span><Button onClick={()=>deleteProject(p.id)}>Delete</Button></div>)}</div>
        <div className="glass p-6 rounded-xl"><h2>Goals</h2>{goals.map((g)=><div key={g.id} className="flex justify-between"><span>{g.text}</span><Button onClick={()=>deleteGoal(g.id)}>Delete</Button></div>)}</div>
      </div>
    </div>
  );
};

export default AdminPanel;
