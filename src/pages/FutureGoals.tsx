import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Goal {
  id: string;
  text: string;
  image_url: string;
}

const FutureGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('goals')
      .select('id, text, image_url')
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setGoals(data ?? []);
        setLoading(false);
      });
  }, []);

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
            What we're building next at InnoveX Hub
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : goals.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">No goals yet.</p>
        ) : (
          <div className="space-y-16">
            {goals.map((goal, i) => {
              const isEven = i % 2 === 0;
              // Split "Title -- Description" or just show as description
              const dashIndex = goal.text.indexOf(' \u2014 ');
              const title = dashIndex > -1 ? goal.text.slice(0, dashIndex) : `Goal ${i + 1}`;
              const description = dashIndex > -1 ? goal.text.slice(dashIndex + 3) : goal.text;

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, x: isEven ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6 }}
                  className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
                >
                  <div className="md:w-1/2 overflow-hidden rounded-2xl glass group">
                    <img
                      src={goal.image_url}
                      alt={title}
                      loading="lazy"
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="md:w-1/2">
                    <h2 className="font-display text-xl tracking-wider text-primary glow-text mb-4">{title}</h2>
                    <p className="text-foreground/70 leading-relaxed">{description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FutureGoals;
