import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageWithFallback from '@/components/ImageWithFallback';
import { getProject } from '@/services/platformStore';
import { useRealtime } from '@/hooks/useRealtime';

const SourceCodeSection = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);
  const isLink = code.trim().startsWith('http');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return isLink ? (
    <a href={code} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent hover:text-primary">
      View Source Repository <ExternalLink size={14} />
    </a>
  ) : (
    <div className="relative"><pre className="glass rounded-xl p-4 text-sm text-green-400 overflow-x-auto"><code>{code}</code></pre><button type="button" onClick={handleCopy} className="absolute top-3 right-3">{copied ? <Check size={16} /> : <Copy size={16} />}</button></div>
  );
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lastEventAt } = useRealtime();
  const project = useMemo(() => (id ? getProject(id) : null), [id, lastEventAt]);

  if (!project) return <div className="pt-24 px-4 text-center">Project Not Found</div>;

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="relative h-64 md:h-96 overflow-hidden">
        <ImageWithFallback src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
      </div>
      <div className="container mx-auto max-w-3xl px-4 -mt-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => navigate('/projects')} className="flex items-center gap-2 mb-6"><ArrowLeft size={16} /> Back to Projects</button>
          <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text glow-text mb-6">{project.title}</h1>
          <p className="text-foreground/80 leading-relaxed mb-6">{project.description}</p>
          {project.components && <p className="mb-6">{project.components}</p>}
          {project.video_link && <a href={project.video_link} target="_blank" rel="noreferrer" className="inline-flex mb-6">Watch Video</a>}
          <SourceCodeSection code={project.source_code} />
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetail;
