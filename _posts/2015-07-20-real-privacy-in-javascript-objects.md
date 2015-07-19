---
layout: post
title: Real privacy in JavaScript objects
date: 2015-07-20 02:19:00
categories: javascript
comments: true
published: true
---

JavaScript objects doesn't have real private properties or functions. There is
a convention to name members intended to be private with an underscore prefix but
that doesn't make them really private. And also, minifiers can't effectively
obfuscate them.

However, when reading the [Flux TodoMVC tutorial][flux-todomvc] I've noticed an
interesting hack, how to simulate privacy, when the scripts are bundled with
browserify or webpack.


## Private properties

When the scripts are bundled with browserify, each file is wrapped with a function.
It makes each variable local. Technically, if a file exports just one class
declaration, all the other things in the file cam be considered the private
properties/functions of that class.

So instead of using properties of the object. Like this:

{% highlight JavaScript %}
function Foo(opts) {
  opts = opts || {};

  this._qar = opts.qar;
  this._qaz = opts.qaz;
}
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
{% endhighlight %}

Maybe the code doesn't look beautiful or even logical but now `_qar` and `_qaz` are
really private and they are not accessible through `foo._qar`, `foo._qaz`.


## Private functions

The principle of private functions is almost the same with one change, private
functions should be executed with the this of the object to which they belong.

If normally, we would declare private functions like this:

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
{% endhighlight %}


[flux-todomvc]: http://facebook.github.io/flux/docs/todo-list.html
