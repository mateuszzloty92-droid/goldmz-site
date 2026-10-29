/* GOLD analytics: the Google tag loads only after analytics consent. */
(() => {
  'use strict';
  const measurementId = 'G-Q2QRELQ657';
  const storageKey = 'gold_analytics_consent_v1';
  const maxAge = 180 * 24 * 60 * 60 * 1000;
  let allowed = false;
  let loaded = false;
  let panel;
  const copy = {
    pl: ['Statystyki odwiedzin', 'Za Twoją zgodą korzystamy z Google Analytics, aby mierzyć odwiedziny i kliknięcia kontaktowe. Google może zapisywać analityczne pliki cookie. Odmowa nie ogranicza korzystania ze strony. Wybór możesz zmienić przyciskiem „Ustawienia analityki”.', 'Zgadzam się', 'Odrzucam', 'Ustawienia analityki', 'Informacje Google o danych'],
    en: ['Visitor statistics', 'With your consent, we use Google Analytics to measure visits and contact clicks. Google may store analytics cookies. Refusing does not limit use of this website. Change your choice using “Analytics settings”.', 'Accept', 'Reject', 'Analytics settings', 'Google data information'],
    cs: ['Statistiky návštěv', 'S vaším souhlasem používáme Google Analytics k měření návštěv a kliknutí na kontakty. Google může ukládat analytické cookies. Odmítnutí neomezuje používání webu. Volbu můžete změnit tlačítkem „Nastavení analytiky”.', 'Souhlasím', 'Odmítám', 'Nastavení analytiky', 'Informace Google o datech']
  };
  const language = () => copy[document.documentElement.lang] ? document.documentElement.lang : 'pl';
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  window['ga-disable-' + measurementId] = true;

  function readChoice() {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey));
      return value && typeof value.allowed === 'boolean' && Date.now() - value.time < maxAge && value.time <= Date.now() ? value.allowed : null;
    } catch (_) { return null; }
  }
  function clearCookies() {
    const domains = ['', location.hostname, '.' + location.hostname, 'goldmz.pl', '.goldmz.pl'];
    document.cookie.split(';').forEach(item => {
      const name = item.split('=')[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) return;
      domains.forEach(domain => {
        document.cookie = name + '=; Max-Age=0; path=/' + (domain ? '; domain=' + domain : '') + '; SameSite=Lax';
      });
    });
  }
  function enable() {
    allowed = true;
    window['ga-disable-' + measurementId] = false;
    gtag('consent', 'update', { analytics_storage: 'granted' });
    if (loaded) return;
    loaded = true;
    gtag('js', new Date());
    // Do not transmit query strings, hashes or form values to Analytics.
    gtag('config', measurementId, {
      page_location: location.origin + location.pathname,
      page_referrer: document.referrer.split('?')[0].split('#')[0],
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.appendChild(script);
  }
  function choose(value) {
    try { localStorage.setItem(storageKey, JSON.stringify({ allowed: value, time: Date.now() })); } catch (_) { /* Current-page choice still works. */ }
    if (value) enable();
    else {
      allowed = false;
      window['ga-disable-' + measurementId] = true;
      gtag('consent', 'update', { analytics_storage: 'denied' });
      clearCookies();
    }
    panel.hidden = true;
    settings.focus({ preventScroll: true });
  }
  function track(name) {
    if (allowed) gtag('event', name, { page_location: location.origin + location.pathname });
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (/^tel:/i.test(href)) track('click_phone');
    else if (/^mailto:/i.test(href)) track('click_email');
    else if (/^https:\/\/(wa\.me|api\.whatsapp\.com)(\/|$)/i.test(href)) track('click_whatsapp');
  });
  // The contact form emits this only after a successful server response.
  document.addEventListener('gold:contact-success', () => track('generate_lead'));

  const style = document.createElement('style');
  style.textContent = '#gold-consent[hidden]{display:none!important}#gold-consent{position:fixed;bottom:64px;left:16px;right:16px;max-width:660px;margin:auto;background:#141414;color:#f5efe7;border:1px solid #c9a646;padding:20px;z-index:2000;font:15px/1.5 system-ui,sans-serif;max-height:70vh;overflow:auto}#gold-consent h2{font:700 20px/1.3 system-ui,sans-serif;margin:0 0 10px}#gold-consent p{margin:0 0 12px}#gold-consent a{color:#e8c86d;text-decoration:underline}#gold-consent .gold-consent-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:16px}#gold-consent button,#gold-analytics-settings{font:600 14px/1.4 system-ui,sans-serif;cursor:pointer;border:1px solid #c9a646;background:#141414;color:#f5efe7;padding:12px 18px}#gold-consent button{flex:1;min-width:140px}#gold-analytics-settings{position:fixed;bottom:10px;left:10px;z-index:1999;padding:8px 12px}#gold-consent button:focus-visible,#gold-analytics-settings:focus-visible{outline:3px solid white;outline-offset:3px}';
  document.head.appendChild(style);
  panel = document.createElement('section');
  panel.id = 'gold-consent';
  panel.setAttribute('aria-labelledby', 'gold-consent-title');
  panel.innerHTML = '<h2 id="gold-consent-title"></h2><p></p><a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer"></a><div class="gold-consent-actions"><button type="button" data-choice="yes"></button><button type="button" data-choice="no"></button></div>';
  const settings = document.createElement('button');
  settings.id = 'gold-analytics-settings';
  settings.type = 'button';
  settings.setAttribute('aria-controls', panel.id);
  function translate() {
    const t = copy[language()];
    panel.querySelector('h2').textContent = t[0];
    panel.querySelector('p').textContent = t[1];
    panel.querySelector('[data-choice="yes"]').textContent = t[2];
    panel.querySelector('[data-choice="no"]').textContent = t[3];
    settings.textContent = t[4];
    panel.querySelector('a').textContent = t[5];
  }
  panel.querySelector('[data-choice="yes"]').addEventListener('click', () => choose(true));
  panel.querySelector('[data-choice="no"]').addEventListener('click', () => choose(false));
  settings.addEventListener('click', () => { panel.hidden = false; panel.querySelector('button').focus(); });
  translate();
  new MutationObserver(translate).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  document.body.append(panel, settings);
  const choice = readChoice();
  panel.hidden = choice !== null;
  if (choice === true) enable();
  else clearCookies();
})();
