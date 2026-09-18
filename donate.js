/* =========================================================
   donate.js — the ONLY place payment gets wired in.

   Everything that can start a donation (any element with the
   data-donate attribute) opens this modal. When you are ready to
   accept real money, you change exactly one function below:
   `startPayment`. Nothing else in the site needs to change.
   ========================================================= */
(function () {
  'use strict';

  var modal   = document.getElementById('donateModal');
  if (!modal) return;

  var form    = document.getElementById('donateForm');
  var note    = document.getElementById('donateNote');
  var causeEl = document.getElementById('modalCause');
  var custom  = document.getElementById('customAmount');
  var emailEl = document.getElementById('donorEmail');
  var submit  = document.getElementById('donateSubmit');

  var state = { amount: 50, frequency: 'one_time', cause: 'General fund' };
  var lastFocused = null;

  /* ---------- open / close ---------- */
  function open(cause) {
    lastFocused = document.activeElement;
    state.cause = cause || 'General fund';
    causeEl.textContent = state.cause;
    note.textContent = 'Payment provider is not connected yet.';
    note.classList.remove('is-err');
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    emailEl.focus();
  }

  function close() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-donate]');
    if (trigger) {
      e.preventDefault();
      open(trigger.dataset.cause);
      return;
    }
    if (e.target.closest('[data-close]')) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) close();
  });

  /* ---------- frequency + amount ---------- */
  modal.querySelectorAll('[data-freq]').forEach(function (b) {
    b.addEventListener('click', function () {
      modal.querySelectorAll('[data-freq]').forEach(function (x) { x.classList.remove('is-on'); });
      b.classList.add('is-on');
      state.frequency = b.dataset.freq;
    });
  });

  modal.querySelectorAll('[data-amt]').forEach(function (b) {
    b.addEventListener('click', function () {
      modal.querySelectorAll('[data-amt]').forEach(function (x) { x.classList.remove('is-on'); });
      b.classList.add('is-on');
      state.amount = Number(b.dataset.amt);
      custom.value = '';
    });
  });

  custom.addEventListener('input', function () {
    if (custom.value) {
      modal.querySelectorAll('[data-amt]').forEach(function (x) { x.classList.remove('is-on'); });
      state.amount = Number(custom.value);
    }
  });

  /* =========================================================
     THE INTEGRATION POINT
     ---------------------------------------------------------
     Today: shows a message. Tomorrow: uncomment the block that
     matches your provider and delete the placeholder.

     Stripe (recommended with Vercel):
       1. Add STRIPE_SECRET_KEY in Vercel → Settings → Environment Variables
       2. Rename api/create-checkout-session.js.example → .js
       3. Replace the body of startPayment with the fetch below.

       var res = await fetch('/api/create-checkout-session', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(payload)
       });
       var data = await res.json();
       window.location.href = data.url;

     PayPal / local gateway (Tap, Moyasar, Paytabs, HyperPay …):
       window.location.href = 'https://your-gateway/checkout?amount=' + payload.amount;
     ========================================================= */
  async function startPayment(payload) {
    console.log('Donation payload ready for the gateway:', payload);
    note.classList.remove('is-err');
    note.textContent =
      'Payment provider is not connected yet. Payload logged to the console.';
  }

  /* ---------- submit ---------- */
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    var amount = Number(custom.value || state.amount);
    var email = emailEl.value.trim();

    if (!amount || amount < 1) {
      note.textContent = 'Choose an amount, or enter one above $1.';
      note.classList.add('is-err');
      return;
    }
    if (!emailEl.checkValidity() || !email) {
      note.textContent = 'Enter a valid email so we can send the receipt.';
      note.classList.add('is-err');
      emailEl.focus();
      return;
    }

    var payload = {
      amount: amount,
      currency: 'usd',
      frequency: state.frequency,
      cause: state.cause,
      email: email
    };

    submit.disabled = true;
    submit.textContent = 'Processing…';
    try {
      await startPayment(payload);
    } catch (err) {
      console.error(err);
      note.textContent = 'Something went wrong. Try again in a moment.';
      note.classList.add('is-err');
    } finally {
      submit.disabled = false;
      submit.textContent = 'Continue to payment';
    }
  });
})();
