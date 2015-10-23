---
layout: post
title:  "DTM killer?"
date:   2015-04-25 11:59:00
categories: ideas
comments: true
permalink: /ideas/2015/04/25/tag-manager-killer.html
---

The company that I am currently working at is using [Adobe DTM][adobe-dtm] for managing tags/pixels. I wasn't involved in the process of adopting it but I am actively using it now (unfortunately).

My impressions are negative, so far. We have a Git repository for our snippets that are used in DTM. And here is our workflow:

1. We write the code in a text editor
2. We cover it with unit tests
3. We code review our changes
4. We run a gulp task to minify the snippets ([UglifyJS][UglifyJS] compresses the snippets way better than Adobe DTM does)
5. We copy paste the code to the Adobe DTM (there is no other method to pull the code to Adobe DTM). We copy paste the code to several places sometimes!

This process is bad in many ways.

## It kills the fun of web development

The reason I like web development is because it is so fast and easy. When writing some SQL scripts, it is hard to test them. But when writing front-end code, it is just a browser reload. And, when using [livereload][lr], it is
even automatic.

However, when writing code in Adobe DTM's web interface, the code has to be saved twice and then the cache should be updated and then we can see our changes. But it is a bad idea to write the code in Adobe DTM, because it
can break stuff for other people. It is possible to create a different property, which will be used only by the locally running website. But thats just more complexity and copy pasting.

## It creates conflicts

When several devs are doing something in Adobe DTM they frequently rewrite the changes of each other.

## A better alternative?

Some say that [Google's Tag Manager][google-tm] is better. They say that Google Tag Manager has an API for pushing changes. They also say that it's event based snippet injection is more intuitive than the methods used by
Adobe DTM (I am not competent in these details. Thats just what I heard at work).

Google Tag Manager may or may not be better than Adobe DTM. However, I don't like the whole concept of these tools. I don't understand why would a developer need a complex UI to do simple things.

## What do we actually need?

What problems are trying to solve tag managers? IMHO, they want to solve just one problem: **updating JavaScript on the page without redeploying the website**.

So why all the complexity? This can be easily done by having:

* a Git repo with the JavaScript
* a static server which would host the resources
* an app that would publish the changes from Git to the static server.
* a JavaScript library that would load and execute the required snippets.

I am going to create an open source project which will do all of it and I'll add the link to it later.

###updated on 23/05/2015

Instead of creating one project, I decided to create two:

1. A tool for developing the static resources locally: [Foso][foso]
2. A static server that autoupdates itself from a Git repository: [Gizi][gizi]

[adobe-dtm]: https://dtm.adobe.com
[UglifyJS]: https://github.com/mishoo/UglifyJS
[lr]: https://github.com/vohof/gulp-livereload
[google-tm]: https://www.google.com/tagmanager/
[foso]: https://github.com/zkochan/foso
[gizi]: https://github.com/zkochan/gizi
