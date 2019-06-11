/*Copyrights for code authored by Yahoo Inc. is licensed under the following terms:
MIT License
Copyright  2017 Yahoo Inc.
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
;(function(window, document, navigator, undefined) {
"use strict";

/*
  utils.js
  ========
*/

/* Copyright  2017 Yahoo Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
*/

var utils = {
    URL: window.URL || window.webkitURL || window.mozURL || window.msURL,
    getUserMedia: function () {
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

        return getUserMedia ? getUserMedia.bind(navigator) : getUserMedia;
    }(),
    requestAnimFrame: window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame,
    requestTimeout: function requestTimeout(callback, delay) {
        callback = callback || utils.noop;
        delay = delay || 0;

        if (!utils.requestAnimFrame) {
            return setTimeout(callback, delay);
        }

        var start = new Date().getTime();
        var handle = new Object();
        var requestAnimFrame = utils.requestAnimFrame;

        var loop = function loop() {
            var current = new Date().getTime();
            var delta = current - start;

            delta >= delay ? callback.call() : handle.value = requestAnimFrame(loop);
        };

        handle.value = requestAnimFrame(loop);

        return handle;
    },
    Blob: window.Blob || window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder,
    btoa: function () {
        var btoa = window.btoa || function (input) {
            var output = '';
            var i = 0;
            var l = input.length;
            var key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            var chr1 = void 0;
            var chr2 = void 0;
            var chr3 = void 0;
            var enc1 = void 0;
            var enc2 = void 0;
            var enc3 = void 0;
            var enc4 = void 0;

            while (i < l) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = (chr1 & 3) << 4 | chr2 >> 4;
                enc3 = (chr2 & 15) << 2 | chr3 >> 6;
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output + key.charAt(enc1) + key.charAt(enc2) + key.charAt(enc3) + key.charAt(enc4);
            }

            return output;
        };

        return btoa ? btoa.bind(window) : utils.noop;
    }(),
    isObject: function isObject(obj) {
        return obj && Object.prototype.toString.call(obj) === '[object Object]';
    },
    isEmptyObject: function isEmptyObject(obj) {
        return utils.isObject(obj) && !Object.keys(obj).length;
    },
    isArray: function isArray(arr) {
        return arr && Array.isArray(arr);
    },
    isFunction: function isFunction(func) {
        return func && typeof func === 'function';
    },
    isElement: function isElement(elem) {
        return elem && elem.nodeType === 1;
    },
    isString: function isString(value) {
        return typeof value === 'string' || Object.prototype.toString.call(value) === '[object String]';
    },
    isSupported: {
        canvas: function canvas() {
            var el = document.createElement('canvas');

            return el && el.getContext && el.getContext('2d');
        },
        webworkers: function webworkers() {
            return window.Worker;
        },
        blob: function blob() {
            return utils.Blob;
        },
        Uint8Array: function Uint8Array() {
            return window.Uint8Array;
        },
        Uint32Array: function Uint32Array() {
            return window.Uint32Array;
        },
        videoCodecs: function () {
            var testEl = document.createElement('video');
            var supportObj = {
                'mp4': false,
                'h264': false,
                'ogv': false,
                'ogg': false,
                'webm': false
            };

            try {
                if (testEl && testEl.canPlayType) {
                    // Check for MPEG-4 support
                    supportObj.mp4 = testEl.canPlayType('video/mp4; codecs="mp4v.20.8"') !== '';

                    // Check for h264 support
                    supportObj.h264 = (testEl.canPlayType('video/mp4; codecs="avc1.42E01E"') || testEl.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')) !== '';

                    // Check for Ogv support
                    supportObj.ogv = testEl.canPlayType('video/ogg; codecs="theora"') !== '';

                    // Check for Ogg support
                    supportObj.ogg = testEl.canPlayType('video/ogg; codecs="theora"') !== '';

                    // Check for Webm support
                    supportObj.webm = testEl.canPlayType('video/webm; codecs="vp8, vorbis"') !== -1;
                }
            } catch (e) {}

            return supportObj;
        }()
    },
    noop: function noop() {},
    each: function each(collection, callback) {
        var x = void 0;
        var len = void 0;

        if (utils.isArray(collection)) {
            x = -1;
            len = collection.length;

            while (++x < len) {
                if (callback(x, collection[x]) === false) {
                    break;
                }
            }
        } else if (utils.isObject(collection)) {
            for (x in collection) {
                if (collection.hasOwnProperty(x)) {
                    if (callback(x, collection[x]) === false) {
                        break;
                    }
                }
            }
        }
    },
    mergeOptions: function mergeOptions(defaultOptions, userOptions) {
        if (!utils.isObject(defaultOptions) || !utils.isObject(userOptions) || !Object.keys) {
            return;
        }

        var newObj = {};

        utils.each(defaultOptions, function (key, val) {
            newObj[key] = defaultOptions[key];
        });

        utils.each(userOptions, function (key, val) {
            var currentUserOption = userOptions[key];

            if (!utils.isObject(currentUserOption)) {
                newObj[key] = currentUserOption;
            } else {
                if (!defaultOptions[key]) {
                    newObj[key] = currentUserOption;
                } else {
                    newObj[key] = utils.mergeOptions(defaultOptions[key], currentUserOption);
                }
            }
        });

        return newObj;
    },
    setCSSAttr: function setCSSAttr(elem, attr, val) {
        if (!utils.isElement(elem)) {
            return;
        }

        if (utils.isString(attr) && utils.isString(val)) {
            elem.style[attr] = val;
        } else if (utils.isObject(attr)) {
            utils.each(attr, function (key, val) {
                elem.style[key] = val;
            });
        }
    },
    removeElement: function removeElement(node) {
        if (!utils.isElement(node)) {
            return;
        }
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    },
    createWebWorker: function createWebWorker(content) {
        if (!utils.isString(content)) {
            return {};
        }

        try {
            var blob = new utils.Blob([content], {
                'type': 'text/javascript'
            });
            var objectUrl = utils.URL.createObjectURL(blob);
            var worker = new Worker(objectUrl);

            return {
                'objectUrl': objectUrl,
                'worker': worker
            };
        } catch (e) {
            return '' + e;
        }
    },
    getExtension: function getExtension(src) {
        return src.substr(src.lastIndexOf('.') + 1, src.length);
    },
    getFontSize: function getFontSize() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        if (!document.body || options.resizeFont === false) {
            return options.fontSize;
        }

        var text = options.text;
        var containerWidth = options.gifWidth;
        var fontSize = parseInt(options.fontSize, 10);
        var minFontSize = parseInt(options.minFontSize, 10);
        var div = document.createElement('div');
        var span = document.createElement('span');

        div.setAttribute('width', containerWidth);
        div.appendChild(span);

        span.innerHTML = text;
        span.style.fontSize = fontSize + 'px';
        span.style.textIndent = '-9999px';
        span.style.visibility = 'hidden';

        document.body.appendChild(span);

        while (span.offsetWidth > containerWidth && fontSize >= minFontSize) {
            span.style.fontSize = --fontSize + 'px';
        }

        document.body.removeChild(span);

        return fontSize + 'px';
    },
    webWorkerError: false
};



var utils$2 = Object.freeze({
	default: utils
});

/*
  error.js
  ========
*/

/* Copyright  2017 Yahoo Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
*/

// Dependencies
var error = {
    validate: function validate(skipObj) {
        skipObj = utils.isObject(skipObj) ? skipObj : {};

        var errorObj = {};

        utils.each(error.validators, function (indece, currentValidator) {
            var errorCode = currentValidator.errorCode;

            if (!skipObj[errorCode] && !currentValidator.condition) {
                errorObj = currentValidator;
                errorObj.error = true;

                return false;
            }
        });

        delete errorObj.condition;

        return errorObj;
    },
    isValid: function isValid(skipObj) {
        var errorObj = error.validate(skipObj);
        var isValid = errorObj.error !== true ? true : false;

        return isValid;
    },
    validators: [{
        condition: utils.isFunction(utils.getUserMedia),
        errorCode: 'getUserMedia',
        errorMsg: 'The getUserMedia API is not supported in your browser'
    }, {
        condition: utils.isSupported.canvas(),
        errorCode: 'canvas',
        errorMsg: 'Canvas elements are not supported in your browser'
    }, {
        condition: utils.isSupported.webworkers(),
        errorCode: 'webworkers',
        errorMsg: 'The Web Workers API is not supported in your browser'
    }, {
        condition: utils.isFunction(utils.URL),
        errorCode: 'window.URL',
        errorMsg: 'The window.URL API is not supported in your browser'
    }, {
        condition: utils.isSupported.blob(),
        errorCode: 'window.Blob',
        errorMsg: 'The window.Blob File API is not supported in your browser'
    }, {
        condition: utils.isSupported.Uint8Array(),
        errorCode: 'window.Uint8Array',
        errorMsg: 'The window.Uint8Array function constructor is not supported in your browser'
    }, {
        condition: utils.isSupported.Uint32Array(),
        errorCode: 'window.Uint32Array',
        errorMsg: 'The window.Uint32Array function constructor is not supported in your browser'
    }],
    messages: {
        videoCodecs: {
            errorCode: 'videocodec',
            errorMsg: 'The video codec you are trying to use is not supported in your browser'
        }
    }
};



var error$2 = Object.freeze({
	default: error
});

/*
  defaultOptions.js
  =================
*/

/* Copyright  2017 Yahoo Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
*/

// Helpers
var noop = function noop() {};

var defaultOptions = {
    sampleInterval: 10,
    numWorkers: 2,
    filter: '',
    gifWidth: 200,
    gifHeight: 200,
    interval: 0.1,
    numFrames: 10,
    frameDuration: 1,
    keepCameraOn: false,
    images: [],
    video: null,
    webcamVideoElement: null,
    cameraStream: null,
    text: '',
    fontWeight: 'normal',
    fontSize: '16px',
    minFontSize: '10px',
    resizeFont: false,
    fontFamily: 'sans-serif',
    fontColor: '#ffffff',
    textAlign: 'center',
    textBaseline: 'bottom',
    textXCoordinate: null,
    textYCoordinate: null,
    progressCallback: noop,
    completeCallback: noop,
    saveRenderingContexts: false,
    savedRenderingContexts: [],
    showFrameText: true,
    crossOrigin: 'Anonymous',
    waterMark: null,
    waterMarkHeight: null,
    waterMarkWidth: null,
    waterMarkXCoordinate: 1,
    waterMarkYCoordinate: 1
};



var defaultOptions$2 = Object.freeze({
	default: defaultOptions
});

/*
  isSupported.js
  ==============
*/

/* Copyright  2017 Yahoo Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
*/

// Dependencies
function isSupported() {
  return error.isValid();
}

/*
  isWebCamGIFSupported.js
  =======================
*/

/* Copyright  2017 Yahoo Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
*/

function isWebCamGIFSupported() {
  return error.isValid();
}

/*
  isSupported.js
  ==============
*/

/* Copyright  2017 Yahoo Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
*/

// Dependencies
function isSupported$1() {
    var options = {
        getUserMedia: true
    };

    return error.isValid(options);
}

/*
  isExistingVideoGIFSupported.js
  ==============================
*/

/* Copyright  2017 Yahoo Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
*/

// Dependencies
function isExistingVideoGIFSupported(codecs) {
    var hasValidCodec = false;

    if (utils.isArray(codecs) && codecs.length) {
        utils.each(codecs, function (indece, currentCodec) {
            if (utils.isSupported.videoCodecs[currentCodec]) {
                hasValidCodec = true;
            }
        });

        if (!hasValidCodec) {
            return false;
        }
    } else if (utils.isString(codecs) && codecs.length) {
        if (!utils.isSupported.videoCodecs[codecs]) {
            return false;
        }
    }

    return error.isValid({
        'getUserMedia': true
    });
}

/*
  NeuQuant.js
  ===========
*/

/*
 * NeuQuant Neural-Net Quantization Algorithm
 * ------------------------------------------
 *
 * Copyright (c) 1994 Anthony Dekker
 *
 * NEUQUANT Neural-Net quantization algorithm by Anthony Dekker, 1994. See
 * "Kohonen neural networks for optimal colour quantization" in "Network:
 * Computation in Neural Systems" Vol. 5 (1994) pp 351-367. for a discussion of
 * the algorithm.
 *
 * Any party obtaining a copy of these files from the author, directly or
 * indirectly, is granted, free of charge, a full and unrestricted irrevocable,
 * world-wide, paid up, royalty-free, nonexclusive right and license to deal in
 * this software and documentation files (the "Software"), including without
 * limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons who
 * receive copies from any such party to do so, with the only requirement being
 * that this copyright notice remain intact.
 */

/*
 * This class handles Neural-Net quantization algorithm
 * @author Kevin Weiner (original Java version - kweiner@fmsware.com)
 * @author Thibault Imbert (AS3 version - bytearray.org)
 * @version 0.1 AS3 implementation
 * @version 0.2 JS->AS3 "translation" by antimatter15
 * @version 0.3 JS clean up + using modern JS idioms by sole - http://soledadpenades.com
 * Also implement fix in color conversion described at http://stackoverflow.com/questions/16371712/neuquant-js-javascript-color-quantization-hidden-bug-in-js-conversion
 */

