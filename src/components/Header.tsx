import { useState } from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import SlideMenu from './SlideMenu';
import LoginModal from './LoginModal';
import innovexLogo from '@/assets/innovex-logo.png';

const Header = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-20 glass-strong">
        <div className="relative container mx-auto flex items-center justify-between h-24 md:h-28 px-4">
          <button
            onClick={() => setMenuOpen(true)}
            className="relative z-10 p-2 text-primary hover:text-accent transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img
              src={innovexLogo}
              alt="InnoveX Hub"
              className="w-[130px] md:w-[170px] h-auto animate-logo-pulse pointer-events-auto"
            />
          </div>

          <div className="relative z-10">
            {user ? (
              <Button variant="glow" size="sm" onClick={logout}>
                Logout
              </Button>
            ) : (
              <Button variant="glow" size="sm" onClick={() => setLoginOpen(true)}>
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      <SlideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
};

export default Header;
