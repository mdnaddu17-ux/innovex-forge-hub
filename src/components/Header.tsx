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
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="container mx-auto flex items-center justify-between h-20 px-4">
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 text-primary hover:text-accent transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          <div className="absolute left-1/2 -translate-x-1/2">
            <img
              src={innovexLogo}
              alt="InnoveX Hub"
              className="h-14 md:h-[44px] lg:h-[48px] w-auto scale-[2] animate-logo-pulse"
            />
          </div>

          <div>
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
