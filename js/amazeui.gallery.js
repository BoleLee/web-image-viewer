/**
  * amazeui定制：Web组件 galary
  * 改写标记: // @modified
  *          1. zoom image container: 使大图预览的区域宽高为屏幕宽高
  *          2. big images src: get big images src from data-rel or lazyload images or src
  *          3. reset image: reset image scale and offset when slide activate
  *          4. actions toolbar: let actions toolbar always display
  *          5. big image extra text: get some extra info to display when preview a big image
  *          // TODO 图片切换滑动边界保护（图片放大状态可移动时）
  *
  * Author: BoleLee(964624188@qq.com)
  * Date: 2017-04-06
  *
  */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jquery"));
	else if(typeof define === 'function' && define.amd)
		define(["jquery"], factory);
	else if(typeof exports === 'object')
		exports["AMUI"] = factory(require("jquery"));
	else
		root["AMUI"] = factory(root["jQuery"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(1);
	__webpack_require__(3);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(2);

	if (typeof $ === 'undefined') {
	  throw new Error('Amaze UI 2.x requires jQuery :-(\n' +
	  '\u7231\u4e0a\u4e00\u5339\u91ce\u9a6c\uff0c\u53ef\u4f60' +
	  '\u7684\u5bb6\u91cc\u6ca1\u6709\u8349\u539f\u2026');
	}

	var UI = $.AMUI || {};
	var $win = $(window);
	var doc = window.document;
	var $html = $('html');

	UI.VERSION = '{{VERSION}}';

	UI.support = {};

	UI.support.transition = (function() {
	  var transitionEnd = (function() {
	    // https://developer.mozilla.org/en-US/docs/Web/Events/transitionend#Browser_compatibility
	    var element = doc.body || doc.documentElement;
	    var transEndEventNames = {
	      WebkitTransition: 'webkitTransitionEnd',
	      MozTransition: 'transitionend',
	      OTransition: 'oTransitionEnd otransitionend',
	      transition: 'transitionend'
	    };

	    for (var name in transEndEventNames) {
	      if (element.style[name] !== undefined) {
	        return transEndEventNames[name];
	      }
	    }
	  })();

	  return transitionEnd && {end: transitionEnd};
	})();

	UI.support.animation = (function() {
	  var animationEnd = (function() {
	    var element = doc.body || doc.documentElement;
	    var animEndEventNames = {
	      WebkitAnimation: 'webkitAnimationEnd',
	      MozAnimation: 'animationend',
	      OAnimation: 'oAnimationEnd oanimationend',
	      animation: 'animationend'
	    };

	    for (var name in animEndEventNames) {
	      if (element.style[name] !== undefined) {
	        return animEndEventNames[name];
	      }
	    }
	  })();

	  return animationEnd && {end: animationEnd};
	})();

	/* eslint-disable dot-notation */
	UI.support.touch = (
	('ontouchstart' in window &&
	navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
	(window.DocumentTouch && document instanceof window.DocumentTouch) ||
	(window.navigator['msPointerEnabled'] &&
	window.navigator['msMaxTouchPoints'] > 0) || // IE 10
	(window.navigator['pointerEnabled'] &&
	window.navigator['maxTouchPoints'] > 0) || // IE >=11
	false);
	/* eslint-enable dot-notation */

	// https://developer.mozilla.org/zh-CN/docs/DOM/MutationObserver
	UI.support.mutationobserver = (window.MutationObserver ||
	window.WebKitMutationObserver || null);

	// https://github.com/Modernizr/Modernizr/blob/924c7611c170ef2dc502582e5079507aff61e388/feature-detects/forms/validation.js#L20
	UI.support.formValidation = (typeof document.createElement('form').
	  checkValidity === 'function');

	UI.utils = {};

	/**
	 * Debounce function
	 *
	 * @param {function} func  Function to be debounced
	 * @param {number} wait Function execution threshold in milliseconds
	 * @param {bool} immediate  Whether the function should be called at
	 *                          the beginning of the delay instead of the
	 *                          end. Default is false.
	 * @description Executes a function when it stops being invoked for n seconds
	 * @see  _.debounce() http://underscorejs.org
	 */
	UI.utils.debounce = function(func, wait, immediate) {
	  var timeout;
	  return function() {
	    var context = this;
	    var args = arguments;
	    var later = function() {
	      timeout = null;
	      if (!immediate) {
	        func.apply(context, args);
	      }
	    };
	    var callNow = immediate && !timeout;

	    clearTimeout(timeout);
	    timeout = setTimeout(later, wait);

	    if (callNow) {
	      func.apply(context, args);
	    }
	  };
	};

	UI.utils.isInView = function(element, options) {
	  var $element = $(element);
	  var visible = !!($element.width() || $element.height()) &&
	    $element.css('display') !== 'none';

	  if (!visible) {
	    return false;
	  }

	  var windowLeft = $win.scrollLeft();
	  var windowTop = $win.scrollTop();
	  var offset = $element.offset();
	  var left = offset.left;
	  var top = offset.top;

	  options = $.extend({topOffset: 0, leftOffset: 0}, options);

	  return (top + $element.height() >= windowTop &&
	  top - options.topOffset <= windowTop + $win.height() &&
	  left + $element.width() >= windowLeft &&
	  left - options.leftOffset <= windowLeft + $win.width());
	};

	UI.utils.parseOptions = UI.utils.options = function(string) {
	  if ($.isPlainObject(string)) {
	    return string;
	  }

	  var start = (string ? string.indexOf('{') : -1);
	  var options = {};

	  if (start != -1) {
	    try {
	      options = (new Function('',
	        'var json = ' + string.substr(start) +
	        '; return JSON.parse(JSON.stringify(json));'))();
	    } catch (e) {
	    }
	  }

	  return options;
	};

	UI.utils.generateGUID = function(namespace) {
	  var uid = namespace + '-' || 'am-';

	  do {
	    uid += Math.random().toString(36).substring(2, 7);
	  } while (document.getElementById(uid));

	  return uid;
	};

	// @see https://davidwalsh.name/get-absolute-url
	UI.utils.getAbsoluteUrl = (function() {
	  var a;

	  return function(url) {
	    if (!a) {
	      a = document.createElement('a');
	    }

	    a.href = url;

	    return a.href;
	  };
	})();

	/**
	 * Plugin AMUI Component to jQuery
	 *
	 * @param {String} name - plugin name
	 * @param {Function} Component - plugin constructor
	 * @param {Object} [pluginOption]
	 * @param {String} pluginOption.dataOptions
	 * @param {Function} pluginOption.methodCall - custom method call
	 * @param {Function} pluginOption.before
	 * @param {Function} pluginOption.after
	 * @since v2.4.1
	 */
	UI.plugin = function UIPlugin(name, Component, pluginOption) {
	  var old = $.fn[name];
	  pluginOption = pluginOption || {};

	  $.fn[name] = function(option) {
	    var allArgs = Array.prototype.slice.call(arguments, 0);
	    var args = allArgs.slice(1);
	    var propReturn;
	    var $set = this.each(function() {
	      var $this = $(this);
	      var dataName = 'amui.' + name;
	      var dataOptionsName = pluginOption.dataOptions || ('data-am-' + name);
	      var instance = $this.data(dataName);
	      var options = $.extend({},
	        UI.utils.parseOptions($this.attr(dataOptionsName)),
	        typeof option === 'object' && option);

	      if (!instance && option === 'destroy') {
	        return;
	      }

	      if (!instance) {
	        $this.data(dataName, (instance = new Component(this, options)));
	      }

	      // custom method call
	      if (pluginOption.methodCall) {
	        pluginOption.methodCall.call($this, allArgs, instance);
	      } else {
	        // before method call
	        pluginOption.before &&
	        pluginOption.before.call($this, allArgs, instance);

	        if (typeof option === 'string') {
	          propReturn = typeof instance[option] === 'function' ?
	            instance[option].apply(instance, args) : instance[option];
	        }

	        // after method call
	        pluginOption.after && pluginOption.after.call($this, allArgs, instance);
	      }
	    });

	    return (propReturn === undefined) ? $set : propReturn;
	  };

	  $.fn[name].Constructor = Component;

	  // no conflict
	  $.fn[name].noConflict = function() {
	    $.fn[name] = old;
	    return this;
	  };

	  UI[name] = Component;
	};

	// http://blog.alexmaccaw.com/css-transitions
	$.fn.emulateTransitionEnd = function(duration) {
	  var called = false;
	  var $el = this;

	  $(this).one(UI.support.transition.end, function() {
	    called = true;
	  });

	  var callback = function() {
	    if (!called) {
	      $($el).trigger(UI.support.transition.end);
	    }
	    $el.transitionEndTimmer = undefined;
	  };
	  this.transitionEndTimmer = setTimeout(callback, duration);
	  return this;
	};

	$.fn.redraw = function() {
	  return this.each(function() {
	    /* eslint-disable */
	    var redraw = this.offsetHeight;
	    /* eslint-enable */
	  });
	};

	$.fn.transitionEnd = function(callback) {
	  var endEvent = UI.support.transition.end;
	  var dom = this;

	  function fireCallBack(e) {
	    callback.call(this, e);
	    endEvent && dom.off(endEvent, fireCallBack);
	  }

	  if (callback && endEvent) {
	    dom.on(endEvent, fireCallBack);
	  }

	  return this;
	};

	$.fn.removeClassRegEx = function() {
	  return this.each(function(regex) {
	    var classes = $(this).attr('class');

	    if (!classes || !regex) {
	      return false;
	    }

	    var classArray = [];
	    classes = classes.split(' ');

	    for (var i = 0, len = classes.length; i < len; i++) {
	      if (!classes[i].match(regex)) {
	        classArray.push(classes[i]);
	      }
	    }

	    $(this).attr('class', classArray.join(' '));
	  });
	};

	//
	$.fn.alterClass = function(removals, additions) {
	  var self = this;

	  if (removals.indexOf('*') === -1) {
	    // Use native jQuery methods if there is no wildcard matching
	    self.removeClass(removals);
	    return !additions ? self : self.addClass(additions);
	  }

	  var classPattern = new RegExp('\\s' +
	  removals.
	    replace(/\*/g, '[A-Za-z0-9-_]+').
	    split(' ').
	    join('\\s|\\s') +
	  '\\s', 'g');

	  self.each(function(i, it) {
	    var cn = ' ' + it.className + ' ';
	    while (classPattern.test(cn)) {
	      cn = cn.replace(classPattern, ' ');
	    }
	    it.className = $.trim(cn);
	  });

	  return !additions ? self : self.addClass(additions);
	};

	// handle multiple browsers for requestAnimationFrame()
	// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
	// https://github.com/gnarf/jquery-requestAnimationFrame
	UI.utils.rAF = (function() {
	  return window.requestAnimationFrame ||
	    window.webkitRequestAnimationFrame ||
	    window.mozRequestAnimationFrame ||
	    window.oRequestAnimationFrame ||
	      // if all else fails, use setTimeout
	    function(callback) {
	      return window.setTimeout(callback, 1000 / 60); // shoot for 60 fps
	    };
	})();

	// handle multiple browsers for cancelAnimationFrame()
	UI.utils.cancelAF = (function() {
	  return window.cancelAnimationFrame ||
	    window.webkitCancelAnimationFrame ||
	    window.mozCancelAnimationFrame ||
	    window.oCancelAnimationFrame ||
	    function(id) {
	      window.clearTimeout(id);
	    };
	})();

	// via http://davidwalsh.name/detect-scrollbar-width
	UI.utils.measureScrollbar = function() {
	  if (document.body.clientWidth >= window.innerWidth) {
	    return 0;
	  }

	  // if ($html.width() >= window.innerWidth) return;
	  // var scrollbarWidth = window.innerWidth - $html.width();
	  var $measure = $('<div ' +
	  'style="width: 100px;height: 100px;overflow: scroll;' +
	  'position: absolute;top: -9999px;"></div>');

	  $(document.body).append($measure);

	  var scrollbarWidth = $measure[0].offsetWidth - $measure[0].clientWidth;

	  $measure.remove();

	  return scrollbarWidth;
	};

	UI.utils.imageLoader = function($image, callback) {
	  function loaded() {
	    callback($image[0]);
	  }

	  function bindLoad() {
	    this.one('load', loaded);
	    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
	      var src = this.attr('src');
	      var param = src.match(/\?/) ? '&' : '?';

	      param += 'random=' + (new Date()).getTime();
	      this.attr('src', src + param);
	    }
	  }

	  if (!$image.attr('src')) {
	    loaded();
	    return;
	  }

	  if ($image[0].complete || $image[0].readyState === 4) {
	    loaded();
	  } else {
	    bindLoad.call($image);
	  }
	};

	/**
	 * @see https://github.com/cho45/micro-template.js
	 * (c) cho45 http://cho45.github.com/mit-license
	 */
	UI.template = function(id, data) {
	  var me = UI.template;

	  if (!me.cache[id]) {
	    me.cache[id] = (function() {
	      var name = id;
	      var string = /^[\w\-]+$/.test(id) ?
	        me.get(id) : (name = 'template(string)', id); // no warnings

	      var line = 1;
	      /* eslint-disable max-len, quotes */
	      var body = ('try { ' + (me.variable ?
	      'var ' + me.variable + ' = this.stash;' : 'with (this.stash) { ') +
	      "this.ret += '" +
	      string.
	        replace(/<%/g, '\x11').replace(/%>/g, '\x13'). // if you want other tag, just edit this line
	        replace(/'(?![^\x11\x13]+?\x13)/g, '\\x27').
	        replace(/^\s*|\s*$/g, '').
	        replace(/\n/g, function() {
	          return "';\nthis.line = " + (++line) + "; this.ret += '\\n";
	        }).
	        replace(/\x11-(.+?)\x13/g, "' + ($1) + '").
	        replace(/\x11=(.+?)\x13/g, "' + this.escapeHTML($1) + '").
	        replace(/\x11(.+?)\x13/g, "'; $1; this.ret += '") +
	      "'; " + (me.variable ? "" : "}") + "return this.ret;" +
	      "} catch (e) { throw 'TemplateError: ' + e + ' (on " + name +
	      "' + ' line ' + this.line + ')'; } " +
	      "//@ sourceURL=" + name + "\n" // source map
	      ).replace(/this\.ret \+= '';/g, '');
	      /* eslint-enable max-len, quotes */
	      var func = new Function(body);
	      var map = {
	        '&': '&amp;',
	        '<': '&lt;',
	        '>': '&gt;',
	        '\x22': '&#x22;',
	        '\x27': '&#x27;'
	      };
	      var escapeHTML = function(string) {
	        return ('' + string).replace(/[&<>\'\"]/g, function(_) {
	          return map[_];
	        });
	      };

	      return function(stash) {
	        return func.call(me.context = {
	          escapeHTML: escapeHTML,
	          line: 1,
	          ret: '',
	          stash: stash
	        });
	      };
	    })();
	  }

	  return data ? me.cache[id](data) : me.cache[id];
	};

	UI.template.cache = {};

	UI.template.get = function(id) {
	  if (id) {
	    var element = document.getElementById(id);
	    return element && element.innerHTML || '';
	  }
	};

	// Dom mutation watchers
	UI.DOMWatchers = [];
	UI.DOMReady = false;
	UI.ready = function(callback) {
	  UI.DOMWatchers.push(callback);
	  if (UI.DOMReady) {
	    // console.log('Ready call');
	    callback(document);
	  }
	};

	UI.DOMObserve = function(elements, options, callback) {
	  var Observer = UI.support.mutationobserver;
	  if (!Observer) {
	    return;
	  }

	  options = $.isPlainObject(options) ?
	    options : {childList: true, subtree: true};

	  callback = typeof callback === 'function' && callback || function() {
	  };

	  $(elements).each(function() {
	    var element = this;
	    var $element = $(element);

	    if ($element.data('am.observer')) {
	      return;
	    }

	    try {
	      var observer = new Observer(UI.utils.debounce(
	        function(mutations, instance) {
	          callback.call(element, mutations, instance);
	          // trigger this event manually if MutationObserver not supported
	          $element.trigger('changed.dom.amui');
	        }, 50));

	      observer.observe(element, options);

	      $element.data('am.observer', observer);
	    } catch (e) {
	    }
	  });
	};

	$.fn.DOMObserve = function(options, callback) {
	  return this.each(function() {
	    /* eslint-disable new-cap */
	    UI.DOMObserve(this, options, callback);
	    /* eslint-enable new-cap */
	  });
	};

	if (UI.support.touch) {
	  $html.addClass('am-touch');
	}

	$(document).on('changed.dom.amui', function(e) {
	  var element = e.target;

	  // TODO: just call changed element's watcher
	  //       every watcher callback should have a key
	  //       use like this: <div data-am-observe='key1, key2'>
	  //       get keys via $(element).data('amObserve')
	  //       call functions store with these keys
	  $.each(UI.DOMWatchers, function(i, watcher) {
	    watcher(element);
	  });
	});

	$(function() {
	  var $body = $(document.body);

	  UI.DOMReady = true;

	  // Run default init
	  $.each(UI.DOMWatchers, function(i, watcher) {
	    watcher(document);
	  });

	  // watches DOM
	  /* eslint-disable new-cap */
	  UI.DOMObserve('[data-am-observe]');
	  /* eslint-enable */

	  $html.removeClass('no-js').addClass('js');

	  UI.support.animation && $html.addClass('cssanimations');

	  // iOS standalone mode
	  if (window.navigator.standalone) {
	    $html.addClass('am-standalone');
	  }

	  $('.am-topbar-fixed-top').length &&
	  $body.addClass('am-with-topbar-fixed-top');

	  $('.am-topbar-fixed-bottom').length &&
	  $body.addClass('am-with-topbar-fixed-bottom');

	  // Remove responsive classes in .am-layout
	  var $layout = $('.am-layout');
	  $layout.find('[class*="md-block-grid"]').alterClass('md-block-grid-*');
	  $layout.find('[class*="lg-block-grid"]').alterClass('lg-block-grid');

	  // widgets not in .am-layout
	  $('[data-am-widget]').each(function() {
	    var $widget = $(this);
	    // console.log($widget.parents('.am-layout').length)
	    if ($widget.parents('.am-layout').length === 0) {
	      $widget.addClass('am-no-layout');
	    }
	  });
	});

	module.exports = UI;


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(2);
	var UI = __webpack_require__(1);
	__webpack_require__(4);

	function galleryInit() {
	  var $gallery = $('[data-am-widget="gallery"]');

	  $gallery.each(function() {
	    var options = UI.utils.parseOptions($(this).attr('data-am-gallery'));

	    if (options.pureview) {
	      (typeof options.pureview === 'object') ?
	        $(this).pureview(options.pureview) : $(this).pureview();
	    }
	  });
	}

	$(galleryInit);

	module.exports = UI.gallery = {
	  VERSION: '3.0.0',
	  init: galleryInit
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(2);
	var UI = __webpack_require__(1);
	var PinchZoom = __webpack_require__(5);
	var Hammer = __webpack_require__(6);
	var animation = UI.support.animation;
	var transition = UI.support.transition;

	/**
	 * PureView
	 * @desc Image browser for Mobile
	 * @param element
	 * @param options
	 * @constructor
	 */

	var PureView = function(element, options) {
	  this.$element = $(element);
	  this.$body = $(document.body);
	  this.options = $.extend({}, PureView.DEFAULTS, options);
	  this.$pureview = $(this.options.tpl).attr('id',
	    UI.utils.generateGUID('am-pureview'));

	  this.$slides = null;
	  this.transitioning = null;
	  this.scrollbarWidth = 0;

	  this.init();
	};

	PureView.DEFAULTS = {
	  tpl: '<div class="am-pureview am-pureview-bar-active">' +
	  '<ul class="am-pureview-slider"></ul>' +
	  '<ul class="am-pureview-direction">' +
	  '<li class="am-pureview-prev"><a href=""></a></li>' +
	  '<li class="am-pureview-next"><a href=""></a></li></ul>' +
	  '<ol class="am-pureview-nav"></ol>' +
	  '<div class="am-pureview-bar am-active">' +
	  '<div class="am-pureview-text">' +
	  '<div class="am-pureview-title"></div>' +
	  '<div class="am-pureview-extra-info"></div></div>' +
	  '<div class="am-pureview-counter"><span class="am-pureview-current"></span> / ' +
	  '<span class="am-pureview-total"></span></div></div>' +
	  '<div class="am-pureview-actions am-active">' +
	  '<a href="javascript: void(0)" class="am-icon-chevron-left" ' +
	  'data-am-close="pureview"></a></div>' +
	  '</div>',

	  className: {
	    prevSlide: 'am-pureview-slide-prev',
	    nextSlide: 'am-pureview-slide-next',
	    onlyOne: 'am-pureview-only',
	    active: 'am-active',
	    barActive: 'am-pureview-bar-active',
	    activeBody: 'am-pureview-active'
	  },

	  selector: {
	    slider: '.am-pureview-slider',
	    close: '[data-am-close="pureview"]',
	    total: '.am-pureview-total',
	    current: '.am-pureview-current',
	    title: '.am-pureview-title',
	    extraInfo: '.am-pureview-extra-info',
	    actions: '.am-pureview-actions',
	    bar: '.am-pureview-bar',
	    pinchZoom: '.am-pinch-zoom',
	    nav: '.am-pureview-nav'
	  },

	  shareBtn: false,

	  // press to toggle Toolbar
	  toggleToolbar: true,

	  // 从何处获取图片，img 可以使用 data-rel 指定大图
	  target: 'img',

	  // 微信 Webview 中调用微信的图片浏览器
	  // 实现图片保存、分享好友、收藏图片等功能
	  weChatImagePreview: true
	};

	PureView.prototype.init = function() {
	  var _this = this;
	  var options = this.options;
	  var $element = this.$element;
	  var $pureview = this.$pureview;

	  this.refreshSlides();

	  $('body').append($pureview);

	  this.$extraInfo = $pureview.find(options.selector.extraInfo);
	  this.$title = $pureview.find(options.selector.title);
	  this.$current = $pureview.find(options.selector.current);
	  this.$bar = $pureview.find(options.selector.bar);
	  this.$actions = $pureview.find(options.selector.actions);

	  if (options.shareBtn) {
	    this.$actions.append('<a href="javascript: void(0)" ' +
	    'class="am-icon-share-square-o" data-am-toggle="share"></a>');
	  }

	  this.$element.on('click.pureview.amui', options.target, function(e) {
	    e.preventDefault();
	    var clicked = _this.$images.index(this);

	    // Invoke WeChat ImagePreview in WeChat
	    // TODO: detect WeChat before init
	    if (options.weChatImagePreview && window.WeixinJSBridge) {
	      window.WeixinJSBridge.invoke('imagePreview', {
	        current: _this.imgUrls[clicked],
	        urls: _this.imgUrls
	      });
	    } else {
	      _this.open(clicked);
	    }
	  });

	  $pureview.find('.am-pureview-direction').
	    on('click.direction.pureview.amui', 'li', function(e) {
	      e.preventDefault();

	      if ($(this).is('.am-pureview-prev')) {
	        _this.prevSlide();
	      } else {
	        _this.nextSlide();
	      }
	    });

	  // Nav Contorl
	  $pureview.find(options.selector.nav).on('click.nav.pureview.amui', 'li',
	    function() {
	      var index = _this.$navItems.index($(this));
	      _this.activate(_this.$slides.eq(index));
	    });

	  // Close Icon
	  $pureview.find(options.selector.close).
	    on('click.close.pureview.amui', function(e) {
	      e.preventDefault();
	      _this.close();
	    });

	  this.$slider.hammer().on('swipeleft.pureview.amui', function(e) {
	    e.preventDefault();
	    // TODO 滑动边界保护：当图片处于放大状态，则当其滑到边界，判断是否要切换下一张
	    _this.nextSlide();
	  }).on('swiperight.pureview.amui', function(e) {
	    e.preventDefault();
	    // TODO 滑动边界保护
	    _this.prevSlide();
	  })
	  // @modified actions toolbar: let actions toolbar always display
	  // .on('press.pureview.amui', function(e) {
	  //   e.preventDefault();
	  //   options.toggleToolbar && _this.toggleToolBar();
	  // })
	  ;

	  this.$slider.data('hammer').get('swipe').set({
	    direction: Hammer.DIRECTION_HORIZONTAL,
	    velocity: 0.35
	  });

	  // Observe DOM
	  $element.DOMObserve({
	    childList: true,
	    subtree: true
	  }, function(mutations, observer) {
	    // _this.refreshSlides();
	    // console.log('mutations[0].type);
	  });

	  // NOTE:
	  // trigger this event manually if MutationObserver not supported
	  //   when new images appended, or call refreshSlides()
	  // if (!UI.support.mutationobserver) $element.trigger('changed.dom.amui')
	  $element.on('changed.dom.amui', function(e) {
	    e.stopPropagation();
	    _this.refreshSlides();
	  });

	  $(document).on('keydown.pureview.amui', $.proxy(function(e) {
	    var keyCode = e.keyCode;
	    if (keyCode == 37) {
	      this.prevSlide();
	    } else if (keyCode == 39) {
	      this.nextSlide();
	    } else if (keyCode == 27) {
	      this.close();
	    }
	  }, this));
	};

	PureView.prototype.refreshSlides = function() {
	  // update images collections
	  this.$images = this.$element.find(this.options.target);
	  var _this = this;
	  var options = this.options;
	  var $pureview = this.$pureview;
	  var $slides = $([]);
	  var $navItems = $([]);
	  var $images = this.$images;
	  var total = $images.length;
	  this.$slider = $pureview.find(options.selector.slider);
	  this.$nav = $pureview.find(options.selector.nav);
	  var viewedFlag = 'data-am-pureviewed';
	  // for WeChat Image Preview
	  this.imgUrls = this.imgUrls || [];

	  if (!total) {
	    return;
	  }

	  if (total === 1) {
	    $pureview.addClass(options.className.onlyOne);
	  }

	  $images.not('[' + viewedFlag + ']').each(function(i, item) {
	    var src;
	    var title;
	    var extraInfo;

	    // get image URI from link's href attribute
	    if (item.nodeName === 'A') {
	      src = item.href; // to absolute path
	      title = item.title || '';
	    } else {
	      // NOTE: `data-rel` should be a full URL, otherwise,
	      //        WeChat images preview will not work
	      // @modified big images src: get big images src from data-rel or lazyload images or src
	    	// <img data-original="" src="" data-rel="">
	    	// data-rel 放大图，data-original为使用lazyload时所用，当图片进入viewport时会加载生成图片的src
	      src = $(item).data('rel') || $(item).data('original') || item.src;
	      src = UI.utils.getAbsoluteUrl(src);
	      title = $(item).attr('alt') || '';
	      // @modified big image extra text: get some extra info to display when preview a big image
	      extraInfo = $(item).data('extraInfo') || '';
	    }

	    // add pureviewed flag
	    item.setAttribute(viewedFlag, '1');

	    // hide bar: wechat_webview_type=1
	    // http://tmt.io/wechat/  not working?
	    _this.imgUrls.push(src);

	    // @modified big image extra text: get some extra info to display when preview a big image
	    $slides = $slides.add($('<li data-src="' + src + '" data-title="' + title + '" data-extra-info="' + extraInfo +
	    '"></li>'));
	    $navItems = $navItems.add($('<li>' + (i + 1) + '</li>'));
	  });

	  $pureview.find(options.selector.total).text(total);

	  this.$slider.append($slides);
	  this.$nav.append($navItems);
	  this.$navItems = this.$nav.find('li');
	  this.$slides = this.$slider.find('li');
	};

	PureView.prototype.loadImage = function($slide, callback) {
	  var appendedFlag = 'image-appended';

	  if (!$slide.data(appendedFlag)) {
	    var $img = $('<img>', {
	      src: $slide.data('src'),
	      alt: $slide.data('title')
	    });

	    $slide.html($img).wrapInner('<div class="am-pinch-zoom"></div>').redraw();

	    var $pinchWrapper = $slide.find(this.options.selector.pinchZoom);
	    $pinchWrapper.data('amui.pinchzoom', new PinchZoom($pinchWrapper[0], {}));
	    $slide.data('image-appended', true);
	  }

	  callback && callback.call(this);
	};

	PureView.prototype.activate = function($slide) {
	  var options = this.options;
	  var $slides = this.$slides;
	  var activeIndex = $slides.index($slide);
	  var title = $slide.data('title') || '';
	  var extraInfo = $slide.data('extraInfo') || '';
	  var active = options.className.active;

	  if ($slides.find('.' + active).is($slide)) {
	    return;
	  }

	  if (this.transitioning) {
	    return;
	  }

	  this.loadImage($slide, function() {
	    UI.utils.imageLoader($slide.find('img'), function(image) {
	      $slide.find('.am-pinch-zoom').addClass('am-pureview-loaded');
	      $(image).addClass('am-img-loaded');
	    });
	  });

	  this.transitioning = 1;

	  this.$title.text(title);
	  // @modified big image extra text: get some extra info to display when preview a big image
	  this.$extraInfo.text(extraInfo);
	  this.$current.text(activeIndex + 1);
	  $slides.removeClass();
	  $slide.addClass(active);
	  $slides.eq(activeIndex - 1).addClass(options.className.prevSlide);
	  $slides.eq(activeIndex + 1).addClass(options.className.nextSlide);

	  this.$navItems.removeClass().
	    eq(activeIndex).addClass(options.className.active);

	  if (transition) {
	    $slide.one(transition.end, $.proxy(function() {
	      this.transitioning = 0;
	    }, this)).emulateTransitionEnd(300);
	  } else {
	    this.transitioning = 0;
	  }

	  // @modified reset image: reset image scale and offset when slide activate
	  var $pinchWrapper = $slide.find(this.options.selector.pinchZoom);
	  // console.log($pinchWrapper.data('amui.pinchzoom'));
	  var $pinchZoom = $pinchWrapper.data('amui.pinchzoom');
	  $pinchZoom.zoomFactor = 1;
	  $pinchZoom.offset.x = 0;
	  $pinchZoom.offset.y = 0;
	  $pinchZoom.update();

	  // TODO: pre-load next image
	};

	PureView.prototype.nextSlide = function() {
	  if (this.$slides.length === 1) {
	    return;
	  }

	  var $slides = this.$slides;
	  var $active = $slides.filter('.am-active');
	  var activeIndex = $slides.index($active);
	  var rightSpring = 'am-animation-right-spring';

	  if (activeIndex + 1 >= $slides.length) { // last one
	    animation && $active.addClass(rightSpring).on(animation.end, function() {
	      $active.removeClass(rightSpring);
	    });
	  } else {
	    this.activate($slides.eq(activeIndex + 1));
	  }
	};

	PureView.prototype.prevSlide = function() {
	  if (this.$slides.length === 1) {
	    return;
	  }

	  var $slides = this.$slides;
	  var $active = $slides.filter('.am-active');
	  var activeIndex = this.$slides.index(($active));
	  var leftSpring = 'am-animation-left-spring';

	  if (activeIndex === 0) { // first one
	    animation && $active.addClass(leftSpring).on(animation.end, function() {
	      $active.removeClass(leftSpring);
	    });
	  } else {
	    this.activate($slides.eq(activeIndex - 1));
	  }
	};

	PureView.prototype.toggleToolBar = function() {
	  this.$pureview.toggleClass(this.options.className.barActive);
	};

	PureView.prototype.open = function(index) {
	  var active = index || 0;
	  this.checkScrollbar();
	  this.setScrollbar();
	  this.activate(this.$slides.eq(active));
	  this.$pureview.show().redraw().addClass(this.options.className.active);
	  this.$body.addClass(this.options.className.activeBody);
	};

	PureView.prototype.close = function() {
	  var options = this.options;

	  this.$pureview.removeClass(options.className.active);
	  this.$slides.removeClass();

	  function resetBody() {
	    this.$pureview.hide();
	    this.$body.removeClass(options.className.activeBody);
	    this.resetScrollbar();
	  }

	  if (transition) {
	    this.$pureview.one(transition.end, $.proxy(resetBody, this)).
	      emulateTransitionEnd(300);
	  } else {
	    resetBody.call(this);
	  }
	};

	PureView.prototype.checkScrollbar = function() {
	  this.scrollbarWidth = UI.utils.measureScrollbar();
	};

	PureView.prototype.setScrollbar = function() {
	  var bodyPaddingRight = parseInt((this.$body.css('padding-right') || 0), 10);
	  if (this.scrollbarWidth) {
	    this.$body.css('padding-right', bodyPaddingRight + this.scrollbarWidth);
	  }
	};

	PureView.prototype.resetScrollbar = function() {
	  this.$body.css('padding-right', '');
	};

	UI.plugin('pureview', PureView);

	// Init code
	UI.ready(function(context) {
	  $('[data-am-pureview]', context).pureview();
	});

	module.exports = PureView;

	// TODO: 1. 动画改进
	//       2. 改变图片的时候恢复 Zoom
	//       3. 选项
	//       4. 图片高度问题：由于 PinchZoom 的原因，过高的图片如果设置看了滚动，则放大以后显示不全


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(2);
	var UI = __webpack_require__(1);
	var requestAnimationFrame = UI.utils.rAF;

	/**
	 * @via https://github.com/manuelstofer/pinchzoom/blob/master/src/pinchzoom.js
	 * @license the MIT License.
	 */

	var definePinchZoom = function($) {

	  /**
	   * Pinch zoom using jQuery
	   * @version 0.0.2
	   * @author Manuel Stofer <mst@rtp.ch>
	   * @param el
	   * @param options
	   * @constructor
	   */
	  var PinchZoom = function(el, options) {
	      this.el = $(el);
	      this.zoomFactor = 1;
	      this.lastScale = 1;
	      this.offset = {
	        x: 0,
	        y: 0
	      };
	      this.options = $.extend({}, this.defaults, options);
	      this.setupMarkup();
	      this.bindEvents();
	      this.update();
	      // default enable.
	      this.enable();

	    },
	    sum = function(a, b) {
	      return a + b;
	    },
	    isCloseTo = function(value, expected) {
	      return value > expected - 0.01 && value < expected + 0.01;
	    };

	  PinchZoom.prototype = {

	    defaults: {
	      tapZoomFactor: 2,
	      zoomOutFactor: 1.3,
	      animationDuration: 300,
	      maxZoom: 4,
	      minZoom: 0.5,
	      lockDragAxis: false,
	      use2d: true,
	      zoomStartEventName: 'pz_zoomstart',
	      zoomEndEventName: 'pz_zoomend',
	      dragStartEventName: 'pz_dragstart',
	      dragEndEventName: 'pz_dragend',
	      doubleTapEventName: 'pz_doubletap'
	    },

	    /**
	     * Event handler for 'dragstart'
	     * @param event
	     */
	    handleDragStart: function(event) {
	      this.el.trigger(this.options.dragStartEventName);
	      this.stopAnimation();
	      this.lastDragPosition = false;
	      this.hasInteraction = true;
	      this.handleDrag(event);
	    },

	    /**
	     * Event handler for 'drag'
	     * @param event
	     */
	    handleDrag: function(event) {

	      if (this.zoomFactor > 1.0) {
	        var touch = this.getTouches(event)[0];
	        this.drag(touch, this.lastDragPosition);
	        this.offset = this.sanitizeOffset(this.offset);
	        this.lastDragPosition = touch;
	      }
	    },

	    handleDragEnd: function() {
	      this.el.trigger(this.options.dragEndEventName);
	      this.end();
	    },

	    /**
	     * Event handler for 'zoomstart'
	     * @param event
	     */
	    handleZoomStart: function(event) {
	      this.el.trigger(this.options.zoomStartEventName);
	      this.stopAnimation();
	      this.lastScale = 1;
	      this.nthZoom = 0;
	      this.lastZoomCenter = false;
	      this.hasInteraction = true;
	    },

	    /**
	     * Event handler for 'zoom'
	     * @param event
	     */
	    handleZoom: function(event, newScale) {

	      // a relative scale factor is used
	      var touchCenter = this.getTouchCenter(this.getTouches(event)),
	        scale = newScale / this.lastScale;
	      this.lastScale = newScale;

	      // the first touch events are thrown away since they are not precise
	      this.nthZoom += 1;
	      if (this.nthZoom > 3) {

	        this.scale(scale, touchCenter);
	        this.drag(touchCenter, this.lastZoomCenter);
	      }
	      this.lastZoomCenter = touchCenter;
	    },

	    handleZoomEnd: function() {
	      this.el.trigger(this.options.zoomEndEventName);
	      this.end();
	    },

	    /**
	     * Event handler for 'doubletap'
	     * @param event
	     */
	    handleDoubleTap: function(event) {
	      var center = this.getTouches(event)[0],
	        zoomFactor = this.zoomFactor > 1 ? 1 : this.options.tapZoomFactor,
	        startZoomFactor = this.zoomFactor,
	        updateProgress = (function(progress) {
	          this.scaleTo(startZoomFactor + progress * (zoomFactor - startZoomFactor), center);
	        }).bind(this);

	      if (this.hasInteraction) {
	        return;
	      }
	      if (startZoomFactor > zoomFactor) {
	        center = this.getCurrentZoomCenter();
	      }

	      this.animate(this.options.animationDuration, updateProgress, this.swing);
	      this.el.trigger(this.options.doubleTapEventName);
	    },

	    /**
	     * Max / min values for the offset
	     * @param offset
	     * @return {Object} the sanitized offset
	     */
	    sanitizeOffset: function(offset) {
	      var maxX = (this.zoomFactor - 1) * this.getContainerX(),
	        maxY = (this.zoomFactor - 1) * this.getContainerY(),
	        maxOffsetX = Math.max(maxX, 0),
	        maxOffsetY = Math.max(maxY, 0),
	        minOffsetX = Math.min(maxX, 0),
	        minOffsetY = Math.min(maxY, 0);

	      return {
	        x: Math.min(Math.max(offset.x, minOffsetX), maxOffsetX),
	        y: Math.min(Math.max(offset.y, minOffsetY), maxOffsetY)
	      };
	    },

	    /**
	     * Scale to a specific zoom factor (not relative)
	     * @param zoomFactor
	     * @param center
	     */
	    scaleTo: function(zoomFactor, center) {
	      this.scale(zoomFactor / this.zoomFactor, center);
	    },

	    /**
	     * Scales the element from specified center
	     * @param scale
	     * @param center
	     */
	    scale: function(scale, center) {
	      scale = this.scaleZoomFactor(scale);
	      this.addOffset({
	        x: (scale - 1) * (center.x + this.offset.x),
	        y: (scale - 1) * (center.y + this.offset.y)
	      });
	    },

	    /**
	     * Scales the zoom factor relative to current state
	     * @param scale
	     * @return the actual scale (can differ because of max min zoom factor)
	     */
	    scaleZoomFactor: function(scale) {
	      var originalZoomFactor = this.zoomFactor;
	      this.zoomFactor *= scale;
	      this.zoomFactor = Math.min(this.options.maxZoom, Math.max(this.zoomFactor, this.options.minZoom));
	      return this.zoomFactor / originalZoomFactor;
	    },

	    /**
	     * Drags the element
	     * @param center
	     * @param lastCenter
	     */
	    drag: function(center, lastCenter) {
	      if (lastCenter) {
	        if (this.options.lockDragAxis) {
	          // lock scroll to position that was changed the most
	          if (Math.abs(center.x - lastCenter.x) > Math.abs(center.y - lastCenter.y)) {
	            this.addOffset({
	              x: -(center.x - lastCenter.x),
	              y: 0
	            });
	          }
	          else {
	            this.addOffset({
	              y: -(center.y - lastCenter.y),
	              x: 0
	            });
	          }
	        }
	        else {
	          this.addOffset({
	            y: -(center.y - lastCenter.y),
	            x: -(center.x - lastCenter.x)
	          });
	        }
	      }
	    },

	    /**
	     * Calculates the touch center of multiple touches
	     * @param touches
	     * @return {Object}
	     */
	    getTouchCenter: function(touches) {
	      return this.getVectorAvg(touches);
	    },

	    /**
	     * Calculates the average of multiple vectors (x, y values)
	     */
	    getVectorAvg: function(vectors) {
	      return {
	        x: vectors.map(function(v) {
	          return v.x;
	        }).reduce(sum) / vectors.length,
	        y: vectors.map(function(v) {
	          return v.y;
	        }).reduce(sum) / vectors.length
	      };
	    },

	    /**
	     * Adds an offset
	     * @param offset the offset to add
	     * @return return true when the offset change was accepted
	     */
	    addOffset: function(offset) {
	      this.offset = {
	        x: this.offset.x + offset.x,
	        y: this.offset.y + offset.y
	      };
	    },

	    sanitize: function() {
	      if (this.zoomFactor < this.options.zoomOutFactor) {
	        this.zoomOutAnimation();
	      } else if (this.isInsaneOffset(this.offset)) {
	        this.sanitizeOffsetAnimation();
	      }
	    },

	    /**
	     * Checks if the offset is ok with the current zoom factor
	     * @param offset
	     * @return {Boolean}
	     */
	    isInsaneOffset: function(offset) {
	      var sanitizedOffset = this.sanitizeOffset(offset);
	      return sanitizedOffset.x !== offset.x ||
	        sanitizedOffset.y !== offset.y;
	    },

	    /**
	     * Creates an animation moving to a sane offset
	     */
	    sanitizeOffsetAnimation: function() {
	      var targetOffset = this.sanitizeOffset(this.offset),
	        startOffset = {
	          x: this.offset.x,
	          y: this.offset.y
	        },
	        updateProgress = (function(progress) {
	          this.offset.x = startOffset.x + progress * (targetOffset.x - startOffset.x);
	          this.offset.y = startOffset.y + progress * (targetOffset.y - startOffset.y);
	          this.update();
	        }).bind(this);

	      this.animate(
	        this.options.animationDuration,
	        updateProgress,
	        this.swing
	      );
	    },

	    /**
	     * Zooms back to the original position,
	     * (no offset and zoom factor 1)
	     */
	    zoomOutAnimation: function() {
	      var startZoomFactor = this.zoomFactor,
	        zoomFactor = 1,
	        center = this.getCurrentZoomCenter(),
	        updateProgress = (function(progress) {
	          this.scaleTo(startZoomFactor + progress * (zoomFactor - startZoomFactor), center);
	        }).bind(this);

	      this.animate(
	        this.options.animationDuration,
	        updateProgress,
	        this.swing
	      );
	    },

	    /**
	     * Updates the aspect ratio
	     */
	    updateAspectRatio: function() {
	      // this.setContainerY(this.getContainerX() / this.getAspectRatio());
        // @modified zoom image container
        this.setContainerY();
	    },

	    /**
	     * Calculates the initial zoom factor (for the element to fit into the container)
	     * @return the initial zoom factor
	     */
	    getInitialZoomFactor: function() {
	      // use .offsetWidth instead of width()
	      // because jQuery-width() return the original width but Zepto-width() will calculate width with transform.
	      // the same as .height()
	      return this.container[0].offsetWidth / this.el[0].offsetWidth;
	    },

	    /**
	     * Calculates the aspect ratio of the element
	     * @return the aspect ratio
	     */
	    getAspectRatio: function() {
	      return this.el[0].offsetWidth / this.el[0].offsetHeight;
	    },

	    /**
	     * Calculates the virtual zoom center for the current offset and zoom factor
	     * (used for reverse zoom)
	     * @return {Object} the current zoom center
	     */
	    getCurrentZoomCenter: function() {

	      // uses following formula to calculate the zoom center x value
	      // offset_left / offset_right = zoomcenter_x / (container_x - zoomcenter_x)
	      var length = this.container[0].offsetWidth * this.zoomFactor,
	        offsetLeft = this.offset.x,
	        offsetRight = length - offsetLeft - this.container[0].offsetWidth,
	        widthOffsetRatio = offsetLeft / offsetRight,
	        centerX = widthOffsetRatio * this.container[0].offsetWidth / (widthOffsetRatio + 1),

	      // the same for the zoomcenter y
	        height = this.container[0].offsetHeight * this.zoomFactor,
	        offsetTop = this.offset.y,
	        offsetBottom = height - offsetTop - this.container[0].offsetHeight,
	        heightOffsetRatio = offsetTop / offsetBottom,
	        centerY = heightOffsetRatio * this.container[0].offsetHeight / (heightOffsetRatio + 1);

	      // prevents division by zero
	      if (offsetRight === 0) {
	        centerX = this.container[0].offsetWidth;
	      }
	      if (offsetBottom === 0) {
	        centerY = this.container[0].offsetHeight;
	      }

	      return {
	        x: centerX,
	        y: centerY
	      };
	    },

	    canDrag: function() {
	      return !isCloseTo(this.zoomFactor, 1);
	    },

	    /**
	     * Returns the touches of an event relative to the container offset
	     * @param event
	     * @return array touches
	     */
	    getTouches: function(event) {
	      var position = this.container.offset();
	      return Array.prototype.slice.call(event.touches).map(function(touch) {
	        return {
	          x: touch.pageX - position.left,
	          y: touch.pageY - position.top
	        };
	      });
	    },

	    /**
	     * Animation loop
	     * does not support simultaneous animations
	     * @param duration
	     * @param framefn
	     * @param timefn
	     * @param callback
	     */
	    animate: function(duration, framefn, timefn, callback) {
	      var startTime = new Date().getTime(),
	        renderFrame = (function() {
	          if (!this.inAnimation) {
	            return;
	          }
	          var frameTime = new Date().getTime() - startTime,
	            progress = frameTime / duration;
	          if (frameTime >= duration) {
	            framefn(1);
	            if (callback) {
	              callback();
	            }
	            this.update();
	            this.stopAnimation();
	            this.update();
	          } else {
	            if (timefn) {
	              progress = timefn(progress);
	            }
	            framefn(progress);
	            this.update();
	            requestAnimationFrame(renderFrame);
	          }
	        }).bind(this);
	      this.inAnimation = true;
	      requestAnimationFrame(renderFrame);
	    },

	    /**
	     * Stops the animation
	     */
	    stopAnimation: function() {
	      this.inAnimation = false;
	    },

	    /**
	     * Swing timing function for animations
	     * @param p
	     * @return {Number}
	     */
	    swing: function(p) {
	      return -Math.cos(p * Math.PI) / 2 + 0.5;
	    },

	    getContainerX: function() {
	      // return this.container[0].offsetWidth;
        // @modified zoom image container
        return window.innerWidth;
	    },

	    getContainerY: function() {
	      // return this.container[0].offsetHeight;
        // @modified zoom image container
        return window.innerHeight;
	    },

	    setContainerY: function(y) {
	      // return this.container.height(y);
        // @modified zoom image container
        var t = window.innerHeight;
        return this.el.css({height: t}), this.container.height(t);
	    },

	    /**
	     * Creates the expected html structure
	     */
	    setupMarkup: function() {
	      this.container = $('<div class="pinch-zoom-container"></div>');
	      this.el.before(this.container);
	      this.container.append(this.el);

	      this.container.css({
	        'overflow': 'hidden',
	        'position': 'relative'
	      });

	      // Zepto doesn't recognize `webkitTransform..` style
	      this.el.css({
	        '-webkit-transform-origin': '0% 0%',
	        '-moz-transform-origin': '0% 0%',
	        '-ms-transform-origin': '0% 0%',
	        '-o-transform-origin': '0% 0%',
	        'transform-origin': '0% 0%',
	        'position': 'absolute'
	      });
	    },

	    end: function() {
	      this.hasInteraction = false;
	      this.sanitize();
	      this.update();
	    },

	    /**
	     * Binds all required event listeners
	     */
	    bindEvents: function() {
	      detectGestures(this.container.get(0), this);
	      // Zepto and jQuery both know about `on`
	      $(window).on('resize', this.update.bind(this));
	      $(this.el).find('img').on('load', this.update.bind(this));
	    },

	    /**
	     * Updates the css values according to the current zoom factor and offset
	     */
	    update: function() {

	      if (this.updatePlaned) {
	        return;
	      }
	      this.updatePlaned = true;

	      setTimeout((function() {
	        this.updatePlaned = false;
	        this.updateAspectRatio();

	        var zoomFactor = this.getInitialZoomFactor() * this.zoomFactor,
	          offsetX = -this.offset.x / zoomFactor,
	          offsetY = -this.offset.y / zoomFactor,
	          transform3d = 'scale3d(' + zoomFactor + ', ' + zoomFactor + ',1) ' +
	            'translate3d(' + offsetX + 'px,' + offsetY + 'px,0px)',
	          transform2d = 'scale(' + zoomFactor + ', ' + zoomFactor + ') ' +
	            'translate(' + offsetX + 'px,' + offsetY + 'px)',
	          removeClone = (function() {
	            if (this.clone) {
	              this.clone.remove();
	              delete this.clone;
	            }
	          }).bind(this);

	        // Scale 3d and translate3d are faster (at least on ios)
	        // but they also reduce the quality.
	        // PinchZoom uses the 3d transformations during interactions
	        // after interactions it falls back to 2d transformations
	        if (!this.options.use2d || this.hasInteraction || this.inAnimation) {
	          this.is3d = true;
	          removeClone();
	          this.el.css({
	            '-webkit-transform': transform3d,
	            '-o-transform': transform2d,
	            '-ms-transform': transform2d,
	            '-moz-transform': transform2d,
	            'transform': transform3d
	          });
	        } else {

	          // When changing from 3d to 2d transform webkit has some glitches.
	          // To avoid this, a copy of the 3d transformed element is displayed in the
	          // foreground while the element is converted from 3d to 2d transform
	          if (this.is3d) {
	            this.clone = this.el.clone();
	            this.clone.css('pointer-events', 'none');
	            this.clone.appendTo(this.container);
	            setTimeout(removeClone, 200);
	          }
	          this.el.css({
	            '-webkit-transform': transform2d,
	            '-o-transform': transform2d,
	            '-ms-transform': transform2d,
	            '-moz-transform': transform2d,
	            'transform': transform2d
	          });
	          this.is3d = false;
	        }
	      }).bind(this), 0);
	    },

	    /**
	     * Enables event handling for gestures
	     */
	    enable: function() {
	      this.enabled = true;
	    },

	    /**
	     * Disables event handling for gestures
	     */
	    disable: function() {
	      this.enabled = false;
	    }
	  };

	  var detectGestures = function(el, target) {
	    var interaction = null,
	      fingers = 0,
	      lastTouchStart = null,
	      startTouches = null,

	      setInteraction = function(newInteraction, event) {
	        if (interaction !== newInteraction) {

	          if (interaction && !newInteraction) {
	            switch (interaction) {
	              case "zoom":
	                target.handleZoomEnd(event);
	                break;
	              case 'drag':
	                target.handleDragEnd(event);
	                break;
	            }
	          }

	          switch (newInteraction) {
	            case 'zoom':
	              target.handleZoomStart(event);
	              break;
	            case 'drag':
	              target.handleDragStart(event);
	              break;
	          }
	        }
	        interaction = newInteraction;
	      },

	      updateInteraction = function(event) {
	        if (fingers === 2) {
	          setInteraction('zoom');
	        } else if (fingers === 1 && target.canDrag()) {
	          setInteraction('drag', event);
	        } else {
	          setInteraction(null, event);
	        }
	      },

	      targetTouches = function(touches) {
	        return Array.prototype.slice.call(touches).map(function(touch) {
	          return {
	            x: touch.pageX,
	            y: touch.pageY
	          };
	        });
	      },

	      getDistance = function(a, b) {
	        var x, y;
	        x = a.x - b.x;
	        y = a.y - b.y;
	        return Math.sqrt(x * x + y * y);
	      },

	      calculateScale = function(startTouches, endTouches) {
	        var startDistance = getDistance(startTouches[0], startTouches[1]),
	          endDistance = getDistance(endTouches[0], endTouches[1]);
	        return endDistance / startDistance;
	      },

	      cancelEvent = function(event) {
	        event.stopPropagation();
	        event.preventDefault();
	      },

	      detectDoubleTap = function(event) {
	        var time = (new Date()).getTime();

	        if (fingers > 1) {
	          lastTouchStart = null;
	        }

	        if (time - lastTouchStart < 300) {
	          cancelEvent(event);

	          target.handleDoubleTap(event);
	          switch (interaction) {
	            case 'zoom':
	              target.handleZoomEnd(event);
	              break;
	            case 'drag':
	              target.handleDragEnd(event);
	              break;
	          }
	        }

	        if (fingers === 1) {
	          lastTouchStart = time;
	        }
	      },
	      firstMove = true;

	    el.addEventListener('touchstart', function(event) {
	      if (target.enabled) {
	        firstMove = true;
	        fingers = event.touches.length;
	        detectDoubleTap(event);
	      }
	    });

	    el.addEventListener('touchmove', function(event) {
	      if (target.enabled) {
	        if (firstMove) {
	          updateInteraction(event);
	          if (interaction) {
	            cancelEvent(event);
	          }
	          startTouches = targetTouches(event.touches);
	        } else {
	          switch (interaction) {
	            case 'zoom':
	              target.handleZoom(event, calculateScale(startTouches, targetTouches(event.touches)));
	              break;
	            case 'drag':
	              target.handleDrag(event);
	              break;
	          }
	          if (interaction) {
	            cancelEvent(event);
	            target.update();
	          }
	        }

	        firstMove = false;
	      }
	    });

	    el.addEventListener('touchend', function(event) {
	      if (target.enabled) {
	        fingers = event.touches.length;
	        updateInteraction(event);
	      }
	    });
	  };

	  return PinchZoom;
	};

	module.exports = UI.pichzoom = definePinchZoom($);


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*! Hammer.JS - v2.0.8 - 2016-04-22
	 * http://hammerjs.github.io/
	 *
	 * Copyright (c) 2016 Jorik Tangelder;
	 * Licensed under the MIT license */

	'use strict';

	var $ = __webpack_require__(2);
	var UI = __webpack_require__(1);

	var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
	var TEST_ELEMENT = document.createElement('div');

	var TYPE_FUNCTION = 'function';

	var round = Math.round;
	var abs = Math.abs;
	var now = Date.now;

	/**
	 * set a timeout with a given scope
	 * @param {Function} fn
	 * @param {Number} timeout
	 * @param {Object} context
	 * @returns {number}
	 */
	function setTimeoutContext(fn, timeout, context) {
	  return setTimeout(bindFn(fn, context), timeout);
	}

	/**
	 * if the argument is an array, we want to execute the fn on each entry
	 * if it aint an array we don't want to do a thing.
	 * this is used by all the methods that accept a single and array argument.
	 * @param {*|Array} arg
	 * @param {String} fn
	 * @param {Object} [context]
	 * @returns {Boolean}
	 */
	function invokeArrayArg(arg, fn, context) {
	  if (Array.isArray(arg)) {
	    each(arg, context[fn], context);
	    return true;
	  }
	  return false;
	}

	/**
	 * walk objects and arrays
	 * @param {Object} obj
	 * @param {Function} iterator
	 * @param {Object} context
	 */
	function each(obj, iterator, context) {
	  var i;

	  if (!obj) {
	    return;
	  }

	  if (obj.forEach) {
	    obj.forEach(iterator, context);
	  } else if (obj.length !== undefined) {
	    i = 0;
	    while (i < obj.length) {
	      iterator.call(context, obj[i], i, obj);
	      i++;
	    }
	  } else {
	    for (i in obj) {
	      obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
	    }
	  }
	}

	/**
	 * wrap a method with a deprecation warning and stack trace
	 * @param {Function} method
	 * @param {String} name
	 * @param {String} message
	 * @returns {Function} A new function wrapping the supplied method.
	 */
	function deprecate(method, name, message) {
	  var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
	  return function() {
	    var e = new Error('get-stack-trace');
	    var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '')
	      .replace(/^\s+at\s+/gm, '')
	      .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';

	    var log = window.console && (window.console.warn || window.console.log);
	    if (log) {
	      log.call(window.console, deprecationMessage, stack);
	    }
	    return method.apply(this, arguments);
	  };
	}

	/**
	 * extend object.
	 * means that properties in dest will be overwritten by the ones in src.
	 * @param {Object} target
	 * @param {...Object} objects_to_assign
	 * @returns {Object} target
	 */
	var assign;
	if (typeof Object.assign !== 'function') {
	  assign = function assign(target) {
	    if (target === undefined || target === null) {
	      throw new TypeError('Cannot convert undefined or null to object');
	    }

	    var output = Object(target);
	    for (var index = 1; index < arguments.length; index++) {
	      var source = arguments[index];
	      if (source !== undefined && source !== null) {
	        for (var nextKey in source) {
	          if (source.hasOwnProperty(nextKey)) {
	            output[nextKey] = source[nextKey];
	          }
	        }
	      }
	    }
	    return output;
	  };
	} else {
	  assign = Object.assign;
	}

	/**
	 * extend object.
	 * means that properties in dest will be overwritten by the ones in src.
	 * @param {Object} dest
	 * @param {Object} src
	 * @param {Boolean} [merge=false]
	 * @returns {Object} dest
	 */
	var extend = deprecate(function extend(dest, src, merge) {
	  var keys = Object.keys(src);
	  var i = 0;
	  while (i < keys.length) {
	    if (!merge || (merge && dest[keys[i]] === undefined)) {
	      dest[keys[i]] = src[keys[i]];
	    }
	    i++;
	  }
	  return dest;
	}, 'extend', 'Use `assign`.');

	/**
	 * merge the values from src in the dest.
	 * means that properties that exist in dest will not be overwritten by src
	 * @param {Object} dest
	 * @param {Object} src
	 * @returns {Object} dest
	 */
	var merge = deprecate(function merge(dest, src) {
	  return extend(dest, src, true);
	}, 'merge', 'Use `assign`.');

	/**
	 * simple class inheritance
	 * @param {Function} child
	 * @param {Function} base
	 * @param {Object} [properties]
	 */
	function inherit(child, base, properties) {
	  var baseP = base.prototype,
	    childP;

	  childP = child.prototype = Object.create(baseP);
	  childP.constructor = child;
	  childP._super = baseP;

	  if (properties) {
	    assign(childP, properties);
	  }
	}

	/**
	 * simple function bind
	 * @param {Function} fn
	 * @param {Object} context
	 * @returns {Function}
	 */
	function bindFn(fn, context) {
	  return function boundFn() {
	    return fn.apply(context, arguments);
	  };
	}

	/**
	 * let a boolean value also be a function that must return a boolean
	 * this first item in args will be used as the context
	 * @param {Boolean|Function} val
	 * @param {Array} [args]
	 * @returns {Boolean}
	 */
	function boolOrFn(val, args) {
	  if (typeof val == TYPE_FUNCTION) {
	    return val.apply(args ? args[0] || undefined : undefined, args);
	  }
	  return val;
	}

	/**
	 * use the val2 when val1 is undefined
	 * @param {*} val1
	 * @param {*} val2
	 * @returns {*}
	 */
	function ifUndefined(val1, val2) {
	  return (val1 === undefined) ? val2 : val1;
	}

	/**
	 * addEventListener with multiple events at once
	 * @param {EventTarget} target
	 * @param {String} types
	 * @param {Function} handler
	 */
	function addEventListeners(target, types, handler) {
	  each(splitStr(types), function(type) {
	    target.addEventListener(type, handler, false);
	  });
	}

	/**
	 * removeEventListener with multiple events at once
	 * @param {EventTarget} target
	 * @param {String} types
	 * @param {Function} handler
	 */
	function removeEventListeners(target, types, handler) {
	  each(splitStr(types), function(type) {
	    target.removeEventListener(type, handler, false);
	  });
	}

	/**
	 * find if a node is in the given parent
	 * @method hasParent
	 * @param {HTMLElement} node
	 * @param {HTMLElement} parent
	 * @return {Boolean} found
	 */
	function hasParent(node, parent) {
	  while (node) {
	    if (node == parent) {
	      return true;
	    }
	    node = node.parentNode;
	  }
	  return false;
	}

	/**
	 * small indexOf wrapper
	 * @param {String} str
	 * @param {String} find
	 * @returns {Boolean} found
	 */
	function inStr(str, find) {
	  return str.indexOf(find) > -1;
	}

	/**
	 * split string on whitespace
	 * @param {String} str
	 * @returns {Array} words
	 */
	function splitStr(str) {
	  return str.trim().split(/\s+/g);
	}

	/**
	 * find if a array contains the object using indexOf or a simple polyFill
	 * @param {Array} src
	 * @param {String} find
	 * @param {String} [findByKey]
	 * @return {Boolean|Number} false when not found, or the index
	 */
	function inArray(src, find, findByKey) {
	  if (src.indexOf && !findByKey) {
	    return src.indexOf(find);
	  } else {
	    var i = 0;
	    while (i < src.length) {
	      if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
	        return i;
	      }
	      i++;
	    }
	    return -1;
	  }
	}

	/**
	 * convert array-like objects to real arrays
	 * @param {Object} obj
	 * @returns {Array}
	 */
	function toArray(obj) {
	  return Array.prototype.slice.call(obj, 0);
	}

	/**
	 * unique array with objects based on a key (like 'id') or just by the array's value
	 * @param {Array} src [{id:1},{id:2},{id:1}]
	 * @param {String} [key]
	 * @param {Boolean} [sort=False]
	 * @returns {Array} [{id:1},{id:2}]
	 */
	function uniqueArray(src, key, sort) {
	  var results = [];
	  var values = [];
	  var i = 0;

	  while (i < src.length) {
	    var val = key ? src[i][key] : src[i];
	    if (inArray(values, val) < 0) {
	      results.push(src[i]);
	    }
	    values[i] = val;
	    i++;
	  }

	  if (sort) {
	    if (!key) {
	      results = results.sort();
	    } else {
	      results = results.sort(function sortUniqueArray(a, b) {
	        return a[key] > b[key];
	      });
	    }
	  }

	  return results;
	}

	/**
	 * get the prefixed property
	 * @param {Object} obj
	 * @param {String} property
	 * @returns {String|Undefined} prefixed
	 */
	function prefixed(obj, property) {
	  var prefix, prop;
	  var camelProp = property[0].toUpperCase() + property.slice(1);

	  var i = 0;
	  while (i < VENDOR_PREFIXES.length) {
	    prefix = VENDOR_PREFIXES[i];
	    prop = (prefix) ? prefix + camelProp : property;

	    if (prop in obj) {
	      return prop;
	    }
	    i++;
	  }
	  return undefined;
	}

	/**
	 * get a unique id
	 * @returns {number} uniqueId
	 */
	var _uniqueId = 1;
	function uniqueId() {
	  return _uniqueId++;
	}

	/**
	 * get the window object of an element
	 * @param {HTMLElement} element
	 * @returns {DocumentView|Window}
	 */
	function getWindowForElement(element) {
	  var doc = element.ownerDocument || element;
	  return (doc.defaultView || doc.parentWindow || window);
	}

	var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

	var SUPPORT_TOUCH = ('ontouchstart' in window);
	var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
	var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

	var INPUT_TYPE_TOUCH = 'touch';
	var INPUT_TYPE_PEN = 'pen';
	var INPUT_TYPE_MOUSE = 'mouse';
	var INPUT_TYPE_KINECT = 'kinect';

	var COMPUTE_INTERVAL = 25;

	var INPUT_START = 1;
	var INPUT_MOVE = 2;
	var INPUT_END = 4;
	var INPUT_CANCEL = 8;

	var DIRECTION_NONE = 1;
	var DIRECTION_LEFT = 2;
	var DIRECTION_RIGHT = 4;
	var DIRECTION_UP = 8;
	var DIRECTION_DOWN = 16;

	var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
	var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
	var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

	var PROPS_XY = ['x', 'y'];
	var PROPS_CLIENT_XY = ['clientX', 'clientY'];

	/**
	 * create new input type manager
	 * @param {Manager} manager
	 * @param {Function} callback
	 * @returns {Input}
	 * @constructor
	 */
	function Input(manager, callback) {
	  var self = this;
	  this.manager = manager;
	  this.callback = callback;
	  this.element = manager.element;
	  this.target = manager.options.inputTarget;

	  // smaller wrapper around the handler, for the scope and the enabled state of the manager,
	  // so when disabled the input events are completely bypassed.
	  this.domHandler = function(ev) {
	    if (boolOrFn(manager.options.enable, [manager])) {
	      self.handler(ev);
	    }
	  };

	  this.init();

	}

	Input.prototype = {
	  /**
	   * should handle the inputEvent data and trigger the callback
	   * @virtual
	   */
	  handler: function() { },

	  /**
	   * bind the events
	   */
	  init: function() {
	    this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
	    this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
	    this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
	  },

	  /**
	   * unbind the events
	   */
	  destroy: function() {
	    this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
	    this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
	    this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
	  }
	};

	/**
	 * create new input type manager
	 * called by the Manager constructor
	 * @param {Hammer} manager
	 * @returns {Input}
	 */
	function createInputInstance(manager) {
	  var Type;
	  var inputClass = manager.options.inputClass;

	  if (inputClass) {
	    Type = inputClass;
	  } else if (SUPPORT_POINTER_EVENTS) {
	    Type = PointerEventInput;
	  } else if (SUPPORT_ONLY_TOUCH) {
	    Type = TouchInput;
	  } else if (!SUPPORT_TOUCH) {
	    Type = MouseInput;
	  } else {
	    Type = TouchMouseInput;
	  }
	  return new (Type)(manager, inputHandler);
	}

	/**
	 * handle input events
	 * @param {Manager} manager
	 * @param {String} eventType
	 * @param {Object} input
	 */
	function inputHandler(manager, eventType, input) {
	  var pointersLen = input.pointers.length;
	  var changedPointersLen = input.changedPointers.length;
	  var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
	  var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

	  input.isFirst = !!isFirst;
	  input.isFinal = !!isFinal;

	  if (isFirst) {
	    manager.session = {};
	  }

	  // source event is the normalized value of the domEvents
	  // like 'touchstart, mouseup, pointerdown'
	  input.eventType = eventType;

	  // compute scale, rotation etc
	  computeInputData(manager, input);

	  // emit secret event
	  manager.emit('hammer.input', input);

	  manager.recognize(input);
	  manager.session.prevInput = input;
	}

	/**
	 * extend the data with some usable properties like scale, rotate, velocity etc
	 * @param {Object} manager
	 * @param {Object} input
	 */
	function computeInputData(manager, input) {
	  var session = manager.session;
	  var pointers = input.pointers;
	  var pointersLength = pointers.length;

	  // store the first input to calculate the distance and direction
	  if (!session.firstInput) {
	    session.firstInput = simpleCloneInputData(input);
	  }

	  // to compute scale and rotation we need to store the multiple touches
	  if (pointersLength > 1 && !session.firstMultiple) {
	    session.firstMultiple = simpleCloneInputData(input);
	  } else if (pointersLength === 1) {
	    session.firstMultiple = false;
	  }

	  var firstInput = session.firstInput;
	  var firstMultiple = session.firstMultiple;
	  var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

	  var center = input.center = getCenter(pointers);
	  input.timeStamp = now();
	  input.deltaTime = input.timeStamp - firstInput.timeStamp;

	  input.angle = getAngle(offsetCenter, center);
	  input.distance = getDistance(offsetCenter, center);

	  computeDeltaXY(session, input);
	  input.offsetDirection = getDirection(input.deltaX, input.deltaY);

	  var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
	  input.overallVelocityX = overallVelocity.x;
	  input.overallVelocityY = overallVelocity.y;
	  input.overallVelocity = (abs(overallVelocity.x) > abs(overallVelocity.y)) ? overallVelocity.x : overallVelocity.y;

	  input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
	  input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

	  input.maxPointers = !session.prevInput ? input.pointers.length : ((input.pointers.length >
	  session.prevInput.maxPointers) ? input.pointers.length : session.prevInput.maxPointers);

	  computeIntervalInputData(session, input);

	  // find the correct target
	  var target = manager.element;
	  if (hasParent(input.srcEvent.target, target)) {
	    target = input.srcEvent.target;
	  }
	  input.target = target;
	}

	function computeDeltaXY(session, input) {
	  var center = input.center;
	  var offset = session.offsetDelta || {};
	  var prevDelta = session.prevDelta || {};
	  var prevInput = session.prevInput || {};

	  if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
	    prevDelta = session.prevDelta = {
	      x: prevInput.deltaX || 0,
	      y: prevInput.deltaY || 0
	    };

	    offset = session.offsetDelta = {
	      x: center.x,
	      y: center.y
	    };
	  }

	  input.deltaX = prevDelta.x + (center.x - offset.x);
	  input.deltaY = prevDelta.y + (center.y - offset.y);
	}

	/**
	 * velocity is calculated every x ms
	 * @param {Object} session
	 * @param {Object} input
	 */
	function computeIntervalInputData(session, input) {
	  var last = session.lastInterval || input,
	    deltaTime = input.timeStamp - last.timeStamp,
	    velocity, velocityX, velocityY, direction;

	  if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
	    var deltaX = input.deltaX - last.deltaX;
	    var deltaY = input.deltaY - last.deltaY;

	    var v = getVelocity(deltaTime, deltaX, deltaY);
	    velocityX = v.x;
	    velocityY = v.y;
	    velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
	    direction = getDirection(deltaX, deltaY);

	    session.lastInterval = input;
	  } else {
	    // use latest velocity info if it doesn't overtake a minimum period
	    velocity = last.velocity;
	    velocityX = last.velocityX;
	    velocityY = last.velocityY;
	    direction = last.direction;
	  }

	  input.velocity = velocity;
	  input.velocityX = velocityX;
	  input.velocityY = velocityY;
	  input.direction = direction;
	}

	/**
	 * create a simple clone from the input used for storage of firstInput and firstMultiple
	 * @param {Object} input
	 * @returns {Object} clonedInputData
	 */
	function simpleCloneInputData(input) {
	  // make a simple copy of the pointers because we will get a reference if we don't
	  // we only need clientXY for the calculations
	  var pointers = [];
	  var i = 0;
	  while (i < input.pointers.length) {
	    pointers[i] = {
	      clientX: round(input.pointers[i].clientX),
	      clientY: round(input.pointers[i].clientY)
	    };
	    i++;
	  }

	  return {
	    timeStamp: now(),
	    pointers: pointers,
	    center: getCenter(pointers),
	    deltaX: input.deltaX,
	    deltaY: input.deltaY
	  };
	}

	/**
	 * get the center of all the pointers
	 * @param {Array} pointers
	 * @return {Object} center contains `x` and `y` properties
	 */
	function getCenter(pointers) {
	  var pointersLength = pointers.length;

	  // no need to loop when only one touch
	  if (pointersLength === 1) {
	    return {
	      x: round(pointers[0].clientX),
	      y: round(pointers[0].clientY)
	    };
	  }

	  var x = 0, y = 0, i = 0;
	  while (i < pointersLength) {
	    x += pointers[i].clientX;
	    y += pointers[i].clientY;
	    i++;
	  }

	  return {
	    x: round(x / pointersLength),
	    y: round(y / pointersLength)
	  };
	}

	/**
	 * calculate the velocity between two points. unit is in px per ms.
	 * @param {Number} deltaTime
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Object} velocity `x` and `y`
	 */
	function getVelocity(deltaTime, x, y) {
	  return {
	    x: x / deltaTime || 0,
	    y: y / deltaTime || 0
	  };
	}

	/**
	 * get the direction between two points
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Number} direction
	 */
	function getDirection(x, y) {
	  if (x === y) {
	    return DIRECTION_NONE;
	  }

	  if (abs(x) >= abs(y)) {
	    return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
	  }
	  return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
	}

	/**
	 * calculate the absolute distance between two points
	 * @param {Object} p1 {x, y}
	 * @param {Object} p2 {x, y}
	 * @param {Array} [props] containing x and y keys
	 * @return {Number} distance
	 */
	function getDistance(p1, p2, props) {
	  if (!props) {
	    props = PROPS_XY;
	  }
	  var x = p2[props[0]] - p1[props[0]],
	    y = p2[props[1]] - p1[props[1]];

	  return Math.sqrt((x * x) + (y * y));
	}

	/**
	 * calculate the angle between two coordinates
	 * @param {Object} p1
	 * @param {Object} p2
	 * @param {Array} [props] containing x and y keys
	 * @return {Number} angle
	 */
	function getAngle(p1, p2, props) {
	  if (!props) {
	    props = PROPS_XY;
	  }
	  var x = p2[props[0]] - p1[props[0]],
	    y = p2[props[1]] - p1[props[1]];
	  return Math.atan2(y, x) * 180 / Math.PI;
	}

	/**
	 * calculate the rotation degrees between two pointersets
	 * @param {Array} start array of pointers
	 * @param {Array} end array of pointers
	 * @return {Number} rotation
	 */
	function getRotation(start, end) {
	  return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
	}

	/**
	 * calculate the scale factor between two pointersets
	 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
	 * @param {Array} start array of pointers
	 * @param {Array} end array of pointers
	 * @return {Number} scale
	 */
	function getScale(start, end) {
	  return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
	}

	var MOUSE_INPUT_MAP = {
	  mousedown: INPUT_START,
	  mousemove: INPUT_MOVE,
	  mouseup: INPUT_END
	};

	var MOUSE_ELEMENT_EVENTS = 'mousedown';
	var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

	/**
	 * Mouse events input
	 * @constructor
	 * @extends Input
	 */
	function MouseInput() {
	  this.evEl = MOUSE_ELEMENT_EVENTS;
	  this.evWin = MOUSE_WINDOW_EVENTS;

	  this.pressed = false; // mousedown state

	  Input.apply(this, arguments);
	}

	inherit(MouseInput, Input, {
	  /**
	   * handle mouse events
	   * @param {Object} ev
	   */
	  handler: function MEhandler(ev) {
	    var eventType = MOUSE_INPUT_MAP[ev.type];

	    // on start we want to have the left mouse button down
	    if (eventType & INPUT_START && ev.button === 0) {
	      this.pressed = true;
	    }

	    if (eventType & INPUT_MOVE && ev.which !== 1) {
	      eventType = INPUT_END;
	    }

	    // mouse must be down
	    if (!this.pressed) {
	      return;
	    }

	    if (eventType & INPUT_END) {
	      this.pressed = false;
	    }

	    this.callback(this.manager, eventType, {
	      pointers: [ev],
	      changedPointers: [ev],
	      pointerType: INPUT_TYPE_MOUSE,
	      srcEvent: ev
	    });
	  }
	});

	var POINTER_INPUT_MAP = {
	  pointerdown: INPUT_START,
	  pointermove: INPUT_MOVE,
	  pointerup: INPUT_END,
	  pointercancel: INPUT_CANCEL,
	  pointerout: INPUT_CANCEL
	};

	// in IE10 the pointer types is defined as an enum
	var IE10_POINTER_TYPE_ENUM = {
	  2: INPUT_TYPE_TOUCH,
	  3: INPUT_TYPE_PEN,
	  4: INPUT_TYPE_MOUSE,
	  5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
	};

	var POINTER_ELEMENT_EVENTS = 'pointerdown';
	var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

	// IE10 has prefixed support, and case-sensitive
	if (window.MSPointerEvent && !window.PointerEvent) {
	  POINTER_ELEMENT_EVENTS = 'MSPointerDown';
	  POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
	}

	/**
	 * Pointer events input
	 * @constructor
	 * @extends Input
	 */
	function PointerEventInput() {
	  this.evEl = POINTER_ELEMENT_EVENTS;
	  this.evWin = POINTER_WINDOW_EVENTS;

	  Input.apply(this, arguments);

	  this.store = (this.manager.session.pointerEvents = []);
	}

	inherit(PointerEventInput, Input, {
	  /**
	   * handle mouse events
	   * @param {Object} ev
	   */
	  handler: function PEhandler(ev) {
	    var store = this.store;
	    var removePointer = false;

	    var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
	    var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
	    var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

	    var isTouch = (pointerType == INPUT_TYPE_TOUCH);

	    // get index of the event in the store
	    var storeIndex = inArray(store, ev.pointerId, 'pointerId');

	    // start and mouse must be down
	    if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
	      if (storeIndex < 0) {
	        store.push(ev);
	        storeIndex = store.length - 1;
	      }
	    } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
	      removePointer = true;
	    }

	    // it not found, so the pointer hasn't been down (so it's probably a hover)
	    if (storeIndex < 0) {
	      return;
	    }

	    // update the event in the store
	    store[storeIndex] = ev;

	    this.callback(this.manager, eventType, {
	      pointers: store,
	      changedPointers: [ev],
	      pointerType: pointerType,
	      srcEvent: ev
	    });

	    if (removePointer) {
	      // remove from the store
	      store.splice(storeIndex, 1);
	    }
	  }
	});

	var SINGLE_TOUCH_INPUT_MAP = {
	  touchstart: INPUT_START,
	  touchmove: INPUT_MOVE,
	  touchend: INPUT_END,
	  touchcancel: INPUT_CANCEL
	};

	var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
	var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

	/**
	 * Touch events input
	 * @constructor
	 * @extends Input
	 */
	function SingleTouchInput() {
	  this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
	  this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
	  this.started = false;

	  Input.apply(this, arguments);
	}

	inherit(SingleTouchInput, Input, {
	  handler: function TEhandler(ev) {
	    var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

	    // should we handle the touch events?
	    if (type === INPUT_START) {
	      this.started = true;
	    }

	    if (!this.started) {
	      return;
	    }

	    var touches = normalizeSingleTouches.call(this, ev, type);

	    // when done, reset the started state
	    if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
	      this.started = false;
	    }

	    this.callback(this.manager, type, {
	      pointers: touches[0],
	      changedPointers: touches[1],
	      pointerType: INPUT_TYPE_TOUCH,
	      srcEvent: ev
	    });
	  }
	});

	/**
	 * @this {TouchInput}
	 * @param {Object} ev
	 * @param {Number} type flag
	 * @returns {undefined|Array} [all, changed]
	 */
	function normalizeSingleTouches(ev, type) {
	  var all = toArray(ev.touches);
	  var changed = toArray(ev.changedTouches);

	  if (type & (INPUT_END | INPUT_CANCEL)) {
	    all = uniqueArray(all.concat(changed), 'identifier', true);
	  }

	  return [all, changed];
	}

	var TOUCH_INPUT_MAP = {
	  touchstart: INPUT_START,
	  touchmove: INPUT_MOVE,
	  touchend: INPUT_END,
	  touchcancel: INPUT_CANCEL
	};

	var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

	/**
	 * Multi-user touch events input
	 * @constructor
	 * @extends Input
	 */
	function TouchInput() {
	  this.evTarget = TOUCH_TARGET_EVENTS;
	  this.targetIds = {};

	  Input.apply(this, arguments);
	}

	inherit(TouchInput, Input, {
	  handler: function MTEhandler(ev) {
	    var type = TOUCH_INPUT_MAP[ev.type];
	    var touches = getTouches.call(this, ev, type);
	    if (!touches) {
	      return;
	    }

	    this.callback(this.manager, type, {
	      pointers: touches[0],
	      changedPointers: touches[1],
	      pointerType: INPUT_TYPE_TOUCH,
	      srcEvent: ev
	    });
	  }
	});

	/**
	 * @this {TouchInput}
	 * @param {Object} ev
	 * @param {Number} type flag
	 * @returns {undefined|Array} [all, changed]
	 */
	function getTouches(ev, type) {
	  var allTouches = toArray(ev.touches);
	  var targetIds = this.targetIds;

	  // when there is only one touch, the process can be simplified
	  if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
	    targetIds[allTouches[0].identifier] = true;
	    return [allTouches, allTouches];
	  }

	  var i,
	    targetTouches,
	    changedTouches = toArray(ev.changedTouches),
	    changedTargetTouches = [],
	    target = this.target;

	  // get target touches from touches
	  targetTouches = allTouches.filter(function(touch) {
	    return hasParent(touch.target, target);
	  });

	  // collect touches
	  if (type === INPUT_START) {
	    i = 0;
	    while (i < targetTouches.length) {
	      targetIds[targetTouches[i].identifier] = true;
	      i++;
	    }
	  }

	  // filter changed touches to only contain touches that exist in the collected target ids
	  i = 0;
	  while (i < changedTouches.length) {
	    if (targetIds[changedTouches[i].identifier]) {
	      changedTargetTouches.push(changedTouches[i]);
	    }

	    // cleanup removed touches
	    if (type & (INPUT_END | INPUT_CANCEL)) {
	      delete targetIds[changedTouches[i].identifier];
	    }
	    i++;
	  }

	  if (!changedTargetTouches.length) {
	    return;
	  }

	  return [
	    // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
	    uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
	    changedTargetTouches
	  ];
	}

	/**
	 * Combined touch and mouse input
	 *
	 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
	 * This because touch devices also emit mouse events while doing a touch.
	 *
	 * @constructor
	 * @extends Input
	 */

	var DEDUP_TIMEOUT = 2500;
	var DEDUP_DISTANCE = 25;

	function TouchMouseInput() {
	  Input.apply(this, arguments);

	  var handler = bindFn(this.handler, this);
	  this.touch = new TouchInput(this.manager, handler);
	  this.mouse = new MouseInput(this.manager, handler);

	  this.primaryTouch = null;
	  this.lastTouches = [];
	}

	inherit(TouchMouseInput, Input, {
	  /**
	   * handle mouse and touch events
	   * @param {Hammer} manager
	   * @param {String} inputEvent
	   * @param {Object} inputData
	   */
	  handler: function TMEhandler(manager, inputEvent, inputData) {
	    var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
	      isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

	    if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
	      return;
	    }

	    // when we're in a touch event, record touches to  de-dupe synthetic mouse event
	    if (isTouch) {
	      recordTouches.call(this, inputEvent, inputData);
	    } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
	      return;
	    }

	    this.callback(manager, inputEvent, inputData);
	  },

	  /**
	   * remove the event listeners
	   */
	  destroy: function destroy() {
	    this.touch.destroy();
	    this.mouse.destroy();
	  }
	});

	function recordTouches(eventType, eventData) {
	  if (eventType & INPUT_START) {
	    this.primaryTouch = eventData.changedPointers[0].identifier;
	    setLastTouch.call(this, eventData);
	  } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
	    setLastTouch.call(this, eventData);
	  }
	}

	function setLastTouch(eventData) {
	  var touch = eventData.changedPointers[0];

	  if (touch.identifier === this.primaryTouch) {
	    var lastTouch = {x: touch.clientX, y: touch.clientY};
	    this.lastTouches.push(lastTouch);
	    var lts = this.lastTouches;
	    var removeLastTouch = function() {
	      var i = lts.indexOf(lastTouch);
	      if (i > -1) {
	        lts.splice(i, 1);
	      }
	    };
	    setTimeout(removeLastTouch, DEDUP_TIMEOUT);
	  }
	}

	function isSyntheticEvent(eventData) {
	  var x = eventData.srcEvent.clientX, y = eventData.srcEvent.clientY;
	  for (var i = 0; i < this.lastTouches.length; i++) {
	    var t = this.lastTouches[i];
	    var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
	    if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
	      return true;
	    }
	  }
	  return false;
	}

	var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
	var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

	// magical touchAction value
	var TOUCH_ACTION_COMPUTE = 'compute';
	var TOUCH_ACTION_AUTO = 'auto';
	var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
	var TOUCH_ACTION_NONE = 'none';
	var TOUCH_ACTION_PAN_X = 'pan-x';
	var TOUCH_ACTION_PAN_Y = 'pan-y';
	var TOUCH_ACTION_MAP = getTouchActionProps();

	/**
	 * Touch Action
	 * sets the touchAction property or uses the js alternative
	 * @param {Manager} manager
	 * @param {String} value
	 * @constructor
	 */
	function TouchAction(manager, value) {
	  this.manager = manager;
	  this.set(value);
	}

	TouchAction.prototype = {
	  /**
	   * set the touchAction value on the element or enable the polyfill
	   * @param {String} value
	   */
	  set: function(value) {
	    // find out the touch-action by the event handlers
	    if (value == TOUCH_ACTION_COMPUTE) {
	      value = this.compute();
	    }

	    if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
	      this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
	    }
	    this.actions = value.toLowerCase().trim();
	  },

	  /**
	   * just re-set the touchAction value
	   */
	  update: function() {
	    this.set(this.manager.options.touchAction);
	  },

	  /**
	   * compute the value for the touchAction property based on the recognizer's settings
	   * @returns {String} value
	   */
	  compute: function() {
	    var actions = [];
	    each(this.manager.recognizers, function(recognizer) {
	      if (boolOrFn(recognizer.options.enable, [recognizer])) {
	        actions = actions.concat(recognizer.getTouchAction());
	      }
	    });
	    return cleanTouchActions(actions.join(' '));
	  },

	  /**
	   * this method is called on each input cycle and provides the preventing of the browser behavior
	   * @param {Object} input
	   */
	  preventDefaults: function(input) {
	    var srcEvent = input.srcEvent;
	    var direction = input.offsetDirection;

	    // if the touch action did prevented once this session
	    if (this.manager.session.prevented) {
	      srcEvent.preventDefault();
	      return;
	    }

	    var actions = this.actions;
	    var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
	    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
	    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

	    if (hasNone) {
	      //do not prevent defaults if this is a tap gesture

	      var isTapPointer = input.pointers.length === 1;
	      var isTapMovement = input.distance < 2;
	      var isTapTouchTime = input.deltaTime < 250;

	      if (isTapPointer && isTapMovement && isTapTouchTime) {
	        return;
	      }
	    }

	    if (hasPanX && hasPanY) {
	      // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
	      return;
	    }

	    if (hasNone ||
	      (hasPanY && direction & DIRECTION_HORIZONTAL) ||
	      (hasPanX && direction & DIRECTION_VERTICAL)) {
	      return this.preventSrc(srcEvent);
	    }
	  },

	  /**
	   * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
	   * @param {Object} srcEvent
	   */
	  preventSrc: function(srcEvent) {
	    this.manager.session.prevented = true;
	    srcEvent.preventDefault();
	  }
	};

	/**
	 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
	 * @param {String} actions
	 * @returns {*}
	 */
	function cleanTouchActions(actions) {
	  // none
	  if (inStr(actions, TOUCH_ACTION_NONE)) {
	    return TOUCH_ACTION_NONE;
	  }

	  var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
	  var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

	  // if both pan-x and pan-y are set (different recognizers
	  // for different directions, e.g. horizontal pan but vertical swipe?)
	  // we need none (as otherwise with pan-x pan-y combined none of these
	  // recognizers will work, since the browser would handle all panning
	  if (hasPanX && hasPanY) {
	    return TOUCH_ACTION_NONE;
	  }

	  // pan-x OR pan-y
	  if (hasPanX || hasPanY) {
	    return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
	  }

	  // manipulation
	  if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
	    return TOUCH_ACTION_MANIPULATION;
	  }

	  return TOUCH_ACTION_AUTO;
	}

	function getTouchActionProps() {
	  if (!NATIVE_TOUCH_ACTION) {
	    return false;
	  }
	  var touchMap = {};
	  var cssSupports = window.CSS && window.CSS.supports;
	  ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function(val) {

	    // If css.supports is not supported but there is native touch-action assume it supports
	    // all values. This is the case for IE 10 and 11.
	    touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
	  });
	  return touchMap;
	}

	/**
	 * Recognizer flow explained; *
	 * All recognizers have the initial state of POSSIBLE when a input session starts.
	 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
	 * Example session for mouse-input: mousedown -> mousemove -> mouseup
	 *
	 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
	 * which determines with state it should be.
	 *
	 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
	 * POSSIBLE to give it another change on the next cycle.
	 *
	 *               Possible
	 *                  |
	 *            +-----+---------------+
	 *            |                     |
	 *      +-----+-----+               |
	 *      |           |               |
	 *   Failed      Cancelled          |
	 *                          +-------+------+
	 *                          |              |
	 *                      Recognized       Began
	 *                                         |
	 *                                      Changed
	 *                                         |
	 *                                  Ended/Recognized
	 */
	var STATE_POSSIBLE = 1;
	var STATE_BEGAN = 2;
	var STATE_CHANGED = 4;
	var STATE_ENDED = 8;
	var STATE_RECOGNIZED = STATE_ENDED;
	var STATE_CANCELLED = 16;
	var STATE_FAILED = 32;

	/**
	 * Recognizer
	 * Every recognizer needs to extend from this class.
	 * @constructor
	 * @param {Object} options
	 */
	function Recognizer(options) {
	  this.options = assign({}, this.defaults, options || {});

	  this.id = uniqueId();

	  this.manager = null;

	  // default is enable true
	  this.options.enable = ifUndefined(this.options.enable, true);

	  this.state = STATE_POSSIBLE;

	  this.simultaneous = {};
	  this.requireFail = [];
	}

	Recognizer.prototype = {
	  /**
	   * @virtual
	   * @type {Object}
	   */
	  defaults: {},

	  /**
	   * set options
	   * @param {Object} options
	   * @return {Recognizer}
	   */
	  set: function(options) {
	    assign(this.options, options);

	    // also update the touchAction, in case something changed about the directions/enabled state
	    this.manager && this.manager.touchAction.update();
	    return this;
	  },

	  /**
	   * recognize simultaneous with an other recognizer.
	   * @param {Recognizer} otherRecognizer
	   * @returns {Recognizer} this
	   */
	  recognizeWith: function(otherRecognizer) {
	    if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
	      return this;
	    }

	    var simultaneous = this.simultaneous;
	    otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	    if (!simultaneous[otherRecognizer.id]) {
	      simultaneous[otherRecognizer.id] = otherRecognizer;
	      otherRecognizer.recognizeWith(this);
	    }
	    return this;
	  },

	  /**
	   * drop the simultaneous link. it doesnt remove the link on the other recognizer.
	   * @param {Recognizer} otherRecognizer
	   * @returns {Recognizer} this
	   */
	  dropRecognizeWith: function(otherRecognizer) {
	    if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
	      return this;
	    }

	    otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	    delete this.simultaneous[otherRecognizer.id];
	    return this;
	  },

	  /**
	   * recognizer can only run when an other is failing
	   * @param {Recognizer} otherRecognizer
	   * @returns {Recognizer} this
	   */
	  requireFailure: function(otherRecognizer) {
	    if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
	      return this;
	    }

	    var requireFail = this.requireFail;
	    otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	    if (inArray(requireFail, otherRecognizer) === -1) {
	      requireFail.push(otherRecognizer);
	      otherRecognizer.requireFailure(this);
	    }
	    return this;
	  },

	  /**
	   * drop the requireFailure link. it does not remove the link on the other recognizer.
	   * @param {Recognizer} otherRecognizer
	   * @returns {Recognizer} this
	   */
	  dropRequireFailure: function(otherRecognizer) {
	    if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
	      return this;
	    }

	    otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	    var index = inArray(this.requireFail, otherRecognizer);
	    if (index > -1) {
	      this.requireFail.splice(index, 1);
	    }
	    return this;
	  },

	  /**
	   * has require failures boolean
	   * @returns {boolean}
	   */
	  hasRequireFailures: function() {
	    return this.requireFail.length > 0;
	  },

	  /**
	   * if the recognizer can recognize simultaneous with an other recognizer
	   * @param {Recognizer} otherRecognizer
	   * @returns {Boolean}
	   */
	  canRecognizeWith: function(otherRecognizer) {
	    return !!this.simultaneous[otherRecognizer.id];
	  },

	  /**
	   * You should use `tryEmit` instead of `emit` directly to check
	   * that all the needed recognizers has failed before emitting.
	   * @param {Object} input
	   */
	  emit: function(input) {
	    var self = this;
	    var state = this.state;

	    function emit(event) {
	      self.manager.emit(event, input);
	    }

	    // 'panstart' and 'panmove'
	    if (state < STATE_ENDED) {
	      emit(self.options.event + stateStr(state));
	    }

	    emit(self.options.event); // simple 'eventName' events

	    if (input.additionalEvent) { // additional event(panleft, panright, pinchin, pinchout...)
	      emit(input.additionalEvent);
	    }

	    // panend and pancancel
	    if (state >= STATE_ENDED) {
	      emit(self.options.event + stateStr(state));
	    }
	  },

	  /**
	   * Check that all the require failure recognizers has failed,
	   * if true, it emits a gesture event,
	   * otherwise, setup the state to FAILED.
	   * @param {Object} input
	   */
	  tryEmit: function(input) {
	    if (this.canEmit()) {
	      return this.emit(input);
	    }
	    // it's failing anyway
	    this.state = STATE_FAILED;
	  },

	  /**
	   * can we emit?
	   * @returns {boolean}
	   */
	  canEmit: function() {
	    var i = 0;
	    while (i < this.requireFail.length) {
	      if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
	        return false;
	      }
	      i++;
	    }
	    return true;
	  },

	  /**
	   * update the recognizer
	   * @param {Object} inputData
	   */
	  recognize: function(inputData) {
	    // make a new copy of the inputData
	    // so we can change the inputData without messing up the other recognizers
	    var inputDataClone = assign({}, inputData);

	    // is is enabled and allow recognizing?
	    if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
	      this.reset();
	      this.state = STATE_FAILED;
	      return;
	    }

	    // reset when we've reached the end
	    if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
	      this.state = STATE_POSSIBLE;
	    }

	    this.state = this.process(inputDataClone);

	    // the recognizer has recognized a gesture
	    // so trigger an event
	    if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
	      this.tryEmit(inputDataClone);
	    }
	  },

	  /**
	   * return the state of the recognizer
	   * the actual recognizing happens in this method
	   * @virtual
	   * @param {Object} inputData
	   * @returns {Const} STATE
	   */
	  process: function(inputData) { }, // jshint ignore:line

	  /**
	   * return the preferred touch-action
	   * @virtual
	   * @returns {Array}
	   */
	  getTouchAction: function() { },

	  /**
	   * called when the gesture isn't allowed to recognize
	   * like when another is being recognized or it is disabled
	   * @virtual
	   */
	  reset: function() { }
	};

	/**
	 * get a usable string, used as event postfix
	 * @param {Const} state
	 * @returns {String} state
	 */
	function stateStr(state) {
	  if (state & STATE_CANCELLED) {
	    return 'cancel';
	  } else if (state & STATE_ENDED) {
	    return 'end';
	  } else if (state & STATE_CHANGED) {
	    return 'move';
	  } else if (state & STATE_BEGAN) {
	    return 'start';
	  }
	  return '';
	}

	/**
	 * direction cons to string
	 * @param {Const} direction
	 * @returns {String}
	 */
	function directionStr(direction) {
	  if (direction == DIRECTION_DOWN) {
	    return 'down';
	  } else if (direction == DIRECTION_UP) {
	    return 'up';
	  } else if (direction == DIRECTION_LEFT) {
	    return 'left';
	  } else if (direction == DIRECTION_RIGHT) {
	    return 'right';
	  }
	  return '';
	}

	/**
	 * get a recognizer by name if it is bound to a manager
	 * @param {Recognizer|String} otherRecognizer
	 * @param {Recognizer} recognizer
	 * @returns {Recognizer}
	 */
	function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
	  var manager = recognizer.manager;
	  if (manager) {
	    return manager.get(otherRecognizer);
	  }
	  return otherRecognizer;
	}

	/**
	 * This recognizer is just used as a base for the simple attribute recognizers.
	 * @constructor
	 * @extends Recognizer
	 */
	function AttrRecognizer() {
	  Recognizer.apply(this, arguments);
	}

	inherit(AttrRecognizer, Recognizer, {
	  /**
	   * @namespace
	   * @memberof AttrRecognizer
	   */
	  defaults: {
	    /**
	     * @type {Number}
	     * @default 1
	     */
	    pointers: 1
	  },

	  /**
	   * Used to check if it the recognizer receives valid input, like input.distance > 10.
	   * @memberof AttrRecognizer
	   * @param {Object} input
	   * @returns {Boolean} recognized
	   */
	  attrTest: function(input) {
	    var optionPointers = this.options.pointers;
	    return optionPointers === 0 || input.pointers.length === optionPointers;
	  },

	  /**
	   * Process the input and return the state for the recognizer
	   * @memberof AttrRecognizer
	   * @param {Object} input
	   * @returns {*} State
	   */
	  process: function(input) {
	    var state = this.state;
	    var eventType = input.eventType;

	    var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
	    var isValid = this.attrTest(input);

	    // on cancel input and we've recognized before, return STATE_CANCELLED
	    if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
	      return state | STATE_CANCELLED;
	    } else if (isRecognized || isValid) {
	      if (eventType & INPUT_END) {
	        return state | STATE_ENDED;
	      } else if (!(state & STATE_BEGAN)) {
	        return STATE_BEGAN;
	      }
	      return state | STATE_CHANGED;
	    }
	    return STATE_FAILED;
	  }
	});

	/**
	 * Pan
	 * Recognized when the pointer is down and moved in the allowed direction.
	 * @constructor
	 * @extends AttrRecognizer
	 */
	function PanRecognizer() {
	  AttrRecognizer.apply(this, arguments);

	  this.pX = null;
	  this.pY = null;
	}

	inherit(PanRecognizer, AttrRecognizer, {
	  /**
	   * @namespace
	   * @memberof PanRecognizer
	   */
	  defaults: {
	    event: 'pan',
	    threshold: 10,
	    pointers: 1,
	    direction: DIRECTION_ALL
	  },

	  getTouchAction: function() {
	    var direction = this.options.direction;
	    var actions = [];
	    if (direction & DIRECTION_HORIZONTAL) {
	      actions.push(TOUCH_ACTION_PAN_Y);
	    }
	    if (direction & DIRECTION_VERTICAL) {
	      actions.push(TOUCH_ACTION_PAN_X);
	    }
	    return actions;
	  },

	  directionTest: function(input) {
	    var options = this.options;
	    var hasMoved = true;
	    var distance = input.distance;
	    var direction = input.direction;
	    var x = input.deltaX;
	    var y = input.deltaY;

	    // lock to axis?
	    if (!(direction & options.direction)) {
	      if (options.direction & DIRECTION_HORIZONTAL) {
	        direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
	        hasMoved = x != this.pX;
	        distance = Math.abs(input.deltaX);
	      } else {
	        direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
	        hasMoved = y != this.pY;
	        distance = Math.abs(input.deltaY);
	      }
	    }
	    input.direction = direction;
	    return hasMoved && distance > options.threshold && direction & options.direction;
	  },

	  attrTest: function(input) {
	    return AttrRecognizer.prototype.attrTest.call(this, input) &&
	      (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
	  },

	  emit: function(input) {

	    this.pX = input.deltaX;
	    this.pY = input.deltaY;

	    var direction = directionStr(input.direction);

	    if (direction) {
	      input.additionalEvent = this.options.event + direction;
	    }
	    this._super.emit.call(this, input);
	  }
	});

	/**
	 * Pinch
	 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
	 * @constructor
	 * @extends AttrRecognizer
	 */
	function PinchRecognizer() {
	  AttrRecognizer.apply(this, arguments);
	}

	inherit(PinchRecognizer, AttrRecognizer, {
	  /**
	   * @namespace
	   * @memberof PinchRecognizer
	   */
	  defaults: {
	    event: 'pinch',
	    threshold: 0,
	    pointers: 2
	  },

	  getTouchAction: function() {
	    return [TOUCH_ACTION_NONE];
	  },

	  attrTest: function(input) {
	    return this._super.attrTest.call(this, input) &&
	      (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
	  },

	  emit: function(input) {
	    if (input.scale !== 1) {
	      var inOut = input.scale < 1 ? 'in' : 'out';
	      input.additionalEvent = this.options.event + inOut;
	    }
	    this._super.emit.call(this, input);
	  }
	});

	/**
	 * Press
	 * Recognized when the pointer is down for x ms without any movement.
	 * @constructor
	 * @extends Recognizer
	 */
	function PressRecognizer() {
	  Recognizer.apply(this, arguments);

	  this._timer = null;
	  this._input = null;
	}

	inherit(PressRecognizer, Recognizer, {
	  /**
	   * @namespace
	   * @memberof PressRecognizer
	   */
	  defaults: {
	    event: 'press',
	    pointers: 1,
	    time: 251, // minimal time of the pointer to be pressed
	    threshold: 9 // a minimal movement is ok, but keep it low
	  },

	  getTouchAction: function() {
	    return [TOUCH_ACTION_AUTO];
	  },

	  process: function(input) {
	    var options = this.options;
	    var validPointers = input.pointers.length === options.pointers;
	    var validMovement = input.distance < options.threshold;
	    var validTime = input.deltaTime > options.time;

	    this._input = input;

	    // we only allow little movement
	    // and we've reached an end event, so a tap is possible
	    if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
	      this.reset();
	    } else if (input.eventType & INPUT_START) {
	      this.reset();
	      this._timer = setTimeoutContext(function() {
	        this.state = STATE_RECOGNIZED;
	        this.tryEmit();
	      }, options.time, this);
	    } else if (input.eventType & INPUT_END) {
	      return STATE_RECOGNIZED;
	    }
	    return STATE_FAILED;
	  },

	  reset: function() {
	    clearTimeout(this._timer);
	  },

	  emit: function(input) {
	    if (this.state !== STATE_RECOGNIZED) {
	      return;
	    }

	    if (input && (input.eventType & INPUT_END)) {
	      this.manager.emit(this.options.event + 'up', input);
	    } else {
	      this._input.timeStamp = now();
	      this.manager.emit(this.options.event, this._input);
	    }
	  }
	});

	/**
	 * Rotate
	 * Recognized when two or more pointer are moving in a circular motion.
	 * @constructor
	 * @extends AttrRecognizer
	 */
	function RotateRecognizer() {
	  AttrRecognizer.apply(this, arguments);
	}

	inherit(RotateRecognizer, AttrRecognizer, {
	  /**
	   * @namespace
	   * @memberof RotateRecognizer
	   */
	  defaults: {
	    event: 'rotate',
	    threshold: 0,
	    pointers: 2
	  },

	  getTouchAction: function() {
	    return [TOUCH_ACTION_NONE];
	  },

	  attrTest: function(input) {
	    return this._super.attrTest.call(this, input) &&
	      (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
	  }
	});

	/**
	 * Swipe
	 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
	 * @constructor
	 * @extends AttrRecognizer
	 */
	function SwipeRecognizer() {
	  AttrRecognizer.apply(this, arguments);
	}

	inherit(SwipeRecognizer, AttrRecognizer, {
	  /**
	   * @namespace
	   * @memberof SwipeRecognizer
	   */
	  defaults: {
	    event: 'swipe',
	    threshold: 10,
	    velocity: 0.3,
	    direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
	    pointers: 1
	  },

	  getTouchAction: function() {
	    return PanRecognizer.prototype.getTouchAction.call(this);
	  },

	  attrTest: function(input) {
	    var direction = this.options.direction;
	    var velocity;

	    if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
	      velocity = input.overallVelocity;
	    } else if (direction & DIRECTION_HORIZONTAL) {
	      velocity = input.overallVelocityX;
	    } else if (direction & DIRECTION_VERTICAL) {
	      velocity = input.overallVelocityY;
	    }

	    return this._super.attrTest.call(this, input) &&
	      direction & input.offsetDirection &&
	      input.distance > this.options.threshold &&
	      input.maxPointers == this.options.pointers &&
	      abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
	  },

	  emit: function(input) {
	    var direction = directionStr(input.offsetDirection);
	    if (direction) {
	      this.manager.emit(this.options.event + direction, input);
	    }

	    this.manager.emit(this.options.event, input);
	  }
	});

	/**
	 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
	 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
	 * a single tap.
	 *
	 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
	 * multi-taps being recognized.
	 * @constructor
	 * @extends Recognizer
	 */
	function TapRecognizer() {
	  Recognizer.apply(this, arguments);

	  // previous time and center,
	  // used for tap counting
	  this.pTime = false;
	  this.pCenter = false;

	  this._timer = null;
	  this._input = null;
	  this.count = 0;
	}

	inherit(TapRecognizer, Recognizer, {
	  /**
	   * @namespace
	   * @memberof PinchRecognizer
	   */
	  defaults: {
	    event: 'tap',
	    pointers: 1,
	    taps: 1,
	    interval: 300, // max time between the multi-tap taps
	    time: 250, // max time of the pointer to be down (like finger on the screen)
	    threshold: 9, // a minimal movement is ok, but keep it low
	    posThreshold: 10 // a multi-tap can be a bit off the initial position
	  },

	  getTouchAction: function() {
	    return [TOUCH_ACTION_MANIPULATION];
	  },

	  process: function(input) {
	    var options = this.options;

	    var validPointers = input.pointers.length === options.pointers;
	    var validMovement = input.distance < options.threshold;
	    var validTouchTime = input.deltaTime < options.time;

	    this.reset();

	    if ((input.eventType & INPUT_START) && (this.count === 0)) {
	      return this.failTimeout();
	    }

	    // we only allow little movement
	    // and we've reached an end event, so a tap is possible
	    if (validMovement && validTouchTime && validPointers) {
	      if (input.eventType != INPUT_END) {
	        return this.failTimeout();
	      }

	      var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
	      var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

	      this.pTime = input.timeStamp;
	      this.pCenter = input.center;

	      if (!validMultiTap || !validInterval) {
	        this.count = 1;
	      } else {
	        this.count += 1;
	      }

	      this._input = input;

	      // if tap count matches we have recognized it,
	      // else it has began recognizing...
	      var tapCount = this.count % options.taps;
	      if (tapCount === 0) {
	        // no failing requirements, immediately trigger the tap event
	        // or wait as long as the multitap interval to trigger
	        if (!this.hasRequireFailures()) {
	          return STATE_RECOGNIZED;
	        } else {
	          this._timer = setTimeoutContext(function() {
	            this.state = STATE_RECOGNIZED;
	            this.tryEmit();
	          }, options.interval, this);
	          return STATE_BEGAN;
	        }
	      }
	    }
	    return STATE_FAILED;
	  },

	  failTimeout: function() {
	    this._timer = setTimeoutContext(function() {
	      this.state = STATE_FAILED;
	    }, this.options.interval, this);
	    return STATE_FAILED;
	  },

	  reset: function() {
	    clearTimeout(this._timer);
	  },

	  emit: function() {
	    if (this.state == STATE_RECOGNIZED) {
	      this._input.tapCount = this.count;
	      this.manager.emit(this.options.event, this._input);
	    }
	  }
	});

	/**
	 * Simple way to create a manager with a default set of recognizers.
	 * @param {HTMLElement} element
	 * @param {Object} [options]
	 * @constructor
	 */
	function Hammer(element, options) {
	  options = options || {};
	  options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
	  return new Manager(element, options);
	}

	/**
	 * @const {string}
	 */
	Hammer.VERSION = '2.0.7';

	/**
	 * default settings
	 * @namespace
	 */
	Hammer.defaults = {
	  /**
	   * set if DOM events are being triggered.
	   * But this is slower and unused by simple implementations, so disabled by default.
	   * @type {Boolean}
	   * @default false
	   */
	  domEvents: false,

	  /**
	   * The value for the touchAction property/fallback.
	   * When set to `compute` it will magically set the correct value based on the added recognizers.
	   * @type {String}
	   * @default compute
	   */
	  touchAction: TOUCH_ACTION_COMPUTE,

	  /**
	   * @type {Boolean}
	   * @default true
	   */
	  enable: true,

	  /**
	   * EXPERIMENTAL FEATURE -- can be removed/changed
	   * Change the parent input target element.
	   * If Null, then it is being set the to main element.
	   * @type {Null|EventTarget}
	   * @default null
	   */
	  inputTarget: null,

	  /**
	   * force an input class
	   * @type {Null|Function}
	   * @default null
	   */
	  inputClass: null,

	  /**
	   * Default recognizer setup when calling `Hammer()`
	   * When creating a new Manager these will be skipped.
	   * @type {Array}
	   */
	  preset: [
	    // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
	    [RotateRecognizer, {enable: false}],
	    [PinchRecognizer, {enable: false}, ['rotate']],
	    [SwipeRecognizer, {direction: DIRECTION_HORIZONTAL}],
	    [PanRecognizer, {direction: DIRECTION_HORIZONTAL}, ['swipe']],
	    [TapRecognizer],
	    [TapRecognizer, {event: 'doubletap', taps: 2}, ['tap']],
	    [PressRecognizer]
	  ],

	  /**
	   * Some CSS properties can be used to improve the working of Hammer.
	   * Add them to this method and they will be set when creating a new Manager.
	   * @namespace
	   */
	  cssProps: {
	    /**
	     * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
	     * @type {String}
	     * @default 'none'
	     */
	    userSelect: 'none',

	    /**
	     * Disable the Windows Phone grippers when pressing an element.
	     * @type {String}
	     * @default 'none'
	     */
	    touchSelect: 'none',

	    /**
	     * Disables the default callout shown when you touch and hold a touch target.
	     * On iOS, when you touch and hold a touch target such as a link, Safari displays
	     * a callout containing information about the link. This property allows you to disable that callout.
	     * @type {String}
	     * @default 'none'
	     */
	    touchCallout: 'none',

	    /**
	     * Specifies whether zooming is enabled. Used by IE10>
	     * @type {String}
	     * @default 'none'
	     */
	    contentZooming: 'none',

	    /**
	     * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
	     * @type {String}
	     * @default 'none'
	     */
	    userDrag: 'none',

	    /**
	     * Overrides the highlight color shown when the user taps a link or a JavaScript
	     * clickable element in iOS. This property obeys the alpha value, if specified.
	     * @type {String}
	     * @default 'rgba(0,0,0,0)'
	     */
	    tapHighlightColor: 'rgba(0,0,0,0)'
	  }
	};

	var STOP = 1;
	var FORCED_STOP = 2;

	/**
	 * Manager
	 * @param {HTMLElement} element
	 * @param {Object} [options]
	 * @constructor
	 */
	function Manager(element, options) {
	  this.options = assign({}, Hammer.defaults, options || {});

	  this.options.inputTarget = this.options.inputTarget || element;

	  this.handlers = {};
	  this.session = {};
	  this.recognizers = [];
	  this.oldCssProps = {};

	  this.element = element;
	  this.input = createInputInstance(this);
	  this.touchAction = new TouchAction(this, this.options.touchAction);

	  toggleCssProps(this, true);

	  each(this.options.recognizers, function(item) {
	    var recognizer = this.add(new (item[0])(item[1]));
	    item[2] && recognizer.recognizeWith(item[2]);
	    item[3] && recognizer.requireFailure(item[3]);
	  }, this);
	}

	Manager.prototype = {
	  /**
	   * set options
	   * @param {Object} options
	   * @returns {Manager}
	   */
	  set: function(options) {
	    assign(this.options, options);

	    // Options that need a little more setup
	    if (options.touchAction) {
	      this.touchAction.update();
	    }
	    if (options.inputTarget) {
	      // Clean up existing event listeners and reinitialize
	      this.input.destroy();
	      this.input.target = options.inputTarget;
	      this.input.init();
	    }
	    return this;
	  },

	  /**
	   * stop recognizing for this session.
	   * This session will be discarded, when a new [input]start event is fired.
	   * When forced, the recognizer cycle is stopped immediately.
	   * @param {Boolean} [force]
	   */
	  stop: function(force) {
	    this.session.stopped = force ? FORCED_STOP : STOP;
	  },

	  /**
	   * run the recognizers!
	   * called by the inputHandler function on every movement of the pointers (touches)
	   * it walks through all the recognizers and tries to detect the gesture that is being made
	   * @param {Object} inputData
	   */
	  recognize: function(inputData) {
	    var session = this.session;
	    if (session.stopped) {
	      return;
	    }

	    // run the touch-action polyfill
	    this.touchAction.preventDefaults(inputData);

	    var recognizer;
	    var recognizers = this.recognizers;

	    // this holds the recognizer that is being recognized.
	    // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
	    // if no recognizer is detecting a thing, it is set to `null`
	    var curRecognizer = session.curRecognizer;

	    // reset when the last recognizer is recognized
	    // or when we're in a new session
	    if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
	      curRecognizer = session.curRecognizer = null;
	    }

	    var i = 0;
	    while (i < recognizers.length) {
	      recognizer = recognizers[i];

	      // find out if we are allowed try to recognize the input for this one.
	      // 1.   allow if the session is NOT forced stopped (see the .stop() method)
	      // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
	      //      that is being recognized.
	      // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
	      //      this can be setup with the `recognizeWith()` method on the recognizer.
	      if (session.stopped !== FORCED_STOP && ( // 1
	        !curRecognizer || recognizer == curRecognizer || // 2
	        recognizer.canRecognizeWith(curRecognizer))) { // 3
	        recognizer.recognize(inputData);
	      } else {
	        recognizer.reset();
	      }

	      // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
	      // current active recognizer. but only if we don't already have an active recognizer
	      if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
	        curRecognizer = session.curRecognizer = recognizer;
	      }
	      i++;
	    }
	  },

	  /**
	   * get a recognizer by its event name.
	   * @param {Recognizer|String} recognizer
	   * @returns {Recognizer|Null}
	   */
	  get: function(recognizer) {
	    if (recognizer instanceof Recognizer) {
	      return recognizer;
	    }

	    var recognizers = this.recognizers;
	    for (var i = 0; i < recognizers.length; i++) {
	      if (recognizers[i].options.event == recognizer) {
	        return recognizers[i];
	      }
	    }
	    return null;
	  },

	  /**
	   * add a recognizer to the manager
	   * existing recognizers with the same event name will be removed
	   * @param {Recognizer} recognizer
	   * @returns {Recognizer|Manager}
	   */
	  add: function(recognizer) {
	    if (invokeArrayArg(recognizer, 'add', this)) {
	      return this;
	    }

	    // remove existing
	    var existing = this.get(recognizer.options.event);
	    if (existing) {
	      this.remove(existing);
	    }

	    this.recognizers.push(recognizer);
	    recognizer.manager = this;

	    this.touchAction.update();
	    return recognizer;
	  },

	  /**
	   * remove a recognizer by name or instance
	   * @param {Recognizer|String} recognizer
	   * @returns {Manager}
	   */
	  remove: function(recognizer) {
	    if (invokeArrayArg(recognizer, 'remove', this)) {
	      return this;
	    }

	    recognizer = this.get(recognizer);

	    // let's make sure this recognizer exists
	    if (recognizer) {
	      var recognizers = this.recognizers;
	      var index = inArray(recognizers, recognizer);

	      if (index !== -1) {
	        recognizers.splice(index, 1);
	        this.touchAction.update();
	      }
	    }

	    return this;
	  },

	  /**
	   * bind event
	   * @param {String} events
	   * @param {Function} handler
	   * @returns {EventEmitter} this
	   */
	  on: function(events, handler) {
	    if (events === undefined) {
	      return;
	    }
	    if (handler === undefined) {
	      return;
	    }

	    var handlers = this.handlers;
	    each(splitStr(events), function(event) {
	      handlers[event] = handlers[event] || [];
	      handlers[event].push(handler);
	    });
	    return this;
	  },

	  /**
	   * unbind event, leave emit blank to remove all handlers
	   * @param {String} events
	   * @param {Function} [handler]
	   * @returns {EventEmitter} this
	   */
	  off: function(events, handler) {
	    if (events === undefined) {
	      return;
	    }

	    var handlers = this.handlers;
	    each(splitStr(events), function(event) {
	      if (!handler) {
	        delete handlers[event];
	      } else {
	        handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
	      }
	    });
	    return this;
	  },

	  /**
	   * emit event to the listeners
	   * @param {String} event
	   * @param {Object} data
	   */
	  emit: function(event, data) {
	    // we also want to trigger dom events
	    if (this.options.domEvents) {
	      triggerDomEvent(event, data);
	    }

	    // no handlers, so skip it all
	    var handlers = this.handlers[event] && this.handlers[event].slice();
	    if (!handlers || !handlers.length) {
	      return;
	    }

	    data.type = event;
	    data.preventDefault = function() {
	      data.srcEvent.preventDefault();
	    };

	    var i = 0;
	    while (i < handlers.length) {
	      handlers[i](data);
	      i++;
	    }
	  },

	  /**
	   * destroy the manager and unbinds all events
	   * it doesn't unbind dom events, that is the user own responsibility
	   */
	  destroy: function() {
	    this.element && toggleCssProps(this, false);

	    this.handlers = {};
	    this.session = {};
	    this.input.destroy();
	    this.element = null;
	  }
	};

	/**
	 * add/remove the css properties as defined in manager.options.cssProps
	 * @param {Manager} manager
	 * @param {Boolean} add
	 */
	function toggleCssProps(manager, add) {
	  var element = manager.element;
	  if (!element.style) {
	    return;
	  }
	  var prop;
	  each(manager.options.cssProps, function(value, name) {
	    prop = prefixed(element.style, name);
	    if (add) {
	      manager.oldCssProps[prop] = element.style[prop];
	      element.style[prop] = value;
	    } else {
	      element.style[prop] = manager.oldCssProps[prop] || '';
	    }
	  });
	  if (!add) {
	    manager.oldCssProps = {};
	  }
	}

	/**
	 * trigger dom event
	 * @param {String} event
	 * @param {Object} data
	 */
	function triggerDomEvent(event, data) {
	  var gestureEvent = document.createEvent('Event');
	  gestureEvent.initEvent(event, true, true);
	  gestureEvent.gesture = data;
	  data.target.dispatchEvent(gestureEvent);
	}

	assign(Hammer, {
	  INPUT_START: INPUT_START,
	  INPUT_MOVE: INPUT_MOVE,
	  INPUT_END: INPUT_END,
	  INPUT_CANCEL: INPUT_CANCEL,

	  STATE_POSSIBLE: STATE_POSSIBLE,
	  STATE_BEGAN: STATE_BEGAN,
	  STATE_CHANGED: STATE_CHANGED,
	  STATE_ENDED: STATE_ENDED,
	  STATE_RECOGNIZED: STATE_RECOGNIZED,
	  STATE_CANCELLED: STATE_CANCELLED,
	  STATE_FAILED: STATE_FAILED,

	  DIRECTION_NONE: DIRECTION_NONE,
	  DIRECTION_LEFT: DIRECTION_LEFT,
	  DIRECTION_RIGHT: DIRECTION_RIGHT,
	  DIRECTION_UP: DIRECTION_UP,
	  DIRECTION_DOWN: DIRECTION_DOWN,
	  DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
	  DIRECTION_VERTICAL: DIRECTION_VERTICAL,
	  DIRECTION_ALL: DIRECTION_ALL,

	  Manager: Manager,
	  Input: Input,
	  TouchAction: TouchAction,

	  TouchInput: TouchInput,
	  MouseInput: MouseInput,
	  PointerEventInput: PointerEventInput,
	  TouchMouseInput: TouchMouseInput,
	  SingleTouchInput: SingleTouchInput,

	  Recognizer: Recognizer,
	  AttrRecognizer: AttrRecognizer,
	  Tap: TapRecognizer,
	  Pan: PanRecognizer,
	  Swipe: SwipeRecognizer,
	  Pinch: PinchRecognizer,
	  Rotate: RotateRecognizer,
	  Press: PressRecognizer,

	  on: addEventListeners,
	  off: removeEventListeners,
	  each: each,
	  merge: merge,
	  extend: extend,
	  assign: assign,
	  inherit: inherit,
	  bindFn: bindFn,
	  prefixed: prefixed
	});

	// jquery.hammer.js
	// This jQuery plugin is just a small wrapper around the Hammer() class.
	// It also extends the Manager.emit method by triggering jQuery events.
	// $(element).hammer(options).bind("pan", myPanHandler);
	// The Hammer instance is stored at $element.data("hammer").
	// https://github.com/hammerjs/jquery.hammer.js

	(function($, Hammer) {
	  function hammerify(el, options) {
	    var $el = $(el);
	    if (!$el.data('hammer')) {
	      $el.data('hammer', new Hammer($el[0], options));
	    }
	  }

	  $.fn.hammer = function(options) {
	    return this.each(function() {
	      hammerify(this, options);
	    });
	  };

	  // extend the emit method to also trigger jQuery events
	  Hammer.Manager.prototype.emit = (function(originalEmit) {
	    return function(type, data) {
	      originalEmit.call(this, type, data);
	      $(this.element).trigger({
	        type: type,
	        gesture: data
	      });
	    };
	  })(Hammer.Manager.prototype.emit);
	})($, Hammer);

	module.exports = UI.Hammer = Hammer;


/***/ }
/******/ ])
});
;