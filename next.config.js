/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    output: 'export',
  
    // Optional: Ubah link `/me` -> `/me/` dan emit `/me.html` -> `/me/index.html`
    // trailingSlash: true,
  
    // Optional: Mencegah redirect otomatis `/me` -> `/me/`, tetap mempertahankan `href`
    // skipTrailingSlashRedirect: true,
  
    // Optional: Ubah direktori output `out` -> `dist`
    // distDir: 'dist',
  }
  
  module.exports = nextConfig;
  