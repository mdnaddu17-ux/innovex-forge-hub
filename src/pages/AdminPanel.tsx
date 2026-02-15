import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const tabs = ['Create User', 'Goals', 'Projects'] as const;
type Tab = typeof tabs[number];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Create User');
  const { toast } = useToast();

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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  toast({ title: 'User Created', description: 'New engineer added to the system.' });
                }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">User ID</label>
                  <input className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">Password</label>
                  <input type="password" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">Role</label>
                  <select className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all">
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <Button type="submit" variant="hero" className="w-full" size="lg">Create User</Button>
              </form>
            )}

            {activeTab === 'Goals' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  toast({ title: 'Goal Added', description: 'New future goal published.' });
                }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">Goal Title</label>
                  <input className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">Description</label>
                  <textarea rows={3} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all resize-none" required />
                </div>
                <div>
                  <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">Image URL</label>
                  <input type="url" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all" />
                </div>
                <Button type="submit" variant="hero" className="w-full" size="lg">Add Goal</Button>
              </form>
            )}

            {activeTab === 'Projects' && (
              <div>
                <h3 className="font-display text-sm tracking-wider text-primary mb-4">Manage Projects</h3>
                <p className="text-muted-foreground text-sm">
                  Project management tools will be available with backend integration.
                  Currently displaying mock project data.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;
