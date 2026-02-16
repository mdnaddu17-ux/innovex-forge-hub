import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';
import { uploadImage } from '@/lib/uploadImage';
import { supabase } from '@/lib/supabase';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const AddProject = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
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
    e.stopPropagation();

    if (!form.title.trim() || !form.description.trim() || !imageFile) {
      toast({
        title: 'Missing Fields',
        description: 'Title, Description and Image are required.',
        variant: 'destructive',
      });
      if (!imageFile) setImageError('Please upload a project image.');
      return;
    }

    if (!form.sourceCode || !form.sourceCode.trim()) {
      toast({
        title: 'Missing Fields',
        description: 'Source code or repository link is required.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const imageUrl = await uploadImage(imageFile);

      const { error } = await supabase.from('projects').insert({
        title: form.title.trim(),
        description: form.description.trim(),
        image_url: imageUrl,
        components: form.components?.trim() || null,
        source_code: form.sourceCode.trim(),
        video: form.video?.trim() || null,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: 'Project Submitted',
        description: 'Your project has been added to the lab.',
      });
      navigate('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      toast({ title: 'Upload Failed', description: message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const isSubmitDisabled = submitting || !!imageError;

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="container mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold gradient-text glow-text mb-8 text-center">
            Add New Project
          </h1>

          <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 glow-box space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                required
              />
            </div>

            {/* Video URL (optional) */}
            <div>
              <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">
                {'Video URL (optional)'}
              </label>
              <input
                type="text"
                value={form.video}
                onChange={(e) => handleChange('video', e.target.value)}
                placeholder="YouTube or Drive link"
                className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>

            {/* Components */}
            <div>
              <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">
                Components
              </label>
              <input
                type="text"
                value={form.components}
                onChange={(e) => handleChange('components', e.target.value)}
                className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>

            {/* Source Code -- accepts GitHub, Drive, or raw code */}
            <div>
              <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">
                Source Code / Repository Link
              </label>
              <textarea
                value={form.sourceCode}
                onChange={(e) => handleChange('sourceCode', e.target.value)}
                rows={3}
                placeholder="GitHub link, Drive link, or paste raw code"
                className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all resize-none"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">
                Description
              </label>
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
