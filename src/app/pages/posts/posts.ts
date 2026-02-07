import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import postsData from '../../../assets/posts.json';
import { Post } from '../../shared/markdown/post.types';

@Component({
    selector: 'app-posts',
    imports: [
        DatePipe,
    ],
    templateUrl: './posts.html',
    styleUrl: './posts.css',
})
export class Posts implements OnInit {

    public posts: Post[] = [];
    public currentPage: number = 1;
    public postsPerPage: number = 15;
    public totalPages: number = 1;

    constructor() {
        //
    }

    public ngOnInit(): void {
        this.getPosts();
    }

    private getPosts(): void {
        this.posts = postsData;

        this.totalPages = Math.ceil(this.posts.length / this.postsPerPage);
    }
}
