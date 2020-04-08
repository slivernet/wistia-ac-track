;(function(document, window, config) {

  'use strict';

  config = cleanConfig(config);

  var _wq = window._wq = window._wq || [];
  var handle = getHandler();
  var f, s;

  _wq.push({
    id: '_all',
    onReady: listenTo
  });

  if (isUndefined_(window.Wistia)) {

    f = document.getElementsByTagName('script')[0];
    s = document.createElement('script');
    s.src = '//fast.wistia.net/assets/external/E-v1.js';
    s.async = true;

    f.parentNode.insertBefore(s, f);

  }

  function listenTo(video) {

    var percentages = config._track.percentages;
    var eventNameDict = {
      'Play': 'play',
      'Pause': 'pause',
      'Watch to End': 'end'
    };
    var cache = {};

    forEach_(['Play', 'Watch to End'], function(key) {

      if (config.events[key]) {

        video.bind(eventNameDict[key], function() {

          handle(key, video);

        });

      }

    });

    if (config.events.Pause) {

      video.bind('pause', function() {

        if (video.percentWatched() !== 1) handle('Pause', video);

      });

    }

    if (percentages) {

      video.bind('secondchange', function(s) {

        var percentage = video.percentWatched();
        var key;

        for (key in percentages) {

          if (percentage >= percentages[key] && !cache[key]) {

            cache[key] = true;
            handle(key, video);

          }

        }

      });

    }

  }

  function cleanConfig(config) {

    config = extend_({}, {
      events: {
        'Play': true,
        'Pause': true,
        'Watch to End': true
      },
      percentages: {
        each: [],
        every: []
      },
      acProxyUrl: ''
    }, config);

    var key;
    var vals;

    forEach_(['each', 'every'], function(setting) {

      var vals = config.percentages[setting];

      if (!isArray_(vals)) vals = [vals];

      if (vals) config.percentages[setting] = map_(vals, Number);

    });

    var points = [].concat(config.percentages.each);

    if (config.percentages.every) {

      forEach_(config.percentages.every, function(val) {

        var n = 100 / val;
        var every = [];
        var i;

        for (i = 1; i < n; i++) every.push(val * i);

        points = points.concat(filter_(every, function(val) {

          return val > 0.0 && val < 100.0;

        }));

      });

    }

    var percentages = reduce_(points, function(prev, curr) {

      prev[curr + '%'] = curr / 100.0;
      return prev;

    }, {});

    config._track = {
      percentages: percentages
    };

    return config;

  }

  function getHandler() {
    // for now only one handler, for ActiveCampaign
    return function(state, video) {
      let email = getEmailInURL()
      fetch(config.acProxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({videoName: video.name(), watchedPercent: state, email: email}),
      }).then((response) => console.log(response))
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  }

  function getEmailInURL() {
    return new URLSearchParams(window.location.search).get('acEmail');
  }

  function extend_() {

    var args = [].slice.call(arguments);
    var dst = args.shift();
    var src;
    var key;
    var i;

    for (i = 0; i < args.length; i++) {

      src = args[i];

      for (key in src) {

        dst[key] = src[key];

      }

    }

    return dst;

  }

  function isArray_(o) {

    if (Array.isArray_) return Array.isArray_(o);

    return Object.prototype.toString.call(o) === '[object Array]';

  }

  function forEach_(arr, fn) {

    if (Array.prototype.forEach_) return arr.forEach.call(arr, fn);

    var i;

    for (i = 0; i < arr.length; i++) {

      fn.call(window, arr[i], i, arr);

    }
  }

  function map_(arr, fn) {

    if (Array.prototype.map_) return arr.map.call(arr, fn);

    var newArr = [];

    forEach_(arr, function(el, ind, arr) {

      newArr.push(fn.call(window, el, ind, arr));

    });

    return newArr;

  }

  function filter_(arr, fn) {

    if (Array.prototype.filter) return arr.filter.call(arr, fn);

    var newArr = [];

    forEach_(arr, function(el, ind, arr) {

      if (fn.call(window, el, ind, arr)) newArr.push(el);

    });

    return newArr;

  }

  function reduce_(arr, fn, init) {

    if (Array.prototype.reduce) return arr.reduce.call(arr, fn, init);

    var result = init;
    var el;
    var i;

    for (i = 0; i < arr.length; i++) {

      el = arr[i];
      result = fn.call(window, result, el, arr, i);

    }

    return result;

  }

  function isUndefined_(thing) {

    return typeof thing === 'undefined';

  }

})(document, window, {
  'events': {
    'Play': true,
    'Pause': true,
    'Watch to End': true
  },
  'percentages': {
    'every': 25,
    'each': [10, 90]
  },
  'acProxyUrl': 'https://wistia-ac.glitch.me/' // Change this to your proxy
});
/*
 * v1.0.0
 * Modified from https://github.com/Bounteous-Inc/wistia-google-analytics/blob/master/src/lunametrics-wistia.gtm.js
 * to send event data directly to ActiveCampgain
 * Written by @waynehoover
 * Documentation: https://github.com/waynehoover/wistia-ac-track/
 * Licensed under the MIT License
 */
