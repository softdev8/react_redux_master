//@TODO clean it up a bit later
// easing functions http://goo.gl/5HLl8
Math.easeInOutQuad = (t, b, c, d) => {
  t /= d/2;
  if (t < 1) {
    return c / 2 * t * t + b;
  }
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};

Math.easeInCubic = (t, b, c, d) => {
  const tc = (t /= d) * t * t;
  return b+c*(tc);
};

Math.inOutQuintic = function(t, b, c, d) {
  const ts = (t /= d) * t,
  tc = ts * t;
  return b + c * (6 * tc * ts + -15 * ts * ts + 10 * tc);
};

// requestAnimationFrame for Smart Animating http://goo.gl/sx5sts
const requestAnimFrame = (() => {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); };
})();

const scrollTo = (to, callback, duration) => {
  // because it's so fucking difficult to detect the scrolling element, just move them all
  const move = (amount) => {
    document.documentElement.scrollTop = amount;
    document.body.parentNode.scrollTop = amount;
    document.body.scrollTop = amount;
  }

  const position = () => {
    return document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop;
  }

  const start = position();
  const increment = 20;
  const change = to - start;
  let currentTime = 0;

  duration = (typeof duration === 'undefined') ? 500 : duration;

  const animateScroll = () => {
    // increment the time
    currentTime += increment;
    // find the value with the quadratic in-out easing function
    const val = Math.easeInOutQuad(currentTime, start, change, duration);
    // move the document.body
    move(val);
    // do the animation unless its over
    if (currentTime < duration) {
      requestAnimFrame(animateScroll);
    } else {
      if (callback && typeof(callback) === 'function') {
        // the animation is done so lets callback
        callback();
      }
    }
  };

  animateScroll();
}

export default scrollTo;
