/*
 * enhance.js — layered on top of the Claude Design source (regenerated on every
 * deploy, so we enhance at runtime). Adds two working forms with a shared, live
 * list to the private Spielmäuse event page:
 *
 *   1. "Wer ist dabei?"  (#wer-ist-dabei)  — a family says it's coming
 *   2. "Was bringst du mit?" (#picknickdecke) — a family adds a picnic item
 *
 * Both POST to a Google-Apps-Script web app (backend/Code.gs) that stores the
 * entry in a Google Sheet, e-mails Dominik, and serves all entries back via GET
 * so every family sees the live list. Site sign-ups are inserted DIRECTLY into
 * the design's own lists — a picnic item into its category's <ul>, a RSVP as a
 * family card — in the native styling, so they look pre-sorted rather than tacked
 * on. Entries already curated into the seed (window.FAMILIES / window.CONTRIBUTIONS
 * in event-data.js) are de-duplicated so nothing shows twice.
 *
 * The deploy pipeline re-injects <script src="enhance.js"> after each pull
 * (scripts/inject_enhance.py), so this survives design updates.
 */
(function () {
  'use strict';

  // ==== Config ====
  // Filled in once the Apps Script web app is deployed (its /exec URL). Until
  // then inject_enhance.py leaves this script out, so the live site stays clean.
  var BACKEND_URL = 'https://script.google.com/macros/s/AKfycbzmNxTAV_2et2q0iUTpa9PHlDws7IbNuQoevoBkOTMkfQh2_07VSCv--7VVQsdEKLXw/exec';
  var SHARED_TOKEN = 'SPIELMAEUSE_2026';   // must match SHARED_TOKEN in backend/Code.gs
  // Local end-to-end testing points this at a mock server.
  try { if (window.SM_BACKEND) BACKEND_URL = window.SM_BACKEND; } catch (e) {}

  var C = {
    teal: '#2F6672', tealDark: '#24525c', cream: '#FFF8EC', coral: '#E58D78',
    yellow: '#F4C965', mint: '#A8C6A0', blue: '#A9DDE7', ink: '#2E4145', muted: '#4d6167'
  };

  function usable() { return BACKEND_URL && BACKEND_URL.indexOf('__') !== 0; }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function el(html) {
    var d = document.createElement('div');
    d.innerHTML = html.trim();
    return d.firstChild;
  }
  function categories() {
    try {
      var cs = (window.CONTRIBUTIONS || []).map(function (c) { return c.category; }).filter(Boolean);
      if (cs.length) return cs;
    } catch (e) {}
    return ['Herzhaft', 'Süß', 'Obst & Gemüse', 'Getränke', 'Geschirr & Nützliches'];
  }
  function norm(s) { return String(s == null ? '' : s).trim().toLowerCase(); }
  // Family names are typed by hand, so a live entry rarely matches the seed byte
  // for byte ("Marshall" vs "Familie Marshall/Mostert"). Normalise away the
  // "Familie" prefix and compare on the surname parts too.
  function famNorm(s) { return norm(s).replace(/^(familie|fam\.?)\s+/, '').trim(); }
  function famParts(s) {
    var n = famNorm(s);
    var parts = n.split('/').map(function (p) { return p.trim(); }).filter(Boolean);
    if (parts.indexOf(n) < 0) parts.push(n);
    return parts;
  }
  // Entries already curated into the design's seed lists (event-data.js) should
  // not ALSO show as a live entry — dedupe the backend list against the seed so
  // moving something into the list makes its live copy disappear.
  function seedPicknickKeys() {
    var set = {};
    try { (window.CONTRIBUTIONS || []).forEach(function (c) {
      (c.items || []).forEach(function (it) {
        var w = norm(it.what);
        famParts(it.family).forEach(function (p) { set[w + '|' + p] = 1; });   // fuzzy on family
      });
    }); } catch (e) {}
    return set;
  }
  function picknickInSeed(e, seed) {
    var w = norm(e.what);
    return famParts(e.family).some(function (p) { return seed[w + '|' + p]; });
  }
  function seedFamilyKeys() {
    var set = {};
    try { (window.FAMILIES || []).forEach(function (f) {
      famParts(f.name).forEach(function (p) { set[p] = 1; });
    }); } catch (e) {}
    return set;
  }
  function familyInSeed(name, seed) {
    return famParts(name).some(function (p) { return seed[p]; });
  }

  // ---- locate the design's rendered lists so we can insert into them ----
  var STRIPES = [C.coral, C.yellow, C.mint, C.blue, C.teal];

  // map category label -> its group <div> in the picnic list (skip our own form)
  function picknickGroups() {
    var sec = document.getElementById('picknickdecke');
    var mine = document.getElementById('sm-picknick');
    var map = {};
    if (!sec) return map;
    sec.querySelectorAll('h3').forEach(function (h3) {
      if (mine && mine.contains(h3)) return;
      var label = (h3.textContent || '').trim();
      if (label && !map[label]) map[label] = h3.parentElement;
    });
    return map;
  }

  // the flex-wrap container holding the family cards in #wer-ist-dabei
  function familyContainer() {
    var sec = document.getElementById('wer-ist-dabei');
    var mine = document.getElementById('sm-rsvp');
    if (!sec) return null;
    var names = {};
    try { (window.FAMILIES || []).forEach(function (f) { names[norm(f.name)] = 1; }); } catch (e) {}
    var found = null;
    sec.querySelectorAll('div').forEach(function (d) {
      if (found || (mine && mine.contains(d))) return;
      if (names[norm((d.textContent || '').trim())]) found = d.parentElement;
    });
    if (found) return found;
    // fallback: a flex-wrap container that isn't our form
    sec.querySelectorAll('div').forEach(function (d) {
      if (found || (mine && mine.contains(d))) return;
      if (/flex-wrap/.test(d.getAttribute('style') || '') && d.children.length) found = d;
    });
    return found;
  }

  function picknickLi(e) {
    var li = document.createElement('li');
    li.className = 'sm-inj';
    li.setAttribute('style', 'background:' + C.cream + ';border-radius:14px;padding:14px 18px;box-shadow:rgba(47,102,114,.07) 0 2px 10px;display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 14px');
    var h = '<span style="font-weight:800;font-size:16.5px;color:' + C.ink + '">' + esc(e.what) + '</span>';
    if (e.amount) h += '<span style="font-size:15px;color:' + C.muted + '">' + esc(e.amount) + '</span>';
    if (e.note) h += '<span style="font-size:14px;font-style:italic;color:' + C.muted + '">' + esc(e.note) + '</span>';
    if (e.family) h += '<span style="margin-left:auto;font-size:14.5px;font-weight:700;color:' + C.teal + ';background:rgba(169,221,231,.4);padding:4px 12px;border-radius:999px">' + esc(e.family) + '</span>';
    li.innerHTML = h;
    return li;
  }

  function familyCard(e, i) {
    var div = document.createElement('div');
    div.className = 'sm-inj';
    div.setAttribute('style', 'background:' + C.cream + ';border-radius:14px 14px 18px 18px;padding:16px 22px 14px;box-shadow:rgba(47,102,114,.1) 0 3px 12px;display:flex;flex-direction:column;gap:4px;min-width:150px;border-top:6px solid ' + STRIPES[i % STRIPES.length]);
    var h = '<span style="font-family:\'Baloo 2\',sans-serif;font-weight:600;font-size:18px;color:' + C.teal + '">' + esc(e.family) + '</span>';
    var det = [];
    if (e.adults) det.push(e.adults + ' Erw.');
    if (e.kids) det.push(e.kids + ' Kind' + (String(e.kids) === '1' ? '' : 'er'));
    if (det.length) h += '<span style="font-size:14px;color:' + C.muted + '">' + esc(det.join(', ')) + '</span>';
    div.innerHTML = h;
    return div;
  }

  // ---- styles (scoped with the sm- prefix) ----
  function injectStyles() {
    if (document.getElementById('sm-enhance-styles')) return;
    var css = [
      '.sm-card{background:#FFFFFF;border-radius:20px;box-shadow:0 4px 20px rgba(47,102,114,.12);',
      '  padding:22px 22px 20px;margin-top:26px;border-top:6px solid ' + C.coral + '}',
      '.sm-card h3{margin:0 0 4px;font-family:"Baloo 2",sans-serif;font-weight:700;font-size:21px;color:' + C.teal + '}',
      '.sm-card p.sm-sub{margin:0 0 16px;font-size:14.5px;color:' + C.muted + '}',
      '.sm-grid{display:flex;flex-wrap:wrap;gap:12px}',
      '.sm-field{display:flex;flex-direction:column;gap:5px;flex:1 1 160px}',
      '.sm-field.sm-wide{flex-basis:100%}',
      '.sm-field label{font-size:13px;font-weight:700;color:' + C.teal + '}',
      '.sm-field input,.sm-field select{min-height:46px;padding:9px 14px;border-radius:12px;border:2px solid ' + C.blue + ';',
      '  font-family:"Nunito",sans-serif;font-size:16px;color:' + C.ink + ';background:' + C.cream + ';box-sizing:border-box;width:100%}',
      '.sm-field input:focus,.sm-field select:focus{outline:none;border-color:' + C.teal + '}',
      '.sm-actions{display:flex;align-items:center;gap:14px;margin-top:16px;flex-wrap:wrap}',
      '.sm-btn{min-height:46px;padding:0 26px;border:none;border-radius:999px;background:' + C.teal + ';color:' + C.cream + ';',
      '  font-family:"Nunito",sans-serif;font-weight:800;font-size:16px;cursor:pointer}',
      '.sm-btn:hover{background:' + C.tealDark + '}',
      '.sm-btn:disabled{opacity:.6;cursor:default}',
      '.sm-msg{font-size:14.5px;font-weight:700}',
      '.sm-msg.ok{color:' + C.teal + '}.sm-msg.err{color:' + C.coral + '}',
      '.sm-live{margin-top:18px;display:flex;flex-wrap:wrap;gap:10px}',
      '.sm-chip{background:' + C.cream + ';border:2px solid ' + C.blue + ';border-radius:14px;padding:9px 14px;',
      '  font-family:"Nunito",sans-serif;font-size:14.5px;color:' + C.ink + '}',
      '.sm-chip b{font-family:"Baloo 2",sans-serif;font-weight:600;color:' + C.teal + '}',
      '.sm-live-head{margin:22px 0 2px;font-family:"Baloo 2",sans-serif;font-weight:600;font-size:15px;color:' + C.teal + '}'
    ].join('');
    var s = document.createElement('style');
    s.id = 'sm-enhance-styles';
    s.textContent = css;
    document.head.appendChild(s);
  }

  // ---- generic form submit ----
  function post(payload, btn, msg, onOk) {
    if (!usable()) {
      msg.className = 'sm-msg err';
      msg.textContent = 'Die Live-Liste wird gerade eingerichtet – gleich hier verfügbar.';
      return;
    }
    btn.disabled = true;
    var oldLabel = btn.textContent;
    btn.textContent = 'Schick…';
    msg.textContent = '';
    payload.token = SHARED_TOKEN;
    fetch(BACKEND_URL, { method: 'POST', body: JSON.stringify(payload) })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .then(function (j) {
        btn.disabled = false; btn.textContent = oldLabel;
        if (j && j.ok) {
          msg.className = 'sm-msg ok';
          msg.textContent = 'Eingetragen – danke! 🐭';
          onOk();
          loadEntries();
        } else {
          msg.className = 'sm-msg err';
          msg.textContent = 'Hat nicht geklappt – bitte nochmal.';
        }
      })
      .catch(function () {
        btn.disabled = false; btn.textContent = oldLabel;
        msg.className = 'sm-msg err';
        msg.textContent = 'Netzwerkfehler – bitte nochmal.';
      });
  }

  // ---- RSVP form (#wer-ist-dabei) ----
  function ensureRsvp() {
    var sec = document.getElementById('wer-ist-dabei');
    if (!sec || sec.querySelector('#sm-rsvp')) return;
    var card = el(
      '<div class="sm-card" id="sm-rsvp">' +
      '<h3>Seid ihr dabei?</h3>' +
      '<p class="sm-sub">Tragt euch direkt hier ein – alle Familien sehen die Liste sofort.</p>' +
      '<div class="sm-grid">' +
      '<div class="sm-field sm-wide"><label>Eure Familie</label><input id="sm-rsvp-family" maxlength="80" placeholder="z. B. Familie Maus" autocomplete="off"></div>' +
      '<div class="sm-field"><label>Erwachsene</label><input id="sm-rsvp-adults" inputmode="numeric" maxlength="2" placeholder="2"></div>' +
      '<div class="sm-field"><label>Kinder</label><input id="sm-rsvp-kids" inputmode="numeric" maxlength="2" placeholder="1"></div>' +
      '</div>' +
      '<div class="sm-actions"><button class="sm-btn" id="sm-rsvp-btn">Wir sind dabei</button><span class="sm-msg" id="sm-rsvp-msg"></span></div>' +
      '</div>');
    sec.appendChild(card);
    var fam = card.querySelector('#sm-rsvp-family');
    var btn = card.querySelector('#sm-rsvp-btn');
    var msg = card.querySelector('#sm-rsvp-msg');
    btn.addEventListener('click', function () {
      var family = fam.value.trim();
      if (!family) { msg.className = 'sm-msg err'; msg.textContent = 'Bitte euren Familiennamen eintragen.'; fam.focus(); return; }
      post({
        type: 'rsvp', family: family,
        adults: card.querySelector('#sm-rsvp-adults').value.trim(),
        kids: card.querySelector('#sm-rsvp-kids').value.trim()
      }, btn, msg, function () {
        fam.value = ''; card.querySelector('#sm-rsvp-adults').value = ''; card.querySelector('#sm-rsvp-kids').value = '';
      });
    });
  }

  // keep the "N Familien, M Erwachsene, K Kinder" summary in sync — the design
  // computes it from window.FAMILIES only, so live sign-ups would be uncounted.
  // Mirrors the source's format (index.html: familySummary).
  function updateCounter(liveFams) {
    var wd = document.getElementById('wer-ist-dabei');
    if (!wd) return;
    var mine = document.getElementById('sm-rsvp');
    var p = null;
    wd.querySelectorAll('p').forEach(function (el) {
      if (mine && mine.contains(el)) return;
      if (/Erwachsene|schon dabei|die Liste wächst/.test(el.textContent || '')) p = el;
    });
    if (!p) return;
    var count = 0, adults = 0, kids = 0;
    try { (window.FAMILIES || []).forEach(function (f) {
      if (f.placeholder) return;
      count++; adults += (+f.adults || 0); kids += (+f.kids || 0);
    }); } catch (e) {}
    liveFams.forEach(function (e) {
      count++; adults += (parseInt(e.adults, 10) || 0); kids += (parseInt(e.kids, 10) || 0);
    });
    p.textContent = kids > 0
      ? count + ' Familien, ' + adults + ' Erwachsene, ' + kids + ' Kinder – ein gemeinsamer Seetag'
      : count + (count === 1 ? ' Familie ist' : ' Familien sind') + ' schon dabei – die Liste wächst';
  }

  // insert live RSVPs straight into the design's family-card row
  function renderRsvp(list) {
    var sec = document.getElementById('wer-ist-dabei');
    if (!sec) return;
    sec.querySelectorAll('.sm-inj').forEach(function (n) { n.remove(); });   // idempotent
    var seed = seedFamilyKeys();
    var seen = {};
    list = list.filter(function (e) {
      var k = famNorm(e.family);
      if (!k || familyInSeed(e.family, seed) || seen[k]) return false;   // skip seed + duplicate submissions
      seen[k] = 1; return true;
    });
    updateCounter(list);                 // count live sign-ups into the summary too
    if (!list.length) return;
    var cont = familyContainer();
    if (!cont) return;
    list.forEach(function (e, i) { cont.appendChild(familyCard(e, i)); });
  }

  // ---- Picknick form (#picknickdecke) ----
  function ensurePicknick() {
    var sec = document.getElementById('picknickdecke');
    if (!sec || sec.querySelector('#sm-picknick')) return;
    var inner = sec.querySelector('div') || sec;   // the max-width:880px wrapper
    var opts = categories().map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + '</option>'; }).join('');
    var card = el(
      '<div class="sm-card" id="sm-picknick">' +
      '<h3>Was bringst du mit?</h3>' +
      '<p class="sm-sub">Trag deine Mitbringsel ein (mehrere Einträge möglich) – sie landen sofort auf der gemeinsamen Liste.</p>' +
      '<div class="sm-grid">' +
      '<div class="sm-field" style="flex-basis:200px"><label>Was?</label><input id="sm-pk-what" maxlength="80" placeholder="z. B. Kartoffelsalat" autocomplete="off"></div>' +
      '<div class="sm-field"><label>Menge</label><input id="sm-pk-amount" maxlength="40" placeholder="z. B. 1 Schüssel"></div>' +
      '<div class="sm-field"><label>Kategorie</label><select id="sm-pk-cat">' + opts + '</select></div>' +
      '<div class="sm-field sm-wide"><label>Eure Familie</label><input id="sm-pk-family" maxlength="80" placeholder="z. B. Familie Maus" autocomplete="off"></div>' +
      '</div>' +
      '<div class="sm-actions"><button class="sm-btn" id="sm-pk-btn">Auf die Decke damit</button><span class="sm-msg" id="sm-pk-msg"></span></div>' +
      '</div>');
    inner.appendChild(card);
    var what = card.querySelector('#sm-pk-what');
    var fam = card.querySelector('#sm-pk-family');
    var btn = card.querySelector('#sm-pk-btn');
    var msg = card.querySelector('#sm-pk-msg');
    btn.addEventListener('click', function () {
      var w = what.value.trim(), family = fam.value.trim();
      if (!w) { msg.className = 'sm-msg err'; msg.textContent = 'Bitte eintragen, was du mitbringst.'; what.focus(); return; }
      if (!family) { msg.className = 'sm-msg err'; msg.textContent = 'Bitte euren Familiennamen eintragen.'; fam.focus(); return; }
      post({
        type: 'picknick', what: w, family: family,
        amount: card.querySelector('#sm-pk-amount').value.trim(),
        category: card.querySelector('#sm-pk-cat').value
      }, btn, msg, function () {
        what.value = ''; fam.value = ''; card.querySelector('#sm-pk-amount').value = '';
      });
    });
  }

  // insert live picnic items straight into their category's <ul> in the design list
  function renderPicknick(list) {
    var sec = document.getElementById('picknickdecke');
    if (!sec) return;
    sec.querySelectorAll('li.sm-inj').forEach(function (n) { n.remove(); });   // idempotent
    // re-show any category placeholder we hid earlier (in case an entry was removed)
    sec.querySelectorAll('[data-sm-hid]').forEach(function (n) { n.style.display = ''; n.removeAttribute('data-sm-hid'); });
    // also drop any <ul> we created for a then-empty category but no longer need
    sec.querySelectorAll('ul.sm-ul').forEach(function (u) { if (!u.querySelector('li')) u.remove(); });

    var seed = seedPicknickKeys();
    var seen = {};
    list = list.filter(function (e) {
      var sk = norm(e.what) + '|' + famNorm(e.family);
      if (picknickInSeed(e, seed) || seen[sk]) return false;
      seen[sk] = 1; return true;
    });
    if (!list.length) return;

    var groups = picknickGroups();
    var firstCat = Object.keys(groups)[0];
    list.forEach(function (e) {
      var group = groups[e.category] || groups[firstCat];
      if (!group) return;
      var ul = group.querySelector('ul');
      if (!ul) {   // empty category: hide its "wird noch gebraucht" note, add a list
        var ph = group.querySelector('p');
        if (ph) { ph.style.display = 'none'; ph.setAttribute('data-sm-hid', '1'); }
        ul = document.createElement('ul');
        ul.className = 'sm-ul';
        ul.setAttribute('style', 'list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px');
        group.appendChild(ul);
      }
      ul.appendChild(picknickLi(e));
    });
  }

  // ---- load live entries ----
  var loadTimer = null;
  function loadEntries() {
    if (!usable()) return;
    fetch(BACKEND_URL, { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j || !j.ok) return;
        renderRsvp(j.rsvp || []);
        renderPicknick(j.picknick || []);
      })
      .catch(function () {});
  }

  // ---- boot + guard against a late React re-render wiping our nodes ----
  function ensureAll() { injectStyles(); ensureRsvp(); ensurePicknick(); }

  function boot() {
    var tries = 0;
    var t = setInterval(function () {
      tries++;
      if (document.getElementById('wer-ist-dabei') && document.getElementById('picknickdecke')) {
        ensureAll();
        loadEntries();
        var root = document.body;
        var mo = new MutationObserver(function () {
          if (!document.getElementById('sm-rsvp') || !document.getElementById('sm-picknick')) {
            ensureAll(); loadEntries();
          }
        });
        mo.observe(root, { childList: true, subtree: true });
        clearInterval(t);
      } else if (tries > 100) { clearInterval(t); }   // give up after ~20s
    }, 200);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
