import { persistFile } from '@/services/platformStore';

export async function uploadImage(file: File, owner_user_id = 'anonymous'): Promise<string> {
  if (!file) throw new Error('Image required');
  if (!file.type.startsWith('image/')) throw new Error('Only image files allowed');
  if (file.size > 2 * 1024 * 1024) throw new Error('Image max size 2MB');
  const record = await persistFile(file, owner_user_id);
  return record.storage_url;
}
