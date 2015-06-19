---
layout: post
title: The art of writing minifiable JavaScript
date: 2015-06-05 21:49:00
categories: javascript
comments: true
published: true
permalink: /javascript/2015/06/05/writing-minifiable-javascript.html
---

There are situations when we want to have as small JavaScript files as possible. JavaScript compressors like [UglifyJS][UglifyJS] can reduce the size of JavaScript source code multiple times. However, they can compress it a lot more effectively with some help!

## Why should you care

Sometimes code has to be small even if it means that it'll be less beautifull. Lets suppose you're working on a library that'll be loaded on each page of your website. You'll want it to be super small. Or what if you're working on a cool open source project? You'll want it to be smaller than any alternatives.

So lets see some best practices and technics of writing **minifiable** JavaScript.

## No CoffeeScript and friends

Languages that are compiling to JavaScript are cool. However, they give less control over the actual source code that will be generated from them.

Lets see one example from the [CoffeScript][CoffeScript] homepage. 

{% highlight coffeescript %}
foods = ['broccoli', 'spinach', 'chocolate']
eat food for food in foods when food isnt 'chocolate'
{% endhighlight %}

The code above will be compiled to this JavaScript:

{% highlight JavaScript %}
foods = ['broccoli', 'spinach', 'chocolate'];

for (l = 0, len2 = foods.length; l < len2; l++) {
  food = foods[l];
  if (food !== 'chocolate') {
    eat(food);
  }
}
{% endhighlight %}

The code in CoffeScript is small and beautifull, but the resulting JavaScript is not as optimized as it could be. It can be at least optimized like this:

{% highlight JavaScript %}
var foods = ['broccoli', 'spinach', 'chocolate'];

for (i = foods.length; i--;) {
  if (foods[i] !== 'chocolate') {
    eat(foods[i]);
  }
}
{% endhighlight %}

## No Browserify (maybe)

[Browserifying][browserify] adds some additional code to the resulting JavaScript file: 415b + 25b per module + (6b + 2X) per dependency ([source][browserify-size]).

However, whether to use Browserify or not is really depends from the project. Browserify gives structure and readability to JavaScript projects. It also makes it easier to cover them with unit tests. If a library is small enough, it can be placed into a single file. In that case Browserify is not needed. However, for larger libs maybe its better to use Browserify and make the output somewhat smaller with [bundle-collapser][bundle-collapser].

## Closures instead of prototypes

When using prototypes, everything is actually public. Minifiers cannot obfuscate public stuff. Furthermore, the ``prototype`` keyword is used all the time, which makes the script bigger as well.

Lets write a Cat object that can sing and try to minify it with UglifyJS. I used [this][online-uglify] online minificator.

{% highlight javascript %}
function Cat() {
  this._sound = 'meow';
}

Cat.prototype._secret = function() {
};

Cat.prototype.sing = function() {
  console.log(this._sound);
}
{% endhighlight %}

And here is the minified version of it:

{% highlight javascript %}
function Cat(){this._sound="meow"}Cat.prototype._secret=function(){},Cat.prototype.sing=function(){console.log(this._sound)};
{% endhighlight %}

Old version: 157 characters  
New version: 125 characters  
Saved: 32 (result is 79.6% of original)

Not much of a minification. Only whitespaces and newlines were removed.

With closures, all of your object's private fields and methods will be just local variables. Local variables are easily obfuscated by any minifier. Lets see the closure version of the Cat object:

{% highlight javascript %}
function cat() {
  var sound = 'meow';

  function secret() {
  }
  
  return {
    sing: function() {
      console.log(sound);
    }
  };
}
{% endhighlight %}

And voilà, this version is a lot more minifiable:

{% highlight javascript %}
function cat(){var a="meow";return{sing:function(){console.log(a)}}}
{% endhighlight %}

Old version: 152 characters  
New version: 68 characters  
Saved: 84 (result is 44.7% of original)

The Cat object is 46% smaller, when minified, if written with closures.

## Forget clean coding, pass lots of arguments

It is considered a better practice to path an object instead of multiple arguments to a function. However, compressors can't obfuscate the properties of the passed object. Lets see it on an example:

{% highlight javascript %}
function createHTMLElement(opts) {
  opts = opts || {};
  return '<' + opts.element + ' id="' + opts.id +
    '" class="' + opts.classAttr + '" title="' + opts.title +
    '">' + opts.innerHTML + '</' + opts.element + '>';
}
{% endhighlight %}

After minification, only `opts` will be renamed to `a`.

{% highlight javascript %}
function createHTMLElement(a){return a=a||{},"<"+a.element+' id="'+a.id+'" class="'+a.classAttr+'" title="'+a.title+'">'+a.innerHTML+"</"+a.element+">"}
{% endhighlight %}

Old version: 225 characters  
New version: 148 characters  
Saved: 77 (result is 65.7% of original)

Now lets rewrite the code so that it uses multiple arguments:

{% highlight javascript %}
function createHTMLElement(element, id, classAttr, title, innerHTML) {
  return '<' + element + ' id="' + id + '" class="' + classAttr +
    '" title="' + title + '">' + innerHTML + '</' + element + '>';
}
{% endhighlight %}

In this version a lot more obfuscation is done.

{% highlight javascript %}
function createHTMLElement(a,b,c,d,e){return"<"+a+' id="'+b+'" class="'+c+'" title="'+d+'">'+e+"</"+a+">"}
{% endhighlight %}

Old version: 195 characters  
New version: 106 characters  
Saved: 89 (result is 54.3% of original)

The version with multiple arguments is 28% smaller, when minified.

## Don't use too much strings

Strings (like keywords) are not minified at all. Try to no log too much in your code or try to log only numbers and save the description somewhere else.

## Avoid global variables

Anything that is global is not minifiable. This has several consiquences for writing minifiable JavaScript:

* all the code has to be wrapped with a [self-executing function][self-executing]
* new global variables should be introduced as rarely as possible
* anything that is global has to have a small name
* don't use a global reference directly because it can't be obfuscated. Assign it to a scoped variable.

## Summary

With a few tricks it is possible to write extremely minifiable JavaScript. **In most cases though, size is not so important and it is better to write readable and more maintainable code.**

It is also worth noting that it doesn't matter how hard you are trying to reduce the size of your code, if it depends on too many dependencies.

[UglifyJS]: https://github.com/mishoo/UglifyJS
[CoffeScript]: http://coffeescript.org/
[browserify]: http://browserify.org/
[browserify-size]: http://webpack.github.io/docs/comparison.html
[bundle-collapser]: https://github.com/substack/bundle-collapser
[online-uglify]: https://marijnhaverbeke.nl/uglifyjs
[self-executing]: http://esbueno.noahstokes.com/post/77292606977/self-executing-anonymous-functions-or-how-to-write