function NeuQuant() {
  var netsize = 256; // number of colours used

  // four primes near 500 - assume no image has a length so large
  // that it is divisible by all four primes
  var prime1 = 499;
  var prime2 = 491;
  var prime3 = 487;
  var prime4 = 503;

  // minimum size for input image
  var minpicturebytes = 3 * prime4;

  // Network Definitions

  var maxnetpos = netsize - 1;
  var netbiasshift = 4; // bias for colour values
  var ncycles = 100; // no. of learning cycles

  // defs for freq and bias
  var intbiasshift = 16; // bias for fractions
  var intbias = 1 << intbiasshift;
  var gammashift = 10; // gamma = 1024
  var gamma = 1 << gammashift;
  var betashift = 10;
  var beta = intbias >> betashift; // beta = 1/1024
  var betagamma = intbias << gammashift - betashift;

  // defs for decreasing radius factor
  // For 256 colors, radius starts at 32.0 biased by 6 bits
  // and decreases by a factor of 1/30 each cycle
  var initrad = netsize >> 3;
  var radiusbiasshift = 6;
  var radiusbias = 1 << radiusbiasshift;
  var initradius = initrad * radiusbias;
  var radiusdec = 30;

  // defs for decreasing alpha factor
  // Alpha starts at 1.0 biased by 10 bits
  var alphabiasshift = 10;
  var initalpha = 1 << alphabiasshift;
  var alphadec;

  // radbias and alpharadbias used for radpower calculation
  var radbiasshift = 8;
  var radbias = 1 << radbiasshift;
  var alpharadbshift = alphabiasshift + radbiasshift;
  var alpharadbias = 1 << alpharadbshift;

  // Input image
  var thepicture;
  // Height * Width * 3
  var lengthcount;
  // Sampling factor 1..30
  var samplefac;

  // The network itself
  var network;
  var netindex = [];

  // for network lookup - really 256
  var bias = [];

  // bias and freq arrays for learning
  var freq = [];
  var radpower = [];

  function NeuQuantConstructor(thepic, len, sample) {

    var i;
    var p;

    thepicture = thepic;
    lengthcount = len;
    samplefac = sample;

    network = new Array(netsize);

    for (i = 0; i < netsize; i++) {
      network[i] = new Array(4);
      p = network[i];
      p[0] = p[1] = p[2] = (i << netbiasshift + 8) / netsize | 0;
      freq[i] = intbias / netsize | 0; // 1 / netsize
      bias[i] = 0;
    }
  }

  function colorMap() {
    var map = [];
    var index = new Array(netsize);
    for (var i = 0; i < netsize; i++) {
      index[network[i][3]] = i;
    }var k = 0;
    for (var l = 0; l < netsize; l++) {
      var j = index[l];
      map[k++] = network[j][0];
      map[k++] = network[j][1];
      map[k++] = network[j][2];
    }
    return map;
  }

  // Insertion sort of network and building of netindex[0..255]
  // (to do after unbias)
  function inxbuild() {
    var i;
    var j;
    var smallpos;
    var smallval;
    var p;
    var q;
    var previouscol;
    var startpos;

    previouscol = 0;
    startpos = 0;

    for (i = 0; i < netsize; i++) {

      p = network[i];
      smallpos = i;
      smallval = p[1]; // index on g
      // find smallest in i..netsize-1
      for (j = i + 1; j < netsize; j++) {

        q = network[j];

        if (q[1] < smallval) {
          // index on g
          smallpos = j;
          smallval = q[1]; // index on g
        }
      }

      q = network[smallpos];

      // swap p (i) and q (smallpos) entries
      if (i != smallpos) {
        j = q[0];
        q[0] = p[0];
        p[0] = j;
        j = q[1];
        q[1] = p[1];
        p[1] = j;
        j = q[2];
        q[2] = p[2];
        p[2] = j;
        j = q[3];
        q[3] = p[3];
        p[3] = j;
      }

      // smallval entry is now in position i
      if (smallval != previouscol) {

        netindex[previouscol] = startpos + i >> 1;

        for (j = previouscol + 1; j < smallval; j++) {
          netindex[j] = i;
        }

        previouscol = smallval;
        startpos = i;
      }
    }

    netindex[previouscol] = startpos + maxnetpos >> 1;
    for (j = previouscol + 1; j < 256; j++) {
      netindex[j] = maxnetpos; // really 256
    }
  }

  // Main Learning Loop

  function learn() {
    var i;
    var j;
    var b;
    var g;
    var r;
    var radius;
    var rad;
    var alpha;
    var step;
    var delta;
    var samplepixels;
    var p;
    var pix;
    var lim;

    if (lengthcount < minpicturebytes) {
      samplefac = 1;
    }

    alphadec = 30 + (samplefac - 1) / 3;
    p = thepicture;
    pix = 0;
    lim = lengthcount;
    samplepixels = lengthcount / (3 * samplefac);
    delta = samplepixels / ncycles | 0;
    alpha = initalpha;
    radius = initradius;

    rad = radius >> radiusbiasshift;
    if (rad <= 1) {
      rad = 0;
    }

    for (i = 0; i < rad; i++) {
      radpower[i] = alpha * ((rad * rad - i * i) * radbias / (rad * rad));
    }

    if (lengthcount < minpicturebytes) {
      step = 3;
    } else if (lengthcount % prime1 !== 0) {
      step = 3 * prime1;
    } else {

      if (lengthcount % prime2 !== 0) {
        step = 3 * prime2;
      } else {
        if (lengthcount % prime3 !== 0) {
          step = 3 * prime3;
        } else {
          step = 3 * prime4;
        }
      }
    }

    i = 0;

    while (i < samplepixels) {

      b = (p[pix + 0] & 0xff) << netbiasshift;
      g = (p[pix + 1] & 0xff) << netbiasshift;
      r = (p[pix + 2] & 0xff) << netbiasshift;
      j = contest(b, g, r);

      altersingle(alpha, j, b, g, r);

      if (rad !== 0) {
        // Alter neighbours
        alterneigh(rad, j, b, g, r);
      }

      pix += step;

      if (pix >= lim) {
        pix -= lengthcount;
      }

      i++;

      if (delta === 0) {
        delta = 1;
      }

      if (i % delta === 0) {
        alpha -= alpha / alphadec;
        radius -= radius / radiusdec;
        rad = radius >> radiusbiasshift;

        if (rad <= 1) {
          rad = 0;
        }

        for (j = 0; j < rad; j++) {
          radpower[j] = alpha * ((rad * rad - j * j) * radbias / (rad * rad));
        }
      }
    }
  }

  // Search for BGR values 0..255 (after net is unbiased) and return colour index
  function map(b, g, r) {
    var i;
    var j;
    var dist;
    var a;
    var bestd;
    var p;
    var best;

    // Biggest possible distance is 256 * 3
    bestd = 1000;
    best = -1;
    i = netindex[g]; // index on g
    j = i - 1; // start at netindex[g] and work outwards

    while (i < netsize || j >= 0) {

      if (i < netsize) {

        p = network[i];

        dist = p[1] - g; // inx key

        if (dist >= bestd) {
          i = netsize; // stop iter
        } else {

          i++;

          if (dist < 0) {
            dist = -dist;
          }

          a = p[0] - b;

          if (a < 0) {
            a = -a;
          }

          dist += a;

          if (dist < bestd) {
            a = p[2] - r;

            if (a < 0) {
              a = -a;
            }

            dist += a;

            if (dist < bestd) {
              bestd = dist;
              best = p[3];
            }
          }
        }
      }

      if (j >= 0) {

        p = network[j];

        dist = g - p[1]; // inx key - reverse dif

        if (dist >= bestd) {
          j = -1; // stop iter
        } else {

          j--;
          if (dist < 0) {
            dist = -dist;
          }
          a = p[0] - b;
          if (a < 0) {
            a = -a;
          }
          dist += a;

          if (dist < bestd) {
            a = p[2] - r;
            if (a < 0) {
              a = -a;
            }
            dist += a;
            if (dist < bestd) {
              bestd = dist;
              best = p[3];
            }
          }
        }
      }
    }

    return best;
  }

  function process() {
    learn();
    unbiasnet();
    inxbuild();
    return colorMap();
  }

  // Unbias network to give byte values 0..255 and record position i
  // to prepare for sort
  function unbiasnet() {
    var i;
    var j;

    for (i = 0; i < netsize; i++) {
      network[i][0] >>= netbiasshift;
      network[i][1] >>= netbiasshift;
      network[i][2] >>= netbiasshift;
      network[i][3] = i; // record colour no
    }
  }

  // Move adjacent neurons by precomputed alpha*(1-((i-j)^2/[r]^2))
  // in radpower[|i-j|]
  function alterneigh(rad, i, b, g, r) {

    var j;
    var k;
    var lo;
    var hi;
    var a;
    var m;

    var p;

    lo = i - rad;
    if (lo < -1) {
      lo = -1;
    }

    hi = i + rad;

    if (hi > netsize) {
      hi = netsize;
    }

    j = i + 1;
    k = i - 1;
    m = 1;

    while (j < hi || k > lo) {

      a = radpower[m++];

      if (j < hi) {

        p = network[j++];

        try {

          p[0] -= a * (p[0] - b) / alpharadbias | 0;
          p[1] -= a * (p[1] - g) / alpharadbias | 0;
          p[2] -= a * (p[2] - r) / alpharadbias | 0;
        } catch (e) {}
      }

      if (k > lo) {

        p = network[k--];

        try {

          p[0] -= a * (p[0] - b) / alpharadbias | 0;
          p[1] -= a * (p[1] - g) / alpharadbias | 0;
          p[2] -= a * (p[2] - r) / alpharadbias | 0;
        } catch (e) {}
      }
    }
  }

  // Move neuron i towards biased (b,g,r) by factor alpha
  function altersingle(alpha, i, b, g, r) {

    // alter hit neuron
    var n = network[i];
    var alphaMult = alpha / initalpha;
    n[0] -= alphaMult * (n[0] - b) | 0;
    n[1] -= alphaMult * (n[1] - g) | 0;
    n[2] -= alphaMult * (n[2] - r) | 0;
  }

  // Search for biased BGR values
  function contest(b, g, r) {

    // finds closest neuron (min dist) and updates freq
    // finds best neuron (min dist-bias) and returns position
    // for frequently chosen neurons, freq[i] is high and bias[i] is negative
    // bias[i] = gamma*((1/netsize)-freq[i])

    var i;
    var dist;
    var a;
    var biasdist;
    var betafreq;
    var bestpos;
    var bestbiaspos;
    var bestd;
    var bestbiasd;
    var n;

    bestd = ~(1 << 31);
    bestbiasd = bestd;
    bestpos = -1;
    bestbiaspos = bestpos;

    for (i = 0; i < netsize; i++) {

      n = network[i];
      dist = n[0] - b;

      if (dist < 0) {
        dist = -dist;
      }

      a = n[1] - g;

      if (a < 0) {
        a = -a;
      }

      dist += a;

      a = n[2] - r;

      if (a < 0) {
        a = -a;
      }

      dist += a;

      if (dist < bestd) {
        bestd = dist;
        bestpos = i;
      }

      biasdist = dist - (bias[i] >> intbiasshift - netbiasshift);

      if (biasdist < bestbiasd) {
        bestbiasd = biasdist;
        bestbiaspos = i;
      }

      betafreq = freq[i] >> betashift;
      freq[i] -= betafreq;
      bias[i] += betafreq << gammashift;
    }

    freq[bestpos] += beta;
    bias[bestpos] -= betagamma;
    return bestbiaspos;
  }

  NeuQuantConstructor.apply(this, arguments);

  var exports = {};
  exports.map = map;
  exports.process = process;

  return exports;
}

/*
  processFrameWorker.js
  =====================
*/

/* Copyright  2017 Yahoo Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
*/

function workerCode() {
    var self = this;

    try {
        self.onmessage = function (ev) {
            var data = ev.data || {};
            var response;

            if (data.gifshot) {
                response = workerMethods.run(data);
                postMessage(response);
            }
        };
    } catch (e) {}

    var workerMethods = {
        dataToRGB: function dataToRGB(data, width, height) {
            var length = width * height * 4;
            var i = 0;
            var rgb = [];

            while (i < length) {
                rgb.push(data[i++]);
                rgb.push(data[i++]);
                rgb.push(data[i++]);
                i++; // for the alpha channel which we don't care about
            }

            return rgb;
        },
        componentizedPaletteToArray: function componentizedPaletteToArray(paletteRGB) {
            paletteRGB = paletteRGB || [];

            var paletteArray = [];

            for (var i = 0; i < paletteRGB.length; i += 3) {
                var r = paletteRGB[i];
                var g = paletteRGB[i + 1];
                var b = paletteRGB[i + 2];

                paletteArray.push(r << 16 | g << 8 | b);
            }

            return paletteArray;
        },
        // This is the "traditional" Animated_GIF style of going from RGBA to indexed color frames
        'processFrameWithQuantizer': function processFrameWithQuantizer(imageData, width, height, sampleInterval) {
            var rgbComponents = this.dataToRGB(imageData, width, height);
            var nq = new NeuQuant(rgbComponents, rgbComponents.length, sampleInterval);
            var paletteRGB = nq.process();
            var paletteArray = new Uint32Array(this.componentizedPaletteToArray(paletteRGB));
            var numberPixels = width * height;
            var indexedPixels = new Uint8Array(numberPixels);
            var k = 0;

            for (var i = 0; i < numberPixels; i++) {
                var r = rgbComponents[k++];
                var g = rgbComponents[k++];
                var b = rgbComponents[k++];

                indexedPixels[i] = nq.map(r, g, b);
            }

            return {
                pixels: indexedPixels,
                palette: paletteArray
            };
        },
        'run': function run(frame) {
            frame = frame || {};

            var _frame = frame,
                height = _frame.height,
                palette = _frame.palette,
                sampleInterval = _frame.sampleInterval,
                width = _frame.width;

            var imageData = frame.data;

            return this.processFrameWithQuantizer(imageData, width, height, sampleInterval);
        }
    };

    return workerMethods;
}

/*
  gifWriter.js
  ============
*/

// (c) Dean McNamee <dean@gmail.com>, 2013.
//
// https://github.com/deanm/omggif
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.
//
// omggif is a JavaScript implementation of a GIF 89a encoder and decoder,
// including animation and compression.  It does not rely on any specific
// underlying system, so should run in the browser, Node, or Plask.

function gifWriter(buf, width, height, gopts) {
  var p = 0;

  gopts = gopts === undefined ? {} : gopts;
  var loop_count = gopts.loop === undefined ? null : gopts.loop;
  var global_palette = gopts.palette === undefined ? null : gopts.palette;

  if (width <= 0 || height <= 0 || width > 65535 || height > 65535) throw "Width/Height invalid.";

  function check_palette_and_num_colors(palette) {
    var num_colors = palette.length;

    if (num_colors < 2 || num_colors > 256 || num_colors & num_colors - 1) throw "Invalid code/color length, must be power of 2 and 2 .. 256.";
    return num_colors;
  }

  // - Header.
  buf[p++] = 0x47;
  buf[p++] = 0x49;
  buf[p++] = 0x46; // GIF
  buf[p++] = 0x38;
  buf[p++] = 0x39;
  buf[p++] = 0x61; // 89a

  // Handling of Global Color Table (palette) and background index.
  var gp_num_colors_pow2 = 0;
  var background = 0;

  // - Logical Screen Descriptor.
  // NOTE(deanm): w/h apparently ignored by implementations, but set anyway.
  buf[p++] = width & 0xff;
  buf[p++] = width >> 8 & 0xff;
  buf[p++] = height & 0xff;
  buf[p++] = height >> 8 & 0xff;
  // NOTE: Indicates 0-bpp original color resolution (unused?).
  buf[p++] = (global_palette !== null ? 0x80 : 0) | // Global Color Table Flag.
  gp_num_colors_pow2; // NOTE: No sort flag (unused?).
  buf[p++] = background; // Background Color Index.
  buf[p++] = 0; // Pixel aspect ratio (unused?).

  if (loop_count !== null) {
    // Netscape block for looping.
    if (loop_count < 0 || loop_count > 65535) throw "Loop count invalid.";

    // Extension code, label, and length.
    buf[p++] = 0x21;
    buf[p++] = 0xff;
    buf[p++] = 0x0b;
    // NETSCAPE2.0
    buf[p++] = 0x4e;
    buf[p++] = 0x45;
    buf[p++] = 0x54;
    buf[p++] = 0x53;
    buf[p++] = 0x43;
    buf[p++] = 0x41;
    buf[p++] = 0x50;
    buf[p++] = 0x45;
    buf[p++] = 0x32;
    buf[p++] = 0x2e;
    buf[p++] = 0x30;
    // Sub-block
    buf[p++] = 0x03;
    buf[p++] = 0x01;
    buf[p++] = loop_count & 0xff;
    buf[p++] = loop_count >> 8 & 0xff;
    buf[p++] = 0x00; // Terminator.
  }

  var ended = false;

  this.addFrame = function (x, y, w, h, indexed_pixels, opts) {
    if (ended === true) {
      --p;
      ended = false;
    } // Un-end.

    opts = opts === undefined ? {} : opts;

    // TODO(deanm): Bounds check x, y.  Do they need to be within the virtual
    // canvas width/height, I imagine?
    if (x < 0 || y < 0 || x > 65535 || y > 65535) throw "x/y invalid.";

    if (w <= 0 || h <= 0 || w > 65535 || h > 65535) throw "Width/Height invalid.";

    if (indexed_pixels.length < w * h) throw "Not enough pixels for the frame size.";

    var using_local_palette = true;
    var palette = opts.palette;
    if (palette === undefined || palette === null) {
      using_local_palette = false;
      palette = global_palette;
    }

    if (palette === undefined || palette === null) throw "Must supply either a local or global palette.";

    var num_colors = check_palette_and_num_colors(palette);

    // Compute the min_code_size (power of 2), destroying num_colors.
    var min_code_size = 0;
    while (num_colors >>= 1) {
      ++min_code_size;
    }num_colors = 1 << min_code_size; // Now we can easily get it back.

    var delay = opts.delay === undefined ? 0 : opts.delay;

    // From the spec:
    //     0 -   No disposal specified. The decoder is
    //           not required to take any action.
    //     1 -   Do not dispose. The graphic is to be left
    //           in place.
    //     2 -   Restore to background color. The area used by the
    //           graphic must be restored to the background color.
    //     3 -   Restore to previous. The decoder is required to
    //           restore the area overwritten by the graphic with
    //           what was there prior to rendering the graphic.
    //  4-7 -    To be defined.
    // NOTE(deanm): Dispose background doesn't really work, apparently most
    // browsers ignore the background palette index and clear to transparency.
    var disposal = opts.disposal === undefined ? 0 : opts.disposal;
    if (disposal < 0 || disposal > 3) // 4-7 is reserved.
      throw "Disposal out of range.";

    var use_transparency = false;
    var transparent_index = 0;
    if (opts.transparent !== undefined && opts.transparent !== null) {
      use_transparency = true;
      transparent_index = opts.transparent;
      if (transparent_index < 0 || transparent_index >= num_colors) throw "Transparent color index.";
    }

    if (disposal !== 0 || use_transparency || delay !== 0) {
      // - Graphics Control Extension
      buf[p++] = 0x21;
      buf[p++] = 0xf9; // Extension / Label.
      buf[p++] = 4; // Byte size.

      buf[p++] = disposal << 2 | (use_transparency === true ? 1 : 0);
      buf[p++] = delay & 0xff;
      buf[p++] = delay >> 8 & 0xff;
      buf[p++] = transparent_index; // Transparent color index.
      buf[p++] = 0; // Block Terminator.
    }

    // - Image Descriptor
    buf[p++] = 0x2c; // Image Seperator.
    buf[p++] = x & 0xff;
    buf[p++] = x >> 8 & 0xff; // Left.
    buf[p++] = y & 0xff;
    buf[p++] = y >> 8 & 0xff; // Top.
    buf[p++] = w & 0xff;
    buf[p++] = w >> 8 & 0xff;
    buf[p++] = h & 0xff;
    buf[p++] = h >> 8 & 0xff;
    // NOTE: No sort flag (unused?).
    // TODO(deanm): Support interlace.
    buf[p++] = using_local_palette === true ? 0x80 | min_code_size - 1 : 0;

    // - Local Color Table
    if (using_local_palette === true) {
      for (var i = 0, il = palette.length; i < il; ++i) {
        var rgb = palette[i];
        buf[p++] = rgb >> 16 & 0xff;
        buf[p++] = rgb >> 8 & 0xff;
        buf[p++] = rgb & 0xff;
      }
    }

    p = GifWriterOutputLZWCodeStream(buf, p, min_code_size < 2 ? 2 : min_code_size, indexed_pixels);
  };

  this.end = function () {
    if (ended === false) {
      buf[p++] = 0x3b; // Trailer.
      ended = true;
    }
    return p;
  };

  // Main compression routine, palette indexes -> LZW code stream.
  // |index_stream| must have at least one entry.
  function GifWriterOutputLZWCodeStream(buf, p, min_code_size, index_stream) {
    buf[p++] = min_code_size;
    var cur_subblock = p++; // Pointing at the length field.

    var clear_code = 1 << min_code_size;
    var code_mask = clear_code - 1;
    var eoi_code = clear_code + 1;
    var next_code = eoi_code + 1;

    var cur_code_size = min_code_size + 1; // Number of bits per code.
    var cur_shift = 0;
    // We have at most 12-bit codes, so we should have to hold a max of 19
    // bits here (and then we would write out).
    var cur = 0;

    function emit_bytes_to_buffer(bit_block_size) {
      while (cur_shift >= bit_block_size) {
        buf[p++] = cur & 0xff;
        cur >>= 8;
        cur_shift -= 8;
        if (p === cur_subblock + 256) {
          // Finished a subblock.
          buf[cur_subblock] = 255;
          cur_subblock = p++;
        }
      }
    }

    function emit_code(c) {
      cur |= c << cur_shift;
      cur_shift += cur_code_size;
      emit_bytes_to_buffer(8);
    }

    // I am not an expert on the topic, and I don't want to write a thesis.
    // However, it is good to outline here the basic algorithm and the few data
    // structures and optimizations here that make this implementation fast.
    // The basic idea behind LZW is to build a table of previously seen runs
    // addressed by a short id (herein called output code).  All data is
    // referenced by a code, which represents one or more values from the
    // original input stream.  All input bytes can be referenced as the same
    // value as an output code.  So if you didn't want any compression, you
    // could more or less just output the original bytes as codes (there are
    // some details to this, but it is the idea).  In order to achieve
    // compression, values greater then the input range (codes can be up to
    // 12-bit while input only 8-bit) represent a sequence of previously seen
    // inputs.  The decompressor is able to build the same mapping while
    // decoding, so there is always a shared common knowledge between the
    // encoding and decoder, which is also important for "timing" aspects like
    // how to handle variable bit width code encoding.
    //
    // One obvious but very important consequence of the table system is there
    // is always a unique id (at most 12-bits) to map the runs.  'A' might be
    // 4, then 'AA' might be 10, 'AAA' 11, 'AAAA' 12, etc.  This relationship
    // can be used for an effecient lookup strategy for the code mapping.  We
    // need to know if a run has been seen before, and be able to map that run
    // to the output code.  Since we start with known unique ids (input bytes),
    // and then from those build more unique ids (table entries), we can
    // continue this chain (almost like a linked list) to always have small
    // integer values that represent the current byte chains in the encoder.
    // This means instead of tracking the input bytes (AAAABCD) to know our
    // current state, we can track the table entry for AAAABC (it is guaranteed
    // to exist by the nature of the algorithm) and the next character D.
    // Therefor the tuple of (table_entry, byte) is guaranteed to also be
    // unique.  This allows us to create a simple lookup key for mapping input
    // sequences to codes (table indices) without having to store or search
    // any of the code sequences.  So if 'AAAA' has a table entry of 12, the
    // tuple of ('AAAA', K) for any input byte K will be unique, and can be our
    // key.  This leads to a integer value at most 20-bits, which can always
    // fit in an SMI value and be used as a fast sparse array / object key.

    // Output code for the current contents of the index buffer.
    var ib_code = index_stream[0] & code_mask; // Load first input index.
    var code_table = {}; // Key'd on our 20-bit "tuple".

    emit_code(clear_code); // Spec says first code should be a clear code.

    // First index already loaded, process the rest of the stream.
    for (var i = 1, il = index_stream.length; i < il; ++i) {
      var k = index_stream[i] & code_mask;
      var cur_key = ib_code << 8 | k; // (prev, k) unique tuple.
      var cur_code = code_table[cur_key]; // buffer + k.

      // Check if we have to create a new code table entry.
      if (cur_code === undefined) {
        // We don't have buffer + k.
        // Emit index buffer (without k).
        // This is an inline version of emit_code, because this is the core
        // writing routine of the compressor (and V8 cannot inline emit_code
        // because it is a closure here in a different context).  Additionally
        // we can call emit_byte_to_buffer less often, because we can have
        // 30-bits (from our 31-bit signed SMI), and we know our codes will only
        // be 12-bits, so can safely have 18-bits there without overflow.
        // emit_code(ib_code);
        cur |= ib_code << cur_shift;
        cur_shift += cur_code_size;
        while (cur_shift >= 8) {
          buf[p++] = cur & 0xff;
          cur >>= 8;
          cur_shift -= 8;
          if (p === cur_subblock + 256) {
            // Finished a subblock.
            buf[cur_subblock] = 255;
            cur_subblock = p++;
          }
        }

        if (next_code === 4096) {
          // Table full, need a clear.
          emit_code(clear_code);
          next_code = eoi_code + 1;
          cur_code_size = min_code_size + 1;
          code_table = {};
        } else {
          // Table not full, insert a new entry.
          // Increase our variable bit code sizes if necessary.  This is a bit
          // tricky as it is based on "timing" between the encoding and
          // decoder.  From the encoders perspective this should happen after
          // we've already emitted the index buffer and are about to create the
          // first table entry that would overflow our current code bit size.
          if (next_code >= 1 << cur_code_size) ++cur_code_size;
          code_table[cur_key] = next_code++; // Insert into code table.
        }

        ib_code = k; // Index buffer to single input k.
      } else {
        ib_code = cur_code; // Index buffer to sequence in code table.
      }
    }

    emit_code(ib_code); // There will still be something in the index buffer.
    emit_code(eoi_code); // End Of Information.

    // Flush / finalize the sub-blocks stream to the buffer.
    emit_bytes_to_buffer(1);

    // Finish the sub-blocks, writing out any unfinished lengths and
    // terminating with a sub-block of length 0.  If we have already started
    // but not yet used a sub-block it can just become the terminator.
    if (cur_subblock + 1 === p) {
      // Started but unused.
      buf[cur_subblock] = 0;
    } else {
      // Started and used, write length and additional terminator block.
      buf[cur_subblock] = p - cur_subblock - 1;
      buf[p++] = 0;
    }
    return p;
  }
}

