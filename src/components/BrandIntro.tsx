import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: () => void;
}

const BrandIntro = ({ onComplete }: Props) => {
  const [visible, setVisible] = useState(() => {
    return !sessionStorage.getItem('innovex-intro-seen');
  });

  useEffect(() => {
    if (!visible) {
      onComplete();
    }
  }, [visible, onComplete]);

  const words = ['Build', 'Innovate', 'Exhibit'];

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center bg-black"
          style={{ zIndex: 60 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onAnimationComplete={(def: any) => {
            if (def?.opacity === 0) {
              sessionStorage.setItem('innovex-intro-seen', 'true');
              onComplete();
            }
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="font-display text-3xl md:text-5xl gradient-text glow-text tracking-[0.3em] mb-8"
          >
            innovexhub.in
          </motion.h1>

          <div className="flex flex-col items-center gap-2">
            {words.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.3, duration: 0.3 }}
                className="font-display text-lg md:text-2xl text-foreground/80 tracking-[0.2em]"
              >
                {word}
              </motion.span>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.1 }}
            onAnimationComplete={() => {
              setTimeout(() => setVisible(false), 300);
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BrandIntro;
