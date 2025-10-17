const testimonials = document.querySelectorAll('.testimonial');
const controls = document.querySelectorAll('.slider-control');
let currentIndex = 0;

function showTestimonial(index) {
  testimonials.forEach((item, i) => {
    item.classList.toggle('is-active', i === index);
  });
}

controls.forEach((button) => {
  button.addEventListener('click', () => {
    const direction = button.dataset.direction;
    if (direction === 'next') {
      currentIndex = (currentIndex + 1) % testimonials.length;
    } else {
      currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    }
    showTestimonial(currentIndex);
  });
});

setInterval(() => {
  currentIndex = (currentIndex + 1) % testimonials.length;
  showTestimonial(currentIndex);
}, 6000);

const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
