import CryptoJS from 'crypto-js';

const KEY_STORAGE_NAME = 'hekma_enc_key';

// Generate or retrieve the local encryption key
const getEncryptionKey = (): string => {
  let key = localStorage.getItem(KEY_STORAGE_NAME);
  if (!key) {
    // Generate a random 256-bit key
    key = CryptoJS.lib.WordArray.random(256 / 8).toString();
    localStorage.setItem(KEY_STORAGE_NAME, key);
  }
  return key;
};

export const encryptMessage = (text: string): string => {
  if (!text) return '';
  const key = getEncryptionKey();
  return CryptoJS.AES.encrypt(text, key).toString();
};

export const decryptMessage = (cipherText: string): string => {
  if (!cipherText) return '';
  try {
    const key = getEncryptionKey();
    const bytes = CryptoJS.AES.decrypt(cipherText, key);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText || '*** Encrypted Content ***';
  } catch (e) {
    console.error("Decryption failed", e);
    return '*** Decryption Error ***';
  }
};
