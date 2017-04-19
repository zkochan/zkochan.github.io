---
layout: post
title:  "Why should we use pnpm?"
date: "2017-03-19 18:39:00 +0200"
categories: nodejs
comments: true
---

[pnpm](https://github.com/pnpm/pnpm) is an alternative package manager for Node.js.
It is a drop-in replacement for npm, but faster and more efficient.

How fast? _3 times faster!_ See benchmarks [here](https://github.com/pnpm/node-package-manager-benchmark).

Why more efficient? When you install a package, we keep it in a global store on your machine,
and hard-link to it. For each version of a module, there is only ever one copy kept on disk.
When using npm or yarn for example, if you have 100 packages using lodash, you will have
100 copies of lodash on disk. _Pnpm allows you to save gigabytes of disk space!_

## Why not Yarn?

TBH, I was really pissed when Facebook has made Yarn public. I was heavily contributing
to pnpm for several months and there were nowhere any news about Yarn. The info about its
development was not public.

After a few days of depression, I realized that Yarn is just a small improvement
over npm. Although it makes installations faster and it has some nice new features,
it uses the same flat _node_modules_ structure that npm does (since version 3).

And flattened dependency trees come with a bunch of issues:

1. modules can access packages they don't depend on
2. the algorithm of flattenning a dependency tree is pretty complex
3. some of the packages have to be copied inside one project's _node_modules_ folder

Furthermore, there are issues that Yarn doesn't plan to solve, like the disk space usage issue.
So I decided to continue investing my time to pnpm, and with great success. As of now (March 2017),
pnpm has all the additional features that Yarn has over npm:

1. **security.** Like Yarn, pnpm has a special file with all the installed packages' checksums
to verify the integrity of every installed package before its code is executed.
2. **offline mode.** pnpm saves all the downloaded package tarballs in a local registry mirror.
It never makes requests when a package is available locally. With the `--offline` parameter,
HTTP requests can be prohibited at all.
3. **speed.** pnpm is not only faster than npm, it is faster than Yarn. It is faster than Yarn both with cold and hot cache. Yarn copies files from cache whereas pnpm just links them from the global store.

## How is it possible?

As I mentioned earlier, pnpm does not flatten the dependency tree. As a result, the algorithms
used by pnpm can be a lot easier! That's why it is possible that only 1 developer could
keep pace with the dozens of contributors of Yarn.

So how does pnpm structure the _node_modules_ directory, if not by flattening? To understand it,
we should recall how did the _node_modules_ folder look like before npm version 3. Prior to _npm@3_,
the _node_modules_ structure was predictable and clean, as every dependency in _node_modules_ had
its own _node_modules_ folder with all of its dependencies specified in _package.json_.

```
node_modules
└─ foo
   ├─ index.js
   ├─ package.json
   └─ node_modules
      └─ bar
         ├─ index.js
         └─ package.json
```

This approach had two serious issues:

* frequently packages were creating too deep dependency trees, which caused long directory paths issue on Windows
* packages were copy pasted several times, when they were required in different dependencies

To solve these issues, npm rethinked the _node_modules_ structure and came up with flattening.
With _npm@3_ the _node_modules_ structure now looks like this:

```
node_modules
├─ foo
|  ├─ index.js
|  └─ package.json
└─ bar
   ├─ index.js
   └─ package.json
```

For more info about the npm v3 dependency resolution, see [npm v3 Dependency Resolution](https://docs.npmjs.com/how-npm-works/npm3).

Unlike npm@3, pnpm tries to solve the issues that npm@2 had, without flattening the dependency tree.
In a _node_modules_ folder created by pnpm, all packages have their own dependencies grouped together,
but the directory tree is never as deep as with npm@2. pnpm keeps all deps flat, but uses symlinks
to group them together.

```
-> - a symlink (or junction on Windows)

node_modules
├─ foo -> .registry.npmjs.org/foo/1.0.0/node_modules/foo
└─ .registry.npmjs.org
   ├─ foo/1.0.0/node_modules
   |  ├─ bar -> ../../bar/2.0.0/node_modules/bar
   |  └─ foo
   |     ├─ index.js
   |     └─ package.json
   └─ bar/2.0.0/node_modules
      └─ bar
         ├─ index.js
         └─ package.json
```

To see a live example, visit the [sample pnpm project](https://github.com/pnpm/sample-project) repo.

Although the example seems too complex for a small project, for bigger projects the
structure looks better structured than what is created by npm/yarn. Lets see why it works.

First of all, you might have noticed, that the package in the root of _node_modules_ is
just a symlink. This is fine as Node.js ignores symlinks and executes the realpath.
So `require('foo')` will execute the file in `node_modules/.registry.npmjs.org/foo/1.0.0/node_modules/foo/index.js`
not in `node_modules/foo/index.js`.

Secondly, non of the installed packages have their own _node_modues_ folder inside their directories.
So how can _foo_ require _bar_? Lets have a look on the folder that contains the _foo_ package:

```
node_modules/.registry.npmjs.org/foo/1.0.0/node_modules
├─ bar -> ../../bar/2.0.0/node_modules/bar
└─ foo
   ├─ index.js
   └─ package.json
```

As you can see

1. the dependencies of _foo_ (which is just _bar_) are installed, but one level up in the directory structure.
2. both packages are inside a folder called _node_modules_

_foo_ can require _bar_, because Node.js looks modules up in the directory structure till the root
of the disk. And _foo_ can also require _foo_, because it is in a folder called _node_modues_
(yep, this is what some packages do).

## Are you convinced?

Just install pnpm via npm: `npm install -g pnpm`. And use it instead of npm whenever you want to install something: `pnpm i foo`.

Also you can read more info at the [pnpm GitHub repo](https://github.com/pnpm/pnpm) or [pnpm.js.org](https://pnpm.js.org/).
You can follow [pnpm on Twitter](https://twitter.com/pnpmjs) or ask for help at the [pnpm Gitter Chat Room](https://gitter.im/pnpm/pnpm).
