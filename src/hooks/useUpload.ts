import { persistFile } from '@/services/platformStore';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export function useUpload() {
  async function upload(file: File, owner_user_id: string, project_id?: string) {
    if (!file.type.startsWith('image/')) throw new Error('Only image files are supported.');
    if (file.size > MAX_FILE_SIZE) throw new Error('Image must be smaller than 2MB.');
    const compressed = await compressImage(file);
    const record = await persistFile(compressed, owner_user_id, project_id);
    return record.storage_url;
  }

  return { upload };
}

async function compressImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.82));
  if (!blob) return file;
  return new File([blob], `${file.name.split('.')[0]}.webp`, { type: 'image/webp' });
}
