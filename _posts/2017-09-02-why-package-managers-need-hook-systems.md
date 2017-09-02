---
layout: post
title:  "Why package managers need hook systems"
date: "2017-09-02 12:00:00 +0200"
categories: nodejs
comments: true
---

We introduced hooks to pnpm in [version 1.12](https://github.com/pnpm/pnpm/releases/tag/v1.12.0). In this article I want to write about why we think package managers (PMs) need hooks.

### Why would we want to hook into `node_modules`?

When installing dependencies of a Node-project, the node_modules structure is 100% controlled by the package.json files of the dependencies (a.k.a. manifests). So if your project depends on foo@1.0.0 which depends on bar@2.0.0 then you’ll be going to have two dependencies installed in your node_modules. While you can change your project’s dependency set, you don’t have control over the manifests of your dependencies.

A typical dependency tree is huge and you have no ownership over the majority of your dependencies. Just analyze any of your dependencies at [npm.anvaka.com](http://npm.anvaka.com).

![](https://i.imgur.com/rynJysq.png)
<figcaption>The dependency graph of browserify</figcaption>

What to do if there is a bug in one of the packages inside your node_modules? If the issue is in a root dependency, then you have 3 options:

1.  find an alternative, more reliable package
2.  submit a pull request (PR) that fixes the issue
3.  create your own package and use it instead of the buggy one

The 2nd option seems to be the correct one and I encourage everyone to contribute as frequently as possible. However, submitting a PR doesn’t mean that your changes will be merged/published. Even if they will be merged and published, it won’t happen immediately, you might have to wait for years. Here are some frequent issues:

*   the project is unmaintained/poorly maintained
*   you did breaking changes and the author doesn’t like bumping major versions. The author will wait for several breaking changes to come in, before publishing a major version
*   the author thinks the bug is not a bug

If the problematic package is a root dependency, then you can easily switch to another package or to your fork. The problem is match harder to solve if the package is a sub-dependency. In that case, your options are:

1.  submit a PR that fixes the issue
2.  submit many PRs to packages that depend on the buggy package

With hooks though, you can have a third option: create a fork and install it instead of the problematic package. So if you have foo@1.0.0 that depends on bar@2.0.0 you can have a hook that will override the dependency.

Let’s say there is a bug in bar@2.0.0 and you submitted a PR with a fix. However, the maintainer of bar is on vacation. You can use a hook to make pnpm install bar from your PR branch instead of bar@2.0.0 from the npm registry.

### Why hooks are important for pnpm’s survival

Hooks are nice to have in any PM but for pnpm they are especially important. As you may know already, pnpm creates a strict symlinked node_modules structure. You can read more about it in: [pnpm’s strictness helps to avoid silly bugs](https://medium.com/pnpm/pnpms-strictness-helps-to-avoid-silly-bugs-9a15fb306308)

Although the node_modules structure created by pnpm is Node.js-compatible, many packages have bugs that show up only when installed via pnpm. As a consequence, pnpm has issues with some popular frameworks and tools.

Of course, we try to solve these issues via PRs (I want to give a shout out to [aecz](https://github.com/aecz) who managed to fix many such issues in Angular). But besides the usual issues, some of the maintainers are hostile and refuse to accept PRs just because they don’t like pnpm or believe that the flat node_modules created by npm/Yarn is a feature (it is not).

In the end, we have two options to fix the ecosystem for the strict pnpm:

1.  make pnpm popular enough. In that case, authors of frameworks/toolings will be testing their product with pnpm as well as npm and Yarn.
2.  make a hook system to temporarily substitute the buggy packages that don’t work with pnpm.

IMHO, the 1st scenario is pretty much impossible. pnpm can’t become popular without being a drop-in replacement for npm.

### Real-life example

There is a popular package called [resolve](https://github.com/browserify/resolve) for resolving dependencies from node_modules (1,3K dependents, 765K downloads a day). Unfortunately for pnpm, resolve preserves symlinks when resolving modules. This is an issue on resolve’s end as Node.js does not preserve symlinks during resolution. I did a [PR](https://github.com/browserify/resolve/pull/131) to fix this issue and now resolve from version 1.4 has an option to not preserve symlinks.

This does not solve the problem for pnpm though. We can’t submit PRs to the 1.3K dependent packages to update resolve and pass preserverSymlink: false to it. The lead maintainer of resolve agreed to switch the option’s default value in the next major version. So I hoped Greenkeeper would create the PRs for us and most of the packages would update resolve to version 2.

I created another [PR](https://github.com/browserify/resolve/pull/135) with the breaking change but resolve’s maintainer wants to wait for more breaking changes before changing resolve to version 2.

I realized that we cannot change the world but we can change pnpm, so I released the readPackage hook. My changes to resolve are available via my fork on GitHub, so all we have to do is to tell pnpm to install resolve from the fork. This can be done by declaring the hook in a file called pnpmfile.js:

<script src="https://gist.github.com/zkochan/fe33b3a9f3963f3a834334918c7973ca.js?file=pnpmfile.js"></script>

During installation, pnpm will pass every package.json to this hook first and use the version of the package.json returned by the hook. So it won’t matter on which version of resolve the package depends, my fork will be installed instead and the project will work fine with pnpm.

### Summary

I did not describe all the use cases when the readPackage can be useful. It is a really powerful tool and I think we’ll learn how to use it smartly.

Also, I want to say thanks to [Andrei Neculau](https://medium.com/u/334c14ed4bfc), who convinced me that this hook-system was a good idea.

To make it a little bit interactive, check how many unresolved PRs you have on GitHub and post the number in the comments section. You can use [this link](https://github.com/pulls) to see all your open PRs.

### Do you want to give pnpm a try?

Just install pnpm via npm: npm install -g pnpm. And use it instead of npm whenever you want to install something: pnpm i foo.

Also, you can read more info at the [pnpm GitHub repo](https://github.com/pnpm/pnpm) or [pnpm.js.org](https://pnpm.js.org/). You can follow [pnpm on Twitter](https://twitter.com/pnpmjs) or ask for help at the [pnpm Gitter Chat Room](https://gitter.im/pnpm/pnpm).
