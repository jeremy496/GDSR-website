# Goldendoodle Stump Removal — website

A self-contained static site (plain HTML/CSS/JS, no build step) for
goldendoodlestumpremoval.com. Hosted for free on GitHub Pages so there's no
vendor account that can delete your data again.

## What's in here

- `index.html` — the whole site: header/nav, hero video, trust strip,
  pricing calculator with Good/Better/Best tiers, online booking (GoHighLevel
  calendar), why-choose-us, Meet the Team, service area + map, final
  call-to-action, footer
- `styles.css` — all styling
- `script.js` — mobile menu, hero video pause button, the pricing calculator,
  and passing the estimate to the booking calendar
- `about.html` — sends the old `/about` address (still in Google) to the homepage
- `404.html` — friendly "page not found" screen that returns visitors home
- `robots.txt`, `sitemap.xml` — help Google find and index the site
- `images/` — photos, logos, favicons and the hero video
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

## 3. Booking

Bookings go through the GoHighLevel calendar embedded in the "Book online"
section. The visitor's estimate from the pricing calculator is sent along with
the booking (as UTM tags and a `website_estimate` field), so it shows on the
contact in GoHighLevel. If the visitor arrived from an ad or link with its own
`utm_source`/`utm_medium`/`utm_campaign`, those are kept.

## 4. Content notes / things to double-check

- Pricing is set in `script.js` (`RATE_PER_INCH` and `TIERS`): $10 per inch of
  total diameter, Good ×1 ($250 minimum), Better ×1.15 ($275 minimum), Best
  ×1.35 ($300 minimum). Minimums apply per visit. More than 3 stumps, stumps
  over 48", or jobs over 30 miles from Spokane Valley show "Call for estimate".
- Business phone used throughout: (509) 479-4685.
- License number shown: WA L&I Contractor #GOLDESR741MO.
- Service area: Spokane and within 30 miles of Spokane Valley.
