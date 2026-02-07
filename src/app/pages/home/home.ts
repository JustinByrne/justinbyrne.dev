import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import postsData from '../../../assets/posts.json';
import { Post } from '../../shared/markdown/post.types';

@Component({
    selector: 'app-home',
    imports: [
        DatePipe,
    ],
    templateUrl: './home.html',
    styleUrl: './home.css',
})
export class Home implements OnInit {

    public posts: Post[] = [];

    public ngOnInit(): void {
        this.getPosts();
    }

    private getPosts(): void {
        this.posts = postsData.slice(0, 5);
    }
}
