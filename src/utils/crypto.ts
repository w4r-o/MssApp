import { Buffer } from 'buffer';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const algorithm = 'aes-256-cbc';
const ivLength = 16;
const keyLength = 32;

export const generateKey = (): string => {
  return randomBytes(keyLength).toString('hex');
};

export const encrypt = (text: string, key: string): string => {
  const iv = randomBytes(ivLength);
  const cipher = createCipheriv(algorithm, Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

export const decrypt = (text: string, key: string): string => {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift() || '', 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = createDecipheriv(algorithm, Buffer.from(key, 'hex'), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}; 