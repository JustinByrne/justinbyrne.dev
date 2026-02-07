---
title: How to center a div - 3 methods
slug: how-to-center-a-div-3-methods
author: Justin Byrne
type: post
date: 2023-02-08T16:00:00.000Z
---

It seems that there are a lot of searches for how to center a div, and there are lots of articles and questions asking the same. Sometimes though these can be a bit hit or miss. However, here are three different methods that I can think of to do this. These different methods include: flexbox, grid and absolute positioning.

## Grid

Grid is by far the easiest method out of the three, however, with the below code is not using grid to its full potential, as there is so much that can be done with it. This method sets up a container that fills the whole screen and then centers the content inside it.

For more information about grid, Kevin Powell on YouTube has done a brilliant video - [Learn CSS Grid the easy way](https://www.youtube.com/watch?v=rg7Fvvl3taU).

### index.html

```html
<head>
    <link rel="stylesheet" href="./style.css" />
</head>
<body>
    <div class="container">
        <div>
            This content is centered
        </div>
    </div>
</body>
```

### style.css

```css
body {
    margin: 0;
}

.container {
    display: grid;
    place-content: center;
    width: 100%;
    height: 100vh;
}
```

## Flexbox

Similarly to the grid method the flexbox method creates a container that matches the screen dimensions and then centers the content inside it. To learn about flexbox a little more the [Knights of the Flexbox Table](https://knightsoftheflexboxtable.com) is a brilliant gamification way of learning it.

### index.html

```html
<head>
    <link rel="stylesheet" href="./style.css" />
</head>
<body>
    <div class="container">
        <div>
            This content is centered
        </div>
    </div>
</body>
```

### style.css

```css
body {
    margin: 0;
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
}
```

## Absolute positioning

Unlike the two previous methods positioning the content absolutely doesn't specifically require a container element as it is positioned relative to the nearest positioned parent, however, if no parent element has position then it will default to the document body.

### index.html

```html
<head>
    <link rel="stylesheet" href="./style.css" />
</head>
<body>
    <div class="center">
        This content is centered
    </div>
</body>
```

### style.css

```css
body {
    margin: 0;
}

.center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
}
```