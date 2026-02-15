import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ProjectCard from '@/components/ProjectCard';
import BecomeMemberModal from '@/components/BecomeMemberModal';
import { MOCK_PROJECTS } from '@/data/projects';
import { useAuth } from '@/contexts/AuthContext';
import type { Project } from '@/data/projects';
import heroBg from '@/assets/hero-bg.jpg';

const Index = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [memberModal, setMemberModal] = useState(false);

  const handleViewMore = (project: Project) => {
    if (role === 'guest') {
      setMemberModal(true);
    } else {
      navigate(`/projects/${project.id}`);
    }
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Hero background image */}
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold gradient-text glow-text mb-2 leading-tight">
            InnoveX
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl font-display text-foreground/80 tracking-wider mb-6">
            Build to Innovate
          </p>

          {/* Animated underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-0.5 w-48 mx-auto mb-8"
            style={{
              background: 'linear-gradient(90deg, transparent, hsl(50, 100%, 83%), hsl(41, 100%, 50%), transparent)',
              transformOrigin: 'center',
            }}
          />

          <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Where engineering students turn bold ideas into real-world innovation.
            Welcome to the lab.
          </p>

          <Button
            variant="hero"
            size="lg"
            className="text-base px-10"
            onClick={() => navigate('/projects')}
          >
            Explore Projects
          </Button>
        </motion.div>
      </section>

      {/* Section divider */}
      <div className="section-divider" />

      {/* Featured Projects */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold gradient-text glow-text mb-4">
              Featured Projects
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Engineering innovation crafted by our lab members
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {MOCK_PROJECTS.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                onViewMore={handleViewMore}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      <BecomeMemberModal open={memberModal} onClose={() => setMemberModal(false)} />
    </div>
  );
};

export default Index;
