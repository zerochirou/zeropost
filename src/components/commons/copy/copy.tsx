'use client';

import { useState } from 'react';

export default function CopyUrlButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Mengambil URL halaman saat ini. Bisa juga diganti dengan string URL lain.
      const currentUrl = window.location.href;

      // Menyalin teks ke clipboard
      await navigator.clipboard.writeText(currentUrl);
      
      setCopied(true);

      // Reset teks tombol kembali setelah 2 detik
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Gagal menyalin URL: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm flex items-center gap-2"
    >
      {copied ? (
        <>
          <span>✓ Berhasil Disalin!</span>
        </>
      ) : (
        <>
          <span>Salin URL</span>
        </>
      )}
    </button>
  );
}