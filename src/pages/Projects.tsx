import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import ProjectCard from '@/components/ProjectCard';
import BecomeMemberModal from '@/components/BecomeMemberModal';
import { MOCK_PROJECTS } from '@/data/projects';
import { useAuth } from '@/contexts/AuthContext';
import type { Project } from '@/data/projects';

const Projects = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [memberModal, setMemberModal] = useState(false);

  const dbProjects = useQuery(api.queries.getProjects);

  const projects: Project[] =
    dbProjects && dbProjects.length > 0
      ? dbProjects.map((p) => ({
          _id: p._id,
          title: p.title,
          description: p.description,
          imageUrl: p.imageUrl,
          components: p.components,
          videoUrl: p.videoUrl,
          sourceCode: p.sourceCode,
          createdBy: p.createdBy,
          createdAt: p.createdAt,
        }))
      : MOCK_PROJECTS;

  const handleViewMore = (project: Project) => {
    if (role === 'guest') {
      setMemberModal(true);
    } else {
      navigate(`/projects/${project._id}`);
    }
  };

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text glow-text mb-4">
            Project Lab
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Explore the engineering innovations built by our collective
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <ProjectCard key={project._id} project={project} onViewMore={handleViewMore} index={i} />
          ))}
        </div>
      </div>

      <BecomeMemberModal open={memberModal} onClose={() => setMemberModal(false)} />
    </div>
  );
};

export default Projects;