/*
  animatedGIF.js
  ==============
*/

/* Copyright  2017 Yahoo Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
*/

// Dependencies
// Helpers
var noop$2 = function noop() {};

var AnimatedGIF = function AnimatedGIF(options) {
    this.canvas = null;
    this.ctx = null;
    this.repeat = 0;
    this.frames = [];
    this.numRenderedFrames = 0;
    this.onRenderCompleteCallback = noop$2;
    this.onRenderProgressCallback = noop$2;
    this.workers = [];
    this.availableWorkers = [];
    this.generatingGIF = false;
    this.options = options;

    // Constructs and initializes the the web workers appropriately
    this.initializeWebWorkers(options);
};

AnimatedGIF.prototype = {
    'workerMethods': workerCode(),
    'initializeWebWorkers': function initializeWebWorkers(options) {
        var self = this;
        var processFrameWorkerCode = NeuQuant.toString() + '(' + workerCode.toString() + '());';
        var webWorkerObj = void 0;
        var objectUrl = void 0;
        var webWorker = void 0;
        var numWorkers = void 0;
        var x = -1;
        var workerError = '';

        numWorkers = options.numWorkers;

        while (++x < numWorkers) {
            webWorkerObj = utils.createWebWorker(processFrameWorkerCode);

            if (utils.isObject(webWorkerObj)) {
                objectUrl = webWorkerObj.objectUrl;
                webWorker = webWorkerObj.worker;

                self.workers.push({
                    worker: webWorker,
                    objectUrl: objectUrl
                });

                self.availableWorkers.push(webWorker);
            } else {
                workerError = webWorkerObj;
                utils.webWorkerError = !!webWorkerObj;
            }
        }

        this.workerError = workerError;
        this.canvas = document.createElement('canvas');
        this.canvas.width = options.gifWidth;
        this.canvas.height = options.gifHeight;
        this.ctx = this.canvas.getContext('2d');
        this.frames = [];
    },
    // Return a worker for processing a frame
    getWorker: function getWorker() {
        return this.availableWorkers.pop();
    },
    // Restores a worker to the pool
    freeWorker: function freeWorker(worker) {
        this.availableWorkers.push(worker);
    },
    byteMap: function () {
        var byteMap = [];

        for (var i = 0; i < 256; i++) {
            byteMap[i] = String.fromCharCode(i);
        }

        return byteMap;
    }(),
    bufferToString: function bufferToString(buffer) {
        var numberValues = buffer.length;
        var str = '';
        var x = -1;

        while (++x < numberValues) {
            str += this.byteMap[buffer[x]];
        }

        return str;
    },
    onFrameFinished: function onFrameFinished(progressCallback) {
        // The GIF is not written until we're done with all the frames
        // because they might not be processed in the same order
        var self = this;
        var frames = self.frames;
        var options = self.options;
        var hasExistingImages = !!(options.images || []).length;
        var allDone = frames.every(function (frame) {
            return !frame.beingProcessed && frame.done;
        });

        self.numRenderedFrames++;

        if (hasExistingImages) {
            progressCallback(self.numRenderedFrames / frames.length);
        }

        self.onRenderProgressCallback(self.numRenderedFrames * 0.75 / frames.length);

        if (allDone) {
            if (!self.generatingGIF) {
                self.generateGIF(frames, self.onRenderCompleteCallback);
            }
        } else {
            utils.requestTimeout(function () {
                self.processNextFrame();
            }, 1);
        }
    },
    processFrame: function processFrame(position) {
        var AnimatedGifContext = this;
        var options = this.options;
        var _options = this.options,
            progressCallback = _options.progressCallback,
            sampleInterval = _options.sampleInterval;

        var frames = this.frames;
        var frame = void 0;
        var worker = void 0;
        var done = function done() {
            var ev = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var data = ev.data;

            // Delete original data, and free memory
            delete frame.data;

            frame.pixels = Array.prototype.slice.call(data.pixels);
            frame.palette = Array.prototype.slice.call(data.palette);
            frame.done = true;
            frame.beingProcessed = false;

            AnimatedGifContext.freeWorker(worker);

            AnimatedGifContext.onFrameFinished(progressCallback);
        };

        frame = frames[position];

        if (frame.beingProcessed || frame.done) {
            this.onFrameFinished();

            return;
        }

        frame.sampleInterval = sampleInterval;
        frame.beingProcessed = true;
        frame.gifshot = true;

        worker = this.getWorker();

        if (worker) {
            // Process the frame in a web worker
            worker.onmessage = done;
            worker.postMessage(frame);
        } else {
            // Process the frame in the current thread
            done({
                'data': AnimatedGifContext.workerMethods.run(frame)
            });
        }
    },
    startRendering: function startRendering(completeCallback) {
        this.onRenderCompleteCallback = completeCallback;

        for (var i = 0; i < this.options.numWorkers && i < this.frames.length; i++) {
            this.processFrame(i);
        }
    },
    processNextFrame: function processNextFrame() {
        var position = -1;

        for (var i = 0; i < this.frames.length; i++) {
            var frame = this.frames[i];

            if (!frame.done && !frame.beingProcessed) {
                position = i;
                break;
            }
        }

        if (position >= 0) {
            this.processFrame(position);
        }
    },
    // Takes the already processed data in frames and feeds it to a new
    // GifWriter instance in order to get the binary GIF file
    generateGIF: function generateGIF(frames, callback) {
        // TODO: Weird: using a simple JS array instead of a typed array,
        // the files are WAY smaller o_o. Patches/explanations welcome!
        var buffer = []; // new Uint8Array(width * height * frames.length * 5);
        var gifOptions = {
            loop: this.repeat
        };
        var options = this.options;
        var interval = options.interval;

        var frameDuration = options.frameDuration;
        var existingImages = options.images;
        var hasExistingImages = !!existingImages.length;
        var height = options.gifHeight;
        var width = options.gifWidth;
        var gifWriter$$1 = new gifWriter(buffer, width, height, gifOptions);
        var onRenderProgressCallback = this.onRenderProgressCallback;
        var delay = hasExistingImages ? interval * 100 : 0;
        var bufferToString = void 0;
        var gif = void 0;

        this.generatingGIF = true;

        utils.each(frames, function (iterator, frame) {
            var framePalette = frame.palette;

            onRenderProgressCallback(0.75 + 0.25 * frame.position * 1.0 / frames.length);

            for (var i = 0; i < frameDuration; i++) {
                gifWriter$$1.addFrame(0, 0, width, height, frame.pixels, {
                    palette: framePalette,
                    delay: delay
                });
            }
        });

        gifWriter$$1.end();

        onRenderProgressCallback(1.0);

        this.frames = [];

        this.generatingGIF = false;

        if (utils.isFunction(callback)) {
            bufferToString = this.bufferToString(buffer);
            gif = 'data:image/gif;base64,' + utils.btoa(bufferToString);

            callback(gif);
        }
    },
    // From GIF: 0 = loop forever, null = not looping, n > 0 = loop n times and stop
    setRepeat: function setRepeat(r) {
        this.repeat = r;
    },
    addFrame: function addFrame(element, gifshotOptions, frameText) {
        gifshotOptions = utils.isObject(gifshotOptions) ? gifshotOptions : {};

        var self = this;
        var ctx = self.ctx;
        var options = self.options;
        var width = options.gifWidth;
        var height = options.gifHeight;
        var fontSize = utils.getFontSize(gifshotOptions);
        var _gifshotOptions = gifshotOptions,
            filter = _gifshotOptions.filter,
            fontColor = _gifshotOptions.fontColor,
            fontFamily = _gifshotOptions.fontFamily,
            fontWeight = _gifshotOptions.fontWeight,
            gifHeight = _gifshotOptions.gifHeight,
            gifWidth = _gifshotOptions.gifWidth,
            text = _gifshotOptions.text,
            textAlign = _gifshotOptions.textAlign,
            textBaseline = _gifshotOptions.textBaseline,
            waterMark = _gifshotOptions.waterMark,
            waterMarkHeight = _gifshotOptions.waterMarkHeight,
            waterMarkWidth = _gifshotOptions.waterMarkWidth,
            waterMarkXCoordinate = _gifshotOptions.waterMarkXCoordinate,
            waterMarkYCoordinate = _gifshotOptions.waterMarkYCoordinate;

        var textXCoordinate = gifshotOptions.textXCoordinate ? gifshotOptions.textXCoordinate : textAlign === 'left' ? 1 : textAlign === 'right' ? width : width / 2;
        var textYCoordinate = gifshotOptions.textYCoordinate ? gifshotOptions.textYCoordinate : textBaseline === 'top' ? 1 : textBaseline === 'center' ? height / 2 : height;
        var font = fontWeight + ' ' + fontSize + ' ' + fontFamily;
        var textToUse = frameText && gifshotOptions.showFrameText ? frameText : text;
        var imageData = void 0;

        try {
            ctx.filter = filter;

            ctx.drawImage(element, 0, 0, width, height);

            if (textToUse) {
                ctx.font = font;
                ctx.fillStyle = fontColor;
                ctx.textAlign = textAlign;
                ctx.textBaseline = textBaseline;
                ctx.fillText(textToUse, textXCoordinate, textYCoordinate);
            }
            if (waterMark) {
                ctx.drawImage(waterMark, waterMarkXCoordinate, waterMarkYCoordinate, waterMarkWidth, waterMarkHeight);
            }
            imageData = ctx.getImageData(0, 0, width, height);

            self.addFrameImageData(imageData);
        } catch (e) {
            return '' + e;
        }
    },
    addFrameImageData: function addFrameImageData() {
        var imageData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var frames = this.frames;
        var imageDataArray = imageData.data;

        this.frames.push({
            'data': imageDataArray,
            'width': imageData.width,
            'height': imageData.height,
            'palette': null,
            'dithering': null,
            'done': false,
            'beingProcessed': false,
            'position': frames.length
        });
    },
    onRenderProgress: function onRenderProgress(callback) {
        this.onRenderProgressCallback = callback;
    },
    isRendering: function isRendering() {
        return this.generatingGIF;
    },
    getBase64GIF: function getBase64GIF(completeCallback) {
        var self = this;
        var onRenderComplete = function onRenderComplete(gif) {
            self.destroyWorkers();

            utils.requestTimeout(function () {
                completeCallback(gif);
            }, 0);
        };

        self.startRendering(onRenderComplete);
    },
    destroyWorkers: function destroyWorkers() {
        if (this.workerError) {
            return;
        }

        var workers = this.workers;

        // Explicitly ask web workers to die so they are explicitly GC'ed
        utils.each(workers, function (iterator, workerObj) {
            var worker = workerObj.worker;
            var objectUrl = workerObj.objectUrl;

            worker.terminate();
            utils.URL.revokeObjectURL(objectUrl);
        });
    }
};

/*
  getBase64GIF.js
  ===============
*/

/* Copyright  2017 Yahoo Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
*/

