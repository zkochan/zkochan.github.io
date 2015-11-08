---
layout: post
title:  "Hapi authentication/authorization for Express users"
date:   2015-11-08 16:25:00
categories: nodejs
comments: true
---

With no doubt [Express][express] is currently the most popular web framework for **Node.js**. It is far from being the only one though! There are dozens of other great Node.js web frameworks and one of them is [hapi][]. Hapi was developed by [@WallmartLabs][WallmartLabs] and has several advantages over Express when used in huge projects. Hence, many will find it a better pick for some projects. The problem is, Hapi is fundametally different from Express and devs used to Express will have to learn how to things in the Hapi way. This article aims to demonstrate for Express users how to configure authentication/authorization on a Hapi web application.


## How is authentication done with Express?

Most frequently [Passport][] is used for authentication in Express apps. Passport is an authentication middleware that uses [express-session][] for storing user credentials and has dozens of authentication strategies. The great thing about passport is that with little configuration your app can have registration via [email][passport-email], [facebook][passport-facebook], [twitter][passport-twitter], [google][passport-google] and whatever other method you select.

It is easy to learn how to use passport. There are a lot of examples on GitHub. Passport is used for authentication on both MEAN stacks ([mean.js][] and [mean.io][]), and by [Hackathon Starter][].


## How to authenticate with Hapi?

Unlike Express, Hapi has its own [authentication API][hapi auth], that is very similar to Passport. However, the strategies that are used by Hapi authentication are not composable like the auth strategies of Express. It is possible to use them in parallel but I couldn't find an example of a Hapi application with multi authentication support. Therefore I had to invent my own solution.


### humble-session

My idea was to use the same technic that is used by Passport: keeping credential informations in the session. To add session to Hapi, I created a plugin called [humble-session][].

Humble-session got its name because unlike the express-session, it is fetched only when needed (express-session is fetched at every request). To fetch the session, you'll have to use a [prerequisite][route pre] in your route:

{% highlight JavaScript %}
var sessionPre = require('humble-session').pre;

exports.register = function(server, options, next) {
  server.route({
    method: 'GET',
    path: '/get-msg-from-session',
    config: {
      pre: [sessionPre],
      handler: function(req, reply) {
        reply(req.pre.session.msg);
      }
    }
  });

  next();
};
{% endhighlight %}


### humble-auth

[Humble-auth][humble-auth] is an authentication strategy that is using humble-session.

Once humble-auth is registered, it extends the `request` object with two new methods: `login` and `logout`. Hence, to log a user in, you can just path an object with the user credentials:

{% highlight JavaScript %}
/* inside a route */
request.login({
  id: user.id
}, function(err) {
  if (err) {
    return reply(Boom.wrap(err));
  }
  reply.redirect('/some-private-page');
});
{% endhighlight %}

What makes this `request.login` method great is that now you can use humble-auth for email registration. However, you can also use it with [bell][] (which is a third party login plugin for hapi), to authenticate users through Facebook, Twitter or other OAuth providers! To do so, you'll just have to log the users in with humble-auth in the bell strategies callbacks.

For instance, for the Facebook strategy you can do:

{% highlight JavaScript %}
server.auth.strategy('facebook', 'bell', {
  provider: 'facebook',
  password: 'j02oal10k1ns',
  clientId: '42423840574399823',
  clientSecret: 'f30g34gj3papjf34nvejsdsd443t'
});

/* handle the callback from Facebook */
server.route({
  path: '/auth/facebook',
  method: 'GET',
  config: {
    auth: 'facebook',
    pre: [humbleSession.pre],
    handler: function(request, reply) {
      if (request.pre.session.user) {
        /* if the user is logged in attach the new Facebook profile to his account */
      } else {
        /* create a new user account */
        /* and log the new user in */
        request.login(user, function() {
          reply.redirect('/');
        });
      }
      /* adding the user passed through request.auth.credentials to an existing account if the user is logged in or */
    }
  }
});
{% endhighlight %}


## SiteGate

I hope this short article has provided you with some basic understanding about how to authenticate in Hapi like in Express. To see a complete working example of an application using this technic, visit the [SiteGate repo][]. SiteGate is an authentication and account management website implemented using Hapi and humble-auth.


[express]: http://expressjs.com/
[hapi]: http://hapijs.com/
[WallmartLabs]: http://www.walmartlabs.com/
[Passport]: http://passportjs.org/
[express-session]: https://github.com/expressjs/session
[passport-email]: https://github.com/zkochan/passport-email
[passport-facebook]: https://github.com/jaredhanson/passport-facebook
[passport-twitter]: https://github.com/jaredhanson/passport-twitter
[passport-google]: https://github.com/jaredhanson/passport-google-oauth
[mean.js]: http://meanjs.org/
[mean.io]: http://mean.io/#!/
[Hackathon Starter]: https://github.com/sahat/hackathon-starter
[hapi auth]: http://hapijs.com/tutorials/auth
[humble-session]: https://github.com/zkochan/humble-session
[route pre]: http://hapijs.com/api#route-prerequisites
[humble-auth]: https://github.com/zkochan/humble-auth
[bell]: https://github.com/hapijs/bell
[SiteGate repo]: https://github.com/sitegate/sitegate
