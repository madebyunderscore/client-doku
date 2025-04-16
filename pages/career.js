// API Function to fetch data
(async () => {
    const proxyUrl   = 'https://proxy-server-doku.vercel.app/api/division-proxy';
    const container  = document.getElementById('career-api');
    const template   = container?.querySelector('.careers_accordion');
  
    if (!container || !template) {
      console.error('[Careers] Container or template missing – check your selectors.');
      return;
    }
  
    // ------- helpers --------------------------------------------------------
    const cacheKey      = 'careerData';
    const cacheTTLHours = 1;                          // change if you want longer cache
    const now           = Date.now();
  
    function loadCache() {
      try {
        const cached = JSON.parse(localStorage.getItem(cacheKey) || '{}');
        if (cached.expires > now) return cached.data;
      } catch { /* ignore */ }
      return null;
    }
  
    function saveCache(data) {
      localStorage.setItem(
        cacheKey,
        JSON.stringify({ data, expires: now + cacheTTLHours * 36e5 })
      );
    }
  
    function clearContainer() {
      // remove previously rendered accordions but keep the hidden template
      [...container.children].forEach(el => {
        if (!el.classList.contains('careers_accordion')) return;
        if (el !== template) el.remove();
      });
    }
  
    function render(data = []) {
      clearContainer();
      const frag = document.createDocumentFragment();
  
      data.forEach(({ division = 'No Division Name', jobs = [] }) => {
        const acc = template.cloneNode(true);
        acc.classList.remove('hidden');
  
        // title
        acc.querySelector('.career_accordion-title').textContent = division;
  
        // job links
        const list = acc.querySelector('.careers_accordion-job-list');
        list.innerHTML = '';                                   // reset
  
        if (jobs.length === 0) {
          list.textContent = 'There are currently no openings.';
        } else {
          jobs.forEach(({ jobId, jobTitle }) => {
            const a = document.createElement('a');
            a.className   = 'career_job-link';
            a.href        = `https://doku-payment.webflow.io/career/detail?jobId=${jobId}`;
            a.target      = '_blank';
            a.textContent = jobTitle || 'Untitled position';
            list.appendChild(a);
          });
        }
        frag.appendChild(acc);
      });
  
      container.appendChild(frag);
  
      // Re‑init interactions after DOM change (give Webflow a tick)
      if (window.Webflow?.require) {
        setTimeout(() => {
          window.Webflow.require('ix2').init();
        }, 0);
      }
    }
  
    // ------- main flow ------------------------------------------------------
    try {
      const cached = loadCache();
      if (cached) {
        console.log('[Careers] Using cached data');
        render(cached);
        return;
      }
  
      const res  = await fetch(proxyUrl, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
  
      saveCache(json);
      render(json);
    } catch (err) {
      console.error('[Careers] Failed to fetch data:', err);
      render([]);                    // render empty state so page layout doesn’t break
    }
  })();