# Goldendoodle Stump Removal — website

A self-contained static site (plain HTML/CSS/JS, no build step) for
goldendoodlestumpremoval.com. Hosted for free on GitHub Pages so there's no
vendor account that can delete your data again.

## What's in here

- `index.html` — the whole site: header/nav, hero, trust strip, feature
  intro, "Choose Your Level" pricing with a live diameter-based estimate,
  Meet Leo section, service area + map, testimonials (placeholders — see
  below), contact/quote form, final call-to-action, footer
- `styles.css` — all styling
- `script.js` — mobile menu, the live price slider, and the contact form
  submit handler
- `images/` — logo and photo assets:
  - `leo-headshot.png` — Leo's square headshot (header + final CTA)
  - `leo-helmet.png` — Leo in his GDSR helmet (Meet Leo section)
  - `hero-leo-illustration.png` — the mascot illustration used in the hero
  - `logo-wordmark.png` — the horizontal text logo (footer)
  - `favicon-32.png`, `favicon-192.png`, `favicon-512.png` — browser tab icon
- `CNAME` — tells GitHub Pages this site should answer to
  `goldendoodlestumpremoval.com`

## 1. Turn on GitHub Pages

1. In this repo, go to **Settings → Pages**.
2. Under "Build and deployment", set **Source** to `Deploy from a branch`,
   branch `main`, folder `/ (root)`. Save.
3. GitHub will give you a URL like `https://jeremy496.github.io/GDSR-website/`
   — give it a minute or two, then check it loads.

## 2. Point your domain at it

You already own `goldendoodlestumpremoval.com`. At whoever you bought/manage
the domain through (GoDaddy, Namecheap, Google Domains, etc.), edit its DNS
records:

- Add an **A record** for `@` pointing to each of GitHub's IPs:
  `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- Add a **CNAME record** for `www` pointing to `jeremy496.github.io`

Then back in **Settings → Pages** on GitHub, type
`goldendoodlestumpremoval.com` into the custom domain box and save (this is
what the included `CNAME` file also does automatically once it's in the
repo). Check **Enforce HTTPS** once it's available.

DNS changes can take anywhere from a few minutes to a few hours to kick in.

## 3. Make the quote form actually send you email

The form in `index.html` posts to Formspree, a free service that turns a
plain HTML form into working email notifications — no backend required
(GitHub Pages can't run server code).

1. Go to formspree.io and make a free account with
   jeremy@goldendoodlestumpremoval.com.
2. Create a new form, copy the endpoint it gives you (looks like
   `https://formspree.io/f/abcdwxyz`).
3. In `index.html`, find this line (in the Contact section):
   `<form class="contact-form" id="quote-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">`
   and replace `YOUR_FORM_ID` with your real endpoint.
4. Commit the change (directly in the GitHub file editor, or however you
   prefer).

Until you do this, the form will show an error message — the phone/text/email
links above the form work immediately either way.

## 4. Content notes / things to double-check

- Pricing shown is calculated live from the diameter slider: $10/inch, $250
  minimum per stump, with a multiplier per tier (Basic Grind ×1, Grind +
  Cleanup ×1.15, Full Removal + Mulch ×1.35). Double-check these multipliers
  match what you actually want to charge — they're an estimate based on your
  known $10/inch, $250-minimum rule since the exact historical tier
  surcharges weren't available when this was rebuilt.
- Business phone used throughout: (509) 479-4685.
- License number shown: WA L&I Contractor #GOLDESR741MO.
- Service area copy says "Spokane, WA and the surrounding area" (not North
  Idaho) since licensing there wasn't confirmed — update this if that's
  changed.
- The testimonials section is intentionally placeholder cards with
  instructions, not fake reviews — swap them for real customer quotes as you
  get them.
- Add real job photos when you have them — drop new images into `images/`
  and reference them in `index.html`.
