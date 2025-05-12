declare module 'crypto' {
  export function randomBytes(size: number): Buffer;
  export function createCipheriv(algorithm: string, key: Buffer, iv: Buffer): Cipher;
  export function createDecipheriv(algorithm: string, key: Buffer, iv: Buffer): Decipher;

  interface Cipher {
    update(data: string | Buffer): Buffer;
    final(): Buffer;
  }

  interface Decipher {
    update(data: Buffer): Buffer;
    final(): Buffer;
  }
}

declare module 'buffer' {
  export class Buffer {
    static from(str: string, encoding?: string): Buffer;
    static concat(list: Buffer[]): Buffer;
    toString(encoding?: string): string;
  }
} 