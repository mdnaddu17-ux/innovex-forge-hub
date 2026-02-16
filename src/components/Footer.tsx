import { Linkedin } from 'lucide-react';

const LINKEDIN_URL =
  'https://www.linkedin.com/in/mohammed-nadeem-562600386?utm_source=share_via&utm_content=profile&utm_medium=member_android';

const Footer = () => {
  return (
    <footer className="relative z-10 glass-strong py-6 px-4">
      <div className="container mx-auto flex flex-col items-center justify-center gap-2">
        <p className="text-xs font-display tracking-wider text-muted-foreground">
          Developed by
        </p>
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-primary hover:text-accent transition-colors"
        >
          <Linkedin size={18} />
          <span className="font-display text-sm tracking-wider">MD Nadeem</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
