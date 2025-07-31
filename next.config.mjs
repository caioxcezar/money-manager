import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = withNextIntl({
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
});

export default nextConfig;
