import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';
import { uploadImage } from '@/lib/uploadImage';
import { supabase } from '@/lib/supabase';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const AddProject = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    video: '',
    components: '',
    sourceCode: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);

    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file.');
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setImageError('Image must be smaller than 2MB.');
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      setImageError('Please upload a project image.');
      return;
    }

    setSubmitting(true);
    try {
      const imageUrl = await uploadImage(imageFile);

      const { error } = await supabase.from('projects').insert({
        title: form.title,
        description: form.description,
        image_url: imageUrl,
        components: form.components,
        source_code: form.sourceCode,
        video: form.video,
      });

      if (error) throw error;

      toast({ title: 'Project Submitted', description: 'Your project has been added to the lab.' });
      setForm({ title: '', description: '', video: '', components: '', sourceCode: '' });
      clearImage();
    } catch (err: any) {
      toast({ title: 'Upload Failed', description: err.message || 'Something went wrong.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const isSubmitDisabled = submitting || !!imageError || !imageFile;

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

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">
                Project Image
              </label>

              {!imagePreview ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center gap-2 py-10 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary/50 hover:text-primary/80 transition-all"
                >
                  <Upload size={28} />
                  <span className="text-sm font-display tracking-wider">Click to upload image</span>
                  <span className="text-xs text-muted-foreground/60">Max 2MB, images only</span>
                </button>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-border">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {imageError && (
                <p className="mt-2 text-sm text-destructive font-display tracking-wider">{imageError}</p>
              )}
            </div>

            <Button type="submit" variant="hero" className="w-full" size="lg" disabled={isSubmitDisabled}>
              {submitting ? 'Uploading...' : 'Submit Project'}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProject;