function getBase64GIF(animatedGifInstance, callback) {
    // This is asynchronous, rendered with WebWorkers
    animatedGifInstance.getBase64GIF(function (image) {
        callback({
            error: false,
            errorCode: '',
            errorMsg: '',
            image: image
        });
    });
}

/*
  existingImages.js
  =================
*/

/* Copyright  2017 Yahoo Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
*/

function existingImages() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var self = this;
    var callback = obj.callback,
        images = obj.images,
        options = obj.options;

    var imagesLength = obj.imagesLength;
    var skipObj = {
        'getUserMedia': true,
        'window.URL': true
    };
    var errorObj = error.validate(skipObj);
    var loadedImages = [];
    var loadedImagesLength = 0;
    var tempImage = void 0;
    var ag = void 0;

    if (errorObj.error) {
        return callback(errorObj);
    }

    // change workerPath to point to where Animated_GIF.worker.js is
    ag = new AnimatedGIF(options);

    utils.each(images, function (index, image) {
        var currentImage = image;

        if (image.src) {
            currentImage = currentImage.src;
        }
        if (utils.isElement(currentImage)) {
            if (options.crossOrigin) {
                currentImage.crossOrigin = options.crossOrigin;
            }

            loadedImages[index] = currentImage;
            loadedImagesLength += 1;

            if (loadedImagesLength === imagesLength) {
                addLoadedImagesToGif();
            }
        } else if (utils.isString(currentImage)) {
            tempImage = new Image();

            if (options.crossOrigin) {
                tempImage.crossOrigin = options.crossOrigin;
            }

            (function (tempImage) {
                if (image.text) {
                    tempImage.text = image.text;
                }

                tempImage.onerror = function (e) {
                    var obj = void 0;

                    --imagesLength; // skips over images that error out

                    if (imagesLength === 0) {
                        obj = {};
                        obj.error = 'None of the requested images was capable of being retrieved';

                        return callback(obj);
                    }
                };

                tempImage.onload = function (e) {
                    if (image.text) {
                        loadedImages[index] = {
                            img: tempImage,
                            text: tempImage.text
                        };
                    } else {
                        loadedImages[index] = tempImage;
                    }

                    loadedImagesLength += 1;

                    if (loadedImagesLength === imagesLength) {
                        addLoadedImagesToGif();
                    }

                    utils.removeElement(tempImage);
                };

                tempImage.src = currentImage;
            })(tempImage);

            utils.setCSSAttr(tempImage, {
                position: 'fixed',
                opacity: '0'
            });

            document.body.appendChild(tempImage);
        }
    });

    function addLoadedImagesToGif() {
        utils.each(loadedImages, function (index, loadedImage) {
            if (loadedImage) {
                if (loadedImage.text) {
                    ag.addFrame(loadedImage.img, options, loadedImage.text);
                } else {
                    ag.addFrame(loadedImage, options);
                }
            }
        });

        getBase64GIF(ag, callback);
    }
}

/*
* Copyright (c) 2015, Leon Sorokin
* All rights reserved. (MIT Licensed)
*
* RgbQuant.js - an image quantization lib
*/

function RgbQuant(opts) {
    opts = opts || {};

    // 1 = by global population, 2 = subregion population threshold
    this.method = opts.method || 2;
    // desired final palette size
    this.colors = opts.colors || 256;
    // # of highest-frequency colors to start with for palette reduction
    this.initColors = opts.initColors || 4096;
    // color-distance threshold for initial reduction pass
    this.initDist = opts.initDist || 0.01;
    // subsequent passes threshold
    this.distIncr = opts.distIncr || 0.005;
    // palette grouping
    this.hueGroups = opts.hueGroups || 10;
    this.satGroups = opts.satGroups || 10;
    this.lumGroups = opts.lumGroups || 10;
    // if > 0, enables hues stats and min-color retention per group
    this.minHueCols = opts.minHueCols || 0;
    // HueStats instance
    this.hueStats = this.minHueCols ? new HueStats(this.hueGroups, this.minHueCols) : null;

    // subregion partitioning box size
    this.boxSize = opts.boxSize || [64, 64];
    // number of same pixels required within box for histogram inclusion
    this.boxPxls = opts.boxPxls || 2;
    // palette locked indicator
    this.palLocked = false;
    // palette sort order
    //		this.sortPal = ['hue-','lum-','sat-'];

    // dithering/error diffusion kernel name
    this.dithKern = opts.dithKern || null;
    // dither serpentine pattern
    this.dithSerp = opts.dithSerp || false;
    // minimum color difference (0-1) needed to dither
    this.dithDelta = opts.dithDelta || 0;

    // accumulated histogram
    this.histogram = {};
    // palette - rgb triplets
    this.idxrgb = opts.palette ? opts.palette.slice(0) : [];
    // palette - int32 vals
    this.idxi32 = [];
    // reverse lookup {i32:idx}
    this.i32idx = {};
    // {i32:rgb}
    this.i32rgb = {};
    // enable color caching (also incurs overhead of cache misses and cache building)
    this.useCache = opts.useCache !== false;
    // min color occurance count needed to qualify for caching
    this.cacheFreq = opts.cacheFreq || 10;
    // allows pre-defined palettes to be re-indexed (enabling palette compacting and sorting)
    this.reIndex = opts.reIndex || this.idxrgb.length == 0;
    // selection of color-distance equation
    this.colorDist = opts.colorDist == "manhattan" ? distManhattan : distEuclidean;

    // if pre-defined palette, build lookups
    if (this.idxrgb.length > 0) {
        var self = this;
        this.idxrgb.forEach(function (rgb, i) {
            var i32 = (255 << 24 | // alpha
            rgb[2] << 16 | // blue
            rgb[1] << 8 | // green
            rgb[0] // red
            ) >>> 0;

            self.idxi32[i] = i32;
            self.i32idx[i32] = i;
            self.i32rgb[i32] = rgb;
        });
    }
}

// gathers histogram info
RgbQuant.prototype.sample = function sample(img, width) {
    if (this.palLocked) throw "Cannot sample additional images, palette already assembled.";

    var data = getImageData(img, width);

    switch (this.method) {
        case 1:
            this.colorStats1D(data.buf32);
            break;
        case 2:
            this.colorStats2D(data.buf32, data.width);
            break;
    }
};

// image quantizer
// todo: memoize colors here also
// @retType: 1 - Uint8Array (default), 2 - Indexed array, 3 - Match @img type (unimplemented, todo)
RgbQuant.prototype.reduce = function reduce(img, retType, dithKern, dithSerp) {
    if (!this.palLocked) this.buildPal();

    dithKern = dithKern || this.dithKern;
    dithSerp = typeof dithSerp != "undefined" ? dithSerp : this.dithSerp;

    retType = retType || 1;

    // reduce w/dither
    if (dithKern) var out32 = this.dither(img, dithKern, dithSerp);else {
        var data = getImageData(img),
            buf32 = data.buf32,
            len = buf32.length,
            out32 = new Uint32Array(len);

        for (var i = 0; i < len; i++) {
            var i32 = buf32[i];
            out32[i] = this.nearestColor(i32);
        }
    }

    if (retType == 1) return new Uint8Array(out32.buffer);

    if (retType == 2) {
        var out = [],
            len = out32.length;

        for (var i = 0; i < len; i++) {
            var i32 = out32[i];
            out[i] = this.i32idx[i32];
        }

        return out;
    }
};

// adapted from http://jsbin.com/iXofIji/2/edit by PAEz
RgbQuant.prototype.dither = function (img, kernel, serpentine) {
    // http://www.tannerhelland.com/4660/dithering-eleven-algorithms-source-code/
    var kernels = {
        FloydSteinberg: [[7 / 16, 1, 0], [3 / 16, -1, 1], [5 / 16, 0, 1], [1 / 16, 1, 1]],
        FalseFloydSteinberg: [[3 / 8, 1, 0], [3 / 8, 0, 1], [2 / 8, 1, 1]],
        Stucki: [[8 / 42, 1, 0], [4 / 42, 2, 0], [2 / 42, -2, 1], [4 / 42, -1, 1], [8 / 42, 0, 1], [4 / 42, 1, 1], [2 / 42, 2, 1], [1 / 42, -2, 2], [2 / 42, -1, 2], [4 / 42, 0, 2], [2 / 42, 1, 2], [1 / 42, 2, 2]],
        Atkinson: [[1 / 8, 1, 0], [1 / 8, 2, 0], [1 / 8, -1, 1], [1 / 8, 0, 1], [1 / 8, 1, 1], [1 / 8, 0, 2]],
        Jarvis: [// Jarvis, Judice, and Ninke / JJN?
        [7 / 48, 1, 0], [5 / 48, 2, 0], [3 / 48, -2, 1], [5 / 48, -1, 1], [7 / 48, 0, 1], [5 / 48, 1, 1], [3 / 48, 2, 1], [1 / 48, -2, 2], [3 / 48, -1, 2], [5 / 48, 0, 2], [3 / 48, 1, 2], [1 / 48, 2, 2]],
        Burkes: [[8 / 32, 1, 0], [4 / 32, 2, 0], [2 / 32, -2, 1], [4 / 32, -1, 1], [8 / 32, 0, 1], [4 / 32, 1, 1], [2 / 32, 2, 1]],
        Sierra: [[5 / 32, 1, 0], [3 / 32, 2, 0], [2 / 32, -2, 1], [4 / 32, -1, 1], [5 / 32, 0, 1], [4 / 32, 1, 1], [2 / 32, 2, 1], [2 / 32, -1, 2], [3 / 32, 0, 2], [2 / 32, 1, 2]],
        TwoSierra: [[4 / 16, 1, 0], [3 / 16, 2, 0], [1 / 16, -2, 1], [2 / 16, -1, 1], [3 / 16, 0, 1], [2 / 16, 1, 1], [1 / 16, 2, 1]],
        SierraLite: [[2 / 4, 1, 0], [1 / 4, -1, 1], [1 / 4, 0, 1]]
    };

    if (!kernel || !kernels[kernel]) {
        throw 'Unknown dithering kernel: ' + kernel;
    }

    var ds = kernels[kernel];

    var data = getImageData(img),

    //			buf8 = data.buf8,
    buf32 = data.buf32,
        width = data.width,
        height = data.height,
        len = buf32.length;

    var dir = serpentine ? -1 : 1;

    for (var y = 0; y < height; y++) {
        if (serpentine) dir = dir * -1;

        var lni = y * width;

        for (var x = dir == 1 ? 0 : width - 1, xend = dir == 1 ? width : 0; x !== xend; x += dir) {
            // Image pixel
            var idx = lni + x,
                i32 = buf32[idx],
                r1 = i32 & 0xff,
                g1 = (i32 & 0xff00) >> 8,
                b1 = (i32 & 0xff0000) >> 16;

            // Reduced pixel
            var i32x = this.nearestColor(i32),
                r2 = i32x & 0xff,
                g2 = (i32x & 0xff00) >> 8,
                b2 = (i32x & 0xff0000) >> 16;

            buf32[idx] = 255 << 24 | // alpha
            b2 << 16 | // blue
            g2 << 8 | // green
            r2;

            // dithering strength
            if (this.dithDelta) {
                var dist = this.colorDist([r1, g1, b1], [r2, g2, b2]);
                if (dist < this.dithDelta) continue;
            }

            // Component distance
            var er = r1 - r2,
                eg = g1 - g2,
                eb = b1 - b2;

            for (var i = dir == 1 ? 0 : ds.length - 1, end = dir == 1 ? ds.length : 0; i !== end; i += dir) {
                var x1 = ds[i][1] * dir,
                    y1 = ds[i][2];

                var lni2 = y1 * width;

                if (x1 + x >= 0 && x1 + x < width && y1 + y >= 0 && y1 + y < height) {
                    var d = ds[i][0];
                    var idx2 = idx + (lni2 + x1);

                    var r3 = buf32[idx2] & 0xff,
                        g3 = (buf32[idx2] & 0xff00) >> 8,
                        b3 = (buf32[idx2] & 0xff0000) >> 16;

                    var r4 = Math.max(0, Math.min(255, r3 + er * d)),
                        g4 = Math.max(0, Math.min(255, g3 + eg * d)),
                        b4 = Math.max(0, Math.min(255, b3 + eb * d));

                    buf32[idx2] = 255 << 24 | // alpha
                    b4 << 16 | // blue
                    g4 << 8 | // green
                    r4; // red
                }
            }
        }
    }

    return buf32;
};

// reduces histogram to palette, remaps & memoizes reduced colors
RgbQuant.prototype.buildPal = function buildPal(noSort) {
    if (this.palLocked || this.idxrgb.length > 0 && this.idxrgb.length <= this.colors) return;

    var histG = this.histogram,
        sorted = sortedHashKeys(histG, true);

    if (sorted.length == 0) throw "Nothing has been sampled, palette cannot be built.";

    switch (this.method) {
        case 1:
            var cols = this.initColors,
                last = sorted[cols - 1],
                freq = histG[last];

            var idxi32 = sorted.slice(0, cols);

            // add any cut off colors with same freq as last
            var pos = cols,
                len = sorted.length;
            while (pos < len && histG[sorted[pos]] == freq) {
                idxi32.push(sorted[pos++]);
            } // inject min huegroup colors
            if (this.hueStats) this.hueStats.inject(idxi32);

            break;
        case 2:
            var idxi32 = sorted;
            break;
    }

    // int32-ify values
    idxi32 = idxi32.map(function (v) {
        return +v;
    });

    this.reducePal(idxi32);

    if (!noSort && this.reIndex) this.sortPal();

    // build cache of top histogram colors
    if (this.useCache) this.cacheHistogram(idxi32);

    this.palLocked = true;
};

RgbQuant.prototype.palette = function palette(tuples, noSort) {
    this.buildPal(noSort);
    return tuples ? this.idxrgb : new Uint8Array(new Uint32Array(this.idxi32).buffer);
};

RgbQuant.prototype.prunePal = function prunePal(keep) {
    var i32;

    for (var j = 0; j < this.idxrgb.length; j++) {
        if (!keep[j]) {
            i32 = this.idxi32[j];
            this.idxrgb[j] = null;
            this.idxi32[j] = null;
            delete this.i32idx[i32];
        }
    }

    // compact
    if (this.reIndex) {
        var idxrgb = [],
            idxi32 = [],
            i32idx = {};

        for (var j = 0, i = 0; j < this.idxrgb.length; j++) {
            if (this.idxrgb[j]) {
                i32 = this.idxi32[j];
                idxrgb[i] = this.idxrgb[j];
                i32idx[i32] = i;
                idxi32[i] = i32;
                i++;
            }
        }

        this.idxrgb = idxrgb;
        this.idxi32 = idxi32;
        this.i32idx = i32idx;
    }
};

// reduces similar colors from an importance-sorted Uint32 rgba array
RgbQuant.prototype.reducePal = function reducePal(idxi32) {
    // if pre-defined palette's length exceeds target
    if (this.idxrgb.length > this.colors) {
        // quantize histogram to existing palette
        var len = idxi32.length,
            keep = {},
            uniques = 0,
            idx,
            pruned = false;

        for (var i = 0; i < len; i++) {
            // palette length reached, unset all remaining colors (sparse palette)
            if (uniques == this.colors && !pruned) {
                this.prunePal(keep);
                pruned = true;
            }

            idx = this.nearestIndex(idxi32[i]);

            if (uniques < this.colors && !keep[idx]) {
                keep[idx] = true;
                uniques++;
            }
        }

        if (!pruned) {
            this.prunePal(keep);
            pruned = true;
        }
    }
    // reduce histogram to create initial palette
    else {
            // build full rgb palette
            var idxrgb = idxi32.map(function (i32) {
                return [i32 & 0xff, (i32 & 0xff00) >> 8, (i32 & 0xff0000) >> 16];
            });

            var len = idxrgb.length,
                palLen = len,
                thold = this.initDist;

            // palette already at or below desired length
            if (palLen > this.colors) {
                while (palLen > this.colors) {
                    var memDist = [];

                    // iterate palette
                    for (var i = 0; i < len; i++) {
                        var pxi = idxrgb[i],
                            i32i = idxi32[i];
                        if (!pxi) continue;

                        for (var j = i + 1; j < len; j++) {
                            var pxj = idxrgb[j],
                                i32j = idxi32[j];
                            if (!pxj) continue;

                            var dist = this.colorDist(pxi, pxj);

                            if (dist < thold) {
                                // store index,rgb,dist
                                memDist.push([j, pxj, i32j, dist]);

                                // kill squashed value
                                delete idxrgb[j];
                                palLen--;
                            }
                        }
                    }

                    // palette reduction pass
                    // console.log("palette length: " + palLen);

                    // if palette is still much larger than target, increment by larger initDist
                    thold += palLen > this.colors * 3 ? this.initDist : this.distIncr;
                }

                // if palette is over-reduced, re-add removed colors with largest distances from last round
                if (palLen < this.colors) {
                    // sort descending
                    sort.call(memDist, function (a, b) {
                        return b[3] - a[3];
                    });

                    var k = 0;
                    while (palLen < this.colors) {
                        // re-inject rgb into final palette
                        idxrgb[memDist[k][0]] = memDist[k][1];

                        palLen++;
                        k++;
                    }
                }
            }

            var len = idxrgb.length;
            for (var i = 0; i < len; i++) {
                if (!idxrgb[i]) continue;

                this.idxrgb.push(idxrgb[i]);
                this.idxi32.push(idxi32[i]);

                this.i32idx[idxi32[i]] = this.idxi32.length - 1;
                this.i32rgb[idxi32[i]] = idxrgb[i];
            }
        }
};

