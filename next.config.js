/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental:{
      serverActions: true
    },
    images: {
      domains: ["res.cloudinary.com", "images.pexels.com", "chineseruleof8.com"],
    },
  };
  
  module.exports = nextConfig;

  // http://chineseruleof8.com/wp-content/uploads/2023/07/james-and-the-giant-peach-fuzzy-stickers-2018-edition-1.jpg
  