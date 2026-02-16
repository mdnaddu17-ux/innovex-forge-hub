import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const BecomeMember = () => {
  return (
    <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-strong rounded-2xl p-12 glow-box text-center max-w-lg"
      >
        <h1 className="text-3xl font-display font-bold gradient-text glow-text mb-6">
          Join InnoveX Engineering Collective
        </h1>
        <p className="text-foreground/70 leading-relaxed mb-8">
          Become part of our innovation lab. Collaborate with fellow engineers,
          access exclusive projects, and build the technology of tomorrow.
        </p>
        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }}>
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
        <p className="text-xs text-muted-foreground mt-6">Applications reviewed within 48 hours</p>
      </motion.div>
    </div>
  );
};

export default BecomeMember;
