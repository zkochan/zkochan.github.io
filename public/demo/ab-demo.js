!function n(e,t,r){function o(u,f){if(!t[u]){if(!e[u]){var c="function"==typeof require&&require;if(!f&&c)return c(u,!0);if(i)return i(u,!0);var a=new Error("Cannot find module '"+u+"'");throw a.code="MODULE_NOT_FOUND",a}var s=t[u]={exports:{}};e[u][0].call(s.exports,function(n){var t=e[u][1][n];return o(t?t:n)},s,s.exports,n,e,t,r)}return t[u].exports}for(var i="function"==typeof require&&require,u=0;u<r.length;u++)o(r[u]);return o}({1:[function(n,e,t){"use strict";function r(n){n=n||[];var e=o(n);e&&e.setup&&e.setup()}var o=n("./assign-expt");e.exports=r},{"./assign-expt":2}],2:[function(n,e,t){"use strict";function r(n){var e=n.match(/abo.x\[[^\]]+\]/);if(e&&e.length){var t=e[0];return t.substr(5,t.length-1)}return null}function o(n,e){if(e=e||window.location,!n)return null;var t={};n.forEach(function(n){t[n.id]=n});var o=r(e.href);if(o&&t[o])return i.set(f,o),t[o];var c=i.get(f);if(c){if(t[c])return t[c];i.remove(f)}var a=u(n);return a?(i.set(f,a.id),a):null}var i=n("./cookie"),u=n("./select-expt"),f="abo.x";e.exports=o},{"./cookie":4,"./select-expt":5}],3:[function(n,e,t){"use strict";function r(){for(var n=0,e=document.domain,t=e.split("."),r="_gd"+(new Date).getTime();n<t.length-1&&-1===document.cookie.indexOf(r+"="+r);)e=t.slice(-1-++n).join("."),document.cookie=r+"="+r+";domain="+e+";";return document.cookie=r+"=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain="+e+";",e}e.exports=r},{}],4:[function(n,e,t){"use strict";var r=n("./base-domain")();t.set=function(n,e,t){var o=t?t:7;t=new Date,t.setTime(+t+864e5*o),document.cookie=[encodeURIComponent(n),"=",encodeURIComponent(String(e)),"; expires=",t.toUTCString(),"; path=/","localhost"===r?"":"; domain="+r].join("")},t.remove=function(n){t.set(n,"",-1)},t.get=function(n){if(!n)return null;for(var e=document.cookie?document.cookie.split("; "):[],t=e.length;t--;){var r=e[t].split("="),o=decodeURIComponent(r.shift()),i=r.join("=");if(n&&n===o)return decodeURIComponent(i)}return null}},{"./base-domain":3}],5:[function(n,e,t){"use strict";function r(n){if(n=n.filter(function(n){var e=typeof n.ac;return"undefined"===e||"function"===e&&n.ac()||"function"!==e&&n.ac}),!n.length)return null;if(1===n.length)return n[0];var e=0,t=[];if(n.forEach(function(n){"number"==typeof n.traffic?e+=n.traffic:t.push(n)}),t.length){var r=e>=1?0:(1-e)/t.length;t.forEach(function(n){n.traffic=r})}var o=Math.random(),i=0;for(var u in n){var f=n[u];if(f.traffic){var c=i+f.traffic;if(o>=i&&c>o||1===f.traffic)return f;i=c}}return null}e.exports=r},{}]},{},[1]);

function applyTheme(name) {
  document.body.className += ' theme-base-' + name;
}

abo([{
  id: '00',
  name: 'Control'
}, {
  id: 'red-theme',
  name: 'Red theme',
  setup: function() {
    applyTheme('08');
  }
}, {
  id: '08',
  name: 'Red theme',
  setup: function() {
    applyTheme('08');
  }
}, {
  id: '09',
  name: 'Orange theme',
  setup: function() {
    applyTheme('09');
  }
}, {
  id: '0a',
  name: 'Yellow theme',
  setup: function() {
    applyTheme('0a');
  }
}, {
  id: '0b',
  name: 'Green theme',
  setup: function() {
    applyTheme('0b');
  }
}, {
  id: '0c',
  name: 'Turquoise theme',
  setup: function() {
    applyTheme('0c');
  }
}, {
  id: '0d',
  name: 'Sky blue theme',
  setup: function() {
    applyTheme('0d');
  }
}, {
  id: '0e',
  name: 'Magenta theme',
  setup: function() {
    applyTheme('0e');
  }
}, {
  id: '0f',
  name: 'Brown theme',
  setup: function() {
    applyTheme('0f');
  }
}]);