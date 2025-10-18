(() => {
  'use strict';

  // Cache DOM references
  const doc = document;
  const nav = doc.querySelector('.navigation');
  const menuToggle = doc.querySelector('.menu-toggle');
  const testimonials = Array.from(doc.querySelectorAll('.testimonial'));
  const sliderControls = doc.querySelectorAll('.slider-control');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const form = doc.querySelector('.contact__form');
  const footerYear = doc.querySelector('[data-js="year"]');

  /* --------------------------------------------------------------------------
   * Mobile menu toggle
   * ----------------------------------------------------------------------- */
  if (menuToggle && nav) {
    const toggleMenu = () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      nav.dataset.open = String(!expanded);
      menuToggle.querySelector('.visually-hidden').textContent = expanded ? 'Abrir menú' : 'Cerrar menú';
    };

    menuToggle.addEventListener('click', toggleMenu);

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 960 && menuToggle.getAttribute('aria-expanded') === 'true') {
          toggleMenu();
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
   * Testimonials slider with autoplay
   * ----------------------------------------------------------------------- */
  let currentTestimonial = 0;
  let autoplayId = null;

  const startAutoplay = () => {
    if (!prefersReducedMotion && testimonials.length) {
      stopAutoplay();
      autoplayId = window.setInterval(() => moveTestimonial(1), 8000);
    }
  };

  const stopAutoplay = () => {
    if (autoplayId) {
      window.clearInterval(autoplayId);
      autoplayId = null;
    }
  };

  const activateTestimonial = (index) => {
    testimonials.forEach((item, idx) => {
      if (idx === index) {
        item.classList.add('is-active');
        item.setAttribute('tabindex', '0');
      } else {
        item.classList.remove('is-active');
        item.removeAttribute('tabindex');
      }
    });
    currentTestimonial = index;
  };

  const moveTestimonial = (direction) => {
    const count = testimonials.length;
    if (!count) return;
    const nextIndex = (currentTestimonial + direction + count) % count;
    activateTestimonial(nextIndex);
  };

  if (testimonials.length) {
    activateTestimonial(0);

    sliderControls.forEach((button) => {
      button.addEventListener('click', () => {
        const direction = button.dataset.direction === 'next' ? 1 : -1;
        moveTestimonial(direction);
      });
    });

    startAutoplay();

    sliderControls.forEach((button) => {
      button.addEventListener('mouseenter', stopAutoplay);
      button.addEventListener('focus', stopAutoplay);
      button.addEventListener('mouseleave', startAutoplay);
      button.addEventListener('blur', startAutoplay);
    });
  }

  /* --------------------------------------------------------------------------
   * IntersectionObserver for progressive enhancements
   * ----------------------------------------------------------------------- */
  const observeTargets = doc.querySelectorAll('.card, .hero__card, .hero__media, .logos__grid li');
  if ('IntersectionObserver' in window && observeTargets.length) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observeTargets.forEach((target) => observer.observe(target));
  }

  /* --------------------------------------------------------------------------
   * Form validation with honeypot and fetch submission
   * ----------------------------------------------------------------------- */
  const validateField = (field) => {
    const hint = field.closest('.form-control')?.querySelector('.input-hint');
    const value = field.value.trim();
    let message = '';

    if (field.required && !value) {
      message = 'Este campo es obligatorio.';
    } else if (field.type === 'email' && value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        message = 'Introduce un correo válido.';
      }
    }

    if (message) {
      field.classList.add('is-invalid');
      field.classList.remove('is-valid');
    } else {
      if (value) {
        field.classList.add('is-valid');
      }
      field.classList.remove('is-invalid');
    }

    if (hint) {
      hint.textContent = message;
    }

    return !message;
  };

  const serializeForm = (formElement) => {
    const data = new FormData(formElement);
    return new URLSearchParams(data).toString();
  };

  if (form) {
    form.addEventListener('input', (event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
        validateField(target);
      }
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const feedback = form.querySelector('.form-feedback');
      const fields = Array.from(form.querySelectorAll('input, textarea, select'));
      const isHuman = (form.querySelector('input[name="empresa_web"]')?.value || '').length === 0;
      let formIsValid = true;

      fields.forEach((field) => {
        if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
          const valid = validateField(field);
          if (!valid) {
            formIsValid = false;
          }
        }
      });

      if (!isHuman) {
        return;
      }

      if (!formIsValid) {
        feedback.textContent = 'Revisa los campos marcados e inténtalo de nuevo.';
        return;
      }

      const endpoint = form.dataset.endpoint;
      const formData = serializeForm(form);

      if (endpoint) {
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: formData
          });

          if (response.ok) {
            feedback.textContent = '¡Gracias! Hemos recibido tu mensaje y te contactaremos muy pronto.';
            form.reset();
            fields.forEach((field) => field.classList.remove('is-valid'));
          } else {
            throw new Error('Error al enviar');
          }
        } catch (error) {
          console.error(error);
          feedback.textContent = 'No pudimos enviar el formulario. Por favor intenta más tarde o escríbenos a hola@kolbing.com.';
        }
      } else {
        const mailtoLink = `mailto:hola@kolbing.com?subject=${encodeURIComponent('Nuevo contacto desde kolbing.com')}&body=${encodeURIComponent(formData)}`;
        window.location.href = mailtoLink;
        feedback.textContent = 'Estamos abriendo tu cliente de correo para completar el envío.';
      }
    });
  }

  /* --------------------------------------------------------------------------
   * Dynamic footer year
   * ----------------------------------------------------------------------- */
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear().toString();
  }
})();
