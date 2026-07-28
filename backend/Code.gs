/**
 * Code.gs — Backend für die Spielmäuse-Seite (RSVP + Picknick-Liste).
 *
 * Läuft als Google-Apps-Script-Web-App auf einem Google Sheet:
 *   - POST  {type, family, adults, kids, category, what, amount, note, token}
 *           → hängt eine Zeile ans Sheet und schickt Dominik eine E-Mail
 *   - GET   → liefert alle Einträge als JSON: { ok, rsvp:[...], picknick:[...] }
 *
 * Einrichtung: siehe backend/SETUP.md. Vor dem Deploy die beiden Konstanten
 * unten anpassen (NOTIFY_EMAIL, SHARED_TOKEN) und SHARED_TOKEN identisch in
 * enhance.js eintragen.
 */

// ==== Anpassen ====
var NOTIFY_EMAIL = 'dominik@thewhykings.com';       // wohin die Benachrichtigung geht
var SHARED_TOKEN = 'SPIELMAEUSE_2026';              // muss mit enhance.js übereinstimmen (weicher Schutz)
var SHEET_NAME   = 'Eintraege';                     // Tab im Sheet

var HEADERS = ['timestamp', 'type', 'family', 'adults', 'kids', 'category', 'what', 'amount', 'note'];

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
  }
  return sh;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function clean_(s, max) {
  s = (s == null ? '' : String(s)).trim();
  return s.slice(0, max || 120);
}

function doGet() {
  var rows = sheet_().getDataRange().getValues();
  rows.shift(); // header
  var rsvp = [], picknick = [];
  rows.forEach(function (r) {
    var o = {};
    HEADERS.forEach(function (h, i) { o[h] = r[i]; });
    if (o.type === 'rsvp') rsvp.push({ family: o.family, adults: o.adults, kids: o.kids });
    else if (o.type === 'picknick') picknick.push({ category: o.category, what: o.what, amount: o.amount, family: o.family, note: o.note });
  });
  return json_({ ok: true, rsvp: rsvp, picknick: picknick });
}

function doPost(e) {
  var data;
  try { data = JSON.parse(e.postData.contents); }
  catch (err) { return json_({ ok: false, error: 'bad_json' }); }

  if (clean_(data.token) !== SHARED_TOKEN) return json_({ ok: false, error: 'forbidden' });

  var type = data.type === 'picknick' ? 'picknick' : 'rsvp';
  var family = clean_(data.family, 80);
  if (!family) return json_({ ok: false, error: 'family_required' });

  var row;
  if (type === 'picknick') {
    var what = clean_(data.what, 80);
    if (!what) return json_({ ok: false, error: 'what_required' });
    row = { type: 'picknick', family: family, category: clean_(data.category, 40),
            what: what, amount: clean_(data.amount, 40), note: clean_(data.note, 200),
            adults: '', kids: '' };
  } else {
    row = { type: 'rsvp', family: family,
            adults: clean_(data.adults, 6), kids: clean_(data.kids, 6),
            category: '', what: '', amount: '', note: clean_(data.note, 200) };
  }

  var ts = new Date();
  sheet_().appendRow(HEADERS.map(function (h) { return h === 'timestamp' ? ts : (row[h] || ''); }));

  try {
    var subj, body;
    if (type === 'picknick') {
      subj = '🧺 Picknick: ' + family + ' bringt ' + row.what;
      body = family + ' bringt mit:\n\n' +
             '  ' + row.what + (row.amount ? ' (' + row.amount + ')' : '') + '\n' +
             (row.category ? '  Kategorie: ' + row.category + '\n' : '') +
             (row.note ? '  Notiz: ' + row.note + '\n' : '');
    } else {
      subj = '✅ Zusage: ' + family;
      body = family + ' ist dabei.\n\n' +
             (row.adults ? '  Erwachsene: ' + row.adults + '\n' : '') +
             (row.kids ? '  Kinder: ' + row.kids + '\n' : '') +
             (row.note ? '  Notiz: ' + row.note + '\n' : '');
    }
    body += '\nEingegangen: ' + ts.toLocaleString('de-DE') + '\n(Spielmäuse am See)';
    MailApp.sendEmail(NOTIFY_EMAIL, subj, body);
  } catch (mailErr) { /* Mail-Fehler soll das Speichern nicht verhindern */ }

  return json_({ ok: true });
}
