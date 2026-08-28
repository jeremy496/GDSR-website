// Goldendoodle Stump Removal — site behavior

document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const mobileNav = document.getElementById('mobile-nav');
if (navToggle && mobileNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Stump price slider
// Formula: per-stump base price = max($250 minimum, $10 x diameter in inches).
// Each tier applies a multiplier on top of that base for the extra labor/haul-away/mulch work.
const RATE_PER_INCH = 10;
const MINIMUM_PRICE = 250;
const TIER_MULTIPLIER = {
  basic: 1,
  cleanup: 1.15,
  full: 1.35
};

const diameterSlider = document.getElementById('diameter-slider');
const diameterValue = document.getElementById('diameter-value');
const priceTags = document.querySelectorAll('.price-tag[data-tier]');

function formatCurrency(n) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function updatePrices() {
  const diameter = Math.max(1, parseInt(diameterSlider.value, 10) || 0);
  if (diameterValue) diameterValue.textContent = diameter;

  const base = Math.max(MINIMUM_PRICE, RATE_PER_INCH * diameter);
  priceTags.forEach(tag => {
    const tier = tag.getAttribute('data-tier');
    const multiplier = TIER_MULTIPLIER[tier] ?? 1;
    tag.textContent = formatCurrency(Math.round(base * multiplier));
  });
}

if (diameterSlider) {
  diameterSlider.addEventListener('input', updatePrices);
  updatePrices();
}

// Keep the "interested in" tier on the contact form in sync when arriving from a pricing card
const tierSelectField = document.getElementById('tier-select');
if (tierSelectField) {
  document.querySelectorAll('.price-card').forEach(card => {
    const cta = card.querySelector('a.btn');
    const tag = card.querySelector('.price-tag[data-tier]');
    if (cta && tag) {
      cta.addEventListener('click', () => {
        tierSelectField.value = tag.getAttribute('data-tier');
      });
    }
  });
}

// Contact form submission (Formspree-compatible: works with any endpoint that accepts
// a normal POST and responds to fetch — swap the form's `action` in index.html to your
// own Formspree endpoint after creating a free account at formspree.io)
const quoteForm = document.getElementById('quote-form');
if (quoteForm) {
  quoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = quoteForm.querySelector('.form-submit');
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    const existingMsg = quoteForm.querySelector('.form-success, .form-error');
    if (existingMsg) existingMsg.remove();

    try {
      const response = await fetch(quoteForm.action, {
        method: 'POST',
        body: new FormData(quoteForm),
        headers: { Accept: 'application/json' }
      });

      const msg = document.createElement('p');
      if (response.ok) {
        msg.className = 'form-success';
        msg.textContent = "Thanks! Your quote request is in — I'll get back to you shortly.";
        quoteForm.reset();
      } else {
        msg.className = 'form-error';
        msg.textContent = "That didn't go through. Please call or text (509) 479-4685 instead.";
      }
      quoteForm.appendChild(msg);
    } catch (err) {
      const msg = document.createElement('p');
      msg.className = 'form-error';
      msg.textContent = "That didn't go through. Please call or text (509) 479-4685 instead.";
      quoteForm.appendChild(msg);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
}
