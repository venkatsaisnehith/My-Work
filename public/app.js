(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const expanded = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(expanded));
      nav.classList.toggle('is-open', expanded);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
        menu.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        menu.focus();
      }
    });
  }
  const entries = [...document.querySelectorAll('[data-entry]')];
  const search = document.querySelector('#content-search');
  const filters = [...document.querySelectorAll('[data-filter]')];
  let activeFilter = 'all';
  function updateEntries() {
    const query = (search?.value || '').trim().toLocaleLowerCase();
    let visible = 0;
    entries.forEach(entry => {
      const title = entry.dataset.title || entry.textContent || '';
      const tags = entry.dataset.tags || '';
      const content = `${title} ${tags}`.toLocaleLowerCase();
      const matchFilter = activeFilter === 'all' || tags.toLocaleLowerCase().split(',').map(tag => tag.trim()).includes(activeFilter);
      const matchSearch = query.split(/\s+/).every(word => content.includes(word));
      entry.hidden = !(matchFilter && matchSearch);
      if (!entry.hidden) visible++;
    });
    const count = document.querySelector('#result-count');
    if (count) count.textContent = `${visible} ${visible === 1 ? 'entry' : 'entries'}`;
    const empty = document.querySelector('#no-results');
    if (empty) empty.hidden = visible !== 0;
  }
  search?.addEventListener('input', updateEntries);
  filters.forEach(button => button.addEventListener('click', () => {
    activeFilter = (button.dataset.filter || 'all').toLocaleLowerCase();
    filters.forEach(filter => {
      const selected = filter === button;
      filter.setAttribute('aria-pressed', String(selected));
      filter.classList.toggle('active', selected);
    });
    updateEntries();
  }));
  if (entries.length || search) updateEntries();
  const preferences = [
    { id: 'reading-width', key: 'readingWidth', values: ['default', 'comfortable', 'wide'] },
    { id: 'font-size', key: 'fontSize', values: ['default', 'large'] }
  ];
  preferences.forEach(({ id, key, values }) => {
    let saved = 'default';
    try { saved = localStorage.getItem(`portfolio-${key}`) || 'default'; } catch { /* Storage can be unavailable in private contexts. */ }
    if (!values.includes(saved)) saved = 'default';
    document.documentElement.dataset[key] = saved;
    const select = document.getElementById(id);
    if (!select) return;
    select.value = saved;
    select.addEventListener('change', () => {
      const value = values.includes(select.value) ? select.value : 'default';
      document.documentElement.dataset[key] = value;
      try { localStorage.setItem(`portfolio-${key}`, value); } catch { /* Preference still applies to this page. */ }
      const status = document.querySelector('#preferences-status');
      if (status) status.textContent = 'Reading preference updated on this device.';
    });
  });
  const contact = document.querySelector('#contact-form');
  contact?.addEventListener('submit', event => {
    event.preventDefault();
    if (!contact.reportValidity()) return;
    const recipient = contact.dataset.email;
    const status = document.querySelector('#contact-status');
    if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
      if (status) status.textContent = 'Email is not configured. Please use the GitHub contact link.';
      return;
    }
    const data = new FormData(contact);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const subject = String(data.get('subject') || `Portfolio inquiry from ${name}`).trim();
    const message = String(data.get('message') || '').trim();
    const body = `${message}\n\nFrom: ${name}\nReply to: ${email}`;
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (status) status.textContent = 'Your email application will open with a draft. Send the message there.';
  });
})();
