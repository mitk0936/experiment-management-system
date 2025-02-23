const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  experimental: {
    serverActions: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

module.exports = nextConfig;
