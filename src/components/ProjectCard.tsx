import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { ProjectRecord as Project } from '@/types/domain';
import ImageWithFallback from '@/components/ImageWithFallback';

interface Props {
  project: Project;
  onViewMore: (project: Project) => void;
  index: number;
}

const ProjectCard = ({ project, onViewMore, index }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group glass rounded-2xl overflow-hidden glow-box cursor-pointer gradient-border"
      onClick={() => onViewMore(project)}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <ImageWithFallback
          src={project.image_url}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-sm tracking-wider text-primary mb-2">{project.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.description}</p>

        <div className="flex items-center gap-2 text-accent text-xs font-display tracking-wider group-hover:text-primary transition-colors">
          View More
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
