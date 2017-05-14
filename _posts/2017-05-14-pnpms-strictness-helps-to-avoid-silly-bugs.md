---
layout: post
title:  "pnpm's strictness helps to avoid silly bugs"
date: "2017-05-14 18:30:00 +0200"
categories: nodejs
comments: true
---

[pnpm](https://github.com/pnpm/pnpm) is a package manager for Node.js.
I have written an article earlier about [why should we use pnpm](/nodejs/why-should-we-use-pnpm.html).
In this article I want to demonstrate how using pnpm helps in preventing some silly bugs.

When using npm, you have access to packages that you don't reference in your project's `package.json`.
This is possible because npm creates a flat `node_modules` folder.

Let me explain this by an example.

* create an empty project: `mkdir project && npm init -y`
* run `npm install express --save`
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
using all those packages without even installing them explicitly.

Let's say you need `debug` in your project. You can start using it and forget to add it to `package.json`.
Your project will work fine. You will commit your changes and publish it to production. It will work well
even in production. However, after a few weeks or months, one of two things can very likely happen:

1. a new major version of `debug` with a new API can get published. Your code was written
for `debug@1` and it needs some updates to work with `debug@2`. You are safe till `express` uses `debug@1`
because `debug@1` is installed to the root of `node_modules`. However, `express` can update its
dependency in any moment, fix all usages of `debug` and publish a new patch (a patch, because `express` didn't
have any breaking changes). Next time you do `npm install`, `express` will be updated and `debug@2` installed
into the root of your `node_modules`. The project will break, even though you did not make any changes!
1. another possibility is that `express` stops using `debug`. It can just remove it from dependencies
and publish a new version. When you'll update `express`, your code will break because the `debug` package
won't be in `node_modules` anymore.

Now imagine that your project is not a web app but a package used by many other people. If you don't
include a package used in code into the `package.json`, your package is a **timed bomb**. Do you remember [left-pad](https://www.theregister.co.uk/2016/03/23/npm_left_pad_chaos/)? I can imagine a similar catastrophe
happening in the future because of a forgotten dependency.

## How does pnpm help with avoiding these type of bugs?

Unlike npm, pnpm does not try to move everything to the root of `node_modules`. If you remove the `node_modules`
folder created by npm in the previous example and run `pnpm install express`, you'll see that `ls -1` will print
only one symlink in the `node_modules` folder: `express`. No `debug`!

On next run, your app will immediately fail, because it won't be able to find `debug`. Which is the way it should be!
To fix the project, you'll just run `pnpm install debug` and `debug` will be added to your `package.json` (pnpm saves packages
to `package.json` by default, even when the `--save` parameter is not passed). With `debug` in your `package.json`, you
can be sure that it will always be installed into `node_modules` and it will work with your code as expected.

pnpm gets a lot of issues opened because some packages/toolings don't work.
These issues are mostly happening because the packages/toolings have `package.json`s that miss dependencies.
Some developers even think that it is fine to not include dependencies in `package.json`
because "it works with npm/yarn". It is not OK! It might work today but it will break tomorrow.

You might not use pnpm. But please, publish valid packages. If you don't use pnpm, use some tooling
like [dependency-check](https://www.npmjs.com/package/dependency-check) to validate your package
before publishing it to the registry.

## Do you want to give pnpm a try?

Just install pnpm via npm: `npm install -g pnpm`. And use it instead of npm whenever you want to install something: `pnpm i foo`.

Also you can read more info at the [pnpm GitHub repo](https://github.com/pnpm/pnpm) or [pnpm.js.org](https://pnpm.js.org/).
You can follow [pnpm on Twitter](https://twitter.com/pnpmjs) or ask for help at the [pnpm Gitter Chat Room](https://gitter.im/pnpm/pnpm).
