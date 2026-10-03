(() => {
  document.documentElement.classList.add('js');
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const isUrl = v => /^https?:\/\//.test(v || '');

  // ===== CONFIG: fill in REAL values only. Empty = hidden. Never invent links. =====
  const CONFIG = {
    email: 'johnpauldalugdog.dev@gmail.com',
    github: 'https://github.com/jpdalugdog',
    cvReady: true, // set true after adding assets/John-Paul-Dalugdog-CV.pdf
    repos: { quickbite: 'https://github.com/jpdalugdog/Quickbite', lunaCafe: 'https://github.com/jpdalugdog/Luna-cafe', elitecut: 'https://github.com/jpdalugdog/Elitecut', portfolio: '' } // real GitHub repo URLs
  };

  // Mobile Navigation
  const btn = $('#menuBtn'), links = $('#navLinks');
  const setMenu = (open, focusBtn) => {
    links.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    btn.textContent = open ? '✕' : '☰';
    if (focusBtn) btn.focus();
  };
  btn.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  $$('a', links).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && links.classList.contains('open')) setMenu(false, true); });

  // Smooth Scrolling (CSS scroll-behavior handles it; move focus to the target for keyboard users)
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', () => {
    const t = document.getElementById(a.getAttribute('href').slice(1));
    if (t) { t.setAttribute('tabindex', '-1'); setTimeout(() => t.focus({ preventScroll: true }), 400); }
  }));

  // Active Navigation (sections without a nav link, e.g. Why/Stats, stay under the previous item)
  const navLinks = $$('.nav-links a');
  const navSections = navLinks.map(a => document.getElementById(a.getAttribute('href').slice(1)));
  const onScroll = () => {
    let current = navSections[0].id;
    navSections.forEach(s => { if (s.getBoundingClientRect().top <= 120) current = s.id; });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) current = 'contact';
    navLinks.forEach(a => {
      const on = a.getAttribute('href') === '#' + current;
      a.classList.toggle('active', on);
      on ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current');
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Scroll Reveal
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }), { threshold: .1 });
    $$('.reveal').forEach(el => io.observe(el));
  } else $$('.reveal').forEach(el => el.classList.add('visible'));

  // Links: demo links disabled unless real; repo links shown only when a real URL is configured
  $$('a[data-link]').forEach(a => {
    if (!isUrl(a.getAttribute('href'))) {
      a.setAttribute('aria-disabled', 'true'); a.removeAttribute('target'); a.title = 'Link coming soon';
      a.addEventListener('click', e => e.preventDefault());
    }
  });
  $$('a[data-repo]').forEach(a => {
    const url = CONFIG.repos[a.dataset.repo];
    if (isUrl(url)) { a.href = url; a.hidden = false; }
  });

  // Contact links (hidden until real values exist)
  let anyContact = false;
  $$('[data-contact]').forEach(li => {
    const v = CONFIG[li.dataset.contact], a = $('a', li);
    const ok = li.dataset.contact === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) : isUrl(v);
    if (!ok) return;
    a.href = li.dataset.contact === 'email'
  ? 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(v)
  : v;
    li.hidden = false; anyContact = true;
  });
  $('#noContact').hidden = anyContact;

  // Download CV (no broken download while the file does not exist)
  if (CONFIG.cvReady) $('#cvBtn').hidden = false; // button stays hidden until the real CV exists

  // Missing image placeholder
  $$('.thumb img').forEach(img => {
    const fallback = () => {
      img.style.display = 'none';
      if (!img.parentElement.querySelector('.ph')) {
        const d = document.createElement('div');
        d.className = 'ph'; d.textContent = 'Screenshot coming soon';
        img.parentElement.appendChild(d);
      }
    };
    img.addEventListener('error', fallback);
    if (img.complete && img.naturalWidth === 0) fallback();
  });

  // Project Details (case study dialog)
  const PROJECTS = {
    quickbite: {
      name: 'QuickBite', type: 'Food Ordering Web Application',
      problem: 'Ordering food online should be quick and clear: customers need to find items, review their order, and get a confirmation without confusion.',
      solution: 'A responsive ordering app where customers browse the menu, search and filter items, manage a cart, complete checkout, and receive a printable receipt. Cart data is kept in the browser with LocalStorage.',
      features: ['Menu browsing', 'Search', 'Filtering', 'Cart', 'Checkout', 'Order confirmation', 'Printable receipt', 'LocalStorage'],
      tech: ['HTML', 'CSS', 'JavaScript', 'LocalStorage'],
      learned: 'DOM manipulation, LocalStorage, form handling, responsive design, and JavaScript-based interaction.'
    },
    lunaCafe: {
      name: 'Luna Café', type: 'Business Website',
      problem: 'Small cafés need a website that presents their brand, menu, and contact details clearly on any device.',
      solution: 'A responsive one-page café website that presents the brand, menu, services, gallery, testimonials, and contact information in a clean, modern layout.',
      features: ['Brand presentation', 'Menu', 'Services', 'Gallery', 'Testimonials', 'Contact information', 'Responsive layout'],
      tech: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
      learned: 'Layout structure for business websites, responsive design with CSS, visual hierarchy, and presenting content clearly.'
    },
    elitecut: {
      name: 'EliteCut', type: 'Service & Booking Website',
      problem: 'Barbershop customers need an easy way to choose a service and barber and book an appointment without back-and-forth messages.',
      solution: 'A responsive multi-step booking flow: choose a service and barber, pick a date and time, enter customer information, review a booking summary, and receive a confirmation.',
      features: ['Service selection', 'Barber selection', 'Date and time selection', 'Customer information', 'Booking summary', 'Form validation', 'Confirmation'],
      tech: ['HTML', 'CSS', 'JavaScript', 'Form Validation'],
      learned: 'Multi-step form flows, input validation, managing state in JavaScript, and building user-friendly booking interactions.'
    }
  };
  const dlg = $('#projectDialog');
  const list = items => '<ul class="tags">' + items.map(i => '<li>' + i + '</li>').join('') + '</ul>';
  $$('[data-details]').forEach(b => b.addEventListener('click', () => {
    const p = PROJECTS[b.dataset.details];
    $('#dlgTitle').textContent = p.name; $('#dlgType').textContent = p.type;
    $('#dlgBody').innerHTML =
      '<h3>Problem</h3><p class="muted">' + p.problem + '</p>' +
      '<h3>Solution</h3><p class="muted">' + p.solution + '</p>' +
      '<h3>Features</h3>' + list(p.features) +
      '<h3>Technologies</h3>' + list(p.tech) +
      '<h3>What I Learned</h3><p class="muted">' + p.learned + '</p>';
    dlg.showModal();
  }));
  $('#dlgClose').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); }); // backdrop click

  // Contact Form Validation
  const form = $('#contactForm');
  const setErr = (id, msg) => {
    $('#' + id + 'Err').textContent = msg;
    $('#' + id).setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  };
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#name').value.trim(), email = $('#email').value.trim(), msg = $('#message').value.trim();
    const ok = [
      setErr('name', name ? '' : 'Please enter your name.'),
      setErr('email', /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? '' : 'Please enter a valid email address.'),
      setErr('message', msg.length >= 10 ? '' : 'Please enter a message (at least 10 characters).')
    ].every(Boolean);
    const out = $('#formOk');
    if (!ok) { out.textContent = ''; return; }
    // This form has no backend, so nothing is sent. Future option: Formspree, Web3Forms, EmailJS, etc.
    if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(CONFIG.email)) {
      out.textContent = 'Your message has been prepared. Your email app should open so you can send it.';
      window.location.href = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent('Portfolio message from ' + name) +
        '&body=' + encodeURIComponent(msg + '\n\nReply to: ' + email);
    } else {
      out.textContent = 'Your message has been prepared. Please use the email link above to contact me directly.';
    }
  });

  // Current Year
  $('#year').textContent = new Date().getFullYear();
})();
