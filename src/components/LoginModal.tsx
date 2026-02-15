import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onClose: () => void;
}

const LoginModal = ({ open, onClose }: Props) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(userId, password);
    if (success) {
      toast({ title: 'Welcome back, Engineer.', description: 'You have been authenticated.' });
      setUserId('');
      setPassword('');
      onClose();
    } else {
      toast({ title: 'Access Denied', description: 'Invalid credentials.', variant: 'destructive' });
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-background/70"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-[90] top-1/2 left-1/2 w-[calc(100%-2rem)] max-w-md glass-strong rounded-2xl p-8 glow-box"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl gradient-text tracking-wider">Engineer Login</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-primary transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">User ID</label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                  placeholder="Enter your ID"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                  placeholder="Enter password"
                  required
                />
              </div>

              <Button type="submit" variant="hero" className="w-full" size="lg">
                Authenticate
              </Button>
            </form>

            <p className="text-xs text-muted-foreground mt-4 text-center">
              Demo: admin/admin123 or member/member123
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
