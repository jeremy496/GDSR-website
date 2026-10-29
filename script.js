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

// ---------------------------------------------------------------------------
// Pricing calculator
// Price for a visit = total inches (all stumps) x $10 x tier multiplier,
// then raised to that tier's minimum. Minimums apply per visit, not per stump.
// Jobs that need a call instead of online booking:
//   - more than 3 stumps
//   - any stump over 48"
//   - more than 30 miles from Spokane Valley
// ---------------------------------------------------------------------------
const RATE_PER_INCH = 10;
const TIERS = {
  good:   { name: 'Good',   service: 'Basic Grind',        multiplier: 1.00, minimum: 250 },
  better: { name: 'Better', service: 'Grind + Cleanup',    multiplier: 1.15, minimum: 275 },
  best:   { name: 'Best',   service: 'Grind, Haul & Fill', multiplier: 1.35, minimum: 300 }
};
const MAX_STUMPS_ONLINE = 3;
const MAX_DIAMETER_ONLINE = 48;
const SLIDER_MIN = 4;
const SLIDER_MAX = 60;

const state = {
  stumps: [24],
  manyStumps: false,
  distance: 'near',
  tier: 'better'
};

const stumpList = document.getElementById('stump-list');
const addStumpBtn = document.getElementById('add-stump');
const manyStumpsBtn = document.getElementById('many-stumps');
const jobSummary = document.getElementById('job-summary');
const jobNote = document.getElementById('job-note');
const callNotice = document.getElementById('call-notice');
const callNoticeReason = document.getElementById('call-notice-reason');
const priceCards = document.querySelectorAll('.price-card[data-tier]');
const bookSelectionValue = document.getElementById('book-selection-value');

function formatCurrency(n) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function priceFor(tierKey, totalInches) {
  const tier = TIERS[tierKey];
  return Math.max(tier.minimum, Math.round(totalInches * RATE_PER_INCH * tier.multiplier));
}

function callReasons() {
  const reasons = [];
  if (state.manyStumps) reasons.push('Jobs with more than 3 stumps are quoted individually — ask about our full-day rate.');
  if (state.stumps.some(d => d > MAX_DIAMETER_ONLINE)) reasons.push(`Stumps over ${MAX_DIAMETER_ONLINE}″ need an on-site look before we can price them.`);
  if (state.distance === 'far') reasons.push('Jobs more than 30 miles from Spokane Valley may include a trip charge.');
  return reasons;
}

function renderStumps() {
  stumpList.innerHTML = '';
  state.stumps.forEach((diameter, i) => {
    const row = document.createElement('div');
    row.className = 'stump-row';
    const id = `stump-${i}`;
    row.innerHTML = `
      <label for="${id}" class="stump-label">Stump ${i + 1}</label>
      <input type="range" id="${id}" min="${SLIDER_MIN}" max="${SLIDER_MAX}" step="1" value="${diameter}" aria-label="Stump ${i + 1} diameter in inches">
      <span class="stump-value"><input type="number" min="1" max="99" value="${diameter}" aria-label="Stump ${i + 1} diameter in inches, exact">″</span>
      ${state.stumps.length > 1 ? `<button type="button" class="stump-remove" aria-label="Remove stump ${i + 1}">×</button>` : '<span class="stump-remove-spacer"></span>'}
    `;
    const range = row.querySelector('input[type="range"]');
    const number = row.querySelector('input[type="number"]');
    range.addEventListener('input', () => {
      state.stumps[i] = parseInt(range.value, 10);
      number.value = range.value;
      update();
    });
    number.addEventListener('input', () => {
      const v = parseInt(number.value, 10);
      if (!v || v < 1) return;
      state.stumps[i] = v;
      range.value = Math.min(Math.max(v, SLIDER_MIN), SLIDER_MAX);
      update();
    });
    const remove = row.querySelector('.stump-remove');
    if (remove) {
      remove.addEventListener('click', () => {
        state.stumps.splice(i, 1);
        renderStumps();
        update();
      });
    }
    stumpList.appendChild(row);
  });

  addStumpBtn.hidden = state.stumps.length >= MAX_STUMPS_ONLINE;
  manyStumpsBtn.textContent = state.manyStumps ? '✓ I have 4 or more stumps' : 'I have 4 or more stumps';
  manyStumpsBtn.setAttribute('aria-pressed', String(state.manyStumps));
}

