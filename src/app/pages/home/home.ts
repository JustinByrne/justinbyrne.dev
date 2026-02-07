import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from "@angular/router";
import postsData from '../../../assets/posts.json';
import { Post } from '../../shared/markdown/post.types';

@Component({
    selector: 'app-home',
    imports: [
        DatePipe,
        RouterLink
    ],
    templateUrl: './home.html',
    styleUrl: './home.css',
})
export class Home implements OnInit {

    public posts: Post[] = [];

    constructor(
        protected title: Title,
    ) {
        this.title.setTitle('JustinByrne.dev');
    }

    public ngOnInit(): void {
        this.getPosts();
    }

    private getPosts(): void {
        this.posts = postsData.slice(0, 5);
    }
}
