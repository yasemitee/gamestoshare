import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://www.gamestoshare.com';
    return {
        rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/terms/', '/api/']
        },
        sitemap: `${baseUrl}/sitemap.xml`
    };
}