// global top-population
RgbQuant.prototype.colorStats1D = function colorStats1D(buf32) {
    var histG = this.histogram,
        num = 0,
        col,
        len = buf32.length;

    for (var i = 0; i < len; i++) {
        col = buf32[i];

        // skip transparent
        if ((col & 0xff000000) >> 24 == 0) continue;

        // collect hue stats
        if (this.hueStats) this.hueStats.check(col);

        if (col in histG) histG[col]++;else histG[col] = 1;
    }
};

// population threshold within subregions
// FIXME: this can over-reduce (few/no colors same?), need a way to keep
// important colors that dont ever reach local thresholds (gradients?)
RgbQuant.prototype.colorStats2D = function colorStats2D(buf32, width) {
    var boxW = this.boxSize[0],
        boxH = this.boxSize[1],
        area = boxW * boxH,
        boxes = makeBoxes(width, buf32.length / width, boxW, boxH),
        histG = this.histogram,
        self = this;

    boxes.forEach(function (box) {
        var effc = Math.max(Math.round(box.w * box.h / area) * self.boxPxls, 2),
            histL = {},
            col;

        iterBox$1(box, width, function (i) {
            col = buf32[i];

            // skip transparent
            if ((col & 0xff000000) >> 24 == 0) return;

            // collect hue stats
            if (self.hueStats) self.hueStats.check(col);

            if (col in histG) histG[col]++;else if (col in histL) {
                if (++histL[col] >= effc) histG[col] = histL[col];
            } else histL[col] = 1;
        });
    });

    if (this.hueStats) this.hueStats.inject(histG);
};

// TODO: group very low lum and very high lum colors
// TODO: pass custom sort order
RgbQuant.prototype.sortPal = function sortPal() {
    var self = this;

    this.idxi32.sort(function (a, b) {
        var idxA = self.i32idx[a],
            idxB = self.i32idx[b],
            rgbA = self.idxrgb[idxA],
            rgbB = self.idxrgb[idxB];

        var hslA = rgb2hsl(rgbA[0], rgbA[1], rgbA[2]),
            hslB = rgb2hsl(rgbB[0], rgbB[1], rgbB[2]);

        // sort all grays + whites together
        var hueA = rgbA[0] == rgbA[1] && rgbA[1] == rgbA[2] ? -1 : hueGroup(hslA.h, self.hueGroups);
        var hueB = rgbB[0] == rgbB[1] && rgbB[1] == rgbB[2] ? -1 : hueGroup(hslB.h, self.hueGroups);

        var hueDiff = hueB - hueA;
        if (hueDiff) return -hueDiff;

        var lumDiff = lumGroup(+hslB.l.toFixed(2)) - lumGroup(+hslA.l.toFixed(2));
        if (lumDiff) return -lumDiff;

        var satDiff = satGroup(+hslB.s.toFixed(2)) - satGroup(+hslA.s.toFixed(2));
        if (satDiff) return -satDiff;
    });

    // sync idxrgb & i32idx
    this.idxi32.forEach(function (i32, i) {
        self.idxrgb[i] = self.i32rgb[i32];
        self.i32idx[i32] = i;
    });
};

// TOTRY: use HUSL - http://boronine.com/husl/
RgbQuant.prototype.nearestColor = function nearestColor(i32) {
    var idx = this.nearestIndex(i32);
    return idx === null ? 0 : this.idxi32[idx];
};

// TOTRY: use HUSL - http://boronine.com/husl/
RgbQuant.prototype.nearestIndex = function nearestIndex(i32) {
    // alpha 0 returns null index
    if ((i32 & 0xff000000) >> 24 == 0) return null;

    if (this.useCache && "" + i32 in this.i32idx) return this.i32idx[i32];

    var min = 1000,
        idx,
        rgb = [i32 & 0xff, (i32 & 0xff00) >> 8, (i32 & 0xff0000) >> 16],
        len = this.idxrgb.length;

    for (var i = 0; i < len; i++) {
        if (!this.idxrgb[i]) continue; // sparse palettes

        var dist = this.colorDist(rgb, this.idxrgb[i]);

        if (dist < min) {
            min = dist;
            idx = i;
        }
    }

    return idx;
};

RgbQuant.prototype.cacheHistogram = function cacheHistogram(idxi32) {
    for (var i = 0, i32 = idxi32[i]; i < idxi32.length && this.histogram[i32] >= this.cacheFreq; i32 = idxi32[i++]) {
        this.i32idx[i32] = this.nearestIndex(i32);
    }
};

function HueStats(numGroups, minCols) {
    this.numGroups = numGroups;
    this.minCols = minCols;
    this.stats = {};

    for (var i = -1; i < numGroups; i++) {
        this.stats[i] = { num: 0, cols: [] };
    }this.groupsFull = 0;
}

HueStats.prototype.check = function checkHue(i32) {
    if (this.groupsFull == this.numGroups + 1) this.check = function () {
        return;
    };

    var r = i32 & 0xff,
        g = (i32 & 0xff00) >> 8,
        b = (i32 & 0xff0000) >> 16,
        hg = r == g && g == b ? -1 : hueGroup(rgb2hsl(r, g, b).h, this.numGroups),
        gr = this.stats[hg],
        min = this.minCols;

    gr.num++;

    if (gr.num > min) return;
    if (gr.num == min) this.groupsFull++;

    if (gr.num <= min) this.stats[hg].cols.push(i32);
};

HueStats.prototype.inject = function injectHues(histG) {
    for (var i = -1; i < this.numGroups; i++) {
        if (this.stats[i].num <= this.minCols) {
            switch (typeOf(histG)) {
                case "Array":
                    this.stats[i].cols.forEach(function (col) {
                        if (histG.indexOf(col) == -1) histG.push(col);
                    });
                    break;
                case "Object":
                    this.stats[i].cols.forEach(function (col) {
                        if (!histG[col]) histG[col] = 1;else histG[col]++;
                    });
                    break;
            }
        }
    }
};

// Rec. 709 (sRGB) luma coef
var Pr = .2126;
var Pg = .7152;
var Pb = .0722;

// http://alienryderflex.com/hsp.html
function rgb2lum(r, g, b) {
    return Math.sqrt(Pr * r * r + Pg * g * g + Pb * b * b);
}

var rd = 255;
var gd = 255;
var bd = 255;

var euclMax = Math.sqrt(Pr * rd * rd + Pg * gd * gd + Pb * bd * bd);

// perceptual Euclidean color distance
function distEuclidean(rgb0, rgb1) {
    var rd = rgb1[0] - rgb0[0],
        gd = rgb1[1] - rgb0[1],
        bd = rgb1[2] - rgb0[2];

    return Math.sqrt(Pr * rd * rd + Pg * gd * gd + Pb * bd * bd) / euclMax;
}

var manhMax = Pr * rd + Pg * gd + Pb * bd;

// perceptual Manhattan color distance
function distManhattan(rgb0, rgb1) {
    var rd = Math.abs(rgb1[0] - rgb0[0]),
        gd = Math.abs(rgb1[1] - rgb0[1]),
        bd = Math.abs(rgb1[2] - rgb0[2]);

    return (Pr * rd + Pg * gd + Pb * bd) / manhMax;
}

