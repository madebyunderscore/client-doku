// This function animates a number rollup effect when the element comes into view.
// It uses Intersection Observer to detect when the element is in view.
// The number is animated from 0 to its final value over a specified duration.
// The default duration is 2000ms.
// The function takes an optional selector to target specific elements.
// The default selector is '[counter-element="number"]'.

export function numberRollupObserver({
    selector = '[counter-element="number"]',
    defaultDuration = 2000,
  } = {}) {
    const animateNumber = (element, target, duration) => {
      let startTime;
      const easing = (t) => 1 - Math.pow(1 - t, 4); // easeOutQuart
  
      const step = (time) => {
        if (startTime === undefined) startTime = time;
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.round(target * easing(progress));
        element.textContent = value.toString();
  
        if (progress < 1) requestAnimationFrame(step);
      };
  
      requestAnimationFrame(step);
    };
  
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const finalNumber = parseInt(el.textContent || '0', 10);
          const duration = parseInt(el.getAttribute('duration') || defaultDuration, 10);
          animateNumber(el, finalNumber, duration);
          obs.unobserve(el);
        }
      });
    });
  
    document.querySelectorAll(selector).forEach((el) => observer.observe(el));
  }