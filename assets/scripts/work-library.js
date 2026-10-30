(() => {
  // Employment is separate from projects and stays absent until real entries exist.
  const employment = document.querySelector('#employment');
  const employmentList = document.querySelector('[data-employment-list]');
  const employmentTemplate = document.querySelector('#employment-entry-template');
  try {
    const entries = JSON.parse(document.querySelector('#employment-data')?.textContent || '[]');
    if (employment && employmentList && employmentTemplate && Array.isArray(entries)) {
      const valid = entries.filter(entry => entry && typeof entry.role === 'string' && entry.role.trim() && typeof entry.organization === 'string' && entry.organization.trim() && typeof entry.period === 'string');
      valid.sort((a, b) => String(b.startDate || '').localeCompare(String(a.startDate || '')));
      for (const entry of valid) {
        const fragment = employmentTemplate.content.cloneNode(true);
        fragment.querySelector('[data-employment-role]').textContent = entry.role;
        fragment.querySelector('[data-employment-organization]').textContent = entry.organization;
        const date = fragment.querySelector('[data-employment-date]');
        date.textContent = entry.period;
        if (/^\d{4}-\d{2}(-\d{2})?$/.test(entry.startDate || '')) date.dateTime = entry.startDate;
        const highlights = fragment.querySelector('[data-employment-highlights]');
        for (const line of Array.isArray(entry.highlights) ? entry.highlights : []) {
          if (typeof line !== 'string') continue;
          const item = document.createElement('li');
          item.textContent = line;
          highlights.append(item);
        }
        if (!highlights.childElementCount) highlights.remove();
        if (entry.url) {
          try {
            const url = new URL(entry.url);
            if (['https:', 'http:'].includes(url.protocol)) {
              const link = fragment.querySelector('[data-employment-link]');
              link.href = url.href;
              link.hidden = false;
            }
          } catch { /* An invalid optional link does not hide the role. */ }
        }
        employmentList.append(fragment);
      }
      if (employmentList.childElementCount) {
        employment.hidden = false;
        document.querySelector('[data-employment-nav]').hidden = false;
      }
    }
  } catch { /* Project content is independent of the optional employment data. */ }

  const nav = document.querySelector('.work-sections-nav');
  if (!nav) return;
  const links = [...nav.querySelectorAll('a')];
  const groups = links.map(link => document.querySelector(link.getAttribute('href')));
  for (const [i, link] of links.entries()) {
    const count = groups[i]?.querySelectorAll('[data-project-id]').length || 0;
    link.querySelector('span').textContent = String(count).padStart(2, '0');
  }
  let frame = 0;
  function update() {
    frame = 0;
    const threshold = 220;
    let active = -1;
    groups.forEach((group, i) => {
      const rect = group.getBoundingClientRect();
      if (rect.top <= threshold && rect.bottom > threshold) active = i;
    });
    links.forEach((link, i) => {
      if (i === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  document.addEventListener('rainpiao:modechange', schedule);
  update();
})();
