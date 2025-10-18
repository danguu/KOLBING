/* =========================================
   Utilidades compartidas
   ========================================= */
document.documentElement.classList.add('js-enabled');

const SELECTORS = {
  menuToggle: '.menu-toggle',
  siteNav: '.site-nav',
  testimonialsSlider: '[data-testimonials]',
  testimonialsPrev: '[data-testimonials-prev]',
  testimonialsNext: '[data-testimonials-next]',
  contactForm: '#form-contacto',
  footerYear: '#footer-year',
  honeypot: '#form-empresa',
};

// Reemplaza esta URL con el endpoint real del servicio que procesa el formulario.
const FORM_ENDPOINT = 'https://tu-endpoint-de-formulario.ejemplo';
const MAILTO_FALLBACK = 'hola@kolbing.com';

/* =========================================
   Inicialización principal
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initTestimonials();
  initContactForm();
  updateFooterYear();
});

/* =========================================
   Cabecera y navegación móvil
   ========================================= */
/**
 * Controla el estado del menú móvil asegurando accesibilidad.
 */
const initMobileMenu = () => {
  const toggle = document.querySelector(SELECTORS.menuToggle);
  const nav = document.querySelector(SELECTORS.siteNav);
  if (!toggle || !nav) return;

  const toggleMenu = () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    const newState = !isExpanded;
    toggle.setAttribute('aria-expanded', String(newState));
    toggle.setAttribute('aria-label', newState ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    nav.classList.toggle('is-open', newState);
    document.body.classList.toggle('hide-overflow', newState);
  };

  toggle.addEventListener('click', toggleMenu);

  nav.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof HTMLAnchorElement) {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      document.body.classList.remove('hide-overflow');
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 720) {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      document.body.classList.remove('hide-overflow');
    }
  });
};

/* =========================================
   Testimonios con control deslizante
   ========================================= */
/**
 * Activa el carrusel de testimonios con soporte para autoplay.
 */
const initTestimonials = () => {
  const slider = document.querySelector(SELECTORS.testimonialsSlider);
  if (!slider) return;

  const slides = Array.from(slider.children);
  const prevButton = document.querySelector(SELECTORS.testimonialsPrev);
  const nextButton = document.querySelector(SELECTORS.testimonialsNext);
  let currentIndex = 0;
  let autoplayInterval = null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateSliderPosition = () => {
    const offset = currentIndex * -100;
    slider.style.transform = `translateX(${offset}%)`;
  };

  const goToSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    updateSliderPosition();
  };

  const goToNext = () => goToSlide(currentIndex + 1);
  const goToPrev = () => goToSlide(currentIndex - 1);

  const startAutoplay = () => {
    if (prefersReducedMotion) return;
    stopAutoplay();
    autoplayInterval = window.setInterval(goToNext, 6000);
  };

  const stopAutoplay = () => {
    if (autoplayInterval) {
      window.clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  };

  prevButton?.addEventListener('click', () => {
    goToPrev();
    startAutoplay();
  });

  nextButton?.addEventListener('click', () => {
    goToNext();
    startAutoplay();
  });

  slider.addEventListener('pointerenter', stopAutoplay);
  slider.addEventListener('pointerleave', startAutoplay);
  slider.addEventListener('focusin', stopAutoplay);
  slider.addEventListener('focusout', startAutoplay);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAutoplay();
          } else {
            stopAutoplay();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(slider);
  } else {
    startAutoplay();
  }

  updateSliderPosition();
};

/* =========================================
   Validación y envío del formulario de contacto
   ========================================= */
/**
 * Inicializa la validación del formulario con honeypot y envío vía Fetch.
 */
const initContactForm = () => {
  const form = document.querySelector(SELECTORS.contactForm);
  const honeypot = document.querySelector(SELECTORS.honeypot);
  if (!form || !honeypot) return;

  const feedback = document.querySelector('#form-feedback');

  const validators = {
    nombre: (value) => value.trim().length >= 3,
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    mensaje: (value) => value.trim().length >= 10,
    consentimiento: (checked) => checked === true,
  };

  const getField = (name) => form.querySelector(`[name="${name}"]`);
  const setFieldState = (field, isValid, errorMessage = '') => {
    if (!field) return;
    field.classList.toggle('is-valid', isValid);
    field.classList.toggle('is-invalid', !isValid);
    if (isValid) {
      field.removeAttribute('aria-invalid');
    } else {
      field.setAttribute('aria-invalid', 'true');
    }
    const errorElement = form.querySelector(`#error-${field.id}`);
    if (errorElement) {
      errorElement.textContent = isValid ? '' : errorMessage;
    }
  };

  form.addEventListener('input', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
    validateField(target.name);
  });

  const validateField = (name) => {
    const field = getField(name);
    if (!field) return true;

    if (!validators[name]) {
      field.classList.remove('is-valid', 'is-invalid');
      return true;
    }

    if (field.type === 'checkbox') {
      const isValid = validators[name]?.(field.checked) ?? true;
      setFieldState(field, isValid, isValid ? '' : 'Debes aceptar el consentimiento.');
      return isValid;
    }

    const value = field.value;
    const isValid = validators[name](value);
    const messages = {
      nombre: 'Ingresa tu nombre completo (mínimo 3 caracteres).',
      email: 'Introduce un correo electrónico válido.',
      mensaje: 'Cuéntanos más detalles (mínimo 10 caracteres).',
    };
    setFieldState(field, isValid, isValid ? '' : messages[name]);
    return isValid;
  };

  const validateForm = () => {
    const fields = ['nombre', 'email', 'mensaje', 'consentimiento'];
    return fields.every((name) => validateField(name));
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (feedback) {
      feedback.textContent = '';
    }

    if (honeypot.value) {
      return;
    }

    if (!validateForm()) {
      if (feedback) {
        feedback.textContent = 'Revisa los campos resaltados.';
      }
      return;
    }

    const formData = new FormData(form);
    formData.delete('empresa');
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Respuesta no válida');
      }

      if (feedback) {
        feedback.textContent = '¡Gracias! Nos pondremos en contacto muy pronto.';
      }
      form.reset();
      form.querySelectorAll('.is-valid').forEach((element) => element.classList.remove('is-valid'));
    } catch (error) {
      if (feedback) {
        feedback.textContent = 'No pudimos enviar el formulario automáticamente. Abriendo tu correo.';
      }
      window.location.href = buildMailtoFallback(payload);
    }
  });
};

/**
 * Construye un enlace mailto con la información del formulario.
 */
const buildMailtoFallback = (payload) => {
  const subject = encodeURIComponent('Contacto Kolbing');
  const body = encodeURIComponent(
    `Nombre: ${payload.nombre}\nCorreo: ${payload.email}\nEmpresa: ${payload.compania ?? ''}\nMensaje: ${payload.mensaje}`
  );
  return `mailto:${MAILTO_FALLBACK}?subject=${subject}&body=${body}`;
};

/* =========================================
   Pie de página
   ========================================= */
/**
 * Actualiza el año del pie de página automáticamente.
 */
const updateFooterYear = () => {
  const yearElement = document.querySelector(SELECTORS.footerYear);
  if (!yearElement) return;
  yearElement.textContent = String(new Date().getFullYear());
};
