import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: () => void;
}

const BrandIntro = ({ onComplete }: Props) => {
  const [visible, setVisible] = useState(true);

  const words = ['Build', 'Innovate', 'Exhibit'];

  // Failsafe: always dismiss the intro after 5 seconds no matter what
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence
      onExitComplete={() => {
        onComplete();
      }}
    >
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-2xl sm:text-3xl md:text-5xl gradient-text glow-text tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] mb-10 max-w-full px-4 text-center break-words"
          >
            INNOVEXHUB.IN
          </motion.h1>

          <div className="flex flex-col items-center gap-3">
            {words.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.5, duration: 0.5 }}
                className="font-display text-lg md:text-2xl text-foreground/80 tracking-[0.2em]"
              >
                {word}
              </motion.span>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8, duration: 0.3 }}
            onAnimationComplete={() => {
              setTimeout(() => setVisible(false), 600);
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BrandIntro;
