---
title: Masking input fields with Alpine.js
slug: masking-input-fields-with-alpine-js
author: Justin Byrne
type: post
date: '2023-02-08T16:00:00.000Z'
---

# Masking input fields with Alpine.js

There are times when creating a form where a field needs its content in a certain state. This can be something as simple as a date field where the field needs to look like `DD/MM/YYYY`.

By default HTML doesn't have the ability to make these custom masks for the inputted content. However, if the site is using [Alpine.js](https://alpinejs.dev) then the [Mask plugin](https://alpinejs.dev/plugins/mask) can be used to achieve this.

## Installation

There are a couple ways to install the mask plugin. The easiest is to use the CDN, this can be done by adding the following before the Alpine.js JavaScript file.

### Via CDN

```html
<!-- Alpine Plugins -->
<script defer src="https://unpkg.com/@alpinejs/mask@3.x.x/dist/cdn.min.js"></script>
 
<!-- Alpine Core -->
<script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### Via NPM

Otherwise is Alpine.js is being used with npm the plugin will first need to be required and then the alpine JavaScript file will need to be updated.

```sh
npm install @alpinejs/mask
```

To implement the plugin the alpine JavaScript file needs to contain the following.

```js
import Alpine from 'alpinejs'
import mask from '@alpinejs/mask'

Alpine.plugin(mask)
```

## Using the Mask plugin

With the mask plugin now available within the HTML it doesn't take too much to be able to implement it into a page. The first thing is to decide what the mask will need to be, to do this the Mask plugin has three different characters that are used to create the mask.

- * can be used for any character
- a can be used for aplha characters (a-z,A-Z)
- 9 can be used for numeric characters (0-9)

Using the example from the introduction `DD/MM/YYYY` the mask that will be used will be `99/99/9999`.

To add the mask to text input box the following can be used

```html
<input type="text" name="dob" x-data x-mask="99/99/9999" />
```

As seen in the above example there are two non-standard HTML attributes. The first is the normal Alpine.js `x-data` this ensures that Alpine.js is looking at the element. The second attribute is x-mask, this is the attribute used for defining the mask itself.