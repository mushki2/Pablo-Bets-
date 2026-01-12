/** @type {import('next').NextConfig} */
const nextConfig = {
  // Note: A 'rewrites' configuration is not necessary for the /api route.
  // Vercel's platform automatically handles the routing of requests
  // starting with /api/ to the corresponding serverless function
  // located in the /api directory. This is a standard convention
  // that simplifies the deployment of hybrid applications.
};

export default nextConfig;
