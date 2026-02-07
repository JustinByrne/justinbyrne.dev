import { DatePipe } from '@angular/common';
import { Component, computed, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import postsData from '../../../assets/posts.json';
import { Post } from '../../shared/markdown/post.types';
import { Pagination } from '../../shared/pagination/pagination';

@Component({
    selector: 'app-posts',
    imports: [
        DatePipe,
        Pagination,
        RouterLink,
    ],
    templateUrl: './posts.html',
    styleUrl: './posts.css',
})
export class Posts implements OnInit {

    public allPosts: WritableSignal<Post[]> = signal([]);
    public searchTerm: WritableSignal<string> = signal('');
    public currentPage: WritableSignal<number> = signal(1);
    public postsPerPage: number = 15;
    public posts: Signal<Post[]> = computed(() => []);
    public filteredPosts: Signal<Post[]> = computed(() => []);
    public totalPages: Signal<number> = computed(() => 1);

    private debouncedSearchTerm: Signal<string> = computed(() => '');

    constructor(
        protected title: Title,
    ) {
        this.title.setTitle('Posts | JustinByrne.dev');

        this.debouncedSearchTerm = toSignal(
            toObservable(this.searchTerm).pipe(
                debounceTime(300),
                distinctUntilChanged()
            ),
            { initialValue: '' }
        );

        toObservable(this.debouncedSearchTerm).subscribe(() => {
            this.currentPage.set(1);
        });
    }

    public ngOnInit(): void {


        this.allPosts.set(postsData);

        this.filteredPosts = computed(() => {
            const search = this.debouncedSearchTerm().toLowerCase();

            if (!search) {
                return this.allPosts();
            }

            return this.allPosts()
                .filter(post =>
                    post.meta.title?.toLowerCase().includes(search)
                    || post.meta.description?.toLowerCase().includes(search)
                    || post.content.toLowerCase().includes(search)
                );
        });

        this.posts = computed(() => {
            const start = (this.currentPage() - 1) * this.postsPerPage;
            const end = start + this.postsPerPage;

            return this.filteredPosts().slice(start, end);
        });

        this.totalPages = computed(() =>
            Math.max(1, Math.ceil(this.filteredPosts().length / this.postsPerPage))
        );
    }

    public setPage(page: number): void {
        if (page < 1 || page > this.totalPages()) return;
        this.currentPage.set(page);
    }
}
