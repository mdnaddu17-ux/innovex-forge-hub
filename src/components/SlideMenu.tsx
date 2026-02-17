import { useNavigate, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAuth, Role } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItem {
  label: string;
  path: string;
  anchor?: string;
  roles: Role[];
}

const MENU_ITEMS: MenuItem[] = [
  { label: 'Home', path: '/', anchor: 'home', roles: ['guest', 'viewer', 'creator', 'admin'] },
  { label: 'About Us', path: '/', anchor: 'about', roles: ['guest', 'viewer', 'creator', 'admin'] },
  { label: 'Projects', path: '/', anchor: 'projects', roles: ['guest', 'viewer', 'creator', 'admin'] },
  { label: 'Add Project', path: '/add-project', roles: ['creator', 'admin'] },
  { label: 'Admin Panel', path: '/admin', roles: ['admin'] },
  { label: 'Future Goals', path: '/', anchor: 'goals', roles: ['guest', 'viewer', 'creator', 'admin'] },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

const SlideMenu = ({ open, onClose }: Props) => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const visibleItems = MENU_ITEMS.filter((item) => {
    if (item.label === 'Become Member') return role === 'guest';
    return item.roles.includes(role);
  });

  // Add Become Member for guests
  if (role === 'guest') {
    visibleItems.splice(2, 0, { label: 'Become Member', path: '/', anchor: 'become-member', roles: ['guest'] });
  }

  const handleMenuClick = (item: MenuItem) => {
    onClose();
    if (item.anchor) {
      if (location.pathname === '/') {
        // Already on home, just scroll
        setTimeout(() => {
          document.getElementById(item.anchor!)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        // Navigate to home first, then scroll after mount
        navigate('/');
        setTimeout(() => {
          document.getElementById(item.anchor!)?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    } else {
      navigate(item.path);
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
            className="fixed inset-0 z-[60] bg-background/60"
            onClick={onClose}
          />
          <motion.nav
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 z-[70] w-72 glass-strong flex flex-col"
            style={{ borderRight: '1px solid hsla(50, 100%, 83%, 0.2)' }}
          >
            <div className="flex items-center justify-end p-4">
              <button onClick={onClose} className="text-primary hover:text-accent transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-1 px-4 pt-4">
              {visibleItems.map((item, i) => (
                <motion.button
                  key={item.path}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => handleMenuClick(item)}
                  className="text-left py-3 px-4 font-display text-sm tracking-widest text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
                >
                  {item.label}
                </motion.button>
              ))}
            </div>

            <div className="p-4 text-xs text-muted-foreground font-display tracking-wider">
              InnoveX Hub © 2026
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
};

export default SlideMenu;