// http://rgb2hsl.nichabi.com/javascript-function.php
function rgb2hsl(r, g, b) {
    var max, min, h, s, l, d;
    r /= 255;
    g /= 255;
    b /= 255;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    l = (max + min) / 2;
    if (max == min) {
        h = s = 0;
    } else {
        d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    //		h = Math.floor(h * 360)
    //		s = Math.floor(s * 100)
    //		l = Math.floor(l * 100)
    return {
        h: h,
        s: s,
        l: rgb2lum(r, g, b)
    };
}

function hueGroup(hue, segs) {
    var seg = 1 / segs,
        haf = seg / 2;

    if (hue >= 1 - haf || hue <= haf) return 0;

    for (var i = 1; i < segs; i++) {
        var mid = i * seg;
        if (hue >= mid - haf && hue <= mid + haf) return i;
    }
}

function satGroup(sat) {
    return sat;
}

function lumGroup(lum) {
    return lum;
}

function typeOf(val) {
    return Object.prototype.toString.call(val).slice(8, -1);
}

var sort = isArrSortStable() ? Array.prototype.sort : stableSort;

// must be used via stableSort.call(arr, fn)
function stableSort(fn) {
    var type = typeOf(this[0]);

    if (type == "Number" || type == "String") {
        var ord = {},
            len = this.length,
            val;

        for (var i = 0; i < len; i++) {
            val = this[i];
            if (ord[val] || ord[val] === 0) continue;
            ord[val] = i;
        }

        return this.sort(function (a, b) {
            return fn(a, b) || ord[a] - ord[b];
        });
    } else {
        var ord = this.map(function (v) {
            return v;
        });

        return this.sort(function (a, b) {
            return fn(a, b) || ord.indexOf(a) - ord.indexOf(b);
        });
    }
}

// test if js engine's Array#sort implementation is stable
function isArrSortStable() {
    var str = "abcdefghijklmnopqrstuvwxyz";

    return "xyzvwtursopqmnklhijfgdeabc" == str.split("").sort(function (a, b) {
        return ~~(str.indexOf(b) / 2.3) - ~~(str.indexOf(a) / 2.3);
    }).join("");
}

// returns uniform pixel data from various img
// TODO?: if array is passed, createimagedata, createlement canvas? take a pxlen?
function getImageData(img, width) {
    var can, ctx, imgd, buf8, buf32, height;

    switch (typeOf(img)) {
        case "HTMLImageElement":
            can = document.createElement("canvas");
            can.width = img.naturalWidth;
            can.height = img.naturalHeight;
            ctx = can.getContext("2d");
            ctx.drawImage(img, 0, 0);
        case "Canvas":
        case "HTMLCanvasElement":
            can = can || img;
            ctx = ctx || can.getContext("2d");
        case "CanvasRenderingContext2D":
            ctx = ctx || img;
            can = can || ctx.canvas;
            imgd = ctx.getImageData(0, 0, can.width, can.height);
        case "ImageData":
            imgd = imgd || img;
            width = imgd.width;
            if (typeOf(imgd.data) == "CanvasPixelArray") buf8 = new Uint8Array(imgd.data);else buf8 = imgd.data;
        case "Array":
        case "CanvasPixelArray":
            buf8 = buf8 || new Uint8Array(img);
        case "Uint8Array":
        case "Uint8ClampedArray":
            buf8 = buf8 || img;
            buf32 = new Uint32Array(buf8.buffer);
        case "Uint32Array":
            buf32 = buf32 || img;
            buf8 = buf8 || new Uint8Array(buf32.buffer);
            width = width || buf32.length;
            height = buf32.length / width;
    }

    return {
        can: can,
        ctx: ctx,
        imgd: imgd,
        buf8: buf8,
        buf32: buf32,
        width: width,
        height: height
    };
}

// partitions a rect of wid x hgt into
// array of bboxes of w0 x h0 (or less)
function makeBoxes(wid, hgt, w0, h0) {
    var wnum = ~~(wid / w0),
        wrem = wid % w0,
        hnum = ~~(hgt / h0),
        hrem = hgt % h0,
        xend = wid - wrem,
        yend = hgt - hrem;

    var bxs = [];
    for (var y = 0; y < hgt; y += h0) {
        for (var x = 0; x < wid; x += w0) {
            bxs.push({ x: x, y: y, w: x == xend ? wrem : w0, h: y == yend ? hrem : h0 });
        }
    }return bxs;
}

// iterates @bbox within a parent rect of width @wid; calls @fn, passing index within parent
function iterBox$1(bbox, wid, fn) {
    var b = bbox,
        i0 = b.y * wid + b.x,
        i1 = (b.y + b.h - 1) * wid + (b.x + b.w - 1),
        cnt = 0,
        incr = wid - b.w + 1,
        i = i0;

    do {
        fn.call(this, i);
        i += ++cnt % b.w == 0 ? incr : 1;
    } while (i <= i1);
}

// returns array of hash keys sorted by their values
function sortedHashKeys(obj, desc) {
    var keys = [];

    for (var key in obj) {
        keys.push(key);
    }return sort.call(keys, function (a, b) {
        return desc ? obj[b] - obj[a] : obj[a] - obj[b];
    });
}

// (c) Dean McNamee <dean@gmail.com>, 2013.
//
// https://github.com/deanm/omggif
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.
//
// omggif is a JavaScript implementation of a GIF 89a encoder and decoder,
// including animation and compression.  It does not rely on any specific
// underlying system, so should run in the browser, Node, or Plask.

function GifWriter(buf, width, height, gopts) {
  var p = 0;

  var gopts = gopts === undefined ? {} : gopts;
  var loop_count = gopts.loop === undefined ? null : gopts.loop;
  var global_palette = gopts.palette === undefined ? null : gopts.palette;

  if (width <= 0 || height <= 0 || width > 65535 || height > 65535) throw "Width/Height invalid.";

  function check_palette_and_num_colors(palette) {
    var num_colors = palette.length;
    if (num_colors < 2 || num_colors > 256 || num_colors & num_colors - 1) throw "Invalid code/color length, must be power of 2 and 2 .. 256.";
    return num_colors;
  }

  // - Header.
  buf[p++] = 0x47;buf[p++] = 0x49;buf[p++] = 0x46; // GIF
  buf[p++] = 0x38;buf[p++] = 0x39;buf[p++] = 0x61; // 89a

  // Handling of Global Color Table (palette) and background index.
  var gp_num_colors_pow2 = 0;
  var background = 0;
  if (global_palette !== null) {
    var gp_num_colors = check_palette_and_num_colors(global_palette);
    while (gp_num_colors >>= 1) {
      ++gp_num_colors_pow2;
    }gp_num_colors = 1 << gp_num_colors_pow2;
    --gp_num_colors_pow2;
    if (gopts.background !== undefined) {
      background = gopts.background;
      if (background >= gp_num_colors) throw "Background index out of range.";
      // The GIF spec states that a background index of 0 should be ignored, so
      // this is probably a mistake and you really want to set it to another
      // slot in the palette.  But actually in the end most browsers, etc end
      // up ignoring this almost completely (including for dispose background).
      if (background === 0) throw "Background index explicitly passed as 0.";
    }
  }

  // - Logical Screen Descriptor.
  // NOTE(deanm): w/h apparently ignored by implementations, but set anyway.
  buf[p++] = width & 0xff;buf[p++] = width >> 8 & 0xff;
  buf[p++] = height & 0xff;buf[p++] = height >> 8 & 0xff;
  // NOTE: Indicates 0-bpp original color resolution (unused?).
  buf[p++] = (global_palette !== null ? 0x80 : 0) | // Global Color Table Flag.
  gp_num_colors_pow2; // NOTE: No sort flag (unused?).
  buf[p++] = background; // Background Color Index.
  buf[p++] = 0; // Pixel aspect ratio (unused?).

  // - Global Color Table
  if (global_palette !== null) {
    for (var i = 0, il = global_palette.length; i < il; ++i) {
      var rgb = global_palette[i];
      buf[p++] = rgb >> 16 & 0xff;
      buf[p++] = rgb >> 8 & 0xff;
      buf[p++] = rgb & 0xff;
    }
  }

  if (loop_count !== null) {
    // Netscape block for looping.
    if (loop_count < 0 || loop_count > 65535) throw "Loop count invalid.";
    // Extension code, label, and length.
    buf[p++] = 0x21;buf[p++] = 0xff;buf[p++] = 0x0b;
    // NETSCAPE2.0
    buf[p++] = 0x4e;buf[p++] = 0x45;buf[p++] = 0x54;buf[p++] = 0x53;
    buf[p++] = 0x43;buf[p++] = 0x41;buf[p++] = 0x50;buf[p++] = 0x45;
    buf[p++] = 0x32;buf[p++] = 0x2e;buf[p++] = 0x30;
    // Sub-block
    buf[p++] = 0x03;buf[p++] = 0x01;
    buf[p++] = loop_count & 0xff;buf[p++] = loop_count >> 8 & 0xff;
    buf[p++] = 0x00; // Terminator.
  }

  var ended = false;

  this.addFrame = function (x, y, w, h, indexed_pixels, opts) {
    if (ended === true) {
      --p;ended = false;
    } // Un-end.

    opts = opts === undefined ? {} : opts;

    // TODO(deanm): Bounds check x, y.  Do they need to be within the virtual
    // canvas width/height, I imagine?
    if (x < 0 || y < 0 || x > 65535 || y > 65535) throw "x/y invalid.";

    if (w <= 0 || h <= 0 || w > 65535 || h > 65535) throw "Width/Height invalid.";

    if (indexed_pixels.length < w * h) throw "Not enough pixels for the frame size.";

    var using_local_palette = true;
    var palette = opts.palette;
    if (palette === undefined || palette === null) {
      using_local_palette = false;
      palette = global_palette;
    }

    if (palette === undefined || palette === null) throw "Must supply either a local or global palette.";

    var num_colors = check_palette_and_num_colors(palette);

    // Compute the min_code_size (power of 2), destroying num_colors.
    var min_code_size = 0;
    while (num_colors >>= 1) {
      ++min_code_size;
    }num_colors = 1 << min_code_size; // Now we can easily get it back.

    var delay = opts.delay === undefined ? 0 : opts.delay;

    // From the spec:
    //     0 -   No disposal specified. The decoder is
    //           not required to take any action.
    //     1 -   Do not dispose. The graphic is to be left
    //           in place.
    //     2 -   Restore to background color. The area used by the
    //           graphic must be restored to the background color.
    //     3 -   Restore to previous. The decoder is required to
    //           restore the area overwritten by the graphic with
    //           what was there prior to rendering the graphic.
    //  4-7 -    To be defined.
    // NOTE(deanm): Dispose background doesn't really work, apparently most
    // browsers ignore the background palette index and clear to transparency.
    var disposal = opts.disposal === undefined ? 0 : opts.disposal;
    if (disposal < 0 || disposal > 3) // 4-7 is reserved.
      throw "Disposal out of range.";

    var use_transparency = false;
    var transparent_index = 0;
    if (opts.transparent !== undefined && opts.transparent !== null) {
      use_transparency = true;
      transparent_index = opts.transparent;
      if (transparent_index < 0 || transparent_index >= num_colors) throw "Transparent color index.";
    }

    if (disposal !== 0 || use_transparency || delay !== 0) {
      // - Graphics Control Extension
      buf[p++] = 0x21;buf[p++] = 0xf9; // Extension / Label.
      buf[p++] = 4; // Byte size.

      buf[p++] = disposal << 2 | (use_transparency === true ? 1 : 0);
      buf[p++] = delay & 0xff;buf[p++] = delay >> 8 & 0xff;
      buf[p++] = transparent_index; // Transparent color index.
      buf[p++] = 0; // Block Terminator.
    }

    // - Image Descriptor
    buf[p++] = 0x2c; // Image Seperator.
    buf[p++] = x & 0xff;buf[p++] = x >> 8 & 0xff; // Left.
    buf[p++] = y & 0xff;buf[p++] = y >> 8 & 0xff; // Top.
    buf[p++] = w & 0xff;buf[p++] = w >> 8 & 0xff;
    buf[p++] = h & 0xff;buf[p++] = h >> 8 & 0xff;
    // NOTE: No sort flag (unused?).
    // TODO(deanm): Support interlace.
    buf[p++] = using_local_palette === true ? 0x80 | min_code_size - 1 : 0;

    // - Local Color Table
    if (using_local_palette === true) {
      for (var i = 0, il = palette.length; i < il; ++i) {
        var rgb = palette[i];
        buf[p++] = rgb >> 16 & 0xff;
        buf[p++] = rgb >> 8 & 0xff;
        buf[p++] = rgb & 0xff;
      }
    }

    p = GifWriterOutputLZWCodeStream(buf, p, min_code_size < 2 ? 2 : min_code_size, indexed_pixels);
  };

  this.end = function () {
    if (ended === false) {
      buf[p++] = 0x3b; // Trailer.
      ended = true;
    }
    return p;
  };
}

// Main compression routine, palette indexes -> LZW code stream.
// |index_stream| must have at least one entry.
function GifWriterOutputLZWCodeStream(buf, p, min_code_size, index_stream) {
  buf[p++] = min_code_size;
  var cur_subblock = p++; // Pointing at the length field.

  var clear_code = 1 << min_code_size;
  var code_mask = clear_code - 1;
  var eoi_code = clear_code + 1;
  var next_code = eoi_code + 1;

  var cur_code_size = min_code_size + 1; // Number of bits per code.
  var cur_shift = 0;
  // We have at most 12-bit codes, so we should have to hold a max of 19
  // bits here (and then we would write out).
  var cur = 0;

  function emit_bytes_to_buffer(bit_block_size) {
    while (cur_shift >= bit_block_size) {
      buf[p++] = cur & 0xff;
      cur >>= 8;cur_shift -= 8;
      if (p === cur_subblock + 256) {
        // Finished a subblock.
        buf[cur_subblock] = 255;
        cur_subblock = p++;
      }
    }
  }

  function emit_code(c) {
    cur |= c << cur_shift;
    cur_shift += cur_code_size;
    emit_bytes_to_buffer(8);
  }

  // I am not an expert on the topic, and I don't want to write a thesis.
  // However, it is good to outline here the basic algorithm and the few data
  // structures and optimizations here that make this implementation fast.
  // The basic idea behind LZW is to build a table of previously seen runs
  // addressed by a short id (herein called output code).  All data is
  // referenced by a code, which represents one or more values from the
  // original input stream.  All input bytes can be referenced as the same
  // value as an output code.  So if you didn't want any compression, you
  // could more or less just output the original bytes as codes (there are
  // some details to this, but it is the idea).  In order to achieve
  // compression, values greater then the input range (codes can be up to
  // 12-bit while input only 8-bit) represent a sequence of previously seen
  // inputs.  The decompressor is able to build the same mapping while
  // decoding, so there is always a shared common knowledge between the
  // encoding and decoder, which is also important for "timing" aspects like
  // how to handle variable bit width code encoding.
  //
  // One obvious but very important consequence of the table system is there
  // is always a unique id (at most 12-bits) to map the runs.  'A' might be
  // 4, then 'AA' might be 10, 'AAA' 11, 'AAAA' 12, etc.  This relationship
  // can be used for an effecient lookup strategy for the code mapping.  We
  // need to know if a run has been seen before, and be able to map that run
  // to the output code.  Since we start with known unique ids (input bytes),
  // and then from those build more unique ids (table entries), we can
  // continue this chain (almost like a linked list) to always have small
  // integer values that represent the current byte chains in the encoder.
  // This means instead of tracking the input bytes (AAAABCD) to know our
  // current state, we can track the table entry for AAAABC (it is guaranteed
  // to exist by the nature of the algorithm) and the next character D.
  // Therefor the tuple of (table_entry, byte) is guaranteed to also be
  // unique.  This allows us to create a simple lookup key for mapping input
  // sequences to codes (table indices) without having to store or search
  // any of the code sequences.  So if 'AAAA' has a table entry of 12, the
  // tuple of ('AAAA', K) for any input byte K will be unique, and can be our
  // key.  This leads to a integer value at most 20-bits, which can always
  // fit in an SMI value and be used as a fast sparse array / object key.

  // Output code for the current contents of the index buffer.
  var ib_code = index_stream[0] & code_mask; // Load first input index.
  var code_table = {}; // Key'd on our 20-bit "tuple".

  emit_code(clear_code); // Spec says first code should be a clear code.

  // First index already loaded, process the rest of the stream.
  for (var i = 1, il = index_stream.length; i < il; ++i) {
    var k = index_stream[i] & code_mask;
    var cur_key = ib_code << 8 | k; // (prev, k) unique tuple.
    var cur_code = code_table[cur_key]; // buffer + k.

    // Check if we have to create a new code table entry.
    if (cur_code === undefined) {
      // We don't have buffer + k.
      // Emit index buffer (without k).
      // This is an inline version of emit_code, because this is the core
      // writing routine of the compressor (and V8 cannot inline emit_code
      // because it is a closure here in a different context).  Additionally
      // we can call emit_byte_to_buffer less often, because we can have
      // 30-bits (from our 31-bit signed SMI), and we know our codes will only
      // be 12-bits, so can safely have 18-bits there without overflow.
      // emit_code(ib_code);
      cur |= ib_code << cur_shift;
      cur_shift += cur_code_size;
      while (cur_shift >= 8) {
        buf[p++] = cur & 0xff;
        cur >>= 8;cur_shift -= 8;
        if (p === cur_subblock + 256) {
          // Finished a subblock.
          buf[cur_subblock] = 255;
          cur_subblock = p++;
        }
      }

      if (next_code === 4096) {
        // Table full, need a clear.
        emit_code(clear_code);
        next_code = eoi_code + 1;
        cur_code_size = min_code_size + 1;
        code_table = {};
      } else {
        // Table not full, insert a new entry.
        // Increase our variable bit code sizes if necessary.  This is a bit
        // tricky as it is based on "timing" between the encoding and
        // decoder.  From the encoders perspective this should happen after
        // we've already emitted the index buffer and are about to create the
        // first table entry that would overflow our current code bit size.
        if (next_code >= 1 << cur_code_size) ++cur_code_size;
        code_table[cur_key] = next_code++; // Insert into code table.
      }

      ib_code = k; // Index buffer to single input k.
    } else {
      ib_code = cur_code; // Index buffer to sequence in code table.
    }
  }

  emit_code(ib_code); // There will still be something in the index buffer.
  emit_code(eoi_code); // End Of Information.

  // Flush / finalize the sub-blocks stream to the buffer.
  emit_bytes_to_buffer(1);

  // Finish the sub-blocks, writing out any unfinished lengths and
  // terminating with a sub-block of length 0.  If we have already started
  // but not yet used a sub-block it can just become the terminator.
  if (cur_subblock + 1 === p) {
    // Started but unused.
    buf[cur_subblock] = 0;
  } else {
    // Started and used, write length and additional terminator block.
    buf[cur_subblock] = p - cur_subblock - 1;
    buf[p++] = 0;
  }
  return p;
}

function GifReaderLZWOutputIndexStream(code_stream, p, output, output_length) {
  var min_code_size = code_stream[p++];

  var clear_code = 1 << min_code_size;
  var eoi_code = clear_code + 1;
  var next_code = eoi_code + 1;

  var cur_code_size = min_code_size + 1; // Number of bits per code.
  // NOTE: This shares the same name as the encoder, but has a different
  // meaning here.  Here this masks each code coming from the code stream.
  var code_mask = (1 << cur_code_size) - 1;
  var cur_shift = 0;
  var cur = 0;

  var op = 0; // Output pointer.

  var subblock_size = code_stream[p++];

  // TODO(deanm): Would using a TypedArray be any faster?  At least it would
  // solve the fast mode / backing store uncertainty.
  // var code_table = Array(4096);
  var code_table = new Int32Array(4096); // Can be signed, we only use 20 bits.

  var prev_code = null; // Track code-1.

  while (true) {
    // Read up to two bytes, making sure we always 12-bits for max sized code.
    while (cur_shift < 16) {
      if (subblock_size === 0) break; // No more data to be read.

      cur |= code_stream[p++] << cur_shift;
      cur_shift += 8;

      if (subblock_size === 1) {
        // Never let it get to 0 to hold logic above.
        subblock_size = code_stream[p++]; // Next subblock.
      } else {
        --subblock_size;
      }
    }

    // TODO(deanm): We should never really get here, we should have received
    // and EOI.
    if (cur_shift < cur_code_size) break;

    var code = cur & code_mask;
    cur >>= cur_code_size;
    cur_shift -= cur_code_size;

    // TODO(deanm): Maybe should check that the first code was a clear code,
    // at least this is what you're supposed to do.  But actually our encoder
    // now doesn't emit a clear code first anyway.
    if (code === clear_code) {
      // We don't actually have to clear the table.  This could be a good idea
      // for greater error checking, but we don't really do any anyway.  We
      // will just track it with next_code and overwrite old entries.

      next_code = eoi_code + 1;
      cur_code_size = min_code_size + 1;
      code_mask = (1 << cur_code_size) - 1;

      // Don't update prev_code ?
      prev_code = null;
      continue;
    } else if (code === eoi_code) {
      break;
    }

    // We have a similar situation as the decoder, where we want to store
    // variable length entries (code table entries), but we want to do in a
    // faster manner than an array of arrays.  The code below stores sort of a
    // linked list within the code table, and then "chases" through it to
    // construct the dictionary entries.  When a new entry is created, just the
    // last byte is stored, and the rest (prefix) of the entry is only
    // referenced by its table entry.  Then the code chases through the
    // prefixes until it reaches a single byte code.  We have to chase twice,
    // first to compute the length, and then to actually copy the data to the
    // output (backwards, since we know the length).  The alternative would be
    // storing something in an intermediate stack, but that doesn't make any
    // more sense.  I implemented an approach where it also stored the length
    // in the code table, although it's a bit tricky because you run out of
    // bits (12 + 12 + 8), but I didn't measure much improvements (the table
    // entries are generally not the long).  Even when I created benchmarks for
    // very long table entries the complexity did not seem worth it.
    // The code table stores the prefix entry in 12 bits and then the suffix
    // byte in 8 bits, so each entry is 20 bits.

    var chase_code = code < next_code ? code : prev_code;

    // Chase what we will output, either {CODE} or {CODE-1}.
    var chase_length = 0;
    var chase = chase_code;
    while (chase > clear_code) {
      chase = code_table[chase] >> 8;
      ++chase_length;
    }

    var k = chase;

    var op_end = op + chase_length + (chase_code !== code ? 1 : 0);
    if (op_end > output_length) {
      console.log("Warning, gif stream longer than expected.");
      return;
    }

    // Already have the first byte from the chase, might as well write it fast.
    output[op++] = k;

    op += chase_length;
    var b = op; // Track pointer, writing backwards.

    if (chase_code !== code) // The case of emitting {CODE-1} + k.
      output[op++] = k;

    chase = chase_code;
    while (chase_length--) {
      chase = code_table[chase];
      output[--b] = chase & 0xff; // Write backwards.
      chase >>= 8; // Pull down to the prefix code.
    }

    if (prev_code !== null && next_code < 4096) {
      code_table[next_code++] = prev_code << 8 | k;
      // TODO(deanm): Figure out this clearing vs code growth logic better.  I
      // have an feeling that it should just happen somewhere else, for now it
      // is awkward between when we grow past the max and then hit a clear code.
      // For now just check if we hit the max 12-bits (then a clear code should
      // follow, also of course encoded in 12-bits).
      if (next_code >= code_mask + 1 && cur_code_size < 12) {
        ++cur_code_size;
        code_mask = code_mask << 1 | 1;
      }
    }

    prev_code = code;
  }

  if (op !== output_length) {
    console.log("Warning, gif stream shorter than expected.");
  }

  return output;
}

/*
* Copyright (c) 2017, Leon Sorokin
* All rights reserved. (MIT Licensed)
*
* GIFter.js - <canvas> to GIF recorder
*/
// final width & height, frames will be scaled to these automaticlly
function GIFter(width, height, opts) {
    opts = opts || {};

    // output dims, input will be scaled to these
    this.width = width;
    this.height = height;

    // 0: no diff, fast, mem-hungry, large output
    // 1: scene mode, frames are stored as deltas, so no color->trans possible
    //    eg: http://cdn.shopify.com/s/files/1/0186/8104/files/Super_Mario_World_GIF-6_grande.gif
    // 2: sprite mode, each frame replaces all previous; full disposal, color->trans okay
    //    eg: http://www.dan-dare.org/SonicMario/SonicMario.htm
    this.diffMode = opts.diffMode === 0 ? 0 : opts.diffMode || 1;

    //		this.quantMode = 0 || 1		// local or global

    // portion of passed frames to grab. default = full frame.
    this.cropBox = opts.cropBox;
    // background color? index?
    this.background = opts.background;
    // 0: infinite; undefined: off
    this.loop = opts.loop;
    // default frame delay (in multiples of 10ms)
    this.frameDelay = opts.frameDelay || 2; // trueSpeed (try using timestamps for delay calc)
    // last frame delay
    this.loopDelay = opts.loopDelay || this.frameDelay;
    // global palette (pre-init transparent)
    this.palette = opts.palette || [0]; // [-1];

    // sampling: use a ramping function?
    // sampling interval
    this.sampleInt = opts.sampleInt || 1;
    // sampling total frame count
    this.sampleQty = opts.sampleQty || 30;
    // sample frame counter
    this.sampleCtr = 0;

    // temp context (size of cropBox) for assembling layers
    this._tmpCtx = null;

    // frames held here (as diffs)
    this.frames = [];
    // currently placed pixels (Uint32Array)
    this.stage = null;

    this.quantOpts = opts.quantOpts || {
        colors: 256, // desired palette size
        method: 2, // histogram method, 2: min-population threshold within subregions; 1: global top-population
        boxSize: [64, 64], // subregion dims (if method = 2)
        boxPxls: 2, // min-population threshold (if method = 2)
        initColors: 4096, // # of top-occurring colors  to start with (if method = 1)
        minHueCols: 0, // # of colors per hue group to evaluate regardless of counts, to retain low-count hues
        dithKern: null, // dithering kernel name, see available kernels in docs below
        dithDelta: 0, // dithering threshhold (0-1) e.g: 0.05 will not dither colors with <= 5% difference
        dithSerp: false, // enable serpentine pattern dithering
        palette: [], // a predefined palette to start with in r,g,b tuple format: [[r,g,b],[r,g,b]...]
        reIndex: false, // affects predefined palettes only. if true, allows compacting of sparsed palette once target palette size is reached. also enables palette sorting.
        useCache: true, // enables caching for perf usually, but can reduce perf in some cases, like pre-def palettes
        cacheFreq: 10, // min color occurance count needed to qualify for caching
        colorDist: "euclidean" // method used to determine color distance, can also be "manhattan"
    };

    this.encOpts = opts.encOpts || {};

    this.quantizer = new RgbQuant(this.quantOpts); // should be fn to have pluggable quantizer, quantopts may have color count at 255 if transparent index is present
    this.encoder = null;
}

// @lyrs: array of <canvas> and/or <img> elements			// TODO: accept typed arrays, imagedata
// @opts: frame-specific opts
GIFter.prototype.addFrame = function addFrame(lyrs, opts) {
    // maybe if layers is blank, assume not changes, increment by amount in opts or global frameDelay
    if (!(lyrs instanceof Array)) lyrs = [lyrs];

    //		if (this.trueSpeed)			// will only work well in workers
    //			var time = +(new Date);

    opts = opts || {};

    var cropBox = opts.cropBox || this.cropBox || [0, 0, lyrs[0].naturalWidth || lyrs[0].width, lyrs[0].naturalHeight || lyrs[0].height];

    // make cropped, composed frame
    var frame32 = this.composeLayers(lyrs, cropBox);

    // disposal mode
    var disp = this.diffMode == 1 ? 0 : 2;

    if (this.diffMode == 0 || this.stage === null) {
        var diff = {
            bbox: [0, 0, cropBox[2], cropBox[3]],
            data: frame32
        };
    } else if (this.diffMode == 2) {
        var cont = frameCont(frame32, cropBox[2]);
        // TODO: still need to real diff it via sameFrame, at least compare diffbox with prior
        var diff = cont;
    } else var diff = frameDiff(this.stage, frame32, cropBox[2]);

    if (diff === null) {
        //increase last frame's delay
        this.frames[this.frames.length - 1].delay += opts.delay || this.frameDelay;
        return;
    }

    this.frames.push({
        bbox: diff.bbox,
        data: diff.data,
        delay: opts.delay || this.frameDelay,
        disp: disp,
        pal: null,
        indxd: null
    });

    this.stage = frame32;

    // must sample here (live), since frames are stored as deltas
    var lastIdx = this.frames.length - 1;
    if (this.sampleCtr < this.sampleQty && lastIdx % this.sampleInt == 0) {
        //	console.log("Sampling frame " + this.frames.length);
        this.quantizer.sample(this.stage);
        this.sampleCtr++;
    }

    // if liveEncode with no quant?
    // this.iframes.push([0, 0, imgd.width, imgd.height, this.indexFrame(frame), opts]);
};

// creates/caches and returns context for layer composing
// DOM-enabled only
GIFter.prototype.getTmpCtx = function getTmpCtx(width, height) {
    if (!this._tmpCtx) {
        var can = document.createElement("canvas"),
            ctx = can.getContext("2d");

        can.width = width;
        can.height = height;

        this._tmpCtx = ctx;
    }

    return this._tmpCtx;
};

// alpha-compose + crop via drawImage to cropbox sized canvas
// @lyrs: array of <canvas> and/or <img> elements
// cropBox must be set
// lyrs2CroppedCtx
GIFter.prototype.composeLayers = function composeLayers(lyrs, cropBox) {
    var w = cropBox[2],
        h = cropBox[3];

    var ctx = this.getTmpCtx(w, h);

    ctx.clearRect(0, 0, w, h);

    for (var i in lyrs) {
        ctx.drawImage(lyrs[i], -cropBox[0], -cropBox[1]);
    }var imgd = ctx.getImageData(0, 0, w, h);

    return new Uint32Array(imgd.data.buffer);
};

GIFter.prototype.complete = function complete() {
    this.buildPalette();
    this.indexFrames();
    return this.render();
};

// not for live use
GIFter.prototype.buildPalette = function buildPalette() {
    //		console.log("Building palette...");
    this.palette = this.quantizer.palette(true).map(function (rgb) {
        return (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];
    });

    // offset indices to account for [0] transparent (TODO: diffmode 1 and 2 only)
    this.palette.unshift(0);

    return this.palette;
};

// not for live use
GIFter.prototype.indexFrames = function indexFrames() {
    //		console.log("Reducing & indexing...");
    for (var i in this.frames) {
        this.frames[i].indxd = this.quantizer.reduce(this.frames[i].data, 2)
        // offset indices to account for [0] transparent (TODO: diffmode 1 and 2 only)
        .map(function (i) {
            return i === null ? 0 : i + 1;
        });
    }
};

//
GIFter.prototype.encode = function encode() {
    //		console.log("Encoding frames...");
    // coerce palette to power of 2; cleverness on loan from http://www.mrdoob.com/lab/javascript/omggif/
    var powof2 = 1;
    while (powof2 < this.palette.length) {
        powof2 <<= 1;
    }this.palette.length = powof2;

    // FIXME: find a way to approximate appropriate buffer size
    var buf = new Uint8Array(1024 * 1024),
        opts = {
        loop: this.loop,
        palette: this.palette
    },
        enc = new GifWriter(buf, this.width, this.height, opts);

    var last = this.frames.length - 1,
        iframeScaled,
        iframe,

    // use first frame's bbox to determine scale factor for all (maybe revisit for sprites)
    rx = this.width / this.frames[0].bbox[2],
        ry = this.height / this.frames[0].bbox[3];

    for (var i in this.frames) {
        iframe = this.frames[i];

        var x = Math.floor(iframe.bbox[0] * rx),
            y = Math.floor(iframe.bbox[1] * ry),
            w = Math.floor(iframe.bbox[2] * rx),
            h = Math.floor(iframe.bbox[3] * ry);

        // FIXME: frames need to be scaled from a uniform external ref point so that
        // rounding doesnt fuck up consistency across varying size & pos delta frames
        // when scale factor is not an even number
        iframeScaled = scaleTo(iframe.indxd, iframe.bbox[2], iframe.bbox[3], w, h);

        // TODO: merge in per-frame opts
        var fopts = {
            delay: i == last ? this.loopDelay : this.frameDelay,
            transparent: 0,
            disposal: iframe.disp
        };

        enc.addFrame(x, y, w, h, iframeScaled, fopts);
    }

    return buf.subarray(0, enc.end());
};

GIFter.prototype.render = function render() {
    var img = document.createElement("img"),
        blob = this.encode();

    img.src = "data:image/gif;base64," + base64ArrayBuffer(blob);

    return img;
};

// computes delta between 2 frames returning minimum
// required diffBox and pixels data. 0 = no change
// TODO: indicate a *new* transparency with [255,255,255,0] ?
function frameDiff(frameA, frameB, width) {
    var diffBox = getDiffBox(frameA, frameB, width);

    if (diffBox === null) return null;

    var data = new Uint32Array(diffBox[2] * diffBox[3]);

    var j = 0;
    iterBox(diffBox, width, function (i) {
        data[j++] = frameA[i] === frameB[i] ? 0 : frameB[i];
    });

    return {
        data: data,
        bbox: diffBox
    };
}

// get frame's content (non-transparent region)
function frameCont(frameA, width) {
    var contBox = getContBox(frameA, width);

    if (contBox === null) return null;

    return {
        data: cropArr(frameA, width, contBox),
        bbox: contBox
    };
}

// analog to getImageData
function cropArr(pxls, width, cropBox) {
    //		var data = getImageData(pxls, width);

    // crop using canvas if available
    //		if (data.imgd) {
    //			var imgd = frame.getImageData.apply(frame, cropBox);
    //		}
    //		else {
    var x0 = cropBox[0],
        y0 = cropBox[1],
        w = cropBox[2],
        h = cropBox[3],
        x1 = x0 + w,
        y1 = y0 + h;

    var type = Object.prototype.toString.call(pxls).slice(8, -1),
        out = new window[type](w * h);

    var idx, sub;
    for (var ln = y0; ln < y1; ln++) {
        idx = ln * width + x0;
        sub = pxls.subarray(idx, idx + w);
        out.set(sub, (ln - y0) * w);
    }

    return out;
    //		}
}

// ported from http://tech-algorithm.com/articles/nearest-neighbor-image-scaling/
function scaleTo(pxls, w1, h1, w2, h2) {
    var out = new Uint8Array(w2 * h2),
        rx = w1 / w2,
        ry = h1 / h2,
        px,
        py;

    for (var i = 0; i < h2; i++) {
        for (var j = 0; j < w2; j++) {
            px = Math.floor(j * rx);
            py = Math.floor(i * ry);
            out[i * w2 + j] = pxls[py * w1 + px];
        }
    }

    return out;
}

function getDiffBox(arrA, arrB, w) {
    var cmpFn = function cmpFn(i) {
        return arrA[i] !== arrB[i];
    };

    return getBox(w, arrA.length / w, cmpFn);
}

function getContBox(arrA, w) {
    var cmpFn = function cmpFn(i) {
        return (arrA[i] & 0xff000000) >> 24 != 0;
    };

    return getBox(w, arrA.length / w, cmpFn);
}

// fast code ain't pretty
// @cmpFn: breaking condition tester
function getBox(w, h, cmpFn) {
    var i,
        x,
        y,
        len = w * h,
        top = null,
        btm = null,
        lft = null,
        rgt = null;

    // top
    i = 0;
    do {
        if (cmpFn(i)) {
            top = ~~(i / w);
            break;
        }
    } while (i++ < len);

    if (top === null) return null;

    // btm
    i = len;
    do {
        if (cmpFn(i)) {
            btm = ~~(i / w);
            break;
        }
    } while (i-- > 0);

    // lft
    x = 0;
    y = top;
    do {
        i = w * y + x;
        if (cmpFn(i)) {
            lft = x;
            break;
        }
        if (y < btm) y++;else {
            y = 0;
            x++;
        }
    } while (i < len);

    // rgt
    x = w - 1;
    y = top;
    do {
        i = w * y + x;
        if (cmpFn(i)) {
            rgt = x;
            break;
        }
        if (y < btm) y++;else {
            y = 0;
            x--;
        }
    } while (i > 0);

    return [lft, top, rgt - lft + 1, btm - top + 1];
}

// iterates @bbox within a parent rect of width @wid; calls @fn, passing index within parent
function iterBox(bbox, wid, fn) {
    var b = { x: bbox[0], y: bbox[1], w: bbox[2], h: bbox[3] },
        i0 = b.y * wid + b.x,
        i1 = (b.y + b.h - 1) * wid + (b.x + b.w - 1),
        cnt = 0,
        incr = wid - b.w + 1,
        i = i0;

    do {
        if (fn.call(this, i) === false) return;
        i += ++cnt % b.w == 0 ? incr : 1;
    } while (i <= i1);
}

/*
  screenShot.js
  =============
*/

/* Copyright  2017 Yahoo Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
*/

// Dependencies
// Helpers
var noop$3 = function noop() {};

var screenShot = {
    getGIF: function getGIF() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var callback = arguments[1];

        callback = utils.isFunction(callback) ? callback : noop$3;

        var canvas = document.createElement('canvas');
        var context = void 0;
        var existingImages = options.images;
        var hasExistingImages = !!existingImages.length;
        var cameraStream = options.cameraStream,
            crop = options.crop,
            filter = options.filter,
            fontColor = options.fontColor,
            fontFamily = options.fontFamily,
            fontWeight = options.fontWeight,
            keepCameraOn = options.keepCameraOn,
            numWorkers = options.numWorkers,
            progressCallback = options.progressCallback,
            saveRenderingContexts = options.saveRenderingContexts,
            savedRenderingContexts = options.savedRenderingContexts,
            text = options.text,
            textAlign = options.textAlign,
            textBaseline = options.textBaseline,
            videoElement = options.videoElement,
            videoHeight = options.videoHeight,
            videoWidth = options.videoWidth,
            webcamVideoElement = options.webcamVideoElement,
            waterMark = options.waterMark,
            waterMarkHeight = options.waterMarkHeight,
            waterMarkWidth = options.waterMarkWidth,
            waterMarkXCoordinate = options.waterMarkXCoordinate,
            waterMarkYCoordinate = options.waterMarkYCoordinate;

        var gifWidth = Number(options.gifWidth);
        var gifHeight = Number(options.gifHeight);
        var interval = Number(options.interval);
        var sampleInterval = Number(options.sampleInterval);
        var waitBetweenFrames = hasExistingImages ? 0 : interval * 1000;
        var renderingContextsToSave = [];
        var numFrames = savedRenderingContexts.length ? savedRenderingContexts.length : options.numFrames;
        var pendingFrames = numFrames;

        console.log('new gifter');

        var ag = new GIFter({
            sampleInt: options.sampleInterval,
            sampleQty: numFrames,
            loop: 0,
            frameDelay: options.frameDuration,
            //				loopDelay: 30,
            diffMode: 1,
            quantOpts: {
                method: 1
            }
        });
        var fontSize = utils.getFontSize(options);
        var textXCoordinate = options.textXCoordinate ? options.textXCoordinate : textAlign === 'left' ? 1 : textAlign === 'right' ? gifWidth : gifWidth / 2;
        var textYCoordinate = options.textYCoordinate ? options.textYCoordinate : textBaseline === 'top' ? 1 : textBaseline === 'center' ? gifHeight / 2 : gifHeight;
        var font = fontWeight + ' ' + fontSize + ' ' + fontFamily;
        var sourceX = crop ? Math.floor(crop.scaledWidth / 2) : 0;
        var sourceWidth = crop ? videoWidth - crop.scaledWidth : 0;
        var sourceY = crop ? Math.floor(crop.scaledHeight / 2) : 0;
        var sourceHeight = crop ? videoHeight - crop.scaledHeight : 0;
        var lastCurrentTime = 0;

        var captureFrames = function captureSingleFrame() {
            var framesLeft = pendingFrames - 1;

            if (savedRenderingContexts.length) {
                context.putImageData(savedRenderingContexts[numFrames - pendingFrames], 0, 0);

                finishCapture();
            } else {
                drawVideo();
            }

            function drawVideo() {
                try {
                    // Makes sure the canvas video heights/widths are in bounds
                    if (sourceWidth > videoWidth) {
                        sourceWidth = videoWidth;
                    }

                    if (sourceHeight > videoHeight) {
                        sourceHeight = videoHeight;
                    }

                    if (sourceX < 0) {
                        sourceX = 0;
                    }

                    if (sourceY < 0) {
                        sourceY = 0;
                    }

                    context.filter = filter;

                    context.drawImage(videoElement, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, gifWidth, gifHeight);

                    finishCapture();
                } catch (e) {
                    // There is a Firefox bug that sometimes throws NS_ERROR_NOT_AVAILABLE and
                    // and IndexSizeError errors when drawing a video element to the canvas
                    if (e.name === 'NS_ERROR_NOT_AVAILABLE') {
                        // Wait 100ms before trying again
                        utils.requestTimeout(drawVideo, 100);
                    } else {
                        throw e;
                    }
                }
            }

            function finishCapture() {
                var imageData = void 0;

                if (saveRenderingContexts) {
                    renderingContextsToSave.push(context.getImageData(0, 0, gifWidth, gifHeight));
                }
                if (waterMark) {
                    context.drawImage(waterMark, waterMarkXCoordinate, waterMarkYCoordinate, waterMarkWidth, waterMarkHeight);
                }
                // If there is text to display, make sure to display it on the canvas after the image is drawn
                if (text) {
                    context.font = font;
                    context.fillStyle = fontColor;
                    context.textAlign = textAlign;
                    context.textBaseline = textBaseline;
                    context.fillText(text, textXCoordinate, textYCoordinate);
                }

                console.log('Get Image Data');
                createImageBitmap(context.getImageData(0, 0, gifWidth, gifHeight)).then(function (img) {
                    ag.addFrame(img);
                });

                // ag.addFrame(imageData);

                pendingFrames = framesLeft;

                // Call back with an r value indicating how far along we are in capture
                progressCallback((numFrames - pendingFrames) / numFrames);

                if (framesLeft > 0) {
                    console.log('Video CurrentTime', videoElement.currentTime);
                    console.log('Capture Single Frame. Interval:', interval);
                    console.log('FramesLeft', framesLeft);

                    videoElement.currentTime = lastCurrentTime + interval;
                    lastCurrentTime = lastCurrentTime + interval;
                    // utils.requestTimeout(captureSingleFrame, 50); // 50ms enough to seek.
                }

                if (pendingFrames === 0) {
                    console.log('Doing getBase64GIF');
                    videoElement.pause();

                    console.log('Render GIFter');
                    var image = ag.render();
                    callback({
                        'error': false,
                        'errorCode': '',
                        'errorMsg': '',
                        'image': image,
                        'cameraStream': cameraStream,
                        'videoElement': videoElement,
                        'webcamVideoElement': webcamVideoElement,
                        'savedRenderingContexts': renderingContextsToSave,
                        'keepCameraOn': keepCameraOn
                    });
                }
            }
        };

        numFrames = numFrames !== undefined ? numFrames : 10;
        interval = interval !== undefined ? interval : 0.1; // In seconds

        canvas.width = gifWidth;
        canvas.height = gifHeight;
        context = canvas.getContext('2d');
        videoElement.onseeked = function () {
            console.log('video seeked', videoElement.currentTime);
            captureFrames();
        };

        var firstTime = true;
        videoElement.onloadeddata = function () {
            console.log('Video Can Play');
            if (firstTime) {
                captureFrames();
                firstTime = false;
            }
        };
    },
    getCropDimensions: function getCropDimensions() {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var width = obj.videoWidth;
        var height = obj.videoHeight;
        var gifWidth = obj.gifWidth;
        var gifHeight = obj.gifHeight;
        var result = {
            width: 0,
            height: 0,
            scaledWidth: 0,
            scaledHeight: 0
        };

        if (width > height) {
            result.width = Math.round(width * (gifHeight / height)) - gifWidth;
            result.scaledWidth = Math.round(result.width * (height / gifHeight));
        } else {
            result.height = Math.round(height * (gifWidth / width)) - gifHeight;
            result.scaledHeight = Math.round(result.height * (width / gifWidth));
        }

        return result;
    }
};

