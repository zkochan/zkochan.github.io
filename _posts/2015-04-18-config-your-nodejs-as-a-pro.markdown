---
layout: post
title:  "Config your NodeJS as a Pro!"
date:   2015-04-18 18:45:49
categories: nodejs
comments: true
---
When I started to develop apps using NodeJS, I wondered, how should I save my configs? It seems that everyone does it in his own way.

# The most popular solution - JS files

The most widespread solution is to create a separate js file for each evironment. Each of those js files export an Object containing all the configs for the corresponding environment.
This is the method suggested by the popular [MEAN.JS][mean-js] and [MEAN.IO][mean-io] projects.

Here's how they do it:

* [MEAN.JS][mean-js-config]
* [MEAN.IO][mean-io-config]

You might wonder, why to use js files for storing configs? Why not just JSON? I think there are 2 reasons for that:

1. Oftenly production configs should get some values from environment variables. It is easy to override some config values from environment variables in a JS file.
2. JSON files are uglier than JS files?!


# Node-convict - JSON files

[Node-convict][node-convict] tries to solve two problems in the NodeJS configuration area:

* Getting configs from environment variables
* Configs validation

They do it by using a `config schema`. A config schema is describing

* what should be the structure of the app's config
* the types of the config values
* names of the environment variables that can override each config value

Having this schema, allows to move the configs to JSON files.


# But what if I don't like JSON files?

I don't think that JSON files are ugly (XML is).
JSON files are cool, and I have nothing against them. However, there is also another language, designed for describing data, which is both cool and beautiful. It is called [YAML][yaml].

With YAML your config file will look like this:

{% highlight yaml %}
app:
  name: hello-world
port: 3000
mongo: mongodb://localhost:27017
{% endhighlight %}

So how can you use YAML files to store your configs? Unfortunately, Node-convict doesn't support yaml files currently. However, it is possible to pass an object instead of a file path to convict. Hence, you can
get the config object from a YAML file, using some other tools, like the npm package called [JS-YAML][js-yaml].

And you'll have something like this:

{% highlight javascript %}
var util = require('util');
var fs = require('fs');
var yaml = require('js-yaml');
var convict = require('convict');

var config = convict({
  env: {
    doc: 'The applicaton environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  }
  // other configs
});

// load environment dependent configuration
var env = config.get('env');
var filePath = __dirname + '/env/' + env + '.yml';
var configFile = yaml.safeLoad(fs.readFileSync(filePath));

config.load(configFile);

// Adding the calculated values
config.load({
  envFoo: config.get('env') + 'Foo'
});

// perform validation
config.validate();

module.exports = config;
{% endhighlight %}


[mean-js]: http://meanjs.org/
[mean-io]: http://mean.io/
[mean-js-config]: https://github.com/meanjs/mean/tree/master/config/env
[mean-io-config]: https://github.com/linnovate/mean/tree/master/config/env
[node-convict]: https://github.com/mozilla/node-convict
[yaml]: http://yaml.org/
[js-yaml]: https://github.com/nodeca/js-yaml