function update() {
  const totalInches = state.stumps.reduce((sum, d) => sum + d, 0);
  const count = state.stumps.length;
  const reasons = callReasons();
  const needsCall = reasons.length > 0;

  jobSummary.textContent = state.manyStumps
    ? '4+ stumps'
    : `${count} stump${count > 1 ? 's' : ''} · ${totalInches}″ total`;
  jobNote.textContent = count > 1
    ? `${state.stumps.map(d => d + '″').join(' + ')} = ${totalInches}″. Minimum charge applies to the whole visit.`
    : 'Minimum charge applies to the whole visit, not each stump.';

  callNotice.hidden = !needsCall;
  callNoticeReason.textContent = reasons.join(' ');
  document.body.classList.toggle('needs-call', needsCall);

  priceCards.forEach(card => {
    const tierKey = card.dataset.tier;
    const amount = card.querySelector('.price-amount');
    const btn = card.querySelector('.tier-btn');
    const price = priceFor(tierKey, totalInches);
    const raw = Math.round(totalInches * RATE_PER_INCH * TIERS[tierKey].multiplier);
    amount.textContent = needsCall ? 'Call' : formatCurrency(price);
    card.querySelector('.price-min').textContent = needsCall
      ? 'for an estimate'
      : raw < TIERS[tierKey].minimum ? `${formatCurrency(TIERS[tierKey].minimum)} minimum applied` : `${formatCurrency(TIERS[tierKey].minimum)} minimum`;
    btn.textContent = needsCall ? 'Call for Estimate' : `Book ${TIERS[tierKey].name}`;
    card.classList.toggle('is-selected', tierKey === state.tier);
  });

  const tier = TIERS[state.tier];
  bookSelectionValue.textContent = needsCall
    ? 'Your job needs a quick call — (509) 479-4685'
    : `${tier.name} · ${count} stump${count > 1 ? 's' : ''} · ${totalInches}″ total · ${formatCurrency(priceFor(state.tier, totalInches))}`;

  const sizes = count > 1 ? `${state.stumps.map(d => d + '″').join(' + ')} = ${totalInches}″` : `${totalInches}″`;
  updateBookingEstimate(
    `${tier.name} (${tier.service}) · ${count} stump${count > 1 ? 's' : ''}: ${sizes} · ` +
    `${state.distance === 'far' ? 'more than' : 'within'} 30 mi of Spokane Valley · ` +
    (needsCall ? `needs a call (${reasons.join(' ')})` : `est. ${formatCurrency(priceFor(state.tier, totalInches))}`)
  );
}

// Send the estimate to the GoHighLevel booking form as the hidden "Website Estimate"
// field (query key website_estimate), so it's saved on the contact with the booking.
// Reloading the calendar resets it, so wait until the visitor stops adjusting the
// calculator, and never reload once they've clicked into the calendar.
const BOOKING_URL = 'https://api.leadconnectorhq.com/widget/booking/4DfR5LlIdesK0LKQRszZ';
const bookingFrame = document.querySelector('.book-frame iframe');
const bookingLink = document.querySelector('.book-fallback a');
let bookingFrameTimer;
let bookingFrameInitialized = false;
let pendingBookingUrl = null;

function loadPendingBookingUrl() {
  clearTimeout(bookingFrameTimer);
  if (!pendingBookingUrl || document.activeElement === bookingFrame) return;
  bookingFrame.src = pendingBookingUrl;
  pendingBookingUrl = null;
}

function updateBookingEstimate(text) {
  const url = `${BOOKING_URL}?website_estimate=${encodeURIComponent(text)}`;
  if (bookingLink) bookingLink.href = url;
  if (!bookingFrame || bookingFrame.src === url) return;
  pendingBookingUrl = url;
  if (!bookingFrameInitialized) {
    bookingFrameInitialized = true;
    loadPendingBookingUrl();
  } else {
    clearTimeout(bookingFrameTimer);
    bookingFrameTimer = setTimeout(loadPendingBookingUrl, 1200);
  }
}

if (stumpList) {
  addStumpBtn.addEventListener('click', () => {
    if (state.stumps.length >= MAX_STUMPS_ONLINE) return;
    state.stumps.push(12);
    renderStumps();
    update();
  });

  manyStumpsBtn.addEventListener('click', () => {
    state.manyStumps = !state.manyStumps;
    renderStumps();
    update();
  });

  document.querySelectorAll('input[name="distance"]').forEach(radio => {
    radio.addEventListener('change', () => {
      state.distance = radio.value;
      update();
    });
  });

  priceCards.forEach(card => {
    card.querySelector('.tier-btn').addEventListener('click', () => {
      state.tier = card.dataset.tier;
      update();
      loadPendingBookingUrl();
      if (callReasons().length) {
        window.location.href = 'tel:+15094794685';
      } else {
        document.getElementById('book').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  renderStumps();
  update();
}

// Booking calendar fallback
// Safari (and iPhones) can block the embedded GoHighLevel calendar, leaving a blank box.
// The calendar posts a "highlevel.setHeight" message once it renders; if that never
// arrives, point people to the full-page booking link instead.
const bookFallback = document.getElementById('book-fallback');
if (bookFallback) {
  let calendarRendered = false;
  window.addEventListener('message', (e) => {
    if (!/^https:\/\/([a-z0-9-]+\.)*leadconnectorhq\.com$/.test(e.origin)) return;
    const type = Array.isArray(e.data) ? e.data[0] : e.data;
    if (type === 'highlevel.setHeight') calendarRendered = true;
  });
  setTimeout(() => {
    if (calendarRendered) return;
    bookFallback.classList.add('is-stuck');
    document.getElementById('book-fallback-text').textContent =
      "The calendar didn't load in this browser — tap below to book on its own page.";
  }, 8000);
}
