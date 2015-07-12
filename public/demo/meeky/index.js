(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jade = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = merge(attrs, a[i]);
    }
    return attrs;
  }
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    a['class'] = ac.concat(bc).filter(nulls);
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */

function nulls(val) {
  return val != null && val !== '';
}

/**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 */
exports.joinClasses = joinClasses;
function joinClasses(val) {
  return (Array.isArray(val) ? val.map(joinClasses) :
    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
    [val]).filter(nulls).join(' ');
}

/**
 * Render the given classes.
 *
 * @param {Array} classes
 * @param {Array.<Boolean>} escaped
 * @return {String}
 */
exports.cls = function cls(classes, escaped) {
  var buf = [];
  for (var i = 0; i < classes.length; i++) {
    if (escaped && escaped[i]) {
      buf.push(exports.escape(joinClasses([classes[i]])));
    } else {
      buf.push(joinClasses(classes[i]));
    }
  }
  var text = joinClasses(buf);
  if (text.length) {
    return ' class="' + text + '"';
  } else {
    return '';
  }
};


exports.style = function (val) {
  if (val && typeof val === 'object') {
    return Object.keys(val).map(function (style) {
      return style + ':' + val[style];
    }).join(';');
  } else {
    return val;
  }
};
/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = function attr(key, val, escaped, terse) {
  if (key === 'style') {
    val = exports.style(val);
  }
  if ('boolean' == typeof val || null == val) {
    if (val) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    } else {
      return '';
    }
  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
    if (JSON.stringify(val).indexOf('&') !== -1) {
      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
                   'will be escaped to `&amp;`');
    };
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will eliminate the double quotes around dates in ' +
                   'ISO form after 2.0.0');
    }
    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
  } else if (escaped) {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + exports.escape(val) + '"';
  } else {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + val + '"';
  }
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 */
exports.attrs = function attrs(obj, terse){
  var buf = [];

  var keys = Object.keys(obj);

  if (keys.length) {
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('class' == key) {
        if (val = joinClasses(val)) {
          buf.push(' ' + key + '="' + val + '"');
        }
      } else {
        buf.push(exports.attr(key, val, false, terse));
      }
    }
  }

  return buf.join('');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

