import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!; // Pastikan 32 bytes di .env

/**
 * Mengenkripsi data menggunakan AES-256-GCM
 */
export const encryptData = (text: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  // Format: iv:tag:encryptedData
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
};

/**
 * Mendekripsi data menggunakan AES-256-GCM
 */
export const decryptData = (encryptedText: string): string => {
  const [ivHex, tagHex, contentHex] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const content = Buffer.from(contentHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  decipher.setAuthTag(tag);

  return Buffer.concat([decipher.update(content), decipher.final()]).toString('utf8');
};