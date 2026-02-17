import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_PROJECTS } from '@/data/projects';
import { supabase } from '@/lib/supabase';
import ImageWithFallback from '@/components/ImageWithFallback';
import type { Project } from '@/data/projects';

const SourceCodeSection = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);
  const isLink = code.trim().startsWith('http');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section>
      <h2 className="font-display text-sm tracking-widest text-primary/70 mb-3">SOURCE CODE</h2>
      {isLink ? (
        <a
          href={code}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-accent hover:text-primary transition-colors font-display text-sm tracking-wider"
        >
          View Source Repository <ExternalLink size={14} />
        </a>
      ) : (
        <div className="relative">
          <pre className="glass rounded-xl p-4 text-sm text-green-400 overflow-x-auto whitespace-pre-wrap break-words max-h-96">
            <code>{code}</code>
          </pre>
          <button
            type="button"
            onClick={handleCopy}
            className="absolute top-3 right-3 p-2 rounded-lg glass text-muted-foreground hover:text-primary transition-colors"
            aria-label="Copy source code"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      )}
    </section>
  );
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null | undefined>(undefined);

  useEffect(() => {
    (async () => {
      // Try fetching from DB first
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setProject(data);
      } else {
        // Fallback to mock data
        const mock = MOCK_PROJECTS.find((p) => p.id === id) ?? null;
        setProject(mock);
      }
    })();
  }, [id]);

  if (project === undefined) {
    return (
      <div className="pt-24 px-4 text-center min-h-screen flex items-center justify-center">
        <p className="font-display text-muted-foreground tracking-wider">Loading...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-24 px-4 text-center min-h-screen flex items-center justify-center">
        <div>
          <h1 className="font-display text-2xl gradient-text mb-4">Project Not Found</h1>
          <Button variant="glow" onClick={() => navigate('/projects')}>Back to Projects</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 min-h-screen">
      {/* Hero image */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <ImageWithFallback src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="container mx-auto max-w-3xl px-4 -mt-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors font-display text-xs tracking-wider"
          >
            <ArrowLeft size={16} /> Back to Projects
          </button>

          <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text glow-text mb-6">
            {project.title}
          </h1>

          <div className="section-divider mb-8" />

          <section className="mb-8">
            <h2 className="font-display text-sm tracking-widest text-primary/70 mb-3">DESCRIPTION</h2>
            <p className="text-foreground/80 leading-relaxed">{project.description}</p>
          </section>

          <div className="section-divider mb-8" />

          {project.components && (
            <>
              <section className="mb-8">
                <h2 className="font-display text-sm tracking-widest text-primary/70 mb-3">COMPONENTS</h2>
                <div className="flex flex-wrap gap-2">
                  {project.components.split(',').map((comp, i) => (
                    <span key={i} className="glass px-3 py-1.5 rounded-full text-xs text-primary/80 font-display tracking-wider">
                      {comp.trim()}
                    </span>
                  ))}
                </div>
              </section>
              <div className="section-divider mb-8" />
            </>
          )}

          {project.video_url && project.video_url.trim() !== '' && (
            <>
              <section className="mb-8">
                <h2 className="font-display text-sm tracking-widest text-primary/70 mb-3">VIDEO</h2>
                <a
                  href={project.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent hover:text-primary transition-colors font-display text-sm tracking-wider"
                >
                  Watch Video <ExternalLink size={14} />
                </a>
              </section>
              <div className="section-divider mb-8" />
            </>
          )}

          {project.source_code && (
            <SourceCodeSection code={project.source_code} />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetail;
