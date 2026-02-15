import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const AddProject = () => {
  const { toast } = useToast();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Project Submitted', description: 'Your project has been added to the lab.' });
    setForm({ title: '', description: '', imageUrl: '', video: '', components: '', sourceCode: '' });
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
              { label: 'Title', field: 'title', type: 'text' },
              { label: 'Image URL', field: 'imageUrl', type: 'url' },
              { label: 'Video URL', field: 'video', type: 'url' },
              { label: 'Components', field: 'components', type: 'text' },
              { label: 'Source Code URL', field: 'sourceCode', type: 'url' },
            ].map(({ label, field, type }) => (
              <div key={field}>
                <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">{label}</label>
                <input
                  type={type}
                  value={(form as any)[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                  required={field === 'title'}
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all resize-none"
                required
              />
            </div>

            {/* Live image preview */}
            {form.imageUrl && (
              <div className="rounded-xl overflow-hidden border border-border">
                <img src={form.imageUrl} alt="Preview" className="w-full h-48 object-cover" />
              </div>
            )}

            <Button type="submit" variant="hero" className="w-full" size="lg">
              Submit Project
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProject;
