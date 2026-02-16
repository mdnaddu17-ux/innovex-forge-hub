import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseAdmin } from '@/lib/supabase-admin';

const inputClass =
  'w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all';

const AddProject = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    video: '',
    components: '',
    sourceCode: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const { error } = await supabaseAdmin.from('projects').insert({
        title: form.title,
        description: form.description,
        image_url: form.imageUrl,
        video_link: form.video || null,
        components: form.components || null,
        source_code: form.sourceCode || null,
        uploaded_by: user.id,
      });

      if (error) throw error;

      toast({ title: 'Project Submitted', description: 'Your project has been added to the lab.' });
      setForm({ title: '', description: '', imageUrl: '', video: '', components: '', sourceCode: '' });
      navigate('/projects');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="container mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold gradient-text glow-text mb-8 text-center">
            Add New Project
          </h1>

          <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 glow-box space-y-6">
            {[
              { label: 'Title', field: 'title', type: 'text', required: true },
              { label: 'Image URL (https)', field: 'imageUrl', type: 'url', required: true },
              { label: 'Video URL', field: 'video', type: 'url', required: false },
              { label: 'Components', field: 'components', type: 'text', required: false },
              { label: 'Source Code URL', field: 'sourceCode', type: 'url', required: false },
            ].map(({ label, field, type, required }) => (
              <div key={field}>
                <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">{label}</label>
                <input
                  type={type}
                  value={(form as Record<string, string>)[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className={inputClass}
                  required={required}
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className={`${inputClass} resize-none`}
                required
              />
            </div>

            {form.imageUrl && (
              <div className="rounded-xl overflow-hidden border border-border">
                <img src={form.imageUrl} alt="Preview" className="w-full h-48 object-cover" />
              </div>
            )}

            <Button type="submit" variant="hero" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Project'}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProject;
