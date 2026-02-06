import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

interface PostMeta {
    title?: string;
    description?: string;
    date?: string;
    image?: string;
}

export interface Post {
    meta: PostMeta;
    content: string;
}

@Injectable({
    providedIn: 'root',
})
export class BlogPostService {

    constructor(
        protected http: HttpClient,
    ) {
        //
    }

    private parseMarkdown(md: string): Post {
        const frontMatterRegex = /^---\n([\s\S]*?)\n---\n?/;
        const match = md.match(frontMatterRegex);

        if (!match) {
            return {
                meta: {},
                content: md,
            } as Post;
        }

        const yaml = match[1];
        const content = md.slice(match[0].length);
        const meta: PostMeta = {};

        yaml
            .split('\n')
            .forEach(line => {
                const [key, ...rest] = line.split(':');
                if (key && rest.length) {
                    const k = key.trim() as keyof PostMeta;
                    meta[k] = rest.join(':').trim();
                }
            });

        return { meta, content } as Post;
    }

    public getPost(slug: string): Observable<Post> {
        return this.http
            .get(`assets/posts/${slug}.md`, { responseType: 'text' })
            .pipe(map(md => this.parseMarkdown(md)));
    }
}
