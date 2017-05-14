---
layout: post
title:  "pnpm's strictness helps to avoid silly bugs"
date: "2017-05-14 18:30:00 +0200"
categories: nodejs
comments: true
---

[pnpm](https://github.com/pnpm/pnpm) is an alternative package manager for Node.js.
I have written an article earlier about [why should we use pnpm](/nodejs/why-should-we-use-pnpm.html).
In this article I want to demonstrate how using pnpm helps in preventing some silly bugs.

When using npm, you have access to packages that you don't reference in your project's `package.json`.
This is possible because npm tries to create as flat `node_modules` folder as possible.

Let me explain this by an example.

* create an empty project: `mkdir project && npm init -y`
* run `npm install express`
* go to the `node_modules` folder that was created
* run `ls -1`

You'll get an output similar to this one:

```
accepts
array-flatten
content-disposition
content-type
cookie
cookie-signature
debug
depd
destroy
ee-first
encodeurl
escape-html
etag
express
finalhandler
forwarded
fresh
http-errors
inherits
ipaddr.js
media-typer
merge-descriptors
methods
mime
mime-db
mime-types
ms
negotiator
on-finished
parseurl
path-to-regexp
proxy-addr
qs
range-parser
send
serve-static
setprototypeof
statuses
type-is
unpipe
utils-merge
vary
```

As you can see, even though you installed only `express`, a lot more packages are available in
the `node_modules` folder. Node.js doesn't care what is in your `package.json` file,
you will have access to all the packages that are in the root of `node_modules`. So you can start
using all those packages without separately installing them, or adding them to your project's `package.json`.

Let's say you need `debug` in your project. You can start using it immediately and forget to add it to `package.json`.
Your project will work fine. You will commit your changes and publish it to production. It will work well
even in production. However, after a few weeks or months, one of two things can very likely happen:

1. a new major version of `debug` with a new API can get published. Your code was written
for `debug@1` and it needs some updates to work with `debug@2`. You are safe till `express` uses `debug@1`
because `debug@1` will be installed to the root of `node_modules`. However, `express` can update its
dependency in any moment, fix all usages of `debug` and publish a new patch. A patch, because `express` didn't
have any breaking changes. Next time you do `npm install`, `express` will be updated and `debug@2` will be installed
into the root of your `node_modules`. Your project will break, even though you did not make any changes!
1. another possibility is that `express` stops using `debug`. It can just remove it from dependencies
and publish a new version. When you'll update `express`, your code will break because the `debug` package
won't be in `node_modules`.

Now imagine that your project is not a web app but a package used by many other people. If you won't
include a package used in code into the `package.json`, your package is a **timed bomb**. Remember [left-pad](https://www.theregister.co.uk/2016/03/23/npm_left_pad_chaos/)? I can imagine a similar catastrophe
happening in the future because of a forgotten dependency.

## How does pnpm help with avoiding these type of bugs?

Unlike npm, pnpm does not try to move everything to the root of `node_modules`. If you remove the `node_modules`
folder created by npm in the previous example and run `pnpm install express`, you'll see that `ls -1` will print
only one symlink in the `node_modules` folder: `express`. No `debug`!

On next run, your app will immediately fail, because it won't be able to find `debug`. Which is the way it should be!
Now you'll just run `pnpm install debug` and `debug` will be added to your `package.json` (pnpm saves packages
to `package.json` by default, even when the `--save` param is not passed). You can be sure that it will always be
there and it will work with your code.

There are frequently issues opened because some packages/toolings don't work with pnpm.
These issues are mostly happening because the packages/tools have some `package.json`s that miss dependencies
used in the code. Some developers even think that it is fine to not include dependencies in `package.json`. It is not!

You might not like pnpm. It is fine. But please, publish correct packages. If you don't like pnpm, use some tooling
like [dependency-check](https://www.npmjs.com/package/dependency-check) to be sure that you have a valid package.
