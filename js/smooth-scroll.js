// smooth-scroll.js
let lenis;

function initSmoothScrolling() {
  lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 0.8,
    smoothTouch: true,
    touchMultiplier: 1.5,
    infinite: false,
    lerp: 0.1,
    wheelMultiplier: 0.7,
    normalizeWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

document.addEventListener('DOMContentLoaded', () => {
  loadComponents().then(() => {
    initSmoothScrolling();
    updateScrollTriggerInstances();
    optimizePerformance();
  });
});

function updateScrollTriggerInstances() {
  if (window.ScrollTrigger) {
    lenis.on('scroll', ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
      },
      pinType: document.body.style.transform ? "transform" : "fixed"
    });

    ScrollTrigger.addEventListener('refresh', () => lenis.resize());
  }
}

function optimizePerformance() {
  // Debounce resize events
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    }, 250);
  });

  // Use passive event listeners
  window.addEventListener('scroll', () => {}, { passive: true });
  window.addEventListener('touchstart', () => {}, { passive: true });

  // Optimize animations
  gsap.ticker.lagSmoothing(0);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
}

// Expose lenis instance globally
window.lenis = lenis;