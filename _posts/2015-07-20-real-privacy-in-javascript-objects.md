---
layout: post
title: Real privacy in JavaScript objects
date: 2015-07-20 02:19:00
categories: javascript
comments: true
published: true
---

JavaScript objects don't have real private properties or functions. There is a
naming convention for members intended to be private with an underscore prefix but
that doesn't make them really private.

However, when reading the [Flux TodoMVC tutorial][flux-todomvc] I've noticed an
interesting hack for simulating privacy, real privacy.


## Private properties

When the scripts are bundled with [browserify][] or [webpack][], the source code of each file is wrapped with a function.
As a consequence, all variables declared in the top scope are local. Technically, if a file exports just one class
declaration, all the other things in the file can be considered the private
properties/functions of that class.

Therefore, instead of using properties of the object, like this:

{% highlight JavaScript %}
function Foo(opts) {
  opts = opts || {};

  this._qar = opts.qar;
  this._qaz = opts.qaz;
}

module.exports = Foo;
{% endhighlight %}

We can use variables declared in a higher scope:

{% highlight JavaScript %}
var _qar;
var _qar;

function Foo(opts) {
  opts = opts || {};

  _qar = opts.qar;
  _qaz = opts.qaz;
}

module.exports = Foo;
{% endhighlight %}

Maybe the later code doesn't look beautiful or even logical but it does make `_qar` and `_qaz`
private. They are not accessible through `foo._qar`, `foo._qaz`.


## Private functions

The principle of private functions is almost the same with one change, private
functions should be executed with the `this` of the object to which they belong.

If normally we would declare private functions like this:

{% highlight JavaScript %}
function Foo() {
  this.version = '1.0.0';
}

/* private */
Foo.prototype._log = function(msg) {
  console.log(this.version, msg);
}

/* public */
Foo.prototype.helloWorld = function() {
  this._log('Hello world!');
}

module.exports = Foo;
{% endhighlight %}

In order to achieve real privacy, we would have to rewrite the code like this:

{% highlight JavaScript %}
function Foo() {
  this.version = '1.0.0';
}

/* private */
function _log(msg) {
  console.log(this.version, msg);
}

/* public */
Foo.prototype.helloWorld = function() {
  _log.call(this, 'Hello world!');
}

module.exports = Foo;
{% endhighlight %}


## Summary

It is possible to have real! privacy in JavaScript objects and it has one great benefit.
Using the methods described in this article makes the private members highly minifiable
because the private methods are not assigned to `this`. And everything that is stored in
`this` cannot be obfuscated as it can be potentially accessed anywhere.


[flux-todomvc]: http://facebook.github.io/flux/docs/todo-list.html
[browserify]: http://browserify.org/
[webpack]: http://webpack.github.io/
