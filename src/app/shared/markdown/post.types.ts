export interface PostMeta {
    title?: string;
    author?: string;
    description?: string;
    date?: string;
    image?: string;
    slug?: string;
    tags?: string;
}

export interface Post {
    meta: PostMeta;
    content: string;
}