import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import postsData from '../../../assets/posts.json';
import { Post } from '../../shared/markdown/post.types';
import { Pagination } from '../../shared/pagination/pagination';

@Component({
    selector: 'app-posts',
    imports: [
        DatePipe,
        Pagination,
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
        this.totalPages = Math.ceil(postsData.length / this.postsPerPage);
        this.setPage(this.currentPage);
    }

    private getPosts(): void {
        const start = (this.currentPage - 1) * this.postsPerPage;
        const end = start + this.postsPerPage;
        this.posts = postsData.slice(start, end);
    }

    public setPage(page: number): void {
        this.currentPage = page;
        this.getPosts();
    }
}
