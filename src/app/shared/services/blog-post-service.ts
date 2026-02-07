import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { parseMarkdown } from '../markdown/parse-markdown';
import { Post } from '../markdown/post.types';

@Injectable({
    providedIn: 'root',
})
export class BlogPostService {

    constructor(
        protected http: HttpClient,
    ) {
        //
    }

    public getPost(slug: string): Observable<Post> {
        return this.http
            .get(`./assets/posts/${slug}.md`, { responseType: 'text' })
            .pipe(map(md => parseMarkdown(md)));
    }
}
