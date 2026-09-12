import { Routes } from '@angular/router';
import { BlogPost } from './pages/blog-post/blog-post';
import { Home } from './pages/home/home';
import { Posts } from './pages/posts/posts';
import { toolsRoutes } from './pages/tools/tools.routes';

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
        path: 'tools',
        children: toolsRoutes,
    },
    {
        path: ':slug',
        component: BlogPost,
    },
    {
        path: '**',
        redirectTo: '',
    }
];