/*
  videoStream.js
  ==============
*/

/* Copyright  2017 Yahoo Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
*/

// Dependencies
var videoStream = {
    loadedData: false,
    defaultVideoDimensions: {
        width: 640,
        height: 480
    },
    findVideoSize: function findVideoSizeMethod(obj) {
        findVideoSizeMethod.attempts = findVideoSizeMethod.attempts || 0;

        var cameraStream = obj.cameraStream,
            completedCallback = obj.completedCallback,
            videoElement = obj.videoElement;


        if (!videoElement) {
            return;
        }

        if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
            videoElement.removeEventListener('loadeddata', videoStream.findVideoSize);

            completedCallback({
                videoElement: videoElement,
                cameraStream: cameraStream,
                videoWidth: videoElement.videoWidth,
                videoHeight: videoElement.videoHeight
            });
        } else {
            if (findVideoSizeMethod.attempts < 10) {
                findVideoSizeMethod.attempts += 1;

                utils.requestTimeout(function () {
                    videoStream.findVideoSize(obj);
                }, 400);
            } else {
                completedCallback({
                    videoElement: videoElement,
                    cameraStream: cameraStream,
                    videoWidth: videoStream.defaultVideoDimensions.width,
                    videoHeight: videoStream.defaultVideoDimensions.height
                });
            }
        }
    },
    onStreamingTimeout: function onStreamingTimeout(callback) {
        if (utils.isFunction(callback)) {
            callback({
                error: true,
                errorCode: 'getUserMedia',
                errorMsg: 'There was an issue with the getUserMedia API - Timed out while trying to start streaming',
                image: null,
                cameraStream: {}
            });
        }
    },
    stream: function stream(obj) {
        var existingVideo = utils.isArray(obj.existingVideo) ? obj.existingVideo[0] : obj.existingVideo;
        var cameraStream = obj.cameraStream,
            completedCallback = obj.completedCallback,
            streamedCallback = obj.streamedCallback,
            videoElement = obj.videoElement;


        if (utils.isFunction(streamedCallback)) {
            streamedCallback();
        }

        if (existingVideo) {
            if (utils.isString(existingVideo)) {
                videoElement.src = existingVideo;
                videoElement.innerHTML = '<source src="' + existingVideo + '" type="video/' + utils.getExtension(existingVideo) + '" />';
            } else if (existingVideo instanceof Blob) {
                try {
                    videoElement.src = utils.URL.createObjectURL(existingVideo);
                } catch (e) {}

                videoElement.innerHTML = '<source src="' + existingVideo + '" type="' + existingVideo.type + '" />';
            }
        } else if (videoElement.mozSrcObject) {
            videoElement.mozSrcObject = cameraStream;
        } else if (utils.URL) {
            try {
                videoElement.srcObject = cameraStream;
                videoElement.src = utils.URL.createObjectURL(cameraStream);
            } catch (e) {
                videoElement.srcObject = cameraStream;
            }
        }

        videoElement.play();

        utils.requestTimeout(function checkLoadedData() {
            checkLoadedData.count = checkLoadedData.count || 0;

            if (videoStream.loadedData === true) {
                videoStream.findVideoSize({
                    videoElement: videoElement,
                    cameraStream: cameraStream,
                    completedCallback: completedCallback
                });

                videoStream.loadedData = false;
            } else {
                checkLoadedData.count += 1;

                if (checkLoadedData.count > 10) {
                    videoStream.findVideoSize({
                        videoElement: videoElement,
                        cameraStream: cameraStream,
                        completedCallback: completedCallback
                    });
                } else {
                    checkLoadedData();
                }
            }
        }, 0);
    },
    startStreaming: function startStreaming(obj) {
        var errorCallback = utils.isFunction(obj.error) ? obj.error : utils.noop;
        var streamedCallback = utils.isFunction(obj.streamed) ? obj.streamed : utils.noop;
        var completedCallback = utils.isFunction(obj.completed) ? obj.completed : utils.noop;
        var crossOrigin = obj.crossOrigin,
            existingVideo = obj.existingVideo,
            lastCameraStream = obj.lastCameraStream,
            options = obj.options,
            webcamVideoElement = obj.webcamVideoElement;

        var videoElement = utils.isElement(existingVideo) ? existingVideo : webcamVideoElement ? webcamVideoElement : document.createElement('video');
        var cameraStream = void 0;

        if (crossOrigin) {
            videoElement.crossOrigin = options.crossOrigin;
        }

        videoElement.autoplay = true;
        videoElement.loop = true;
        videoElement.muted = true;
        videoElement.addEventListener('loadeddata', function (event) {
            videoStream.loadedData = true;
            if (options.offset) {
                videoElement.currentTime = options.offset;
            }
        });

        if (existingVideo) {
            videoStream.stream({
                videoElement: videoElement,
                existingVideo: existingVideo,
                completedCallback: completedCallback
            });
        } else if (lastCameraStream) {
            videoStream.stream({
                videoElement: videoElement,
                cameraStream: lastCameraStream,
                streamedCallback: streamedCallback,
                completedCallback: completedCallback
            });
        } else {
            utils.getUserMedia({
                video: true
            }, function (stream) {
                videoStream.stream({
                    videoElement: videoElement,
                    cameraStream: stream,
                    streamedCallback: streamedCallback,
                    completedCallback: completedCallback
                });
            }, errorCallback);
        }
    },
    startVideoStreaming: function startVideoStreaming(callback) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var timeoutLength = options.timeout !== undefined ? options.timeout : 0;
        var originalCallback = options.callback;
        var webcamVideoElement = options.webcamVideoElement;
        var noGetUserMediaSupportTimeout = void 0;

        // Some browsers apparently have support for video streaming because of the
        // presence of the getUserMedia function, but then do not answer our
        // calls for streaming.
        // So we'll set up this timeout and if nothing happens after a while, we'll
        // conclude that there's no actual getUserMedia support.
        if (timeoutLength > 0) {
            noGetUserMediaSupportTimeout = utils.requestTimeout(function () {
                videoStream.onStreamingTimeout(originalCallback);
            }, 10000);
        }

        videoStream.startStreaming({
            error: function error() {
                originalCallback({
                    error: true,
                    errorCode: 'getUserMedia',
                    errorMsg: 'There was an issue with the getUserMedia API - the user probably denied permission',
                    image: null,
                    cameraStream: {}
                });
            },
            streamed: function streamed() {
                // The streaming started somehow, so we can assume there is getUserMedia support
                clearTimeout(noGetUserMediaSupportTimeout);
            },
            completed: function completed() {
                var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var cameraStream = obj.cameraStream,
                    videoElement = obj.videoElement,
                    videoHeight = obj.videoHeight,
                    videoWidth = obj.videoWidth;


                callback({
                    cameraStream: cameraStream,
                    videoElement: videoElement,
                    videoHeight: videoHeight,
                    videoWidth: videoWidth
                });
            },
            lastCameraStream: options.lastCameraStream,
            webcamVideoElement: webcamVideoElement,
            crossOrigin: options.crossOrigin,
            options: options
        });
    },
    stopVideoStreaming: function stopVideoStreaming(obj) {
        obj = utils.isObject(obj) ? obj : {};

        var _obj = obj,
            keepCameraOn = _obj.keepCameraOn,
            videoElement = _obj.videoElement,
            webcamVideoElement = _obj.webcamVideoElement;

        var cameraStream = obj.cameraStream || {};
        var cameraStreamTracks = cameraStream.getTracks ? cameraStream.getTracks() || [] : [];
        var hasCameraStreamTracks = !!cameraStreamTracks.length;
        var firstCameraStreamTrack = cameraStreamTracks[0];

        if (!keepCameraOn && hasCameraStreamTracks) {
            if (utils.isFunction(firstCameraStreamTrack.stop)) {
                // Stops the camera stream
                firstCameraStreamTrack.stop();
            }
        }

        if (utils.isElement(videoElement) && !webcamVideoElement) {
            // Pauses the video, revokes the object URL (freeing up memory), and remove the video element
            videoElement.pause();

            // Destroys the object url
            if (utils.isFunction(utils.URL.revokeObjectURL) && !utils.webWorkerError) {
                if (videoElement.src) {
                    utils.URL.revokeObjectURL(videoElement.src);
                }
            }

            // Removes the video element from the DOM
            utils.removeElement(videoElement);
        }
    }
};

