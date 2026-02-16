import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  open: boolean;
  onClose: () => void;
}

const BecomeMemberModal = ({ open, onClose }: Props) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-background/80"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg glass-strong rounded-2xl p-10 glow-box text-center pointer-events-auto"
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
              <Button
                variant="hero"
                size="lg"
                className="px-10"
                onClick={() => {
                  window.location.href =
                    'mailto:innovexhub01@gmail.com?subject=Membership Application&body=Name:%0ACollege Name:%0AUSN No / Reference ID:%0A%0AWhy do you want InnoveX Hub membership? (Minimum 100 words):%0A';
                }}
              >
                Apply Now
              </Button>
            </motion.div>

            <p className="text-xs text-muted-foreground mt-4">
              Applications reviewed within 48 hours
            </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BecomeMemberModal;
