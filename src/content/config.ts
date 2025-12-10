import { defineCollection, z } from 'astro:content'



const projects = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        heroImage: z.string().optional(), // Make optional or use a default
        repo: z.string().optional(), // GitHub repo URL
        url: z.string().optional(), // Live URL
        tags: z.array(z.string()).optional(),
        pubDate: z.coerce.date().optional(), // Useful for sorting
    }),
});


export const collections = { projects }