var jade_encode_html_rules = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
};
var jade_match_html = /[&<>"]/g;

function jade_encode_char(c) {
  return jade_encode_html_rules[c] || c;
}

exports.escape = jade_escape;
function jade_escape(html){
  var result = String(html).replace(jade_match_html, jade_encode_char);
  if (result === '' + html) return html;
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str = str || require('fs').readFileSync(filename, 'utf8')
  } catch (ex) {
    rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

exports.DebugItem = function DebugItem(lineno, filename) {
  this.lineno = lineno;
  this.filename = filename;
}

},{"fs":2}],2:[function(require,module,exports){

},{}]},{},[1])(1)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"fs":1}],3:[function(require,module,exports){
'use strict';

var Miki = require('../');

var miki = new Miki({
  steps: require('./steps')
});

miki.on('save', function(answers) {
  $.ajax({
     url: 'https://script.google.com/macros/s/AKfycbwK0fpzj5JJrBIVUZ_nsp1JCMNntPO0eONMKOe2ekpYmO6vFxBx/exec',
     type: 'post',
     data: answers
 });
});

miki.show();

},{"../":5,"./steps":4}],4:[function(require,module,exports){
module.exports = {
  startStep: {
    question: 'How old are you?',
    desc: 'Some description',
    type: 'question', // or message
    nextStep: 'nameStep',
    answerType: 'singleChoice',
    randomize: true,
    answers: [
      {
        title: '<18',
        nextStep: 'tooYoungStep'
      },
      {
        title: '18-30'
      },
      {
        title: '>30',
        commentType: 'multiline'
      }
    ]
  },
  nameStep: {
    question: 'What is your name?',
    type: 'question',
    answerType: 'text',
    nextStep: 'moviesStep'
  },
  moviesStep: {
    question: 'What movies do you like?',
    type: 'question',
    answerType: 'multiChoice',
    nextStep: 'aboutStep',
    answers: [
      {
        title: 'Horror'
      },
      {
        title: 'Action'
      },
      {
        title: 'Comedy'
      }
    ]
  },
  aboutStep: {
    type: 'question',
    question: 'Tell about yourself',
    answerType: 'multilineText',
    nextStep: 'thankYouStep'
  },
  thankYouStep: {
    type: 'message',
    message: 'Thank you!'
  },
  tooYoungStep: {
    type: 'message',
    message: 'You\'re too young for this survey'
  }
};

},{}],5:[function(require,module,exports){
'use strict';

var surveyTemplate = require('./views/survey.jade');
var stepTemplate = require('./views/step.jade');

var Emitter = require('browser-emitter');

function Miki(opts) {
  opts = opts || {};

  if (!opts.steps) {
    throw new Error('opts.steps is required');
  }

  this._steps = opts.steps;

  this._emitter = new Emitter();

  this._responses = {};
}

Miki.prototype.show = function() {
  $('body').append(surveyTemplate());
  this.$$surveyBox = $('.miki');
  this.$$stepContainer = $('.miki .body');
  this.gotoStep(this._steps.startStep);

  var _this = this;
  $('.close', this.$$surveyBox).click(function() {
    _this.toggle();
  });
};

Miki.prototype.hide = function() {
  this.$$surveyBox.hide();
};

Miki.prototype.toggle = function() {
  if (this._isMinimized) {
    this.maximize();
    return;
  }
  this.minimize();
};

Miki.prototype.maximize = function() {
  var _this = this;
  this.$$surveyBox.animate({
    bottom: '0px'
  }, function() {
    _this._isMinimized = false;
    _this.$$surveyBox.removeClass('minimized');
    _this._emitter.emit('maximize');
    _this.focus();
  });
};

Miki.prototype.minimize = function() {
  var _this = this;
  this.$$surveyBox.animate({
    bottom: -(this.$$surveyBox.height() - 20) + 'px'
  }, function() {
    _this._isMinimized = true;
    _this.$$surveyBox.addClass('minimized');
    _this._emitter.emit('minimize');
  });
};

Miki.prototype.on = function(event, cb) {
  this._emitter.on(event, cb);
};

Miki.prototype.focus = function() {
  if (this._currentStep.answerType === 'text') {
    $('input', this.$$stepContainer).focus();
  } else if (this._currentStep.answerType === 'multilineText') {
    $('textarea', this.$$stepContainer).focus();
  }
};

Miki.prototype.gotoStep = function(step) {
  this.$$stepContainer.html(stepTemplate(step));

  this._currentStep = step;

  var _this = this;
  $('.miki button').click(function() {
    _this._next();
  });

  this.focus();
};

Miki.prototype._getAnswer = function() {
  switch (this._currentStep.answerType) {
    case 'singleChoice':
      return $('.miki input:checked').val();
    case 'multiChoice':
      var responses = [];
      $('.miki input:checked').each(function() {
        responses.push($(this).val());
      });
      return responses.join(',');
    case 'text':
      return $('.miki input[type=text]').val();
    case 'multilineText':
      return $('.miki textarea').val();
  }
};

Miki.prototype._sendData = function() {
  this._emitter.emit('save', this._responses);
};

Miki.prototype._next = function() {
  var answer = this._getAnswer();

  if (!answer) {
    return;
  }

  this._responses[this._currentStep.question] = answer;

  var nextStepName = this._currentStep.nextStep;
  if (this._currentStep.answerType === 'singleChoice') {
    nextStepName = $('.miki input:checked')
      .attr('data-next-step') || nextStepName;
  }

  var nextStep = this._steps[nextStepName];
  this.gotoStep(nextStep);
  if (nextStep.type === 'message') {
    /* TODO: send the data also if the user doesn't
     * answer to all the questions */
    this._sendData();
    var _this = this;
    setTimeout(function() {
      _this.hide();
    }, 5000);
  }
};

module.exports = Miki;

},{"./views/step.jade":7,"./views/survey.jade":8,"browser-emitter":6}],6:[function(require,module,exports){
/**
 * [browser-emitter-js] Emitter.js
 * Copyright (c) 2013 Yoshitaka Sakamoto <brilliantpenguin@gmail.com>
 * See license: https://github.com/ystskm/browser-emitter-js/blob/master/LICENSE
 */
(function(has_win, has_mod) {

  var exports;
  if(has_win) {
    // browser, emulated window
    exports = window;
  } else {
    // raw Node.js, web-worker
    exports = typeof self == 'undefined' ? this: self;
  }

  has_mod && (module.exports = Emitter);
  exports.Emitter = Emitter;

  function Emitter() {
    this._events = {};
  }

  var EmitterProps = {
    inherits: inherits
  };
  for( var i in EmitterProps)
    Emitter[i] = EmitterProps[i];

  var EmitterProtos = {
    on: on,
    off: off,
    once: once,
    emit: emit,
    listeners: listeners
  };
  for( var i in EmitterProtos)
    Emitter.prototype[i] = _wrap(EmitterProtos[i]);

  function on(type, args) {
    this._events[type].push({
      fn: args[0]
    }); // TODO more options
    return this;
  }

  function once(type, args) {
    this._events[type].push({
      fn: args[0],
      once: true
    }); // TODO more options
    return this;
  }

  function off(type, args) {

    var self = this, splice_pos = 0;
    var evts = this._events;
    if(type == null) {
      for( var i in evts)
        delete evts[i];
      return this;
    }

    while(splice_pos < evts[type].length) {
      var stat = evts[type][splice_pos];
      typeof args[0] != 'function' || args[0] === stat.fn ? (function() {
        evts[type].splice(splice_pos, 1);
      })(): splice_pos++;
    }

    if(evts[type]) {
      // occasionally already deleted (another .off() called)
      evts[type].length == 0 && delete evts[type];
    }
    return this;

  }

  function emit(type, args) {

    var emitter = this, splice_pos = 0;
    var evts = emitter._events, handlers = [];

    // emit event occasionally off all type of events
    while(evts[type] && splice_pos < evts[type].length) {
      var stat = evts[type][splice_pos];
      handlers.push(stat.fn), stat.once ? (function() {
        evts[type].splice(splice_pos, 1);
      })(): splice_pos++;
    }

    if(evts[type]) {
      // occasionally already deleted (.off() called)
      evts[type].length || delete evts[type];
    }

    handlers.forEach(function(fn) {
      fn.apply(emitter, args);
    });

    return emitter;

  }

  function listeners(type) {
    return type == null ? this._events: this._events[type];
  }

  function inherits(Super) {
    for( var i in Emitter.prototype)
      Super.prototype[i] = Emitter.prototype[i];
  }

  function _wrap(fn) {
    return function() {
      var args = Array.prototype.slice.call(arguments), type = args.shift();
      !Array.isArray(this._events[type]) && (this._events[type] = []);
      return fn.call(this, type, args);
    };
  }

}).call(this, typeof window != 'undefined', typeof module != 'undefined');

},{}],7:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (answerType, answers, buttonLabel, label, message, question, type, undefined) {
buf.push("<div" + (jade.cls(['step',(answerType || '')], [null,true])) + ">");
switch (type){
case 'message':
buf.push("<div class=\"message\">" + (null == (jade_interp = message) ? "" : jade_interp) + "</div>");
  break;
case 'question':
buf.push("<div class=\"question\">" + (null == (jade_interp = question) ? "" : jade_interp) + "</div>");
switch (answerType){
case 'multiChoice':
// iterate answers
;(function(){
  var $$obj = answers;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var answer = $$obj[$index];

buf.push("<label class=\"answer\"><input type=\"checkbox\"" + (jade.attr("value", answer.title, true, false)) + "/>" + (null == (jade_interp = answer.title) ? "" : jade_interp) + "</label>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var answer = $$obj[$index];

buf.push("<label class=\"answer\"><input type=\"checkbox\"" + (jade.attr("value", answer.title, true, false)) + "/>" + (null == (jade_interp = answer.title) ? "" : jade_interp) + "</label>");
    }

  }
}).call(this);

  break;
case 'singleChoice':
// iterate answers
;(function(){
  var $$obj = answers;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var answer = $$obj[$index];

buf.push("<label class=\"answer\"><input type=\"radio\" name=\"answer\"" + (jade.attr("value", answer.title, true, false)) + (jade.attr("data-next-step", answer.nextStep, true, false)) + "/>" + (null == (jade_interp = answer.title) ? "" : jade_interp) + "</label>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var answer = $$obj[$index];

buf.push("<label class=\"answer\"><input type=\"radio\" name=\"answer\"" + (jade.attr("value", answer.title, true, false)) + (jade.attr("data-next-step", answer.nextStep, true, false)) + "/>" + (null == (jade_interp = answer.title) ? "" : jade_interp) + "</label>");
    }

  }
}).call(this);

  break;
case 'text':
buf.push((null == (jade_interp = label) ? "" : jade_interp) + "<input type=\"text\"/>");
  break;
case 'multilineText':
buf.push((null == (jade_interp = label) ? "" : jade_interp) + "<textarea></textarea>");
  break;
}
buf.push("<div class=\"footer\"><button>" + (null == (jade_interp = buttonLabel || 'Send') ? "" : jade_interp) + "</button></div>");
  break;
}
buf.push("</div>");}.call(this,"answerType" in locals_for_with?locals_for_with.answerType:typeof answerType!=="undefined"?answerType:undefined,"answers" in locals_for_with?locals_for_with.answers:typeof answers!=="undefined"?answers:undefined,"buttonLabel" in locals_for_with?locals_for_with.buttonLabel:typeof buttonLabel!=="undefined"?buttonLabel:undefined,"label" in locals_for_with?locals_for_with.label:typeof label!=="undefined"?label:undefined,"message" in locals_for_with?locals_for_with.message:typeof message!=="undefined"?message:undefined,"question" in locals_for_with?locals_for_with.question:typeof question!=="undefined"?question:undefined,"type" in locals_for_with?locals_for_with.type:typeof type!=="undefined"?type:undefined,"undefined" in locals_for_with?locals_for_with.undefined:typeof undefined!=="undefined"?undefined:undefined));;return buf.join("");
};
},{"jade/runtime":2}],8:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"miki\"><div class=\"close\"></div><div class=\"body\"></div></div>");;return buf.join("");
};
},{"jade/runtime":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL1VzZXJzL1pvbHRhbi5ab2x0YW4tUEMvQXBwRGF0YS9Sb2FtaW5nL25wbS9ub2RlX21vZHVsZXMvZm9zaWZ5LWpzL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi8uLi9Vc2Vycy9ab2x0YW4uWm9sdGFuLVBDL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Zvc2lmeS1qcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwiLi4vLi4vLi4vVXNlcnMvWm9sdGFuLlpvbHRhbi1QQy9BcHBEYXRhL1JvYW1pbmcvbnBtL25vZGVfbW9kdWxlcy9mb3NpZnktanMvbm9kZV9tb2R1bGVzL2phZGUvcnVudGltZS5qcyIsIm1haW4uYnVuZGxlLmpzIiwic3RlcHMuanMiLCIuLi9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLWVtaXR0ZXIvRW1pdHRlci5qcyIsIi4uL3ZpZXdzL3N0ZXAuamFkZSIsIi4uL3ZpZXdzL3N1cnZleS5qYWRlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLG51bGwsIihmdW5jdGlvbihmKXtpZih0eXBlb2YgZXhwb3J0cz09PVwib2JqZWN0XCImJnR5cGVvZiBtb2R1bGUhPT1cInVuZGVmaW5lZFwiKXttb2R1bGUuZXhwb3J0cz1mKCl9ZWxzZSBpZih0eXBlb2YgZGVmaW5lPT09XCJmdW5jdGlvblwiJiZkZWZpbmUuYW1kKXtkZWZpbmUoW10sZil9ZWxzZXt2YXIgZztpZih0eXBlb2Ygd2luZG93IT09XCJ1bmRlZmluZWRcIil7Zz13aW5kb3d9ZWxzZSBpZih0eXBlb2YgZ2xvYmFsIT09XCJ1bmRlZmluZWRcIil7Zz1nbG9iYWx9ZWxzZSBpZih0eXBlb2Ygc2VsZiE9PVwidW5kZWZpbmVkXCIpe2c9c2VsZn1lbHNle2c9dGhpc31nLmphZGUgPSBmKCl9fSkoZnVuY3Rpb24oKXt2YXIgZGVmaW5lLG1vZHVsZSxleHBvcnRzO3JldHVybiAoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSh7MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogTWVyZ2UgdHdvIGF0dHJpYnV0ZSBvYmplY3RzIGdpdmluZyBwcmVjZWRlbmNlXG4gKiB0byB2YWx1ZXMgaW4gb2JqZWN0IGBiYC4gQ2xhc3NlcyBhcmUgc3BlY2lhbC1jYXNlZFxuICogYWxsb3dpbmcgZm9yIGFycmF5cyBhbmQgbWVyZ2luZy9qb2luaW5nIGFwcHJvcHJpYXRlbHlcbiAqIHJlc3VsdGluZyBpbiBhIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYVxuICogQHBhcmFtIHtPYmplY3R9IGJcbiAqIEByZXR1cm4ge09iamVjdH0gYVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5tZXJnZSA9IGZ1bmN0aW9uIG1lcmdlKGEsIGIpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICB2YXIgYXR0cnMgPSBhWzBdO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgICAgYXR0cnMgPSBtZXJnZShhdHRycywgYVtpXSk7XG4gICAgfVxuICAgIHJldHVybiBhdHRycztcbiAgfVxuICB2YXIgYWMgPSBhWydjbGFzcyddO1xuICB2YXIgYmMgPSBiWydjbGFzcyddO1xuXG4gIGlmIChhYyB8fCBiYykge1xuICAgIGFjID0gYWMgfHwgW107XG4gICAgYmMgPSBiYyB8fCBbXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYWMpKSBhYyA9IFthY107XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGJjKSkgYmMgPSBbYmNdO1xuICAgIGFbJ2NsYXNzJ10gPSBhYy5jb25jYXQoYmMpLmZpbHRlcihudWxscyk7XG4gIH1cblxuICBmb3IgKHZhciBrZXkgaW4gYikge1xuICAgIGlmIChrZXkgIT0gJ2NsYXNzJykge1xuICAgICAgYVtrZXldID0gYltrZXldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhO1xufTtcblxuLyoqXG4gKiBGaWx0ZXIgbnVsbCBgdmFsYHMuXG4gKlxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBudWxscyh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPSBudWxsICYmIHZhbCAhPT0gJyc7XG59XG5cbi8qKlxuICogam9pbiBhcnJheSBhcyBjbGFzc2VzLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuam9pbkNsYXNzZXMgPSBqb2luQ2xhc3NlcztcbmZ1bmN0aW9uIGpvaW5DbGFzc2VzKHZhbCkge1xuICByZXR1cm4gKEFycmF5LmlzQXJyYXkodmFsKSA/IHZhbC5tYXAoam9pbkNsYXNzZXMpIDpcbiAgICAodmFsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSA/IE9iamVjdC5rZXlzKHZhbCkuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIHZhbFtrZXldOyB9KSA6XG4gICAgW3ZhbF0pLmZpbHRlcihudWxscykuam9pbignICcpO1xufVxuXG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gY2xhc3Nlcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBjbGFzc2VzXG4gKiBAcGFyYW0ge0FycmF5LjxCb29sZWFuPn0gZXNjYXBlZFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmNscyA9IGZ1bmN0aW9uIGNscyhjbGFzc2VzLCBlc2NhcGVkKSB7XG4gIHZhciBidWYgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGVzY2FwZWQgJiYgZXNjYXBlZFtpXSkge1xuICAgICAgYnVmLnB1c2goZXhwb3J0cy5lc2NhcGUoam9pbkNsYXNzZXMoW2NsYXNzZXNbaV1dKSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBidWYucHVzaChqb2luQ2xhc3NlcyhjbGFzc2VzW2ldKSk7XG4gICAgfVxuICB9XG4gIHZhciB0ZXh0ID0gam9pbkNsYXNzZXMoYnVmKTtcbiAgaWYgKHRleHQubGVuZ3RoKSB7XG4gICAgcmV0dXJuICcgY2xhc3M9XCInICsgdGV4dCArICdcIic7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG59O1xuXG5cbmV4cG9ydHMuc3R5bGUgPSBmdW5jdGlvbiAodmFsKSB7XG4gIGlmICh2YWwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModmFsKS5tYXAoZnVuY3Rpb24gKHN0eWxlKSB7XG4gICAgICByZXR1cm4gc3R5bGUgKyAnOicgKyB2YWxbc3R5bGVdO1xuICAgIH0pLmpvaW4oJzsnKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdmFsO1xuICB9XG59O1xuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGF0dHJpYnV0ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGVzY2FwZWRcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdGVyc2VcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5hdHRyID0gZnVuY3Rpb24gYXR0cihrZXksIHZhbCwgZXNjYXBlZCwgdGVyc2UpIHtcbiAgaWYgKGtleSA9PT0gJ3N0eWxlJykge1xuICAgIHZhbCA9IGV4cG9ydHMuc3R5bGUodmFsKTtcbiAgfVxuICBpZiAoJ2Jvb2xlYW4nID09IHR5cGVvZiB2YWwgfHwgbnVsbCA9PSB2YWwpIHtcbiAgICBpZiAodmFsKSB7XG4gICAgICByZXR1cm4gJyAnICsgKHRlcnNlID8ga2V5IDoga2V5ICsgJz1cIicgKyBrZXkgKyAnXCInKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfSBlbHNlIGlmICgwID09IGtleS5pbmRleE9mKCdkYXRhJykgJiYgJ3N0cmluZycgIT0gdHlwZW9mIHZhbCkge1xuICAgIGlmIChKU09OLnN0cmluZ2lmeSh2YWwpLmluZGV4T2YoJyYnKSAhPT0gLTEpIHtcbiAgICAgIGNvbnNvbGUud2FybignU2luY2UgSmFkZSAyLjAuMCwgYW1wZXJzYW5kcyAoYCZgKSBpbiBkYXRhIGF0dHJpYnV0ZXMgJyArXG4gICAgICAgICAgICAgICAgICAgJ3dpbGwgYmUgZXNjYXBlZCB0byBgJmFtcDtgJyk7XG4gICAgfTtcbiAgICBpZiAodmFsICYmIHR5cGVvZiB2YWwudG9JU09TdHJpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUud2FybignSmFkZSB3aWxsIGVsaW1pbmF0ZSB0aGUgZG91YmxlIHF1b3RlcyBhcm91bmQgZGF0ZXMgaW4gJyArXG4gICAgICAgICAgICAgICAgICAgJ0lTTyBmb3JtIGFmdGVyIDIuMC4wJyk7XG4gICAgfVxuICAgIHJldHVybiAnICcgKyBrZXkgKyBcIj0nXCIgKyBKU09OLnN0cmluZ2lmeSh2YWwpLnJlcGxhY2UoLycvZywgJyZhcG9zOycpICsgXCInXCI7XG4gIH0gZWxzZSBpZiAoZXNjYXBlZCkge1xuICAgIGlmICh2YWwgJiYgdHlwZW9mIHZhbC50b0lTT1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc29sZS53YXJuKCdKYWRlIHdpbGwgc3RyaW5naWZ5IGRhdGVzIGluIElTTyBmb3JtIGFmdGVyIDIuMC4wJyk7XG4gICAgfVxuICAgIHJldHVybiAnICcgKyBrZXkgKyAnPVwiJyArIGV4cG9ydHMuZXNjYXBlKHZhbCkgKyAnXCInO1xuICB9IGVsc2Uge1xuICAgIGlmICh2YWwgJiYgdHlwZW9mIHZhbC50b0lTT1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc29sZS53YXJuKCdKYWRlIHdpbGwgc3RyaW5naWZ5IGRhdGVzIGluIElTTyBmb3JtIGFmdGVyIDIuMC4wJyk7XG4gICAgfVxuICAgIHJldHVybiAnICcgKyBrZXkgKyAnPVwiJyArIHZhbCArICdcIic7XG4gIH1cbn07XG5cbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBhdHRyaWJ1dGVzIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge09iamVjdH0gZXNjYXBlZFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmF0dHJzID0gZnVuY3Rpb24gYXR0cnMob2JqLCB0ZXJzZSl7XG4gIHZhciBidWYgPSBbXTtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG5cbiAgaWYgKGtleXMubGVuZ3RoKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXVxuICAgICAgICAsIHZhbCA9IG9ialtrZXldO1xuXG4gICAgICBpZiAoJ2NsYXNzJyA9PSBrZXkpIHtcbiAgICAgICAgaWYgKHZhbCA9IGpvaW5DbGFzc2VzKHZhbCkpIHtcbiAgICAgICAgICBidWYucHVzaCgnICcgKyBrZXkgKyAnPVwiJyArIHZhbCArICdcIicpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBidWYucHVzaChleHBvcnRzLmF0dHIoa2V5LCB2YWwsIGZhbHNlLCB0ZXJzZSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWYuam9pbignJyk7XG59O1xuXG4vKipcbiAqIEVzY2FwZSB0aGUgZ2l2ZW4gc3RyaW5nIG9mIGBodG1sYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaHRtbFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxudmFyIGphZGVfZW5jb2RlX2h0bWxfcnVsZXMgPSB7XG4gICcmJzogJyZhbXA7JyxcbiAgJzwnOiAnJmx0OycsXG4gICc+JzogJyZndDsnLFxuICAnXCInOiAnJnF1b3Q7J1xufTtcbnZhciBqYWRlX21hdGNoX2h0bWwgPSAvWyY8PlwiXS9nO1xuXG5mdW5jdGlvbiBqYWRlX2VuY29kZV9jaGFyKGMpIHtcbiAgcmV0dXJuIGphZGVfZW5jb2RlX2h0bWxfcnVsZXNbY10gfHwgYztcbn1cblxuZXhwb3J0cy5lc2NhcGUgPSBqYWRlX2VzY2FwZTtcbmZ1bmN0aW9uIGphZGVfZXNjYXBlKGh0bWwpe1xuICB2YXIgcmVzdWx0ID0gU3RyaW5nKGh0bWwpLnJlcGxhY2UoamFkZV9tYXRjaF9odG1sLCBqYWRlX2VuY29kZV9jaGFyKTtcbiAgaWYgKHJlc3VsdCA9PT0gJycgKyBodG1sKSByZXR1cm4gaHRtbDtcbiAgZWxzZSByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gKiBSZS10aHJvdyB0aGUgZ2l2ZW4gYGVycmAgaW4gY29udGV4dCB0byB0aGVcbiAqIHRoZSBqYWRlIGluIGBmaWxlbmFtZWAgYXQgdGhlIGdpdmVuIGBsaW5lbm9gLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVyclxuICogQHBhcmFtIHtTdHJpbmd9IGZpbGVuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gbGluZW5vXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLnJldGhyb3cgPSBmdW5jdGlvbiByZXRocm93KGVyciwgZmlsZW5hbWUsIGxpbmVubywgc3RyKXtcbiAgaWYgKCEoZXJyIGluc3RhbmNlb2YgRXJyb3IpKSB0aHJvdyBlcnI7XG4gIGlmICgodHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyB8fCAhZmlsZW5hbWUpICYmICFzdHIpIHtcbiAgICBlcnIubWVzc2FnZSArPSAnIG9uIGxpbmUgJyArIGxpbmVubztcbiAgICB0aHJvdyBlcnI7XG4gIH1cbiAgdHJ5IHtcbiAgICBzdHIgPSBzdHIgfHwgcmVxdWlyZSgnZnMnKS5yZWFkRmlsZVN5bmMoZmlsZW5hbWUsICd1dGY4JylcbiAgfSBjYXRjaCAoZXgpIHtcbiAgICByZXRocm93KGVyciwgbnVsbCwgbGluZW5vKVxuICB9XG4gIHZhciBjb250ZXh0ID0gM1xuICAgICwgbGluZXMgPSBzdHIuc3BsaXQoJ1xcbicpXG4gICAgLCBzdGFydCA9IE1hdGgubWF4KGxpbmVubyAtIGNvbnRleHQsIDApXG4gICAgLCBlbmQgPSBNYXRoLm1pbihsaW5lcy5sZW5ndGgsIGxpbmVubyArIGNvbnRleHQpO1xuXG4gIC8vIEVycm9yIGNvbnRleHRcbiAgdmFyIGNvbnRleHQgPSBsaW5lcy5zbGljZShzdGFydCwgZW5kKS5tYXAoZnVuY3Rpb24obGluZSwgaSl7XG4gICAgdmFyIGN1cnIgPSBpICsgc3RhcnQgKyAxO1xuICAgIHJldHVybiAoY3VyciA9PSBsaW5lbm8gPyAnICA+ICcgOiAnICAgICcpXG4gICAgICArIGN1cnJcbiAgICAgICsgJ3wgJ1xuICAgICAgKyBsaW5lO1xuICB9KS5qb2luKCdcXG4nKTtcblxuICAvLyBBbHRlciBleGNlcHRpb24gbWVzc2FnZVxuICBlcnIucGF0aCA9IGZpbGVuYW1lO1xuICBlcnIubWVzc2FnZSA9IChmaWxlbmFtZSB8fCAnSmFkZScpICsgJzonICsgbGluZW5vXG4gICAgKyAnXFxuJyArIGNvbnRleHQgKyAnXFxuXFxuJyArIGVyci5tZXNzYWdlO1xuICB0aHJvdyBlcnI7XG59O1xuXG5leHBvcnRzLkRlYnVnSXRlbSA9IGZ1bmN0aW9uIERlYnVnSXRlbShsaW5lbm8sIGZpbGVuYW1lKSB7XG4gIHRoaXMubGluZW5vID0gbGluZW5vO1xuICB0aGlzLmZpbGVuYW1lID0gZmlsZW5hbWU7XG59XG5cbn0se1wiZnNcIjoyfV0sMjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cbn0se31dfSx7fSxbMV0pKDEpXG59KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBNaWtpID0gcmVxdWlyZSgnLi4vJyk7XG5cbnZhciBtaWtpID0gbmV3IE1pa2koe1xuICBzdGVwczogcmVxdWlyZSgnLi9zdGVwcycpXG59KTtcblxubWlraS5vbignc2F2ZScsIGZ1bmN0aW9uKGFuc3dlcnMpIHtcbiAgJC5hamF4KHtcbiAgICAgdXJsOiAnaHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J3SzBmcHpqNUpKckJJVlVaX25zcDFKQ01ObnRQTzBlT05NS09lMmVrcFltTzZ2RnhCeC9leGVjJyxcbiAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICBkYXRhOiBhbnN3ZXJzXG4gfSk7XG59KTtcblxubWlraS5zaG93KCk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgc3RhcnRTdGVwOiB7XG4gICAgcXVlc3Rpb246ICdIb3cgb2xkIGFyZSB5b3U/JyxcbiAgICBkZXNjOiAnU29tZSBkZXNjcmlwdGlvbicsXG4gICAgdHlwZTogJ3F1ZXN0aW9uJywgLy8gb3IgbWVzc2FnZVxuICAgIG5leHRTdGVwOiAnbmFtZVN0ZXAnLFxuICAgIGFuc3dlclR5cGU6ICdzaW5nbGVDaG9pY2UnLFxuICAgIHJhbmRvbWl6ZTogdHJ1ZSxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHRpdGxlOiAnPDE4JyxcbiAgICAgICAgbmV4dFN0ZXA6ICd0b29Zb3VuZ1N0ZXAnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0aXRsZTogJzE4LTMwJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdGl0bGU6ICc+MzAnLFxuICAgICAgICBjb21tZW50VHlwZTogJ211bHRpbGluZSdcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIG5hbWVTdGVwOiB7XG4gICAgcXVlc3Rpb246ICdXaGF0IGlzIHlvdXIgbmFtZT8nLFxuICAgIHR5cGU6ICdxdWVzdGlvbicsXG4gICAgYW5zd2VyVHlwZTogJ3RleHQnLFxuICAgIG5leHRTdGVwOiAnbW92aWVzU3RlcCdcbiAgfSxcbiAgbW92aWVzU3RlcDoge1xuICAgIHF1ZXN0aW9uOiAnV2hhdCBtb3ZpZXMgZG8geW91IGxpa2U/JyxcbiAgICB0eXBlOiAncXVlc3Rpb24nLFxuICAgIGFuc3dlclR5cGU6ICdtdWx0aUNob2ljZScsXG4gICAgbmV4dFN0ZXA6ICdhYm91dFN0ZXAnLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdGl0bGU6ICdIb3Jyb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0aXRsZTogJ0FjdGlvbidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRpdGxlOiAnQ29tZWR5J1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAgYWJvdXRTdGVwOiB7XG4gICAgdHlwZTogJ3F1ZXN0aW9uJyxcbiAgICBxdWVzdGlvbjogJ1RlbGwgYWJvdXQgeW91cnNlbGYnLFxuICAgIGFuc3dlclR5cGU6ICdtdWx0aWxpbmVUZXh0JyxcbiAgICBuZXh0U3RlcDogJ3RoYW5rWW91U3RlcCdcbiAgfSxcbiAgdGhhbmtZb3VTdGVwOiB7XG4gICAgdHlwZTogJ21lc3NhZ2UnLFxuICAgIG1lc3NhZ2U6ICdUaGFuayB5b3UhJ1xuICB9LFxuICB0b29Zb3VuZ1N0ZXA6IHtcbiAgICB0eXBlOiAnbWVzc2FnZScsXG4gICAgbWVzc2FnZTogJ1lvdVxcJ3JlIHRvbyB5b3VuZyBmb3IgdGhpcyBzdXJ2ZXknXG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgc3VydmV5VGVtcGxhdGUgPSByZXF1aXJlKCcuL3ZpZXdzL3N1cnZleS5qYWRlJyk7XHJcbnZhciBzdGVwVGVtcGxhdGUgPSByZXF1aXJlKCcuL3ZpZXdzL3N0ZXAuamFkZScpO1xyXG5cclxudmFyIEVtaXR0ZXIgPSByZXF1aXJlKCdicm93c2VyLWVtaXR0ZXInKTtcclxuXHJcbmZ1bmN0aW9uIE1pa2kob3B0cykge1xyXG4gIG9wdHMgPSBvcHRzIHx8IHt9O1xyXG5cclxuICBpZiAoIW9wdHMuc3RlcHMpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignb3B0cy5zdGVwcyBpcyByZXF1aXJlZCcpO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5fc3RlcHMgPSBvcHRzLnN0ZXBzO1xyXG5cclxuICB0aGlzLl9lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcclxuXHJcbiAgdGhpcy5fcmVzcG9uc2VzID0ge307XHJcbn1cclxuXHJcbk1pa2kucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbigpIHtcclxuICAkKCdib2R5JykuYXBwZW5kKHN1cnZleVRlbXBsYXRlKCkpO1xyXG4gIHRoaXMuJCRzdXJ2ZXlCb3ggPSAkKCcubWlraScpO1xyXG4gIHRoaXMuJCRzdGVwQ29udGFpbmVyID0gJCgnLm1pa2kgLmJvZHknKTtcclxuICB0aGlzLmdvdG9TdGVwKHRoaXMuX3N0ZXBzLnN0YXJ0U3RlcCk7XHJcblxyXG4gIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgJCgnLmNsb3NlJywgdGhpcy4kJHN1cnZleUJveCkuY2xpY2soZnVuY3Rpb24oKSB7XHJcbiAgICBfdGhpcy50b2dnbGUoKTtcclxuICB9KTtcclxufTtcclxuXHJcbk1pa2kucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLiQkc3VydmV5Qm94LmhpZGUoKTtcclxufTtcclxuXHJcbk1pa2kucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKCkge1xyXG4gIGlmICh0aGlzLl9pc01pbmltaXplZCkge1xyXG4gICAgdGhpcy5tYXhpbWl6ZSgpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICB0aGlzLm1pbmltaXplKCk7XHJcbn07XHJcblxyXG5NaWtpLnByb3RvdHlwZS5tYXhpbWl6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgdGhpcy4kJHN1cnZleUJveC5hbmltYXRlKHtcclxuICAgIGJvdHRvbTogJzBweCdcclxuICB9LCBmdW5jdGlvbigpIHtcclxuICAgIF90aGlzLl9pc01pbmltaXplZCA9IGZhbHNlO1xyXG4gICAgX3RoaXMuJCRzdXJ2ZXlCb3gucmVtb3ZlQ2xhc3MoJ21pbmltaXplZCcpO1xyXG4gICAgX3RoaXMuX2VtaXR0ZXIuZW1pdCgnbWF4aW1pemUnKTtcclxuICAgIF90aGlzLmZvY3VzKCk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5NaWtpLnByb3RvdHlwZS5taW5pbWl6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgdGhpcy4kJHN1cnZleUJveC5hbmltYXRlKHtcclxuICAgIGJvdHRvbTogLSh0aGlzLiQkc3VydmV5Qm94LmhlaWdodCgpIC0gMjApICsgJ3B4J1xyXG4gIH0sIGZ1bmN0aW9uKCkge1xyXG4gICAgX3RoaXMuX2lzTWluaW1pemVkID0gdHJ1ZTtcclxuICAgIF90aGlzLiQkc3VydmV5Qm94LmFkZENsYXNzKCdtaW5pbWl6ZWQnKTtcclxuICAgIF90aGlzLl9lbWl0dGVyLmVtaXQoJ21pbmltaXplJyk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5NaWtpLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKGV2ZW50LCBjYikge1xyXG4gIHRoaXMuX2VtaXR0ZXIub24oZXZlbnQsIGNiKTtcclxufTtcclxuXHJcbk1pa2kucHJvdG90eXBlLmZvY3VzID0gZnVuY3Rpb24oKSB7XHJcbiAgaWYgKHRoaXMuX2N1cnJlbnRTdGVwLmFuc3dlclR5cGUgPT09ICd0ZXh0Jykge1xyXG4gICAgJCgnaW5wdXQnLCB0aGlzLiQkc3RlcENvbnRhaW5lcikuZm9jdXMoKTtcclxuICB9IGVsc2UgaWYgKHRoaXMuX2N1cnJlbnRTdGVwLmFuc3dlclR5cGUgPT09ICdtdWx0aWxpbmVUZXh0Jykge1xyXG4gICAgJCgndGV4dGFyZWEnLCB0aGlzLiQkc3RlcENvbnRhaW5lcikuZm9jdXMoKTtcclxuICB9XHJcbn07XHJcblxyXG5NaWtpLnByb3RvdHlwZS5nb3RvU3RlcCA9IGZ1bmN0aW9uKHN0ZXApIHtcclxuICB0aGlzLiQkc3RlcENvbnRhaW5lci5odG1sKHN0ZXBUZW1wbGF0ZShzdGVwKSk7XHJcblxyXG4gIHRoaXMuX2N1cnJlbnRTdGVwID0gc3RlcDtcclxuXHJcbiAgdmFyIF90aGlzID0gdGhpcztcclxuICAkKCcubWlraSBidXR0b24nKS5jbGljayhmdW5jdGlvbigpIHtcclxuICAgIF90aGlzLl9uZXh0KCk7XHJcbiAgfSk7XHJcblxyXG4gIHRoaXMuZm9jdXMoKTtcclxufTtcclxuXHJcbk1pa2kucHJvdG90eXBlLl9nZXRBbnN3ZXIgPSBmdW5jdGlvbigpIHtcclxuICBzd2l0Y2ggKHRoaXMuX2N1cnJlbnRTdGVwLmFuc3dlclR5cGUpIHtcclxuICAgIGNhc2UgJ3NpbmdsZUNob2ljZSc6XHJcbiAgICAgIHJldHVybiAkKCcubWlraSBpbnB1dDpjaGVja2VkJykudmFsKCk7XHJcbiAgICBjYXNlICdtdWx0aUNob2ljZSc6XHJcbiAgICAgIHZhciByZXNwb25zZXMgPSBbXTtcclxuICAgICAgJCgnLm1pa2kgaW5wdXQ6Y2hlY2tlZCcpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmVzcG9uc2VzLnB1c2goJCh0aGlzKS52YWwoKSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gcmVzcG9uc2VzLmpvaW4oJywnKTtcclxuICAgIGNhc2UgJ3RleHQnOlxyXG4gICAgICByZXR1cm4gJCgnLm1pa2kgaW5wdXRbdHlwZT10ZXh0XScpLnZhbCgpO1xyXG4gICAgY2FzZSAnbXVsdGlsaW5lVGV4dCc6XHJcbiAgICAgIHJldHVybiAkKCcubWlraSB0ZXh0YXJlYScpLnZhbCgpO1xyXG4gIH1cclxufTtcclxuXHJcbk1pa2kucHJvdG90eXBlLl9zZW5kRGF0YSA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMuX2VtaXR0ZXIuZW1pdCgnc2F2ZScsIHRoaXMuX3Jlc3BvbnNlcyk7XHJcbn07XHJcblxyXG5NaWtpLnByb3RvdHlwZS5fbmV4dCA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBhbnN3ZXIgPSB0aGlzLl9nZXRBbnN3ZXIoKTtcclxuXHJcbiAgaWYgKCFhbnN3ZXIpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIHRoaXMuX3Jlc3BvbnNlc1t0aGlzLl9jdXJyZW50U3RlcC5xdWVzdGlvbl0gPSBhbnN3ZXI7XHJcblxyXG4gIHZhciBuZXh0U3RlcE5hbWUgPSB0aGlzLl9jdXJyZW50U3RlcC5uZXh0U3RlcDtcclxuICBpZiAodGhpcy5fY3VycmVudFN0ZXAuYW5zd2VyVHlwZSA9PT0gJ3NpbmdsZUNob2ljZScpIHtcclxuICAgIG5leHRTdGVwTmFtZSA9ICQoJy5taWtpIGlucHV0OmNoZWNrZWQnKVxyXG4gICAgICAuYXR0cignZGF0YS1uZXh0LXN0ZXAnKSB8fCBuZXh0U3RlcE5hbWU7XHJcbiAgfVxyXG5cclxuICB2YXIgbmV4dFN0ZXAgPSB0aGlzLl9zdGVwc1tuZXh0U3RlcE5hbWVdO1xyXG4gIHRoaXMuZ290b1N0ZXAobmV4dFN0ZXApO1xyXG4gIGlmIChuZXh0U3RlcC50eXBlID09PSAnbWVzc2FnZScpIHtcclxuICAgIC8qIFRPRE86IHNlbmQgdGhlIGRhdGEgYWxzbyBpZiB0aGUgdXNlciBkb2Vzbid0XHJcbiAgICAgKiBhbnN3ZXIgdG8gYWxsIHRoZSBxdWVzdGlvbnMgKi9cclxuICAgIHRoaXMuX3NlbmREYXRhKCk7XHJcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgX3RoaXMuaGlkZSgpO1xyXG4gICAgfSwgNTAwMCk7XHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNaWtpO1xyXG4iLCIvKipcbiAqIFticm93c2VyLWVtaXR0ZXItanNdIEVtaXR0ZXIuanNcbiAqIENvcHlyaWdodCAoYykgMjAxMyBZb3NoaXRha2EgU2FrYW1vdG8gPGJyaWxsaWFudHBlbmd1aW5AZ21haWwuY29tPiBcbiAqIFNlZSBsaWNlbnNlOiBodHRwczovL2dpdGh1Yi5jb20veXN0c2ttL2Jyb3dzZXItZW1pdHRlci1qcy9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cbihmdW5jdGlvbihoYXNfd2luLCBoYXNfbW9kKSB7XG5cbiAgdmFyIGV4cG9ydHM7XG4gIGlmKGhhc193aW4pIHtcbiAgICAvLyBicm93c2VyLCBlbXVsYXRlZCB3aW5kb3dcbiAgICBleHBvcnRzID0gd2luZG93O1xuICB9IGVsc2Uge1xuICAgIC8vIHJhdyBOb2RlLmpzLCB3ZWItd29ya2VyXG4gICAgZXhwb3J0cyA9IHR5cGVvZiBzZWxmID09ICd1bmRlZmluZWQnID8gdGhpczogc2VsZjtcbiAgfVxuXG4gIGhhc19tb2QgJiYgKG1vZHVsZS5leHBvcnRzID0gRW1pdHRlcik7XG4gIGV4cG9ydHMuRW1pdHRlciA9IEVtaXR0ZXI7XG5cbiAgZnVuY3Rpb24gRW1pdHRlcigpIHtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgfVxuXG4gIHZhciBFbWl0dGVyUHJvcHMgPSB7XG4gICAgaW5oZXJpdHM6IGluaGVyaXRzXG4gIH07XG4gIGZvciggdmFyIGkgaW4gRW1pdHRlclByb3BzKVxuICAgIEVtaXR0ZXJbaV0gPSBFbWl0dGVyUHJvcHNbaV07XG5cbiAgdmFyIEVtaXR0ZXJQcm90b3MgPSB7XG4gICAgb246IG9uLFxuICAgIG9mZjogb2ZmLFxuICAgIG9uY2U6IG9uY2UsXG4gICAgZW1pdDogZW1pdCxcbiAgICBsaXN0ZW5lcnM6IGxpc3RlbmVyc1xuICB9O1xuICBmb3IoIHZhciBpIGluIEVtaXR0ZXJQcm90b3MpXG4gICAgRW1pdHRlci5wcm90b3R5cGVbaV0gPSBfd3JhcChFbWl0dGVyUHJvdG9zW2ldKTtcblxuICBmdW5jdGlvbiBvbih0eXBlLCBhcmdzKSB7XG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2goe1xuICAgICAgZm46IGFyZ3NbMF1cbiAgICB9KTsgLy8gVE9ETyBtb3JlIG9wdGlvbnNcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uY2UodHlwZSwgYXJncykge1xuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKHtcbiAgICAgIGZuOiBhcmdzWzBdLFxuICAgICAgb25jZTogdHJ1ZVxuICAgIH0pOyAvLyBUT0RPIG1vcmUgb3B0aW9uc1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZnVuY3Rpb24gb2ZmKHR5cGUsIGFyZ3MpIHtcblxuICAgIHZhciBzZWxmID0gdGhpcywgc3BsaWNlX3BvcyA9IDA7XG4gICAgdmFyIGV2dHMgPSB0aGlzLl9ldmVudHM7XG4gICAgaWYodHlwZSA9PSBudWxsKSB7XG4gICAgICBmb3IoIHZhciBpIGluIGV2dHMpXG4gICAgICAgIGRlbGV0ZSBldnRzW2ldO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgd2hpbGUoc3BsaWNlX3BvcyA8IGV2dHNbdHlwZV0ubGVuZ3RoKSB7XG4gICAgICB2YXIgc3RhdCA9IGV2dHNbdHlwZV1bc3BsaWNlX3Bvc107XG4gICAgICB0eXBlb2YgYXJnc1swXSAhPSAnZnVuY3Rpb24nIHx8IGFyZ3NbMF0gPT09IHN0YXQuZm4gPyAoZnVuY3Rpb24oKSB7XG4gICAgICAgIGV2dHNbdHlwZV0uc3BsaWNlKHNwbGljZV9wb3MsIDEpO1xuICAgICAgfSkoKTogc3BsaWNlX3BvcysrO1xuICAgIH1cblxuICAgIGlmKGV2dHNbdHlwZV0pIHtcbiAgICAgIC8vIG9jY2FzaW9uYWxseSBhbHJlYWR5IGRlbGV0ZWQgKGFub3RoZXIgLm9mZigpIGNhbGxlZClcbiAgICAgIGV2dHNbdHlwZV0ubGVuZ3RoID09IDAgJiYgZGVsZXRlIGV2dHNbdHlwZV07XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuXG4gIH1cblxuICBmdW5jdGlvbiBlbWl0KHR5cGUsIGFyZ3MpIHtcblxuICAgIHZhciBlbWl0dGVyID0gdGhpcywgc3BsaWNlX3BvcyA9IDA7XG4gICAgdmFyIGV2dHMgPSBlbWl0dGVyLl9ldmVudHMsIGhhbmRsZXJzID0gW107XG5cbiAgICAvLyBlbWl0IGV2ZW50IG9jY2FzaW9uYWxseSBvZmYgYWxsIHR5cGUgb2YgZXZlbnRzXG4gICAgd2hpbGUoZXZ0c1t0eXBlXSAmJiBzcGxpY2VfcG9zIDwgZXZ0c1t0eXBlXS5sZW5ndGgpIHtcbiAgICAgIHZhciBzdGF0ID0gZXZ0c1t0eXBlXVtzcGxpY2VfcG9zXTtcbiAgICAgIGhhbmRsZXJzLnB1c2goc3RhdC5mbiksIHN0YXQub25jZSA/IChmdW5jdGlvbigpIHtcbiAgICAgICAgZXZ0c1t0eXBlXS5zcGxpY2Uoc3BsaWNlX3BvcywgMSk7XG4gICAgICB9KSgpOiBzcGxpY2VfcG9zKys7XG4gICAgfVxuXG4gICAgaWYoZXZ0c1t0eXBlXSkge1xuICAgICAgLy8gb2NjYXNpb25hbGx5IGFscmVhZHkgZGVsZXRlZCAoLm9mZigpIGNhbGxlZClcbiAgICAgIGV2dHNbdHlwZV0ubGVuZ3RoIHx8IGRlbGV0ZSBldnRzW3R5cGVdO1xuICAgIH1cblxuICAgIGhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24oZm4pIHtcbiAgICAgIGZuLmFwcGx5KGVtaXR0ZXIsIGFyZ3MpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGVtaXR0ZXI7XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIGxpc3RlbmVycyh0eXBlKSB7XG4gICAgcmV0dXJuIHR5cGUgPT0gbnVsbCA/IHRoaXMuX2V2ZW50czogdGhpcy5fZXZlbnRzW3R5cGVdO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5oZXJpdHMoU3VwZXIpIHtcbiAgICBmb3IoIHZhciBpIGluIEVtaXR0ZXIucHJvdG90eXBlKVxuICAgICAgU3VwZXIucHJvdG90eXBlW2ldID0gRW1pdHRlci5wcm90b3R5cGVbaV07XG4gIH1cblxuICBmdW5jdGlvbiBfd3JhcChmbikge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSwgdHlwZSA9IGFyZ3Muc2hpZnQoKTtcbiAgICAgICFBcnJheS5pc0FycmF5KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgKHRoaXMuX2V2ZW50c1t0eXBlXSA9IFtdKTtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIHR5cGUsIGFyZ3MpO1xuICAgIH07XG4gIH1cblxufSkuY2FsbCh0aGlzLCB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnLCB0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnKTtcbiIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGFuc3dlclR5cGUsIGFuc3dlcnMsIGJ1dHRvbkxhYmVsLCBsYWJlbCwgbWVzc2FnZSwgcXVlc3Rpb24sIHR5cGUsIHVuZGVmaW5lZCkge1xuYnVmLnB1c2goXCI8ZGl2XCIgKyAoamFkZS5jbHMoWydzdGVwJywoYW5zd2VyVHlwZSB8fCAnJyldLCBbbnVsbCx0cnVlXSkpICsgXCI+XCIpO1xuc3dpdGNoICh0eXBlKXtcbmNhc2UgJ21lc3NhZ2UnOlxuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJtZXNzYWdlXFxcIj5cIiArIChudWxsID09IChqYWRlX2ludGVycCA9IG1lc3NhZ2UpID8gXCJcIiA6IGphZGVfaW50ZXJwKSArIFwiPC9kaXY+XCIpO1xuICBicmVhaztcbmNhc2UgJ3F1ZXN0aW9uJzpcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwicXVlc3Rpb25cXFwiPlwiICsgKG51bGwgPT0gKGphZGVfaW50ZXJwID0gcXVlc3Rpb24pID8gXCJcIiA6IGphZGVfaW50ZXJwKSArIFwiPC9kaXY+XCIpO1xuc3dpdGNoIChhbnN3ZXJUeXBlKXtcbmNhc2UgJ211bHRpQ2hvaWNlJzpcbi8vIGl0ZXJhdGUgYW5zd2Vyc1xuOyhmdW5jdGlvbigpe1xuICB2YXIgJCRvYmogPSBhbnN3ZXJzO1xuICBpZiAoJ251bWJlcicgPT0gdHlwZW9mICQkb2JqLmxlbmd0aCkge1xuXG4gICAgZm9yICh2YXIgJGluZGV4ID0gMCwgJCRsID0gJCRvYmoubGVuZ3RoOyAkaW5kZXggPCAkJGw7ICRpbmRleCsrKSB7XG4gICAgICB2YXIgYW5zd2VyID0gJCRvYmpbJGluZGV4XTtcblxuYnVmLnB1c2goXCI8bGFiZWwgY2xhc3M9XFxcImFuc3dlclxcXCI+PGlucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIlwiICsgKGphZGUuYXR0cihcInZhbHVlXCIsIGFuc3dlci50aXRsZSwgdHJ1ZSwgZmFsc2UpKSArIFwiLz5cIiArIChudWxsID09IChqYWRlX2ludGVycCA9IGFuc3dlci50aXRsZSkgPyBcIlwiIDogamFkZV9pbnRlcnApICsgXCI8L2xhYmVsPlwiKTtcbiAgICB9XG5cbiAgfSBlbHNlIHtcbiAgICB2YXIgJCRsID0gMDtcbiAgICBmb3IgKHZhciAkaW5kZXggaW4gJCRvYmopIHtcbiAgICAgICQkbCsrOyAgICAgIHZhciBhbnN3ZXIgPSAkJG9ialskaW5kZXhdO1xuXG5idWYucHVzaChcIjxsYWJlbCBjbGFzcz1cXFwiYW5zd2VyXFxcIj48aW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiXCIgKyAoamFkZS5hdHRyKFwidmFsdWVcIiwgYW5zd2VyLnRpdGxlLCB0cnVlLCBmYWxzZSkpICsgXCIvPlwiICsgKG51bGwgPT0gKGphZGVfaW50ZXJwID0gYW5zd2VyLnRpdGxlKSA/IFwiXCIgOiBqYWRlX2ludGVycCkgKyBcIjwvbGFiZWw+XCIpO1xuICAgIH1cblxuICB9XG59KS5jYWxsKHRoaXMpO1xuXG4gIGJyZWFrO1xuY2FzZSAnc2luZ2xlQ2hvaWNlJzpcbi8vIGl0ZXJhdGUgYW5zd2Vyc1xuOyhmdW5jdGlvbigpe1xuICB2YXIgJCRvYmogPSBhbnN3ZXJzO1xuICBpZiAoJ251bWJlcicgPT0gdHlwZW9mICQkb2JqLmxlbmd0aCkge1xuXG4gICAgZm9yICh2YXIgJGluZGV4ID0gMCwgJCRsID0gJCRvYmoubGVuZ3RoOyAkaW5kZXggPCAkJGw7ICRpbmRleCsrKSB7XG4gICAgICB2YXIgYW5zd2VyID0gJCRvYmpbJGluZGV4XTtcblxuYnVmLnB1c2goXCI8bGFiZWwgY2xhc3M9XFxcImFuc3dlclxcXCI+PGlucHV0IHR5cGU9XFxcInJhZGlvXFxcIiBuYW1lPVxcXCJhbnN3ZXJcXFwiXCIgKyAoamFkZS5hdHRyKFwidmFsdWVcIiwgYW5zd2VyLnRpdGxlLCB0cnVlLCBmYWxzZSkpICsgKGphZGUuYXR0cihcImRhdGEtbmV4dC1zdGVwXCIsIGFuc3dlci5uZXh0U3RlcCwgdHJ1ZSwgZmFsc2UpKSArIFwiLz5cIiArIChudWxsID09IChqYWRlX2ludGVycCA9IGFuc3dlci50aXRsZSkgPyBcIlwiIDogamFkZV9pbnRlcnApICsgXCI8L2xhYmVsPlwiKTtcbiAgICB9XG5cbiAgfSBlbHNlIHtcbiAgICB2YXIgJCRsID0gMDtcbiAgICBmb3IgKHZhciAkaW5kZXggaW4gJCRvYmopIHtcbiAgICAgICQkbCsrOyAgICAgIHZhciBhbnN3ZXIgPSAkJG9ialskaW5kZXhdO1xuXG5idWYucHVzaChcIjxsYWJlbCBjbGFzcz1cXFwiYW5zd2VyXFxcIj48aW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIG5hbWU9XFxcImFuc3dlclxcXCJcIiArIChqYWRlLmF0dHIoXCJ2YWx1ZVwiLCBhbnN3ZXIudGl0bGUsIHRydWUsIGZhbHNlKSkgKyAoamFkZS5hdHRyKFwiZGF0YS1uZXh0LXN0ZXBcIiwgYW5zd2VyLm5leHRTdGVwLCB0cnVlLCBmYWxzZSkpICsgXCIvPlwiICsgKG51bGwgPT0gKGphZGVfaW50ZXJwID0gYW5zd2VyLnRpdGxlKSA/IFwiXCIgOiBqYWRlX2ludGVycCkgKyBcIjwvbGFiZWw+XCIpO1xuICAgIH1cblxuICB9XG59KS5jYWxsKHRoaXMpO1xuXG4gIGJyZWFrO1xuY2FzZSAndGV4dCc6XG5idWYucHVzaCgobnVsbCA9PSAoamFkZV9pbnRlcnAgPSBsYWJlbCkgPyBcIlwiIDogamFkZV9pbnRlcnApICsgXCI8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIvPlwiKTtcbiAgYnJlYWs7XG5jYXNlICdtdWx0aWxpbmVUZXh0JzpcbmJ1Zi5wdXNoKChudWxsID09IChqYWRlX2ludGVycCA9IGxhYmVsKSA/IFwiXCIgOiBqYWRlX2ludGVycCkgKyBcIjx0ZXh0YXJlYT48L3RleHRhcmVhPlwiKTtcbiAgYnJlYWs7XG59XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcImZvb3RlclxcXCI+PGJ1dHRvbj5cIiArIChudWxsID09IChqYWRlX2ludGVycCA9IGJ1dHRvbkxhYmVsIHx8ICdTZW5kJykgPyBcIlwiIDogamFkZV9pbnRlcnApICsgXCI8L2J1dHRvbj48L2Rpdj5cIik7XG4gIGJyZWFrO1xufVxuYnVmLnB1c2goXCI8L2Rpdj5cIik7fS5jYWxsKHRoaXMsXCJhbnN3ZXJUeXBlXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5hbnN3ZXJUeXBlOnR5cGVvZiBhbnN3ZXJUeXBlIT09XCJ1bmRlZmluZWRcIj9hbnN3ZXJUeXBlOnVuZGVmaW5lZCxcImFuc3dlcnNcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmFuc3dlcnM6dHlwZW9mIGFuc3dlcnMhPT1cInVuZGVmaW5lZFwiP2Fuc3dlcnM6dW5kZWZpbmVkLFwiYnV0dG9uTGFiZWxcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmJ1dHRvbkxhYmVsOnR5cGVvZiBidXR0b25MYWJlbCE9PVwidW5kZWZpbmVkXCI/YnV0dG9uTGFiZWw6dW5kZWZpbmVkLFwibGFiZWxcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmxhYmVsOnR5cGVvZiBsYWJlbCE9PVwidW5kZWZpbmVkXCI/bGFiZWw6dW5kZWZpbmVkLFwibWVzc2FnZVwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgubWVzc2FnZTp0eXBlb2YgbWVzc2FnZSE9PVwidW5kZWZpbmVkXCI/bWVzc2FnZTp1bmRlZmluZWQsXCJxdWVzdGlvblwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgucXVlc3Rpb246dHlwZW9mIHF1ZXN0aW9uIT09XCJ1bmRlZmluZWRcIj9xdWVzdGlvbjp1bmRlZmluZWQsXCJ0eXBlXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC50eXBlOnR5cGVvZiB0eXBlIT09XCJ1bmRlZmluZWRcIj90eXBlOnVuZGVmaW5lZCxcInVuZGVmaW5lZFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudW5kZWZpbmVkOnR5cGVvZiB1bmRlZmluZWQhPT1cInVuZGVmaW5lZFwiP3VuZGVmaW5lZDp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcblxuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJtaWtpXFxcIj48ZGl2IGNsYXNzPVxcXCJjbG9zZVxcXCI+PC9kaXY+PGRpdiBjbGFzcz1cXFwiYm9keVxcXCI+PC9kaXY+PC9kaXY+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyJdfQ==
