import { motion } from 'framer-motion';
import { Rocket, Eye, Cpu, Heart } from 'lucide-react';

const SECTIONS = [
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
    text: 'Because textbooks alone don\'t build engineers. We exist to bridge the gap between academic theory and hands-on creation. This is where builders belong.',
  },
];

const About = () => {
  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-3xl md:text-5xl font-display font-bold gradient-text glow-text mb-4 leading-tight">
            Engineering Tomorrow
            <br />
            at InnoveX Hub
          </h1>
        </motion.div>

        {/* Vertical timeline */}
        <div className="relative">
          {/* Glowing vertical line */}
          <div
            className="absolute left-8 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5"
            style={{
              background: 'linear-gradient(180deg, hsl(50, 100%, 83%, 0.5), hsl(41, 100%, 50%, 0.3), transparent)',
            }}
          />

          {SECTIONS.map((section, i) => {
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
                {/* Timeline node */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary glow-box z-10 mt-1" />

                {/* Content */}
                <div className={`ml-16 md:ml-0 md:w-5/12 ${isEven ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'}`}>
                  <div className="glass rounded-xl p-6 glow-box">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon size={20} className="text-primary" />
                      </div>
                      <h2 className="font-display text-lg tracking-wider text-primary">{section.title}</h2>
                    </div>
                    <p className="text-foreground/70 leading-relaxed text-sm">{section.text}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default About;
