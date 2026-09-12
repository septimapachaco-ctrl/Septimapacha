/**
 * Séptima Pacha Co. — main.js
 * JS compartido por todas las páginas. Cada función revisa que sus
 * elementos existan antes de actuar, así el mismo archivo sirve para
 * index.html, servicios.html, codigo-fluido.html y plantillas.html.
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
  window.addEventListener('load', () => {
    setTimeout(() => {
      splash.classList.add('is-hidden');
      try { sessionStorage.setItem('septimaSplashShown', '1'); } catch (e) { /* almacenamiento no disponible */ }
      setTimeout(() => { splash.style.display = 'none'; }, 800);
    }, 1400);
  });
}

/**
 * Formulario de contacto sin backend: arma un enlace mailto con los
 * datos cargados. Si en el futuro se conecta un servicio como
 * Formspree o Web3Forms, alcanza con reemplazar este handler por un
 * fetch() al endpoint correspondiente.
 */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  const status = form.querySelector('.form-status');
  const destination = form.dataset.destinationEmail || 'hola@septimapacha.com';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = form.querySelector('#nombre').value.trim();
    const email = form.querySelector('#email').value.trim();
    const mensaje = form.querySelector('#mensaje').value.trim();
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!nombre || !emailValido || !mensaje) {
      if (status) {
        status.textContent = 'Completá nombre, un email válido y tu mensaje.';
        status.className = 'form-status is-error';
      }
      return;
    }

    const subject = encodeURIComponent(`Consulta web de ${nombre}`);
    const body = encodeURIComponent(`${mensaje}\n\nResponder a: ${email}`);
    window.location.href = `mailto:${destination}?subject=${subject}&body=${body}`;

    if (status) {
      status.textContent = 'Se abrió tu cliente de correo con el mensaje listo para enviar.';
      status.className = 'form-status is-success';
    }
    form.reset();
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

/* Toggle de idioma / moneda en servicios.html */
function initServiciosControls() {
  const currencyBtn = document.getElementById('currencyBtn');
  if (!currencyBtn) return;
  const USD_BLUE_RATE = 1470;
  let currentCurrency = 'ARS';

  document.querySelectorAll('.pricing-price').forEach((priceTag) => {
    const arsSpan = priceTag.querySelector('.price-ars');
    const usdSpan = priceTag.querySelector('.price-usd');
    if (!arsSpan || !usdSpan) return;
    const arsValue = parseInt(arsSpan.textContent.replace(/[^0-9]/g, ''), 10);
    usdSpan.textContent = `USD $${Math.round(arsValue / USD_BLUE_RATE)}`;
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
  initContactForm();
  initServiciosControls();
});
