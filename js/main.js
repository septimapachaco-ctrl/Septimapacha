/**
 * Séptima Pacha Co. — main.js
 * JS compartido por todas las páginas. Cada función revisa que sus
 * elementos existan antes de actuar, así el mismo archivo sirve para
 * todas las páginas del sitio.
 */

/* Menú de navegación (hamburguesa + panel lateral) */
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  const backdrop = document.querySelector('.nav-backdrop');
  if (!toggle || !nav) return;

  const closeNav = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    backdrop && backdrop.classList.remove('is-visible');
  };

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    backdrop && backdrop.classList.toggle('is-visible', isOpen);
  });

  backdrop && backdrop.addEventListener('click', closeNav);
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });
}

/* Resalta el enlace de la página actual en el menú (aria-current) */
function markCurrentNavLink() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a[href]').forEach((link) => {
    if (link.getAttribute('href') === current) link.setAttribute('aria-current', 'page');
  });
}

/* Animación de aparición al hacer scroll, respeta prefers-reduced-motion */
function initScrollReveal() {
  const items = document.querySelectorAll('.fade-in');
  if (!items.length) return;
  const reveal = (el) => el.classList.add('is-visible');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        reveal(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
  items.forEach((el) => observer.observe(el));

  // Red de seguridad: si por algún motivo el observer no revela un
  // elemento (JS lento, navegador atípico), igual queda visible.
  window.setTimeout(() => items.forEach(reveal), 4000);
}

/* Pantalla de bienvenida con el logo de la marca: se oculta sola al cargar */
function initSplashScreen() {
  const splash = document.querySelector('.splash-screen');
  if (!splash) return;
  // Si el usuario ya la vio en esta sesión, no la repetimos en cada página
  let alreadyShown = false;
  try { alreadyShown = sessionStorage.getItem('septimaSplashShown') === '1'; } catch (e) { /* almacenamiento no disponible */ }
  if (alreadyShown) {
    splash.style.display = 'none';
    return;
  }
  // Se muestra apenas un instante para no demorar la carga visible (LCP)
  setTimeout(() => {
    splash.classList.add('is-hidden');
    try { sessionStorage.setItem('septimaSplashShown', '1'); } catch (e) { /* almacenamiento no disponible */ }
    setTimeout(() => { splash.style.display = 'none'; }, 500);
  }, 400);
}

/**
 * Formularios (.contact-form): contacto y botón de arrepentimiento/baja.
 * Si el form tiene una access key real de Web3Forms en data-web3forms-key,
 * envía los datos por fetch y llegan al email configurado en Web3Forms.
 * Mientras la key sea el placeholder, abre el cliente de correo (mailto).
 */
function initContactForms() {
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  document.querySelectorAll('.contact-form').forEach((form) => {
    const status = form.querySelector('.form-status');
    const destination = form.dataset.destinationEmail || 'hola@septimapacha.com';
    const key = form.dataset.web3formsKey || '';
    const hasKey = key && !key.startsWith('REEMPLAZAR');
    const setStatus = (text, type) => {
      if (!status) return;
      status.textContent = text;
      status.className = `form-status is-${type}`;
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fields = [...form.querySelectorAll('input, select, textarea')]
        .filter((el) => el.name && el.name !== 'botcheck' && el.type !== 'checkbox');
      const invalid = fields.find((el) => (el.required && !el.value.trim())
        || (el.type === 'email' && el.value.trim() && !EMAIL_RE.test(el.value.trim())));
      if (invalid) {
        const label = form.querySelector(`label[for="${invalid.id}"]`);
        setStatus(`Revisá el campo "${label ? label.textContent.replace('*', '').trim() : invalid.name}".`, 'error');
        invalid.focus();
        return;
      }

      const data = {};
      fields.forEach((el) => { data[el.name] = el.value.trim(); });
      const subject = `${form.dataset.subject || 'Consulta desde la web'} — ${data.nombre || ''}`.trim();

      if (hasKey) {
        setStatus('Enviando…', 'success');
        try {
          const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ access_key: key, subject, from_name: 'Web Séptima Pacha', botcheck: form.querySelector('[name="botcheck"]')?.checked || false, ...data }),
          });
          const json = await res.json();
          if (!json.success) throw new Error(json.message);
          setStatus(form.dataset.successMessage || '¡Gracias! Recibimos tu mensaje y te respondemos a la brevedad.', 'success');
          form.reset();
        } catch (err) {
          setStatus('No pudimos enviar el mensaje. Probá de nuevo o escribinos por WhatsApp.', 'error');
        }
        return;
      }

      const body = fields.map((el) => {
        const label = form.querySelector(`label[for="${el.id}"]`);
        return `${label ? label.textContent.replace('*', '').trim() : el.name}: ${el.value.trim()}`;
      }).join('\n');
      window.location.href = `mailto:${destination}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus('Se abrió tu cliente de correo con el mensaje listo para enviar.', 'success');
      form.reset();
    });
  });
}

/* Si falta una captura real de proyecto, muestra un placeholder prolijo en su lugar */
function initProjectImageFallback() {
  const replaceWithPlaceholder = (img) => {
    const placeholder = document.createElement('div');
    placeholder.className = 'project-shot project-shot-placeholder';
    placeholder.setAttribute('role', 'img');
    placeholder.setAttribute('aria-label', img.alt);
    placeholder.textContent = '📸 Captura pendiente de cargar';
    img.replaceWith(placeholder);
  };

  document.querySelectorAll('.project-shot').forEach((img) => {
    // La imagen ya pudo haber fallado antes de que este script corriera
    if (img.complete && img.naturalWidth === 0) {
      replaceWithPlaceholder(img);
      return;
    }
    img.addEventListener('error', () => replaceWithPlaceholder(img), { once: true });
  });
}

/* Conversión referencial ARS → USD en servicios.html */
function initServiciosControls() {
  const currencyBtn = document.getElementById('currencyBtn');
  if (!currencyBtn) return;
  const USD_BLUE_RATE = 1470;
  let currentCurrency = 'ARS';

  // data-ars admite un valor ("280000") o un rango ("134400-235000").
  // Sin data-ars se usa el texto del precio; si no hay un valor válido, se muestra "Consultar".
  document.querySelectorAll('.pricing-price').forEach((priceTag) => {
    const arsSpan = priceTag.querySelector('.price-ars');
    const usdSpan = priceTag.querySelector('.price-usd');
    if (!arsSpan || !usdSpan) return;
    const raw = arsSpan.dataset.ars !== undefined ? arsSpan.dataset.ars : arsSpan.textContent.replace(/[^0-9]/g, '');
    const values = raw.split('-').map((v) => parseInt(v, 10)).filter((v) => v >= USD_BLUE_RATE);
    usdSpan.textContent = values.length
      ? `USD $${values.map((v) => Math.round(v / USD_BLUE_RATE)).join(' – $')}`
      : 'Consultar';
  });

  currencyBtn.addEventListener('click', () => {
    currentCurrency = currentCurrency === 'ARS' ? 'USD' : 'ARS';
    document.querySelectorAll('.pricing-price').forEach((priceTag) => {
      const arsSpan = priceTag.querySelector('.price-ars');
      const usdSpan = priceTag.querySelector('.price-usd');
      if (!arsSpan || !usdSpan) return;
      arsSpan.hidden = currentCurrency === 'USD';
      usdSpan.hidden = currentCurrency !== 'USD';
    });
    currencyBtn.textContent = currentCurrency === 'ARS' ? '💵 Ver en USD' : '💵 Ver en ARS';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  markCurrentNavLink();
  initScrollReveal();
  initSplashScreen();
  initProjectImageFallback();
  initContactForms();
  initServiciosControls();
});
