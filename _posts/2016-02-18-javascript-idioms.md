---
layout: post
title:  "JavaScript idioms"
date: "2016-02-18 01:00:00 +0200"
categories: javascript
comments: true
---

JavaScript is a powerful and sometimes weird language and it has a lot of interesting idioms.
My intention in this article is just to show some of the most popular and widely used javascript idioms.
I won't focus on whether it is good or bad to use some or any of them.


## Double exclamation

Prefixing anything with `!!` converts it to a boolean.

```js
var foo = 0
console.log(!!foo)
//> false
```

Essentially it is a shorter way to write `Boolean(foo)`.


## Converting arguments to array

The [arguments object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments)
can be used to access the arguments passed to the function. However, it is not an Array so it doesn't have
Array properties except `length`. The `Array.prototype.slice.call(arguments)` idiom is used very frequently
to convert the arguments object to an actual array.

```js
(function() {
  console.log(arguments instanceof Array)
  //> false

  var args = Array.prototype.slice.call(arguments)
  console.log(args instanceof Array)
  //> true
})()
```


## Assigning default values

```js
function foo(opts) {
  var msg = opts.message || 'Hello world!'
  console.log(msg)
}

// instead of
function foo(opts) {
  var msg = opts.message ? opts.message : 'Hello world!'
  console.log(msg)
}
```

More examples of interesting `||` and `&&` usages can be found in the
[12 Simple (Yet Powerful) JavaScript Tips](http://javascriptissexy.com/12-simple-yet-powerful-javascript-tips/) article.


## Converting to array if not already

```js
var totallyArray = [].concat(value)

//instead of
var totallyArray = value instanceof Array ? value : [value]
```


## Converting strings to number

```js
var foo = +'12.2'
var bar = +'12'

// instead of
var foo = parseFloat('12.2')
var bar = parseInt('12')
```


## Checking if an array includes an element

```js
if (~[1, 2, 3].indexOf(2)) { console.log('includes') }

// instead of
if ([1, 2, 3].indexOf(2) > -1) { console.log('includes') }
```

There are some other usage examples for the **tilde** operator as well in [The Great Mystery of the Tilde(~)](http://www.joezimjs.com/javascript/great-mystery-of-the-tilde/).


## Writing multi-line strings

```js
var multiStr = [
  "This is the first line",
  "This is the second line",
  "This is more..."
].join("\n");

// instead of
var multiStr = "This is the first line\n" +
  "This is the second line\n" +
  "This is more...";
```


## Looping through an array

It can be used if order is not important

```js
for (var i = arr.length; i--;) {
  // ...
}

// instead of
for (var i = 0; i < arr.length; i++) {
  // ...
}
```


## `setTimeout(func, 0)`

JavaScript code runs on one thread. Calling `setTimeout` with `0` allows to schedule a function to run
after the current event loop tick.

```js
setTimeout(function() {
  console.log('log message from next tick')
}, 0)

console.log('Hello world!')
//> Hello world!
//> log message from next tick
```
