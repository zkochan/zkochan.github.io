---
layout: post
title:  "How to write a good npm module"
date: "2016-03-02 01:00:00 +0200"
categories: javascript
comments: true
---

Creating a new npm module is as easy as executing the [npm init](https://docs.npmjs.com/cli/init) command.
However, writing a good npm module is not that easy. Here you'll find some suggestions about how to make a great npm module.


## Write tests

A good npm module will have tests. It doesn't matter what test framework will you use but you'll have to add the test running command to the scripts section of `package.json`. E.g., if you use [mocha](https://mochajs.org/), you'll have something like this:

```json
"scripts": {
  "test": "mocha test/{**/,/}*.js"
}
```


## Configure continuous integration

If your module is open source, your best CI choice will probably be [Travis](https://travis-ci.org/). Travis is completely free for open source projects. In order to configure your project for running on travis, just add a minimal `.travis.yml` file to the root directory of your module:

```yml
language: node_js
sudo: false
node_js:
  - v5
```

Once you have it, travis will automatically run **npm test** on your module, every time you push. If it fails, you'll recive an email.


## Coverage reporting

Once you configured **npm test** and CI, you can configure coverage reporting as well.

If your project is open source, you can use [coveralls](https://coveralls.io/), which is free for open source and has travis integration.

For generating the coverage reports, you can use [istanbul](https://github.com/gotwarlost/istanbul): `npm install istanbul --save`. Once you have it
in your dev dependencies, you can add a few tasks to the scripts section that will generate the coverage reports and send them to coveralls:

```json
"coverage": "istanbul cover _mocha test/{**/,/}*.js -- -R spec",
"precoveralls": "istanbul cover _mocha test/{**/,/}*.js --report lcovonly -- -R spec && npm i coveralls@2",
"coveralls": "cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js",
```

And all you have to do to make travis send the coverage reports to coveralls, is to add and **after_script** section to **travis.yml**:

```yml
after_script:
  - npm run coveralls
```


## Code style

Choose a code style and force it in your module. A good choice might be a preconfigured codestyle like [standardjs](http://standardjs.com/) or [xo](https://github.com/sindresorhus/xo).

However, if you have your own taste, you can write your own `.jshintrc`, `.jscsrc` files. To force your own code style, install the style checkers as dev dependencies:

```
npm install jscs jshint --save-dev
```

And update the scripts in `packages.json`:

```json
"scripts": {
  "test-jscs": "node_modules/jscs/bin/jscs index.js test/index.js",
  "test-jshint": "jshint index.js test/index.js",
  "test-style": "npm run test-jshint && npm run test-jscs",
  "test": "npm run test-style && mocha test/{**/,/}*.js"
}
```

With the update **npm test** task, the module will fail not only if the tests will not pass but if the module's code style will be broken.


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
{ "url" : "https://github.com/owner/project/issues"
, "email" : "project@hostname.com"
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

``` json
"repository" :
  { "type" : "git"
  , "url" : "https://github.com/npm/npm.git"
  }

"repository" :
  { "type" : "svn"
  , "url" : "https://v8.googlecode.com/svn/trunk/"
  }
```

The URL should be a publicly available (perhaps read-only) url that can be handed directly to a VCS program without any modification. It should not be a url to an html project page that you put in your browser. It's for computers.

For GitHub, GitHub gist, Bitbucket, or GitLab repositories you can use the same shortcut syntax you use for **npm install**:

```json
"repository": "npm/npm"

"repository": "gist:11081aaa281"

"repository": "bitbucket:example/repo"

"repository": "gitlab:another/repo"
```
