---
layout: post
title:  "Hapi authentication/authorization for Express users"
date:   2015-08-11 16:25:00
categories: nodejs
comments: true
---

With no doubt [Express][express] is currently the most popular web framework for **Node.js**. It is far from being the only one though! There are dozens of other great Node.js web frameworks and one of them is [hapi][]. Hapi was developed by [@WallmartLabs][WallmartLabs] and has several advantages over Express when used in huge projects. Hence, many will find it a better pick for some projects. The problem is, Hapi is fundametally different from Express and devs used to Express will have to learn how to things in the Hapi way. This article aims to demonstrate for Express users how to configure authentication/authorization on a Hapi web application.


# How is authentication done with Express?

Most frequently [Passport][] is used for authentication in Express apps. Passport is an authentication middleware that uses [express-session][] for storing user credentials and has dozens of authentication strategies. The great thing about passport is that with little configuration your app can have registration via [email][passport-email], [facebook][passport-facebook], [twitter][passport-twitter], [google][passport-google] and whatever other method you select.

It is easy to learn how to use passport. There are a lot of examples on GitHub. Passport is used for authentication 


[express]: http://expressjs.com/
[hapi]: http://hapijs.com/
[WallmartLabs]: http://www.walmartlabs.com/
[Passport]: http://passportjs.org/
[express-session]: https://github.com/expressjs/session
[passport-email]: https://github.com/zkochan/passport-email
[passport-facebook]: https://github.com/jaredhanson/passport-facebook
[passport-twitter]: https://github.com/jaredhanson/passport-twitter
[passport-google]: https://github.com/jaredhanson/passport-google-oauth
