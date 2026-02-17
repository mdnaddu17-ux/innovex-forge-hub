import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { listGoals } from '@/services/platformStore';
import { useRealtime } from '@/hooks/useRealtime';
import ImageWithFallback from '@/components/ImageWithFallback';
import goalImage from '@/assets/goal-future.jpg';


const STATIC_GOALS = [
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

const FutureGoals = () => {
  const { lastEventAt } = useRealtime();
  const dbGoals = useMemo(() => listGoals(), [lastEventAt]);

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text glow-text mb-4">
            Future Goals
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {"What we're building next at InnoveX Hub"}
          </p>
        </motion.div>

        <div className="space-y-16">
          {/* Render DB goals if available */}
          {dbGoals && dbGoals.length > 0
            ? dbGoals.map((goal, i) => {
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
                          alt={goal.text}
                          loading="lazy"
                          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className={goal.image_url ? 'md:w-1/2' : 'w-full'}>
                      <p className="text-foreground/70 leading-relaxed">{goal.text}</p>
                    </div>
                  </motion.div>
                );
              })
            : STATIC_GOALS.map((goal, i) => {
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
                      <h2 className="font-display text-xl tracking-wider text-primary glow-text mb-4">{goal.title}</h2>
                      <p className="text-foreground/70 leading-relaxed">{goal.description}</p>
                    </div>
                  </motion.div>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default FutureGoals;
