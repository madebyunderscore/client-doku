export function setupNavbarScrollEffect() {
    const threshold = window.innerHeight * 0.03;
  
    const headerBar = document.querySelector('.header-bar');
    const navbar = document.querySelector('.navbar');
    const navLogo = document.querySelector('.nav_logo');
  
    if (!headerBar || !navbar || !navLogo) {
      console.error('Elements not found: Ensure .header-bar, .navbar, and .nav_logo exist in the DOM.');
      return;
    }
  
    let isScrolled = false;
    const defaultHeaderHeight = getComputedStyle(headerBar).height;
    const defaultNavbarHeight = getComputedStyle(navbar).height;
    const defaultNavLogoSize = getComputedStyle(navLogo).height;
  
    let ticking = false;
  
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolledPastThreshold = window.scrollY > threshold;
  
          if (scrolledPastThreshold && !isScrolled) {
            isScrolled = true;
            headerBar.style.height = '2.5rem';
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
            navbar.style.height = '4.5rem';
            navbar.style.boxShadow = '0 0 4px 2px #00000014';
            navbar.style.backdropFilter = 'blur(15px)';
            navLogo.style.height = '3rem';
            navLogo.style.width = '3rem';
          } else if (!scrolledPastThreshold && isScrolled) {
            isScrolled = false;
            headerBar.style.height = defaultHeaderHeight;
            navbar.style.backgroundColor = 'transparent';
            navbar.style.height = defaultNavbarHeight;
            navbar.style.boxShadow = 'none';
            navbar.style.backdropFilter = 'none';
            navLogo.style.height = defaultNavLogoSize;
            navLogo.style.width = defaultNavLogoSize;
          }
  
          ticking = false;
        });
  
        ticking = true;
      }
    });
  }