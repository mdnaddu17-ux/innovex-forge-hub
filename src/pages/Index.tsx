import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ProjectCard from '@/components/ProjectCard';
import BecomeMemberModal from '@/components/BecomeMemberModal';
import { MOCK_PROJECTS } from '@/data/projects';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/data/projects';
import heroBg from '@/assets/hero-bg.jpg';
import goalImage from '@/assets/goal-future.jpg';
import { Rocket, Eye, Cpu, Heart } from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';

const ABOUT_SECTIONS = [
  {
    icon: Rocket,
    title: 'Our Mission',
    text: 'To create a space where engineering students can experiment, prototype, and build real-world solutions. We believe innovation starts when curiosity meets capability.',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    text: 'A future where every aspiring engineer has access to a collaborative lab environment — where ideas are not just discussed, but built, tested, and launched.',
  },
  {
    icon: Cpu,
    title: 'What We Build',
    text: 'From autonomous robots and AI systems to custom PCBs and IoT networks — we tackle projects that push boundaries. Every build is a lesson, every failure is data.',
  },
  {
    icon: Heart,
    title: 'Why We Exist',
    text: "Because textbooks alone don't build engineers. We exist to bridge the gap between academic theory and hands-on creation. This is where builders belong.",
  },
];

const GOALS = [
  {
    title: 'AI-Powered Research Lab',
    description: 'Integrating machine learning tools directly into the lab workflow — from computer vision QA to predictive maintenance on equipment.',
    image: goalImage,
  },
  {
    title: 'Open Hardware Initiative',
    description: 'Publishing all project designs as open-source hardware, allowing other student labs worldwide to replicate and improve upon our work.',
    image: goalImage,
  },
  {
    title: 'Industry Partnership Program',
    description: 'Connecting with engineering firms and startups to bring real-world problem statements into the lab for collaborative solution development.',
    image: goalImage,
  },
];

const APPLY_MAILTO =
  'mailto:innovexhub01@gmail.com?subject=Membership Application&body=Name:%0ACollege Name:%0AUSN No / Reference ID:%0A%0AWhy do you want InnoveX Hub membership? (Minimum 100 words):%0A';

interface DbGoal {
  id: string;
  goal_text: string;
  image_url: string;
  created_at: string;
}

const Index = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [memberModal, setMemberModal] = useState(false);
  const [dbProjects, setDbProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [dbGoals, setDbGoals] = useState<DbGoal[] | null>(null);

  useEffect(() => {
    (async () => {
      const [projRes, goalRes] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('goals').select('*').order('created_at', { ascending: false }),
      ]);
      if (projRes.data && projRes.data.length > 0) setDbProjects(projRes.data);
      if (goalRes.data) setDbGoals(goalRes.data);
    })();
  }, []);

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
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore Projects
          </Button>
        </motion.div>
      </section>

      {/* Section divider */}
      <div className="section-divider" />

      {/* About Section */}
      <section id="about" className="py-24 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold gradient-text glow-text mb-4 leading-tight">
              Engineering Tomorrow
              <br />
              at InnoveX Hub
            </h2>
          </motion.div>

          {/* Vertical timeline */}
          <div className="relative">
            <div
              className="absolute left-8 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5"
              style={{
                background: 'linear-gradient(180deg, hsl(50, 100%, 83%, 0.5), hsl(41, 100%, 50%, 0.3), transparent)',
              }}
            />

            {ABOUT_SECTIONS.map((section, i) => {
              const Icon = section.icon;
              const isEven = i % 2 === 0;

              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`relative flex items-start gap-6 mb-16 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-row`}
                >
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary glow-box z-10 mt-1" />

                  <div className={`ml-16 md:ml-0 md:w-5/12 ${isEven ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'}`}>
                    <div className="glass rounded-xl p-6 glow-box">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon size={20} className="text-primary" />
                        </div>
                        <h3 className="font-display text-lg tracking-wider text-primary">{section.title}</h3>
                      </div>
                      <p className="text-foreground/70 leading-relaxed text-sm">{section.text}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Projects Section */}
      <section id="projects" className="py-24 px-4">
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
            {dbProjects.map((project, i) => (
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

      <div className="section-divider" />

      {/* Future Goals Section */}
      <section id="goals" className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold gradient-text glow-text mb-4">
              Future Goals
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              What we are building next at InnoveX Hub
            </p>
          </motion.div>

          <div className="space-y-16">
            {(dbGoals && dbGoals.length > 0 ? dbGoals : null)?.map((goal, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, x: isEven ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6 }}
                  className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
                >
                  {goal.image_url && (
                    <div className="md:w-1/2 overflow-hidden rounded-2xl glass group">
                      <ImageWithFallback
                        src={goal.image_url}
                        alt={goal.goal_text}
                        loading="lazy"
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  <div className={goal.image_url ? 'md:w-1/2' : 'w-full'}>
                    <p className="text-foreground/70 leading-relaxed">{goal.goal_text}</p>
                  </div>
                </motion.div>
              );
            })}
            {/* Fallback to static goals when DB is empty */}
            {(!dbGoals || dbGoals.length === 0) && GOALS.map((goal, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={goal.title}
                  initial={{ opacity: 0, x: isEven ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6 }}
                  className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
                >
                  <div className="md:w-1/2 overflow-hidden rounded-2xl glass group">
                    <ImageWithFallback
                      src={goal.image}
                      alt={goal.title}
                      loading="lazy"
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="md:w-1/2">
                    <h3 className="font-display text-xl tracking-wider text-primary glow-text mb-4">{goal.title}</h3>
                    <p className="text-foreground/70 leading-relaxed">{goal.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Become Member Section */}
      <section id="become-member" className="py-24 px-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-strong rounded-2xl p-12 glow-box text-center max-w-lg mx-auto"
        >
          <h2 className="text-3xl font-display font-bold gradient-text glow-text mb-6">
            Join InnoveX Engineering Collective
          </h2>
          <p className="text-foreground/70 leading-relaxed mb-8">
            Become part of our innovation lab. Collaborate with fellow engineers,
            access exclusive projects, and build the technology of tomorrow.
          </p>
          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }}>
            <Button
              variant="hero"
              size="lg"
              className="px-10"
              onClick={() => { window.location.href = APPLY_MAILTO; }}
            >
              Apply Now
            </Button>
          </motion.div>
          <p className="text-xs text-muted-foreground mt-6">Applications reviewed within 48 hours</p>
        </motion.div>
      </section>

      <BecomeMemberModal open={memberModal} onClose={() => setMemberModal(false)} />
    </div>
  );
};

export default Index;
