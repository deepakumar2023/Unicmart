/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // enables static HTML export to /out
  images: {
    unoptimized: true, // disable Next.js image optimization
  }
  // experimental: {
  //   appDir: true, // only include this if you're using the app/ directory
  // },
};

export default nextConfig;
