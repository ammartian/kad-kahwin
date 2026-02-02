import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/ingest/'],
    },
    sitemap: 'https://jemputandigital.my/sitemap.xml',
  }
}
