---
layout: post
title: How to dynamically create an IFrame
date: 2015-06-16 19:59:00
categories: javascript
comments: true
published: true
---

I've spent a lot of time on figuring out how to create an iframe dynamically. At first, I thought it is as simple as: 

{% highlight JavaScript %}
var iframe = document.createElement('iframe');
document.body.appendChild(iframe);

iframe.contentWindow.document.write('<div>foo</div>');
{% endhighlight %}

However, this will not work in IE 8/9! In Internet Explorer inline frames don't inherit the parent's document.domain. As a consiquence, [same-origin policy][sop] restricts the parent from accessing the iframe created without a source.

After some search in the internet, I've found out that it is possible to set the source of the iframe using a little hack:

{% highlight JavaScript %}
var iframe = document.createElement('iframe');
document.body.appendChild(iframe);

iframe.src = 'javascript:(function() {' +
  'document.open();document.domain=\'' + document.domain +
  '\';document.close();})();';

iframe.contentWindow.document.write('<div>foo</div>');
{% endhighlight %}

As you can see, there is a small inline JavaScript snippet that sets the iframe's document.domain to the domain of its parent.

This solution does fix the accessibility issue in IE. However, it creates a new problem: the creation of the iframe adds a new entry to the browser's history. And this one is not an IE only issue. Fortunately, after some searching and experimenting, I've found another solution, that both updates the domain and doesn't create a new entry in the history.

{% highlight JavaScript %}
var iframe = document.createElement('iframe');
document.body.appendChild(iframe);

iframe.src = 'javascript:document.write("<head><script>(function() {' +
  'document.open();document.domain=\'' + document.domain +
  '\';document.close();})();</script></head><body></body>")';

iframe.contentWindow.document.write('<div>foo</div>');
{% endhighlight %}

Unlike the previous solution, this one replaces the iframe instead of altering its domain. Hence, the action is not pushed to the history of the browser.

The last solution will perfectly work in all modern browsers and in IE starting from IE8. However, it is not perfect as well, because it can't be used as inline script in the page. And the reason for that is because it contains a closing `</script>` tag. Some would suggest to split the closing script tag like this: `'</' + 'script>'`. However, splitting it is not a good solution because any smart minifier would optimize the split and unite the string. The best solution in this case is to create the script tag with `document.createElement`:

{% highlight JavaScript %}
var script = document.createElement('script');
script.innerHTML = '/* some javascript goes here */';
console.log(script.outerHTML);
{% endhighlight %}

Using this solution, here's how the final IFrame creating code will look like:

{% highlight JavaScript %}
var iframe = document.createElement('iframe');
document.body.appendChild(iframe);

iframe.src = 'javascript:void((function(){var script = document.createElement(\'script\');' +
  'script.innerHTML = "(function() {' +
  'document.open();document.domain=\'' + document.domain +
  '\';document.close();})();";' +
  'document.write("<head>" + script.outerHTML + "</head><body></body>);})())';

iframe.contentWindow.document.write('<div>foo</div>');
{% endhighlight %}

And now we have a working iframe in IE8 and all the other browsers.

[sop]: https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy