/**
 * Universal form handler.
 * - Auto-format phone XXX-XXX-XXXX while typing.
 * - Client-side validation (required fields only; shows each problem + red field).
 * - On error, offers a clickable "call us" fallback using the site's own phone.
 * - POSTs to same-origin /api/contact (server validates again + forwards to Zapier).
 *   Zapier hook URL is NEVER exposed to client (no window.__ZAPIER_HOOK__).
 * - On success: redirect to /thank-you/.
 */
(() => {
  'use strict';

  // Self-contained styles so the red invalid-field highlight + message box render
  // on every site regardless of its own CSS. Injected once.
  function injectStyles() {
    if (document.getElementById('form-handler-styles')) return;
    const style = document.createElement('style');
    style.id = 'form-handler-styles';
    style.textContent = `
      .field-error { border: 2px solid #dc2626 !important; background-color: #fef2f2 !important; }
      .form-message { margin-top: 0.75rem; padding: 0.75rem 1rem; border-radius: 0.5rem; font-size: 0.95rem; line-height: 1.45; }
      .form-message-sending { background: #eff6ff; color: #1e40af; }
      .form-message-success { background: #ecfdf5; color: #065f46; }
      .form-message-error { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
      .form-message-error a { color: #b91c1c; font-weight: 700; text-decoration: underline; }
      .form-message-call { display: block; margin-top: 0.4rem; }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  function escapeHtml(s) {
    return (s || '').toString().replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // Pull the site's phone from the first tel: link on the page (header call button).
  function getSitePhone() {
    const a = document.querySelector('a[href^="tel:"]');
    if (!a) return null;
    const href = a.getAttribute('href') || '';
    const raw = href.replace(/^tel:/i, '').trim();
    let text = (a.textContent || '').trim();
    if (!/\d/.test(text)) {
      const d = raw.replace(/[^\d]/g, '');
      text = d.length === 10 ? `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}` : raw;
    }
    return { href, text };
  }

  function callFallbackHtml() {
    const p = getSitePhone();
    if (!p) return '';
    return `<span class="form-message-call">Or call us instead: <a href="${escapeHtml(p.href)}">${escapeHtml(p.text)}</a>.</span>`;
  }

  function formatPhone(input) {
    const digits = (input.value || '').replace(/\D/g, '').slice(0, 10);
    input.value = digits.replace(/(\d{3})(\d{0,3})(\d{0,4}).*/, (_, a, b, c) =>
      [a, b, c].filter(Boolean).join('-')
    );
  }

  function isPhoneField(el) {
    if (!el) return false;
    const n = (el.name || '').toLowerCase();
    const t = (el.type || '').toLowerCase();
    return t === 'tel' || /phone/.test(n);
  }

  function setupPhoneFormat(form) {
    form.querySelectorAll('input').forEach(input => {
      if (isPhoneField(input)) {
        input.setAttribute('inputmode', 'tel');
        input.setAttribute('autocomplete', 'tel');
        input.setAttribute('placeholder', 'XXX-XXX-XXXX');
        input.addEventListener('input', () => formatPhone(input));
      }
    });
  }

  function getMessageBox(form) {
    let box = form.querySelector('.form-message');
    if (!box) {
      box = document.createElement('div');
      box.className = 'form-message';
      box.setAttribute('role', 'status');
      box.setAttribute('aria-live', 'polite');
      const submit = form.querySelector('input[type="submit"], button[type="submit"]');
      if (submit && submit.parentNode) submit.parentNode.insertBefore(box, submit.nextSibling);
      else form.appendChild(box);
    }
    return box;
  }

  // `html` may contain markup we built ourselves (escaped where dynamic).
  function showMessage(form, type, html) {
    const box = getMessageBox(form);
    box.innerHTML = html;
    box.className = `form-message form-message-${type}`;
  }

  function disableForm(form, disabled) {
    form.querySelectorAll('input, select, textarea, button').forEach(el => {
      el.disabled = disabled;
    });
  }

  function buildPayload(form) {
    const data = new FormData(form);
    // Elementor forms emit fields like `form_fields[name]`, `form_fields[email]`, etc.
    // Build a generic key index so name/phone/email/message match across CF7 + Elementor + plain forms.
    const idx = {};
    for (const [k, v] of data.entries()) {
      const m = k.match(/^form_fields\[([^\]]+)\]$/);
      const key = (m ? m[1] : k).toLowerCase();
      if (!idx[key]) idx[key] = (v ?? '').toString();
    }
    const name    = (data.get('FullName')     || data.get('Name')    || data.get('name')    || idx['name']    || idx['fullname']    || idx['full_name']  || '').toString().trim();
    const phone   = (data.get('PhoneNumber')  || data.get('Phone')   || data.get('phone')   || idx['phone']   || idx['phonenumber'] || idx['phone_number']|| idx['tel']     || '').toString().trim();
    const email   = (data.get('EmailAddress') || data.get('Email')   || data.get('email')   || idx['email']   || idx['emailaddress']|| idx['email_address'] || '').toString().trim();
    const message = (data.get('Message')      || data.get('message') || idx['message']      || idx['msg']     || idx['comment']     || idx['comments']  || '').toString().trim();

    // Empty-field guard — never POST a blank required field even if validation slipped
    if (!name || !email || !phone) {
      throw new Error('missing required field (name/email/phone)');
    }

    let service = '';
    form.querySelectorAll('select').forEach(sel => {
      if (sel.value) service = sel.value;
    });

    const honeypot = (data.get('honeypot-911') || '').toString();

    const utm = {};
    new URLSearchParams(location.search).forEach((v, k) => {
      if (k.startsWith('utm_')) utm[k] = v;
    });

    // Compute human-readable form_name from page title (better than URL string)
    const pageTitleEl = document.querySelector('h1');
    const pageTitle = pageTitleEl ? pageTitleEl.textContent.trim().slice(0, 60) : document.title;
    const form_name = `Contact Form - ${pageTitle}`;

    return {
      name, phone, email, message,
      service,
      honeypot,
      form_name,
      page_url: location.href,
      utm
    };
  }

  function isVisible(el) {
    // Hidden via display:none anywhere in ancestor chain → offsetParent is null.
    if (el.offsetParent === null && el.type !== 'hidden') {
      // Edge case: <body> has offsetParent null but is visible — fall through to style check
      const cs = (el.ownerDocument && el.ownerDocument.defaultView)
        ? el.ownerDocument.defaultView.getComputedStyle(el)
        : null;
      if (cs && (cs.display === 'none' || cs.visibility === 'hidden')) return false;
      // offsetParent null could also mean fixed-positioned — only safe to treat as hidden
      // if inline style says display:none
      const inline = (el.getAttribute('style') || '').toLowerCase();
      if (inline.includes('display:none') || inline.includes('display: none')) return false;
    }
    // Inline style display:none catches Elementor honeypot fields rendered as type=text
    const inline = (el.getAttribute('style') || '').toLowerCase();
    if (inline.includes('display:none') || inline.includes('display: none')) return false;
    if (inline.includes('visibility:hidden') || inline.includes('visibility: hidden')) return false;
    return true;
  }

  // Friendly label for an invalid field, preferring placeholder, then a nearby
  // label, then the field name (asterisks/colons stripped).
  function fieldLabel(el) {
    const n = (el.name || '').toLowerCase();
    // Phone/email get canonical labels — their placeholder is a format mask
    // ("XXX-XXX-XXXX") that setupPhoneFormat forces, so it's never a good label.
    if (isPhoneField(el)) return 'Phone number';
    if ((el.type || '').toLowerCase() === 'email' || /email/.test(n)) return 'Email address';
    let raw = el.placeholder || '';
    if (!raw && el.id) {
      const lbl = el.ownerDocument.querySelector(`label[for="${el.id}"]`);
      if (lbl) raw = lbl.textContent || '';
    }
    if (!raw) raw = el.getAttribute('aria-label') || el.name || 'This field';
    return raw.replace(/[*:]/g, '').trim() || 'This field';
  }

  function validateForm(form) {
    let firstInvalid = null;
    const errors = [];
    form.querySelectorAll('input, select, textarea').forEach(el => {
      const n = (el.name || '').toLowerCase();
      // Skip honeypots, framework hidden fields, hidden inputs, and Elementor's
      // hidden anti-bot text fields (rendered as type=text with display:none).
      if (/honeypot|^_wpcf7|form_fields\[field_/.test(n)) return;
      if (el.type === 'hidden' || el.type === 'submit' || el.type === 'button') return;
      if (!isVisible(el)) return;

      el.classList.remove('field-error');
      const v = (el.value || '').trim();
      // Core contact fields are always required (matches the server contract),
      // even on WPCF7 markup that omits the `required` attribute. Name/phone/email.
      const isCore =
        /^(fullname|name|full_name)$/.test(n) ||
        /phone/.test(n) || (el.type || '').toLowerCase() === 'tel' ||
        /email/.test(n) || (el.type || '').toLowerCase() === 'email';
      const isRequired = isCore || el.hasAttribute('required') || el.getAttribute('aria-required') === 'true';
      if (!v) {
        if (isRequired) {
          errors.push(`${fieldLabel(el)} is required`);
          if (!firstInvalid) firstInvalid = el;
          el.classList.add('field-error');
        }
        return; // empty optional field: nothing more to validate
      }
      if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        errors.push('Please enter a valid email address');
        if (!firstInvalid) firstInvalid = el;
        el.classList.add('field-error');
      }
      if (isPhoneField(el)) {
        const d = v.replace(/\D/g, '');
        if (d.length < 10) {
          errors.push('Phone number needs 10 digits');
          if (!firstInvalid) firstInvalid = el;
          el.classList.add('field-error');
        }
      }
    });
    return { valid: errors.length === 0, errors, firstInvalid };
  }

  function init() {
    injectStyles();
    const forms = document.querySelectorAll('form.wpcf7-form, form.elementor-form, form[data-zapier], form.contact-form');
    forms.forEach(form => {
      if (form.dataset.handlerWired === '1') return;
      form.dataset.handlerWired = '1';
      setupPhoneFormat(form);
      form.setAttribute('novalidate', 'novalidate');

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (form.dataset.submitting === '1') return;

        const { valid, errors, firstInvalid } = validateForm(form);
        if (!valid) {
          const list = errors.map(x => `• ${escapeHtml(x)}`).join('<br>');
          showMessage(form, 'error', `Please fix the following:<br>${list}${callFallbackHtml()}`);
          if (firstInvalid) firstInvalid.focus();
          return;
        }

        let payload;
        try {
          payload = buildPayload(form);
        } catch (err) {
          showMessage(form, 'error', `Please complete all required fields (name, phone, email).${callFallbackHtml()}`);
          return;
        }

        form.dataset.submitting = '1';
        disableForm(form, true);
        showMessage(form, 'sending', 'Sending…');

        try {
          console.log('[form-handler] POST /api/contact', payload);
          const res = await fetch('/api/contact/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          console.log('[form-handler] response status:', res.status);
          const data = await res.json().catch(() => ({}));
          console.log('[form-handler] response body:', data);

          if (!res.ok) {
            throw new Error(data.error || `server returned ${res.status}`);
          }
          showMessage(form, 'success', 'Successfully submitted! Redirecting…');
          form.reset();
          setTimeout(() => { window.location.href = '/thank-you/'; }, 800);
        } catch (err) {
          console.error('[form-handler]', err);
          showMessage(form, 'error', `Sorry, your message couldn't be sent right now.${callFallbackHtml()}`);
        } finally {
          disableForm(form, false);
          form.dataset.submitting = '';
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
