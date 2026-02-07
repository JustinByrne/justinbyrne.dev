import fs from 'fs';
import path from 'path';
import { parseMarkdown } from '../src/app/shared/markdown/parse-markdown';
import { Post } from '../src/app/shared/markdown/post.types';

const POSTS_DIR = path.resolve(__dirname, '../src/assets/posts');
const OUTPUT_FILE = path.resolve(__dirname, '../src/assets/posts.json');

function generatePosts() {
    const files = fs
        .readdirSync(POSTS_DIR)
        .filter(file => file.endsWith('.md'));

    const posts: Post[] = files.map(file => {
        const fullPath = path.join(POSTS_DIR, file);
        const raw = fs.readFileSync(fullPath, 'utf8');

        const post = parseMarkdown(raw);

        return {
            ...post,
            meta: {
                ...post.meta,
                slug: file.replace(/\.md$/, ''),
            },
        };
    });

    // optional: sort by date descending
    posts.sort((a, b) => {
        const da = new Date(a.meta.date ?? 0).getTime();
        const db = new Date(b.meta.date ?? 0).getTime();
        return db - da;
    });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
    console.log(`✓ Generated ${posts.length} posts`);
}

generatePosts();
