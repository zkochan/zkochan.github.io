---
layout: post
title:  "What is the best front-end MVC framework in 2015?"
date:   2015-05-04 18:27:00
categories: mvc
comments: true
permalink: /mvc/2015/05/04/best-front-end-mvc-framework-in-2015.html
---

Before writing my first [single-page application (SPA)][spa-wiki] I’ve spent a lot of time researching all the existing, most popular front-end MVC frameworks. After reading a few posts and comparisons, I decided to learn [AngularJS][angular]. It seems that right now AngularJS is the most popular framework for writing SPAs.

##AngularJS

AngularJS was the first **real** front-end framework that I managed to learn. Before it, I was trying to understand [Backbone][backbone] several times, but for some reason it seemed to me too complex. AngularJS was pretty straightforward once I got through it’s official [tutorial][angular-tutorial].

When I learned the principles of AngularJS, I managed to write a small website using it. After some work with AngularJS I realized that the standard modules are not enough for developing a big app. Luckily, there are dozens of great libraries that are extending AngularJS with amazing features. These are the ones that I personally used the most:

* [UI Router][angular-ui-router] is an amazing library for routing in an Angular app.
* [Angular validation][angular-validation]. Angular doesn’t have built in support for forms validation. This library was best that I’ve found, for forms validation in an Angular app.

After using Angular for a few months I recognized many of its stengths and weaknesses.

**The stengths** are that there are really a lot of packages that can extend Angular with new features. If something should be developed in Angular, probably there is already a package for that on GitHub.

**The weaknesses** are:

* if there is an error in the code, it is really hard to find it in Angular. Especially if the error is in the view. 
* the learning curve is pretty huge.
* the Angular framework is very big. It takes quite a lot of time when an Angular SPA is first opened in the browser.

##What is the future?

I started to search for alternatives. The first alternative that I’ve found was [Vue.js][vue-js]. However, after going through it’s guide, I realized that it is quite similar to Angular, so I continued my searches.

After a few days of blog readings I came to the conclusion that the future of web technologies is behind [isomorphic JavaScript][isomorphic] (JavaScript that can render pages both on the front- and back-end). For this reason, I didn’t even look into frameworks that were not suitable for isomorphic use. IMHO, that kind of frameworks were designed to loose the battle.

Even though [Meteor][meteor] seems to be the best stack for building isomorphic apps up to date, I don’t like it, because it is too monolithic. I like to design my applications as sets of microservices. Meteor doesn’t seem to be designed for such use cases.


##ReactJS and RiotJS

There are many articles in the net about how [React][react] is better than Angular. E.g., [this][angular-vs-react] is the last one that I was reading. That’s why I started to investigate the concept of ReactJS. After reading through its documentation I realized that:

1. it is cool
2. it is faster than AngularJS templates
3. [RiotJS][riot-js] is even faster and smaller than ReactJS

However, React and Riot are just the V from the MVC.

In order to have a complete analogue of AngularJS, React has to be combined with something like [Flux][flux] for managing data and some other library for routing.

Maybe this makes ReactJS and RiotJS more flexible and gives more freedom to the developers. However, I wouldn’t like to spend days on finding the best building blocks for a React application. And even after finding the building blocks I would have to design a good app structure. Angular has all of this out of the box. Furthermore, there are dozens of ready apps on GitHub, which I can use as examples.

##Mithril

IMHO, [Mithril][mithril] is the best framework that I’ve found so far.

* it is fast and small like RiotJS
* it uses a virtual DOM, so it has an isomorphic potential like React and Riot
* it is an MVC framework like AngularJS
* it describes the views in JS files, so error debugging is easier than in AngularJS

[Here][mithril-comparison] is a page that compares Mithril to other frameworks.

Even though Mithril seems to be really cool, it is not as popular as other front-end MVC frameworks. It is hard to find tutorials about it, except the official ones. There are hardly any packages that are extending it.

I think, the future is behind Mithril or something like Mithril, but we are not quite there yet. For now, AngularJS seems to be the <s>safer</s> easier way to go.

## Summary

Unfortunately, currently there isn’t a perfect framework for writing single-page apps. Each framework has its strong and weak sides, so the decision has to be made separately for each application developed.

[spa-wiki]: https://en.wikipedia.org/wiki/Single-page_application
[angular]: https://angularjs.org/
[backbone]: http://backbonejs.org/
[angular-tutorial]: https://docs.angularjs.org/tutorial
[angular-ui-router]: https://github.com/angular-ui/ui-router
[angular-validation]: https://github.com/huei90/angular-validation
[vue-js]: http://vuejs.org/
[isomorphic]: http://isomorphic.net/
[meteor]: https://www.meteor.com/
[react]: http://facebook.github.io/react/
[angular-vs-react]: http://blog.risingstack.com/from-angularjs-to-react-the-isomorphic-way/
[riot-js]: https://muut.com/riotjs/
[flux]: http://facebook.github.io/flux/
[mithril]: http://lhorie.github.io/mithril/
[mithril-comparison]: http://lhorie.github.io/mithril/comparison.html
