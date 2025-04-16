import { numberRollupObserver } from '@madebyunderscore/webflow-core/utils/number-rollup.js';
import { addUTMToExternalLinks } from '@madebyunderscore/webflow-core/utils/utm-tagging.js';
import { storeUTMParameters, appendUTMParametersToLinks } from '@madebyunderscore/webflow-core/utils/utm-utils.js';
import { updateIframeWithUTM } from '@madebyunderscore/webflow-core/utils/utm-utils';
import { setupNavbarScrollEffect } from './utils/navbar-scroll.js';

window.addEventListener('DOMContentLoaded', () => {
  numberRollupObserver();
  setupNavbarScrollEffect();

  // UTM tagging
  addUTMToExternalLinks({
    source: 'dokucom',
    contentMap: {
      'header a[href], .navbar a[href]': 'header',
      'footer a[href], .footer a[href]': 'footer',
    },
  });

  // Section reveal animation
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        sectionObserver.unobserve(entry.target);
      }
    });
  });

  document.querySelectorAll('section').forEach(section => sectionObserver.observe(section));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

  // Hover-to-click tabs
  document.querySelectorAll('[und-tab="hover"]').forEach((tab) => {
    tab.addEventListener('mouseenter', () => tab.click());
  });

  // Mobile nav dropdown replication from desktop
  const desktopNavDropdowns = document.querySelectorAll('.nav-link_dd');

  desktopNavDropdowns.forEach((dropdown, dropdownIndex) => {
    const desktopTabLinks = dropdown.querySelectorAll('.nav-dd_tab-menu-link');
    const desktopTabContents = dropdown.querySelectorAll('.nav-dd_tabs-pane-grid');
    const mobileNavContainer = dropdown.querySelector('.nav-mobile_nav_btm');

    if (!mobileNavContainer) {
      console.warn(`Mobile container not found in dropdown index ${dropdownIndex}.`);
      return;
    }

    mobileNavContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();

    desktopTabLinks.forEach((tabLink, index) => {
      const tabContent = desktopTabContents[index];
      if (!tabContent) return;

      const mobileDd = document.createElement('div');
      mobileDd.className = 'nav-mobile-dd';

      const toggle = document.createElement('div');
      toggle.className = 'nav-mobile-dd_toggle';
      toggle.innerHTML = tabLink.innerHTML;

      const toggleId = `nav-mobile-dd-toggle-${dropdownIndex}-${index}`;
      const contentId = `nav-mobile-dd-content-${dropdownIndex}-${index}`;
      toggle.id = toggleId;
      toggle.setAttribute('role', 'button');
      toggle.setAttribute('aria-controls', contentId);
      toggle.setAttribute('aria-expanded', 'false');
      toggle.tabIndex = 0;

      const btm = document.createElement('div');
      btm.className = 'nav-mobile-dd_btm';
      btm.id = contentId;
      btm.setAttribute('aria-labelledby', toggleId);
      btm.setAttribute('role', 'region');
      btm.style.display = 'none';

      const list = document.createElement('div');
      list.className = 'nav-mobile-dd_list';
      list.innerHTML = tabContent.innerHTML;

      btm.appendChild(list);
      mobileDd.appendChild(toggle);
      mobileDd.appendChild(btm);
      fragment.appendChild(mobileDd);
    });

    mobileNavContainer.appendChild(fragment);

    // Toggle open/close
    mobileNavContainer.addEventListener('click', (event) => {
      const toggle = event.target.closest('.nav-mobile-dd_toggle');
      if (!toggle) return;

      const btm = toggle.nextElementSibling;
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

      mobileNavContainer.querySelectorAll('.nav-mobile-dd_btm').forEach(el => el.style.display = 'none');
      mobileNavContainer.querySelectorAll('.nav-mobile-dd_toggle').forEach(el => el.setAttribute('aria-expanded', 'false'));

      if (!isExpanded) {
        btm.style.display = 'block';
        toggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Keyboard accessibility
    mobileNavContainer.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const toggle = event.target.closest('.nav-mobile-dd_toggle');
      if (toggle) {
        event.preventDefault();
        toggle.click();
      }
    });
  });
});

// Load event (waits for all assets)
window.addEventListener('load', () => {
  console.log('onReady fired. Document and all resources loaded.');
  try {
    storeUTMParameters();
    appendUTMParametersToLinks();
    updateIframeWithUTM();
  } catch (err) {
    console.error('UTM handling error:', err);
  }
});

