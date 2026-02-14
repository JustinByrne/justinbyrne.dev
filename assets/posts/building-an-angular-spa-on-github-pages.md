---
title: Building an Angular SPA on GitHub Pages
slug: building-an-angular-spa-on-github-pages
author: Justin Byrne
type: post
date: 2026-02-14T23:07:00.000Z
tags: angular, github, github actions, github pages
---

In the past, I have used a range of different CMS tools to run my personal website, including WordPress, GhostCMS and even built a full Laravel site with FilamentPHP. The one thing all of these have in common is that they are just more complex than I need. All I need is somewhere to post an article for me to look back at in the future or to pass on to someone I know.

So, in my venture to get my site back up and running after issues with my server, I was reintroduced to GitHub pages. It was going to be the perfect option, a nice, easy-to-host solution, with an easy-to-update direction I could take. I write most, if not, all of my posts in markdown and thought this would be the perfect opportunity to try using Angular to load my posts from the markdown files, allowing me to just write a new post, commit it to the repo and be done.


## Building a new Angular site

So the first thing I needed to do was to get an Angular site set up. This was easy enough, as I have the Angular CLI, but if I didn't, it could be easily installed with the following.

```sh
npm install -g @angular/cli
```

To get the new Angular v21 site created, I ran the following command. I personally named the site after the domain I was planning to use, but the site can be names whatever you want.

```sh
ng new justinbyrne.dev
```

This command asked several different questions during the setup process, most of which I just used the default options. After that, I had an Angular site ready to use. In this post, I won't go too much into how I got my markdown logic working. However, I'll put this in a different post, hopefully soon.

## Setting up auto deployment

There are different ways that GitHub pages can be set up. It can be done either by deploying from a branch or by using GitHub actions. My process was to use GitHub actions to deploy from a branch. I know how backwards that sounds.

So the first thing to do was to set up the workflow file that would run when I wanted to deploy. I personally like it to only run the deployment to pages when I create a new release. I find this is nicer as I can add a bunch of different features before choosing when to deploy it. The workflow is then defined in the following file `.github/workflows/deploy.yml`

```yml
name: Deploy Angular SPA to GitHub Pages

on:
  release:
    types: [published]

permissions:
  contents: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'

      - name: Install dependencies
        run: npm ci

      - name: Build Angular site
        run: npm run build -- --configuration production --base-href "/" --output-path dist/site

      - name: Add 404.html for SPA routing
        run: cp dist/site/browser/index.html dist/site/browser/404.html

      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          branch: gh-pages
          folder: dist/site/browser
          clean: true
```

There are a couple of parts within this file that need explaining.

### Building Angular

When building the Angular site, I use the normal `npm run build` script. However, I do include some parameters.

`--base-href "/"` - this sets what the directory will be. As I am using a custom domain, I want this to be the root-level domain. However, if you are using GitHub pages without a custom domain, this will need to be set to the repo name.

`--output-path dist/site` - this tells npm what directory to build the site to. This is important as it will be used later when pushing the site to a branch. The name of the directory that the site is built in doesn't matter too much, but it will need to be consistent across the yaml file.

### 404 page

As part of the GitHub pages, if it cannot find the page it's looking for, it will redirect to a `404.html` page in the root directory. This allows for custom 404 pages. However, as this is using Angular and the Angular routing, this can cause a problem.

To make sure that even if there is a 404 error, the user remains in the Angular router, the quickest and easiest thing to do is to copy the index.html to a new file `404.html`. I do that with the following step.

```yaml
- name: Add 404.html for SPA routing
  run: cp dist/site/browser/index.html dist/site/browser/404.html
```

This ensures that the files are the same. One of the biggest benefits of this is that it helps deal with the auto `index.html` that GitHub pages tries to open. For example, if you visited `domain.com/sub-folder`, GitHub pages will try to load `domain.com/sub-folder/index.html`. If that file doesn't exist, it will fall back to the `404.html`, which luckily will now use the Angular routing and return the correct route.

### Deploy to GitHub pages

The last step in the workflow is to deploy the site using the deploy action. This will take your built Angular site that is currently sitting temporarily in GitHub actions, and then push the changes to a specified branch. The directory in the repo that is pushed can also be defined.

I have defined that I want the `dist/site/browser` directory to be pushed to a `gh-pages` branch. This ensures that the site is loaded from the correct directory and that I don't need to make any further special changes to GitHub pages.