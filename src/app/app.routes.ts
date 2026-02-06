import { Routes } from '@angular/router';
import { BlogPost } from './blog-post/blog-post';

export const routes: Routes = [
    {
        path: ':slug',
        component: BlogPost,
    }
];
