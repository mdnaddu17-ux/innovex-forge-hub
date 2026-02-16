import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  open: boolean;
  onClose: () => void;
}

const BecomeMemberModal = ({ open, onClose }: Props) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80"
            style={{ zIndex: 40 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed w-[90%] max-w-[420px] glass-strong rounded-2xl p-10 glow-box text-center"
            style={{
              zIndex: 50,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="font-display text-2xl gradient-text tracking-wider mb-4">
              Join InnoveX Engineering Collective
            </h2>

            <p className="text-foreground/80 mb-6 leading-relaxed">
              Become part of our innovation lab. Access exclusive projects, collaborate with fellow engineers,
              and build the technology of tomorrow.
            </p>

            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Button variant="hero" size="lg" className="px-10">
                Apply Now
              </Button>
            </motion.div>

            <p className="text-xs text-muted-foreground mt-4">
              Applications reviewed within 48 hours
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default BecomeMemberModal;
