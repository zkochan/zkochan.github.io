---
layout: post
title:  "It is OK to keep random things in a single monorepo"
date: "2018-10-23 01:00:00 +0200"
categories: nodejs
comments: true
---

For a long time, I was an opponent of monorepos. There are many popular open source contributors that have hundreds of packages on npm and each of those packages have a dedicated GitHub repository. I thought everyone does it this way, so it should be the right way! No?

I started to publish some things to npm as well and after a few years, I have now almost 300 packages in the registry. It took me a long time but I realized, the *majority* of npm packages don't need dedicated repositories.

## Most of the npm packages are almost never updated

Once a package is ready, you will probably never update it again. The only time you will need to update a package is when Renovate or Greenkeeper will open a PR to update dependencies that had major version changes.

So why create a dedicated repository for a package that will have less than 10 useful commits?

## Most of the npm packages never get any contributions

Even popular packages get few contributions. Certainly, you will be *the only* contributor of your non-popular packages.

So why keeping a separate GitHub repository? There will be no other developers that will need admin permissions to a given npm package.

## It is OK, use one repo!

You might think: "but those packages are completely unrelated". And that is true. But that is the only downside: keeping random packages in a single repository. Think about all the advantages:

* fewer notifications from Greenkeeper/Renovate
* less CI setup
* less boilerplate

Additional advantages:

* you can use services that limit the number of repositories you use.
* you can easily migrate all your code to other git servers because there is only one repository to migrate

## How to

My recipe is using the [recursive commands](https://pnpm.js.org/docs/en/pnpm-recursive.html) of [pnpm](https://github.com/pnpm/pnpm) to install all dependencies of your packages and run their tests:

```
pnpm recursive install
pnpm recursive test --workspace-concurrency 1
```

But you may also use [Rush](https://rushjs.io/), [Lerna](https://github.com/lerna/lerna/), or other monorepo managing tools.

To see how I moved some of my packages to a single repo, see [zkochan/packages](https://github.com/zkochan/packages).

## You can always create a dedicated repository later

If one of your packages will receive a lot of attention, you can always move it to a dedicated repository later.
