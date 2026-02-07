import { Routes } from '@angular/router';
import { BlogPost } from './pages/blog-post/blog-post';
import { Home } from './pages/home/home';
import { Posts } from './pages/posts/posts';

export const routes: Routes = [
    {
        path: '',
        component: Home,
    },
    {
        path: 'posts',
        component: Posts,
    },
    {
        path: ':slug',
        component: BlogPost,
    }
];
