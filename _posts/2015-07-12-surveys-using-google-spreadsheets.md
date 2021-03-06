---
layout: post
title: Surveys using Google Spreadsheets as a database
date: 2015-07-12 11:14:00
categories: javascript
comments: true
published: true
demo:
  scripts:
    - //ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
    - /public/demo/meeky/index.js
  styles:
    - /public/demo/meeky/index.css
---

Frequently we need to survey our visitors. We don't bother developing our own
surveying tool because there are already lots of them. Mostly payed but cheaper
than developing your own.


## Google Forms?

On the other hand, there is [Google Forms][]. Although Google Forms are
completely free, they cannot integrate into your website, you must have a link
to the surveying page. Unfortunately that surveying page is not even customizable. All
you can do is select from the several templates that are offered.

Payed services win the battle against Google Forms. However, there is one thing
in Google Forms that we can use to easier develop our surveying tool! The data
storage. Google Forms are saving the answers to the surveys in Google Spreadsheets.


## Saving to Google Spreadsheets

The idea of writing a survey tool that will save the answers to Google Spreadsheets
came to me when I've read [Martin Hawksey's][Martin Hawksey] article
[Google Sheets as a Database][]. After reading that article I thought, brilliant,
now I can use the back-end of Google Forms and implement my own front-end.

So lets start with implementing the back-end as described in Martin Hawkin's
article.

First, you have to create a new Google Spreadsheet to which the answers will be
saved. In your new sheet, click on `Tools > Script editor...`.

When you have your new Google Script Code project opened, paste this code to the
`Code.gs` file.

<script src="https://gist.github.com/zkochan/e5fc3c999875a6da0d5b.js"></script>

After pasting the code, click on `Run > setup`.

Click on `Publish > Deploy as web app`.
* enter Project Version name and click 'Save New Version'
* set security level and enable service (most likely execute as 'me' and access 'anyone, even anonymously)

Copy the `Current web app URL` and save it somewhere, you'll need it later.


## Posting to Google Sheets

Now that you have configured your Google Script project, you can try to post
some data to your Google Sheet.

First, you'll have to insert column names on your destination sheet matching the
parameter names of the data you are going to send to it (exactly matching case).

![](//i.imgur.com/j0O88Mr.png)

Now you can try and post some answers to your web app URL.

{% highlight JavaScript %}
$.ajax({
  url: 'https://script.google.com/macros/s/AKfycbzV--xTooSkBLufMs4AnrCTdwZxVNtycTE4JNtaCze2UijXAg8/exec',
  type: 'post',
  data: {
    'How old are you?': '12',
    'What is your name?': 'John',
    'What movies do you like?': 'Action'
  }
});
{% endhighlight %}


## Creating a survey popup

Now that you can post answers, it is easy to create a UI for your survey.

On this page I am using a survey popup that I called [meeky][]. It is posting
data to [this][demo-sheet] Google Sheet.

[Google Forms]: http://www.google.com/forms/about/
[Martin Hawksey]: https://twitter.com/mhawksey
[Google Sheets as a Database]: https://mashe.hawksey.info/2014/07/google-sheets-as-a-database-insert-with-apps-script-using-postget-methods-with-ajax-example/
[meeky]: https://github.com/zkochan/meeky
[demo-sheet]: https://docs.google.com/spreadsheets/d/1MnSXN88A3Iq7cbqVbi-JAwt0bVNpP9WYNWwVYXb-o-M/edit?usp=sharing
