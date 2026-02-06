import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';
import { BlogPostService } from '../shared/services/blog-post-service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
    selector: 'app-blog-post',
    imports: [
        MarkdownComponent,
    ],
    templateUrl: './blog-post.html',
    styleUrl: './blog-post.css',
})
export class BlogPost implements OnInit {

    public content: string = '';
    public isLoading: boolean = false;

    constructor(
        protected blogPostService: BlogPostService,
        protected meta: Meta,
        protected route: ActivatedRoute,
        protected title: Title,
    ) {
        //
    }

    public ngOnInit(): void {
        const slug = this.route.snapshot.paramMap.get('slug');

        if (!slug) {
            return;
        }

        this.isLoading = true;

        this.blogPostService
            .getPost(slug)
            .subscribe(post => {
                this.content = post.content;

                if (post.meta.title) {
                    this.title.setTitle(post.meta.title ?? '');

                    this.meta.updateTag({
                        property: 'og:title',
                        content: post.meta.title,
                    });
                }

                if (post.meta.description) {
                    this.meta.updateTag({
                        name: 'description',
                        content: post.meta.description,
                    });

                    this.meta.updateTag({
                        property: 'og:description',
                        content: post.meta.description,
                    });
                }

                if (post.meta.image) {
                    this.meta.updateTag({
                        property: 'og:image',
                        content: post.meta.image ?? ''
                    });
                }

                this.meta.updateTag({
                    name: 'twitter:card',
                    content: 'summary_large_image'
                });

                this.isLoading = false;
            })
    }
}
