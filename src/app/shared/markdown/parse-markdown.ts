import { Post, PostMeta } from './post.types';

export function parseMarkdown(md: string): Post {
    const frontMatterRegex = /^---\n([\s\S]*?)\n---\n?/;
    const match = md.match(frontMatterRegex);

    if (!match) {
        return {
            meta: {},
            content: md,
        };
    }

    const yaml = match[1];
    const content = md.slice(match[0].length);
    const meta: PostMeta = {};

    yaml.split('\n').forEach(line => {
        const [key, ...rest] = line.split(':');
        if (key && rest.length) {
            const k = key.trim() as keyof PostMeta;
            meta[k] = rest.join(':').trim();
        }
    });

    return { meta, content };
}
