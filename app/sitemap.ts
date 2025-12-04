import { url } from 'inspector';
import { MetadataRoute} from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.gamestoshare.com';
    return [
        {url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1},
        {url: `${baseUrl}/listings`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8},
        {url: `${baseUrl}/info`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7},
        {url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6},
    ];
}
