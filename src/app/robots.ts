import type { MetadataRoute } from 'next';

import { getServerSideUrl } from '@/payload/utils/get-server-side-url';

export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_TARGET_ENV !== 'production') {
    return {
      rules: { userAgent: '*', disallow: '/' },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/next/', '/api/'],
    },
    sitemap: new URL('/sitemap.xml', getServerSideUrl()).toString(),
  };
}
