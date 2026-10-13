// Taruh file ini di C:\Website_Fakultas (sejajar dengan folder web-fst, web-feb, web-fh, web-fsh)
// lalu jalankan dari folder itu:  pm2 start ecosystem.config.js
//
// Port BACKEND tidak diatur di sini. Backend membaca PORT dari file .env di foldernya sendiri:
//   web-fst = 5000, web-feb = 5001, web-fsh = 5002, web-fh = 5003
// Port FRONTEND diatur di bawah (args: 'start -p ...') dan HARUS sama dengan
// baris FRONTEND_URL di backend\.env milik fakultas yang sama.

module.exports = {
  apps: [
    // ==========================================
    // 1. FAKULTAS SOSIAL HUMANIORA (FSH)
    //    Folder web-fsh belum dibuat. Hapus tanda // di bawah setelah folder dan databasenya ada.
    // ==========================================
      {
      name: 'fsh-frontend',
      cwd: './web-fsh/frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3004',
      env: { NODE_ENV: 'production' },
    },
    {
      name: 'fsh-backend',
      cwd: './web-fsh/backend',
      script: 'dist/src/index.js',
      env: { NODE_ENV: 'production' },
    },
    // ==========================================
    // 2. FAKULTAS EKONOMI & BISNIS (FEB)
    // ==========================================
    {
      name: 'feb-frontend',
      cwd: './web-feb/frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3001',
      env: { NODE_ENV: 'production' },
    },
    {
      name: 'feb-backend',
      cwd: './web-feb/backend',
      script: 'dist/src/index.js',
      env: { NODE_ENV: 'production' },
    },

    // ==========================================
    // 3. FAKULTAS HUKUM (FH)
    // ==========================================
    {
      name: 'fh-frontend',
      cwd: './web-fh/frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3003',
      env: { NODE_ENV: 'production' },
    },
    {
      name: 'fh-backend',
      cwd: './web-fh/backend',
      script: 'dist/src/index.js',
      env: { NODE_ENV: 'production' },
    },

    // ==========================================
    // 4. FAKULTAS SAINS & TEKNOLOGI (FST)
    // ==========================================
    {
      name: 'fst-frontend',
      cwd: './web-fst/frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      env: { NODE_ENV: 'production' },
    },
    {
      name: 'fst-backend',
      cwd: './web-fst/backend',
      script: 'dist/src/index.js',
      env: { NODE_ENV: 'production' },
    },
  ],
};