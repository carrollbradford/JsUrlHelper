/**
Released under MIT and CC (https://creativecommons.org/licenses/by/4.0/) licenses
Copyright 2022 Carroll Bradford Inc. [https://dogood.carrollbradford.io/]

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * @class $URL
 * @description URL Object Class with public methods.
 * for URL functions and manipulation. <b>See Global for public methods</b>
 *
 */
(function (__u, undefined) {
    'use strict';

    var win = window;
    var doc = document;

    //check if template head has defined these variables
    var $H = typeof win.$HOST === 'undefined' ? false : win.$HOST;
    var $TMP = typeof win.$TEMPLATE === 'undefined' ? false : win.$TEMPLATE;

    //define the initial variables

    var PROTOCOL = win.location.protocol.replace(':', '');
    var HOST = !$H ? win.location.host : $H;
    var TEMPLATE = !$TMP ? '' : $TMP;
    var PATH = location.pathname;
    var SITE_URL = !$H ? PROTOCOL + '://' + HOST : $H;
    var FULL_URL = !$H ? PROTOCOL + '://' + HOST + PATH : $H + PATH;

    /**
     * Get the query info object from the current URL
     * @private
     * @return {Object} with params, query, search, keys, values and collection
     */
    var URL_PARAMS = function () {
        var params = new URLSearchParams(window.location.search);
        var vars = [];

        params.forEach(function (value, key) {
            vars[key] = value;
        });

        return {
            params: params,
            queryString: params.toString(),
            search: window.location.search,
            keys: Array.from(params.keys()),
            values: Array.from(params.values()),
            collection: vars,
        };
    };

    /**
     * Get the current page name (Last part of the url)
     * @function $URL / getPage
     * @example $URL.getPage()
     * @return {String}
     */
    __u.getPage = function () {
        var cURL = doc.location.toString().toLowerCase();
        var page = cURL.substr(cURL.lastIndexOf('/') + 1).split('.')[0];

        if (!page) {
            var urlParts = [];
            var rawUrlParts = cURL.split('/');

            for (var i = 0; i <= rawUrlParts.length; i++) {
                if (!!rawUrlParts[i] && rawUrlParts[i] !== HOST && rawUrlParts[i] !== PROTOCOL) {
                    urlParts.push(rawUrlParts[i]);
                }
            }

            page = urlParts.length > 0 ? urlParts[urlParts.length - 1] : urlParts[0];
        }

        return page;
    };

    /**
     * Get the query object info from the current URL.
     * With params, query, search, keys, values and entries
     * @function $URL / getParams
     * @example $URL.getParams()
     * @return {Object} with params, queryString, search, keys, values and collection
     */
    __u.getParams = function () {
        return URL_PARAMS();
    };

    /**
     * Get the query string from the current URL
     * @function $URL / getQuery
     * @example $URL.getQuery()
     * @return {String} with query string
     */
    __u.getQuery = function () {
        return URL_PARAMS().queryString;
    };

    /**
     * Add params to the current query string from the current URL
     * @function $URL / addToQuery
     * @example $URL.addToQuery({key:value})
     * @param {Object} query
     * @return {Object} With collection (all query params) and String (query string)
     */
    __u.addToQuery = function (query) {
        let currentQuery = URL_PARAMS().collection;
        let qString = '';

        Object.entries(query).forEach((q) => {
            currentQuery[q[0]] = q[1];
        });

        Object.entries(currentQuery).forEach((p) => {
            qString += `${p[0]}=${p[1]}&`;
        });

        return {
            collection: currentQuery,
            queryString: qString,
        };
    };

    /**
     * Get only the URL hash
     * @function $URL / getHash
     * @example $URL.getHash()
     * @return {String}
     */
    __u.getHash = function () {
        var hash = win.location.hash;
        return hash.substring(1);
    };

    /**
     * Set the URL hash
     * @function $URL / setHash
     * @example $URL.setHash()
     * @return {Void}
     */
    __u.setHash = function (h) {
        doc.location.hash = h;
        return;
    };

    /**
     * Remove the URL hash
     * @function $URL / deleteHash
     * @example $URL.deleteHash()
     * @return {Void}
     */
    __u.deleteHash = function () {
        history.pushState('', doc.title, win.location.pathname);
        return;
    };

    /**
     * Go to URL on same page
     * @function $URL / goTo
     * @example $URL.goTo()
     * @return {Boolean} Always false to prevent browser behavior
     */
    __u.goTo = function (url) {
        win.location.href = url;
        return false;
    };

    /**
     * Open URL on browser
     * @function $URL / open
     * @example $URL.open()
     * @param {String} url
     * @param {String} name default _blank (options: _self)
     * @param {String} params toolbar=yes, scrollbars=yes, resizable=yes, top=500, left=500, width=400, height=400
     * @return {Function} JS native open function
     */
    __u.open = function (url, name, params) {
        var n = typeof name === 'undefined' ? '_blank' : name;
        var p = typeof params === 'undefined' ? '' : params;
        return win.open(url, n, p);
    };

    /**
     * Function to be executed if the current URL changes
     * @function $URL / onChange
     * @example $URL.onChange()
     * @param {Function} callback
     * @return {Void}
     */
    __u.onChange = function (callback) {
        if (typeof callback === 'function') {
            win.addEventListener('hashchange', callback);
        }
    };

    // -------------------------
    //constants
    /**
     * returns Full URL (includes current page path)
     * @constant $URL.FULL_URL
     * @example $URL.FULL_URL
     * @return {String}
     */
    __u.FULL_URL = FULL_URL;

    /**
     * returns site URL (root URL) (no page path)
     * @constant $URL.SITE_URL
     * @example $URL.SITE_URL
     * @return {String}
     */
    __u.SITE_URL = SITE_URL;

    /**
     * returns template url (for sites that use template folders).
     * Need to set the window.$TEMPLATE externally with the template path
     * @constant $URL.TEMPLATE
     * @example $URL.TEMPLATE
     * @return {String}
     */
    __u.TEMPLATE = TEMPLATE;

    /**
     * returns server protocol (http/https)
     * @constant $URL.PROTOCOL
     * @example $URL.PROTOCOL
     * @return {String}
     */
    __u.PROTOCOL = PROTOCOL;

    /**
     * returns name of the server
     * @constant $URL.HOST
     * @example $URL.HOST = localhost
     * @return {String}
     */
    __u.HOST = HOST;

    /**
     * returns path
     * @constant $URL.PATH
     * @example $URL.PATH
     * @return {String}
     */
    __u.PATH = PATH;

    /**
     * returns a readble URL
     * @constant $URL.READ_URL
     * @example $URL.READ_URL
     * @return {String}
     */
    __u.READ_URL = doc.URL;
})((window.$URL = window.$URL || {}));