/*
  stopVideoStreaming.js
  =====================
*/

/* Copyright  2017 Yahoo Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
*/

function stopVideoStreaming(options) {
  options = utils.isObject(options) ? options : {};

  videoStream.stopVideoStreaming(options);
}

/*
  createAndGetGIF.js
  ==================
*/

/* Copyright  2017 Yahoo Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
*/

// Dependencies
function createAndGetGIF(obj, callback) {
    var options = obj.options || {};

    var images = options.images,
        video = options.video;

    var gifWidth = Number(options.gifWidth);
    var gifHeight = Number(options.gifHeight);
    var numFrames = Number(options.numFrames);
    var cameraStream = obj.cameraStream,
        videoElement = obj.videoElement,
        videoWidth = obj.videoWidth,
        videoHeight = obj.videoHeight;

    var cropDimensions = screenShot.getCropDimensions({
        videoWidth: videoWidth,
        videoHeight: videoHeight,
        gifHeight: gifHeight,
        gifWidth: gifWidth
    });
    var completeCallback = callback;

    options.crop = cropDimensions;
    options.videoElement = videoElement;
    options.videoWidth = videoWidth;
    options.videoHeight = videoHeight;
    options.cameraStream = cameraStream;

    if (!utils.isElement(videoElement)) {
        return;
    }

    videoElement.width = gifWidth + cropDimensions.width;
    videoElement.height = gifHeight + cropDimensions.height;

    if (!options.webcamVideoElement) {
        utils.setCSSAttr(videoElement, {
            position: 'fixed',
            opacity: '0'
        });

        document.body.appendChild(videoElement);
    }

    // Firefox doesn't seem to obey autoplay if the element is not in the DOM when the content
    // is loaded, so we must manually trigger play after adding it, or the video will be frozen
    videoElement.play();

    screenShot.getGIF(options, function (obj) {
        if ((!images || !images.length) && (!video || !video.length)) {
            stopVideoStreaming(obj);
        }

        completeCallback(obj);
    });
}

/*
  existingVideo.js
  ================
*/

/* Copyright  2017 Yahoo Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
*/

// Dependencies
function existingVideo() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var callback = obj.callback,
        existingVideo = obj.existingVideo,
        options = obj.options;

    var skipObj = {
        getUserMedia: true,
        'window.URL': true
    };
    var errorObj = error.validate(skipObj);
    var loadedImages = 0;
    var videoType = void 0;
    var videoSrc = void 0;
    var tempImage = void 0;
    var ag = void 0;

    if (errorObj.error) {
        return callback(errorObj);
    }

    if (utils.isElement(existingVideo) && existingVideo.src) {
        videoSrc = existingVideo.src;
        videoType = utils.getExtension(videoSrc);

        if (!utils.isSupported.videoCodecs[videoType]) {
            return callback(error.messages.videoCodecs);
        }
    } else if (utils.isArray(existingVideo)) {
        utils.each(existingVideo, function (iterator, videoSrc) {
            if (videoSrc instanceof Blob) {
                videoType = videoSrc.type.substr(videoSrc.type.lastIndexOf('/') + 1, videoSrc.length);
            } else {
                videoType = videoSrc.substr(videoSrc.lastIndexOf('.') + 1, videoSrc.length);
            }

            if (utils.isSupported.videoCodecs[videoType]) {
                existingVideo = videoSrc;

                return false;
            }
        });
    }

    videoStream.startStreaming({
        completed: function completed(obj) {
            obj.options = options || {};

            createAndGetGIF(obj, callback);
        },
        existingVideo: existingVideo,
        crossOrigin: options.crossOrigin,
        options: options
    });
}

/*
  existingWebcam.js
  =================
*/

/* Copyright  2017 Yahoo Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
*/

// Dependencies
function existingWebcam() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var callback = obj.callback,
        lastCameraStream = obj.lastCameraStream,
        options = obj.options,
        webcamVideoElement = obj.webcamVideoElement;


    if (!isWebCamGIFSupported()) {
        return callback(error.validate());
    }

    if (options.savedRenderingContexts.length) {
        screenShot.getGIF(options, function (obj) {
            callback(obj);
        });

        return;
    }

    videoStream.startVideoStreaming(function () {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        obj.options = options || {};

        createAndGetGIF(obj, callback);
    }, {
        lastCameraStream: lastCameraStream,
        callback: callback,
        webcamVideoElement: webcamVideoElement,
        crossOrigin: options.crossOrigin
    });
}

/*
  createGIF.js
  ============
*/

/* Copyright  2017 Yahoo Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
*/

// Dependencies
function createGIF(userOptions, callback) {
  callback = utils.isFunction(userOptions) ? userOptions : callback;
  userOptions = utils.isObject(userOptions) ? userOptions : {};

  if (!utils.isFunction(callback)) {
    return;
  }

  var options = utils.mergeOptions(defaultOptions, userOptions) || {};
  var lastCameraStream = userOptions.cameraStream;
  var images = options.images;
  var imagesLength = images ? images.length : 0;
  var video = options.video;
  var webcamVideoElement = options.webcamVideoElement;

  options = utils.mergeOptions(options, {
    'gifWidth': Math.floor(options.gifWidth),
    'gifHeight': Math.floor(options.gifHeight)
  });

  // If the user would like to create a GIF from an existing image(s)
  if (imagesLength) {
    existingImages({
      'images': images,
      'imagesLength': imagesLength,
      'callback': callback,
      'options': options
    });
  } else if (video) {
    // If the user would like to create a GIF from an existing HTML5 video
    existingVideo({
      'existingVideo': video,
      callback: callback,
      options: options
    });
  } else {
    // If the user would like to create a GIF from a webcam stream
    existingWebcam({
      lastCameraStream: lastCameraStream,
      callback: callback,
      webcamVideoElement: webcamVideoElement,
      options: options
    });
  }
}

/*
  takeSnapShot.js
  ===============
*/

/* Copyright  2017 Yahoo Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
*/

function takeSnapShot(userOptions, callback) {
    callback = utils.isFunction(userOptions) ? userOptions : callback;
    userOptions = utils.isObject(userOptions) ? userOptions : {};

    if (!utils.isFunction(callback)) {
        return;
    }

    var mergedOptions = utils.mergeOptions(defaultOptions, userOptions);
    var options = utils.mergeOptions(mergedOptions, {
        'interval': .1,
        'numFrames': 1,
        'gifWidth': Math.floor(mergedOptions.gifWidth),
        'gifHeight': Math.floor(mergedOptions.gifHeight)
    });

    createGIF(options, callback);
}

/*
  API.js
  ======
*/

/* Copyright  2017 Yahoo Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
*/

// Dependencies
var API = {
  'utils': utils$2,
  'error': error$2,
  'defaultOptions': defaultOptions$2,
  'createGIF': createGIF,
  'takeSnapShot': takeSnapShot,
  'stopVideoStreaming': stopVideoStreaming,
  'isSupported': isSupported,
  'isWebCamGIFSupported': isWebCamGIFSupported,
  'isExistingVideoGIFSupported': isExistingVideoGIFSupported,
  'isExistingImagesGIFSupported': isSupported$1,
  'VERSION': '0.4.5'
};

/*
  index.js
  ========
*/

/* Copyright  2017 Yahoo Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */

// Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, and plain browser loading
if (typeof define === 'function' && define.amd) {
    define([], function () {
        return API;
    });
} else if (typeof exports !== 'undefined') {
    module.exports = API;
} else {
    window.gifshot = API;
}
}(typeof window !== "undefined" ? window : {}, typeof document !== "undefined" ? document : { createElement: function() {} }, typeof window !== "undefined" ? window.navigator : {}));
