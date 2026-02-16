import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProjectCard from '@/components/ProjectCard';
import BecomeMemberModal from '@/components/BecomeMemberModal';
import { fetchProjects } from '@/data/projects';
import { useAuth } from '@/contexts/AuthContext';
import type { Project } from '@/data/projects';

const Projects = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [memberModal, setMemberModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const handleViewMore = (project: Project) => {
    if (role === 'guest') {
      setMemberModal(true);
    } else {
      navigate(`/projects/${project.id}`);
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

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">No projects found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} onViewMore={handleViewMore} index={i} />
            ))}
          </div>
        )}
      </div>

      <BecomeMemberModal open={memberModal} onClose={() => setMemberModal(false)} />
    </div>
  );
};

export default Projects;
