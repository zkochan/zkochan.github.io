---
layout: post
title: Vanilla A/B testing with Abo
date: 2015-06-24 21:47:00
categories: ab
comments: true
published: true
demoScript: /demo/ab-demo.js
---


In a [previous post](http://www.kochan.io/ab/2015/05/22/coding-ab-tests-effectively.html) I wrote about how unhandy it is to develop A/B tests in [Optimizely's][opt] web interface. In this post I want to get one step further. If we don't develop our experiments in Optimizely, why do we need to copy paste the code to Optimizely? Eventually, what's so hard about front-end A/B testing?


## What do we need for front-end A/B testing?

The principle of front-end A/B testing is actually fairly simple.

1. there should be a trojan that mutates the initial page
2. a traffic allocator that divides the traffic between different experiments
3. some sort of tracking to compare the performance of a B variation to a control A variation

I will not write about the 3rd item in this article. I'll just say that it is really easy to track different events and goals with [Google Analytics][] and [segments][] can be used for comparing the performance of different variations.

The first 2 problems are easily solvable with JavaScript on the front-end.


## Abo. The solution

Abo (або) means 'or' in Ukrainian. [Abo][] is a micro front-end testing library.

Abo randomly assigns a variation to a user and keeps that user on the variation providing him a consistent user experience. Lets see the algorithm behind Abo:

![](//i.imgur.com/1L9LgMc.png)

Although the algorithm seems very simple, it can achieve anything required for an A/B experiment. Lets suppose you need an experiment that will change the size of the page header for 10% of mobile traffic. You can achive it by writing an assignemt condition that will return true only on cell phones:

{% highlight JavaScript %}
var abo = require('abo');

var expt = {
  id: '1',
  name: 'Mobile experiment',

  /*
   * The experiment will get 10% of the traffic for
   * which the assignment condition will be satisfied
   */
  traffic: .1,

  /*
   * Assignment Condition
   * will return true only if executed on a cell phone
   */
  ac: function() {
    if (typeof matchMedia !== 'function') {
      return false;
    }
    return matchMedia('(max-width: 470px)').matches;
  },

  /*
   * This method will be executed only if the experiment
   * will be assigned to the user
   */
  setup: function() {
    $('h1').css({
      font-size: '24px'
    });
  }
};

/*
 * abo receives an array of experiments and kicks off immediately
 * after receving it
 */
abo([expt]);
{% endhighlight %}


## How to structure an Abo project?

Big projects can have dozens of A/B tests running or under development. Hence, it is important to have a good structure for your A/B testing project. Fortunately, there's a [Yeoman generator][abo-generator] for generating Abo projects and experiments. In order to use it, you'll have to install [Yeoman][] first.

{% highlight bash %}
npm install -g yo
{% endhighlight %}

Yeoman is an amazing tool that helps kick-start new projects! If you haven't used it so far, check out the list of their [generators][]. You'll probably find a lot of usefull ones for your needs.

Now that you have Yeoman installed, you can install Yeoman generator for Abo:

{% highlight bash %}
npm install -g generator-abo
{% endhighlight %}

Great! Now you can create a folder for your A/B testing project and call `yo abo` to kikstart your project.

{% highlight bash %}
mkdir ab
cd ab
yo abo
{% endhighlight %}

Yeoman will ask a few questions about your project.

![](http://i.imgur.com/a3XrIf4.png)

Once you answer all the questions, your project will be created and all the dependencies installed.


## How to add Abo to your website?

Once you have the standard Abo project generated, you can bundle the Abo scripts by running `foso build -m` or self-host them by running `foso serve`. [Foso][] is a static server that bundles resources using some simple conventions. If you don't have it already, you can install it by running `npm install -g foso`.

Foso will bundle your files into the `dist` directory. A simple project will have only one file bundled into that folder: `index.js`. That file will have to be added to every single page of your website. If you run `foso serve` then foso will run a static server hosting the snippets from the `dist` directory.

The standard address of the static server is `http://localhost:1769/`, so you can just add a reference to `http://localhost:1769/index.js` to your website in order to test Abo locally.


## How to develop an experiment?

To create your first experiment, you can run `yo abo:expt`. Yeoman will create a directory for your experiment in the root directory of your A/B project.

Of course, during developing a new experiment you wil want it to be active on the page, no matter what. Hence you won't need the Abo library and all the other active experiments loaded. Luckily, your yet empty experiment, is already configured to allow independent usage! Go to the experiment's directory and run `foso serve`. Foso will bundle the file called `_bundle.js` and rename it to `index.js`. This file will be available under `http://localhost:1769/index.js`.

Have you noticed that the file URL is the same as the one you already added to the page? You can enter different modes by running the foso server in different directories of your A/B testing project. If you run `foso serve` in the root directory, you can test the overall traffic allocation, experiment assignment, execution, etc. But if you run `foso serve` inside an experiment's folder, you'll enter to that experiment's demo mode.

The great thing about foso is that it automatically adds a livereload link to the page, so when you update your experiment, the page will automatically reload.

Abo gives you complete freedom to implement your experiments the way you want. If you'd like to see some examples and best practices, check out the [TodoMVC A/B][todo-ab] testing project.


## How to release A/B tests to production?

Everything that you'll have to export to production will be bundled in the `dist` directory. You can manually copy/paste those files to your production server.

Although, there is a better solution of delivering your changes to production. The Abo generator creates your project with a `ung.json` config file. [Ung][] is a static resources manager. In a nutshell, it is a simple NodeJS server that hosts static resources. What makes it a manager? The fact that it can update resources on the fly.

If you create an Ung server in production and update your `ung.json` file to point to the right domain, you'll be able to update your experiments in production by running two commands in the root directory of your project:

{% highlight bash %}
ung pack prod
ung publish prod
{% endhighlight %}

The first command bundles your resources and packs them to a gzip and the second one posts them to production.

## Summary

Of course, it is harder to maintain your own A/B testing solution, when there are great tools already in the web. But it gives you many advantages:

* The ability to CR experiments
* Reusable code
* The comfort of using a code editor during developing experiments
* Livereload
* History of changes (if your project will be in a Git repository)
* Flexibility
* Little learning curve


[opt]: https://www.optimizely.com/
[Google Analytics]: http://www.google.com/analytics/
[segments]: https://support.google.com/analytics/answer/3123951?hl=en
[abo]: https://github.com/abojs/abo
[abo-demo]: https://github.com/abojs/abo-demo
[abo-generator]: https://github.com/abojs/generator-abo
[yeoman]: http://yeoman.io/
[generators]: http://yeoman.io/generators/
[foso]: https://github.com/fosojs/foso
[todo-ab]: https://github.com/abojs/todomvc-ab
[ung]: https://github.com/zkochan/ung
