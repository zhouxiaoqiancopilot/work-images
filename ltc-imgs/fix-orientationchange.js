/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable func-names */
/* eslint-disable no-unused-expressions */
/**
 * orientationchange-fix
 * orientationchange修复实用库
 */
export default (win, cb) => {
  const meta = {};
  let timer;
  // 是否支持orientationchange事件
  const isOrientation = 'orientation' in window && 'onorientationchange' in window;
  meta.isOrientation = isOrientation;
  // font-family
  const html = document.documentElement;
  const hstyle = win.getComputedStyle(html, null);
  const ffstr = hstyle['font-family'];
  meta.font = ffstr;

  // automatically load css script
  function loadStyleString(css) {
    const _style = document.createElement('style');
    const _head = document.head ? document.head : document.getElementsByTagName('head')[0];
    _style.type = 'text/css';
    try {
      _style.appendChild(document.createTextNode(css));
    } catch (ex) {
      // lower IE support, if you want to know more about this to see http://www.quirksmode.org/dom/w3c_css.html
      _style.styleSheet.cssText = css;
    }
    _head.appendChild(_style);
    return _style;
  }

  // callback
  const orientationCB = function (e) {
    if (win.orientation === 180 || win.orientation === 0) {
      meta.init = 'portrait';
      meta.current = 'portrait';
    }
    if (win.orientation === 90 || win.orientation === -90) {
      meta.init = 'landscape';
      meta.current = 'landscape';
    }
    return function () {
      if (win.orientation === 180 || win.orientation === 0) {
        meta.current = 'portrait';
      }
      if (win.orientation === 90 || win.orientation === -90) {
        meta.current = 'landscape';
      }
      cb(meta);
    };
  };
  var resizeCB = function () {
    const pstr = `portrait, ${ffstr}`;
    const lstr = `landscape, ${ffstr}`;
    const cssstr = `@media (orientation: portrait) { .orientation{font-family:${pstr};} } @media (orientation: landscape) {  .orientation{font-family:${lstr};}}`;

    (';}}');
    // 载入样式
    loadStyleString(cssstr);
    // 添加类
    html.className = `orientation ${html.className}`;
    if (hstyle['font-family'] === pstr) {
      // 初始化判断
      meta.init = 'portrait';
      meta.current = 'portrait';
    } else {
      meta.init = 'landscape';
      meta.current = 'landscape';
    }
    resizeCB = function () {
      if (hstyle['font-family'] === pstr) {
        if (meta.current !== 'portrait') {
          meta.current = 'portrait';
          cb(meta);
        }
      } else if (meta.current !== 'landscape') {
        meta.current = 'landscape';
        cb(meta);
      }
    };
  };
  const callback = isOrientation
    ? orientationCB()
    : (function () {
        resizeCB();
        return resizeCB;
      })();

  // 监听
  win.addEventListener(isOrientation ? 'orientationchange' : 'resize', callback, false);
};
