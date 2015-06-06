---
layout: post
title: Coding A/B tests effectively
date: 2015-05-22 22:35:00
categories: ab
comments: true
published: true
---


Writing A/B tests is very popular nowadays. It is an effective and fast way of finding out whether users will like some changes on the site or not, will the change increase conversion, revenue engagement or other key metrics on the site or not?

From the tech side, there are two types of A/B testing:

* Server side
* Front-end side

In most cases it is enough to use front-end side testing, and there are many services that are helping with it. Here are just some of them:

* [Optimizely][optimizely]
* [Visual Website Optimizer][vwo]
* [Maxymiser][maxymiser]

##How does front-end A/B testing work?

Front-end A/B testing is great, because it doesn't require changes in the app's codebase. In a nutshell, front-end A/B tests are just javascripts injected into the page.

FE A/B testing is really the best choice when the changes are not too big. Like adding a new component to the page or changing the color of a button. However, sometimes even small changes require many lines of code. Furthermore, some tests can contain more than one variation. Imagine a situation when one experiment would contain 3 variations:

1. Changing the color of the Sign in button to red
2. Changing the logo in the header
3. All the changes from variatoin 1 and 2 + changing the copies in the footer

A good programmer would say that the 3rd variation has to reuse the code from variation #1 and #2.

However, Optimizely's variation code editor is not readlly designed for that:

![Optimizely code editor](http://i.imgur.com/2tJNUf1.png?1)

If a dev is lazy, he will just copy/paste the code into the different variations.

But there's a better solution that I'll explain later.

##Browserify + Livereload

Developing experiments using Optimizely's built-in editor has many negative sides:

* Optimizely's previewing is slow. [Livereload][livereload] works much better.
* Optimizely's in-browser editor is not as good as [Sublime][sublime], [Brackets][brackets], [Atom][atom] or any other real editors that are running directly on the machine. Maybe there are better online editors. I think [Ace][ace] is currently the best. However, no online editor can compete with the usability and speed of a native OS application.
* The fact that the code is not stored in a Git repository has its own set of drawbacks:
  * the experiment's code has no history of changes
  * other devs can excidentally remove something and it is gone forever
  * multiple devs can't work on the same experiment at the same time because they would rewrite the changes of each other
  * the code can't be code reviewed
* All the code has to be written in one JavaScript file. Even all the CSS and HTML needed for the experiment.

These are not issues that Optimizely has to solve. In fact, these problems are already solved by dozens of libraries.

[Browserify][browserify] can nicely unite JavaScript modules into one file. With some plugins it can even add [Less][less], HTML of [Jade][jade] to the resulting bundle. And it can do [a lot more][browserify-transform] than that!

[Livereload][livereload] can reload the page in the browser when the experiment is updated.

##Foso means cool

It is very easy to create a simple NodeJS app that will do all the hard work and bundle the experiment code. When that's ready, all that remains to be done is adding two links to the page on which the experiment has to be applied:

* a link to the JavaScript that has to modify the page
* a link to LiveReload, which will reload the page each time the script is updated

And the good news is: I've already created that simple NodeJS app! It is called [Foso][foso] and uses some simple conventions to bundle scripts for multipage experiments.

##How to use Foso with Optimizely?

Lets return to our example, where we wanted to do 3 variations in one experiment, and reuse some of the code. In order to implement it with Foso, we can use this folder structure:

<pre>
my-experiment
 ├── shared
 |   ├── red-sign-in.less
 |   ├── new-logo.less
 |   └── add-class.js
 ├── variation-1
 |   └── homepage
 |       └── bundle.js
 ├── variation-2
 |   └── homepage
 |       └── bundle.js
 └── variation-3
     └── homepage
         ├── changing-footer.js
         └── bundle.js
</pre>

**red-sign-in.less** has to contain the styles that are overriding the styles of the Sign in button, making it red. It can look like this:

{% highlight css %}
.my-experiment .sign-in {
  background-color: red;
}
{% endhighlight %}

**new-logo.less** has to change the logo. Something like this will do:

{% highlight css %}
.my-experiment .logo {
  background-image: url(//example.com/some.png);
}
{% endhighlight %}

**add-class.js** can add a new class to the body in order to make the new selectors override the original styles of the elements.

{% highlight javascript %}
$('body').addClass('my-experiment');
{% endhighlight %}

Now the interesting part. The 1st variation has to require the red button. **variation-1/homepage/index.js** will look like this:

{% highlight javascript %}
require('../../shared/red-sign-in.less');
require('../../shared/add-class.js');
{% endhighlight %}

The 2nd variation has to require the logo change. **variation-2/homepage/index.js**:

{% highlight javascript %}
require('../../shared/new-logo.less');
require('../../shared/add-class.js');
{% endhighlight %}

The third variation can reuse the code from the 1st and 2nd variations and add its own changes upon them.
**variation-3/homepage/index.js**:

{% highlight javascript %}
require('../../variation-1/homepage');
require('../../variation-2/homepage');

require('./changing-footer.js');
{% endhighlight %}

Each variation can be tested locally by running ``foso serve`` from the variation's root directory (e.g, my-experiment/variation-1/). The files will be bundled and saved into the ``_build/`` folders of each variation.

When the code is ready it can be bundled and minified by running ``foso build -m``.
The bundled code can be easily copy/pasted to Optimizely.

No more code duplication!

[optimizely]: https://www.optimizely.com/
[vwo]: https://vwo.com/
[maxymiser]: https://www.maxymiser.com/
[livereload]: http://livereload.com/
[sublime]: http://www.sublimetext.com/
[atom]: https://atom.io/
[brackets]: http://brackets.io/
[ace]: http://ace.c9.io/
[browserify]: http://browserify.org/
[browserify-transform]: https://github.com/substack/node-browserify/wiki/list-of-transforms
[less]: http://lesscss.org/
[jade]: http://jade-lang.com/
[foso]: https://github.com/zkochan/foso
