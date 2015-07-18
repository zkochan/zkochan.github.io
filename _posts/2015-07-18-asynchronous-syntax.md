---
layout: post
title: Asynchronous syntax
date: 2015-07-18 13:38:00
categories: javascript
comments: true
published: true
---

In a perfect world all the objects on a page would be always created by the time we need
them. However, frequently some scripts are loaded asynchronously or the javascript
code is not well organized on the page. In that case it is unknown when the object
that we need will be created.


## How we usually solve it?

The most common solution for this problem is checking if the object exists every
several milliseconds.

{% highlight JavaScript %}
var intervalId = setInterval(function() {
  if (typeof window.foo === 'object') {
    foo.bar();
    clearInterval(intervalId);
  }
}, 100);
{% endhighlight %}

It is a hack though.


## How others do it?

Google, Optimizely, Qualaroo and many others, I believe, are all using an interesting
technique of caching API calls. Lets see how to track an event in Optimizely:

{% highlight JavaScript %}
window.optimizely = window.optimizely || [];
window.optimizely.push(['trackEvent', 'registration']);
{% endhighlight %}

We don't need the Optimizely object at all! We pass instructions that will be executed
once the Optimizely script is loaded.

Qualaroo does the same. E.g., here's how to force Qualaroo to start the surveys in
minimized state:

{% highlight JavaScript %}
window._kiq = window._kiq || [];
_kiq.push(['minimizeNudge']);
{% endhighlight %}

Google Analytics also caches the calls inside the `ga` function until the main
script is loaded. You can see it from the implementation of `ga`:

{% highlight JavaScript %}
window.ga = window.ga || function() {
  (window.ga.q = window.ga.q || []).push(arguments)
};
{% endhighlight %}

Even though this hack is very popular, I could never find an article
about it. I didn't even know how this technique is called. Only a few days ago
I've accidentally came across this article: [Tracking Basics (Asynchronous Syntax)][google-async-syntax].
Asynchronous Syntax! So that's how it is called. The article is dedicated to
the usage of `ga` in an asynchronous way but contains many useful explanations
about the Asynchronous Syntax as well. The next section is from that page.


## How the Asynchronous Syntax Works

This section is from [Tracking Basics (Asynchronous Syntax)][google-async-syntax-hiw]

The `_gaq` object is what makes the asynchronous syntax possible. It acts as a
queue, which is a first-in, first-out data structure that collects API calls
until ga.js is ready to execute them. To add something to the queue, use the
`_gaq.push` method.

To push an API call onto the queue, you must convert it from the traditional
JavaScript syntax into a command array. Command arrays are simply JavaScript
arrays that conform to a certain format. The first element in a command array
is the name of the tracker object method you want to call. It must be a string.
The rest of the elements are the arguments you want to pass to the tracker
object method. These can be any JavaScript value.

The following code calls `_trackPageview()` using the traditional syntax:

{% highlight JavaScript %}
var pageTracker = _gat._getTracker('UA-XXXXX-X');
pageTracker._trackPageview();
{% endhighlight %}

The equivalent code in the asynchronous syntax requires two calls to `_gaq.push`.

{% highlight JavaScript %}
_gaq.push(['_setAccount', 'UA-XXXXX-X']);
_gaq.push(['_trackPageview']);
{% endhighlight %}


## applyq

After figuring out this technique I've created a javascript library called [applyq][]
that allows to use the Asynchronous Syntax for any javascript objects.

Lets see how it works on a simple `Logger` object that is just a wrapper over the
`console` object.

{% highlight JavaScript %}
function Logger() {}

Logger.prototype.log = function(msg) {
  console.log(msg);
};
{% endhighlight %}

All that we have to do in order to make it usable in an asynchronous way is to
pass it to the `applyq` method after creation, along with the array that contains
the cached commands.

{% highlight JavaScript %}
window.logger = new Logger();
applyq(logger, _loggerq);
{% endhighlight %}

`_loggerq` will always print the messages. Immediately or after the `Logger` was
initialized.

{% highlight JavaScript %}
window._loggerq = window._loggerq || [];
_loggerq.push(['log', 'Hello world!']);
{% endhighlight %}


[google-async-syntax]: https://developers.google.com/analytics/devguides/collection/gajs/
[google-async-syntax-hiw]: https://developers.google.com/analytics/devguides/collection/gajs/#how-the-asynchronous-syntax-works
[applyq]: https://github.com/zkochan/applyq
