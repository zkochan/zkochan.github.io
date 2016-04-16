---
layout: post
title:  "How to write a good npm module"
date: "2016-03-02 01:00:00 +0200"
categories: javascript
comments: true
---

Creating a new _npm module_ is as easy as executing the [npm init](https://docs.npmjs.com/cli/init) command.
However, writing an **awesome! npm module** involves more than just creating a minimal `package.json` file.


## Tests are important!

An awesome npm module should have tests. It doesn't matter what test framework is used but always add the test running command to the scripts section of `package.json`. E.g., if you use [mocha](https://mochajs.org/), you'll have something like this:

<script src="https://gist.github.com/zkochan/dbd6c8542818000cb9cc2a1a70aaee97.js?file=test-script.json"></script>

A list of the most popular [NodeJS testing frameworks](https://github.com/vndmtrx/awesome-nodejs#testing).


## Configure continuous integration

If your module is open source, your best CI choice will probably be [Travis](https://travis-ci.org/). Travis is completely free for open source projects. In order to configure your project for running on travis, just add a minimal `.travis.yml` file to the root directory of your module:

<script src="https://gist.github.com/zkochan/dbd6c8542818000cb9cc2a1a70aaee97.js?file=.travis.yml"></script>

Once you have it, travis will automatically run **npm test** on your module, every time you push. If it fails, you'll recieve an email.


## Coverage reporting

Once you configured **npm test** and CI, you can configure coverage reporting as well.

If your project is open source, you can use [coveralls](https://coveralls.io/), which is free for open source and has travis integration.

For generating the coverage reports, you can use [istanbul](https://github.com/gotwarlost/istanbul): `npm install istanbul --save`. Once you have it
in your dev dependencies, you can add a few tasks to the scripts section that will generate the coverage reports and send them to coveralls:

<script src="https://gist.github.com/zkochan/dbd6c8542818000cb9cc2a1a70aaee97.js?file=coverage-scripts.json"></script>

And all you have to do in order to make travis send the coverage reports to coveralls, is to add an **after_success** section to **.travis.yml**:

<script src="https://gist.github.com/zkochan/dbd6c8542818000cb9cc2a1a70aaee97.js?file=travis-after-script.yml"></script>


## Coding style

Choose a coding style and enforce it in your module. A good choice might be a preconfigured codestyle like [standardjs](http://standardjs.com/) or [xo](https://github.com/sindresorhus/xo).


### Custom coding style using JSHint + JSCS

If you have your own style, write custom `.jshintrc` and `.jscsrc` files in the root directory of your module. In order to enforce your own coding style you'll have to install the style checkers as dev dependencies:

```
npm install jscs jshint --save-dev
```

And update the scripts in `packages.json`:

<script src="https://gist.github.com/zkochan/dbd6c8542818000cb9cc2a1a70aaee97.js?file=lint-scripts.json"></script>

With the updated **npm test** task, the module will fail if the coding style will be broken somewhere in the project.


### Custom coding style using ESLint

[ESLint](http://eslint.org/) can be used as an alternative to to the combination of JSHint and JSCS. To enforce coding styles using ESLint, you'll have to create an `.eslintrc` configuration file in the root directory of the module and install ESLint as dev dependency:

```
npm install eslint --save-dev
```

The scripts property will look like this:

<script src="https://gist.github.com/zkochan/dbd6c8542818000cb9cc2a1a70aaee97.js?file=eslint-scripts.json"></script>


## Flesh out the package.json

There are only two required fields in `package.json`: name and version. The complete list of the available fields can be found [here](https://docs.npmjs.com/files/package.json). From the list of available fields I would strongly recommend to specify the following ones in every module:


### description

Put a description in it. It's a string. This helps people discover your package, as it's listed in **npm search**.


### keywords

Put keywords in it. It's an array of strings. This helps people discover your package as it's listed in **npm search**.


### homepage

The url to the project homepage.

**NOTE:** This is not the same as "url". If you put a "url" field, then the registry will think it's a redirection to your package that has been published somewhere else, and spit at you.

Literally. Spit. I'm so not kidding.


### bugs

The url to your project's issue tracker and / or the email address to which issues should be reported. These are helpful for people who encounter issues with your package.

It should look like this:

```json
{
  "url" : "https://github.com/owner/project/issues",
  "email" : "project@hostname.com"
}
```

You can specify either one or both values. If you want to provide only a url, you can specify the value for "bugs" as a simple string instead of an object.

If a url is provided, it will be used by the **npm bugs** command.


### license

You should specify a license for your package so that people know how they are permitted to use it, and any restrictions you're placing on it.

If you're using a common license such as BSD-2-Clause or MIT, add a current SPDX license identifier for the license you're using, like this:

```json
{ "license" : "BSD-3-Clause" }
```


### files

The "files" field is an array of files to include in your project. If you name a folder in the array, then it will also include the files inside that folder. (Unless they would be ignored by another rule.)

You can also provide a ".npmignore" file in the root of your package or in subdirectories, which will keep files from being included, even if they would be picked up by the files array. The **.npmignore** file works just like a **.gitignore**.

Certain files are always included, regardless of settings:

* package.json
* README (and its variants)
* CHANGELOG (and its variants)
* LICENSE / LICENCE

Conversely, some files are always ignored:

* .git
* CVS
* .svn
* .hg
* .lock-wscript
* .wafpickle-N
* \*.swp
* .DS_Store
* .\_\*
* npm-debug.log


### repository

Specify the place where your code lives. This is helpful for people who want to contribute. If the git repo is on GitHub, then the **npm docs** command will be able to find you.

Do it like this:

```
"repository": {
  "type" : "git",
  "url" : "https://github.com/npm/npm.git"
}
```

or like this:

```
"repository": {
  "type" : "svn",
  "url" : "https://v8.googlecode.com/svn/trunk/"
}
```

The URL should be a publicly available (perhaps read-only) url that can be handed directly to a VCS program without any modification. It should not be a url to an html project page that you put in your browser. It's for computers.

For GitHub, GitHub gist, Bitbucket, or GitLab repositories you can use the same shortcut syntax you use for **npm install**:

```
"repository": "npm/npm"

"repository": "gist:11081aaa281"

"repository": "bitbucket:example/repo"

"repository": "gitlab:another/repo"
```
