// ─── Zentrale Datendatei: alle Inhalte hier pflegen ───
window.EVENT_DATA = {
  title: "Spielmäuse am See",
  password: "Keks2026",             // Mäuse-Parole (Hinweis: nur weicher Schutz, s. Chat)
  dateISO: "2026-08-07",            // YYYY-MM-DD
  dateLabel: "Freitag, 7. August 2026",
  startTime: "12:30",
  endLabel: "Open End",
  meetingPoint: {
    label: "Ostufer (siehe Karte)",
    latitude: 48.19911,             // aus der Übersichtsgrafik georeferenziert
    longitude: 11.42178,
    googleMapsUrl: "https://maps.app.goo.gl/DqGHp4KkU9VFazPf9",
    appleMapsUrl: null
  },
  arrivalNote: "[ANFAHRTSHINWEIS – z. B. Parken, Fußweg]",
  weatherPlan: "Bei schlechtem Wetter entscheidet jede Familie für sich. :)",
  contactLabel: "Signal-Elterngruppe",
  contactUrl: null,                 // bestätigter Link, sonst null
  mainSiteUrl: "https://www.laimer-spielmaeuse.de/",
  mapCenter: { latitude: 48.198, longitude: 11.4189, zoom: 15 } // Lußsee, nur Kartenausschnitt
};

window.SCHEDULE = [
  { time: "12:30", title: "Ankommen & Aufbauen", note: "Decken ausbreiten, Plätzchen sichern", icon: "blanket" },
  { time: "ab 13:00", title: "Schwimmspaß & Mäusefütterung", note: "Ab ins Wasser – und ans Picknick", icon: "boat" },
  { time: "danach", title: "Open End", note: "Wir bleiben, solange es schön ist", icon: "sun" }
];

window.FAMILIES = [
  { name: "Familie Candar/Sesselmann", adults: 1, kids: 1 },
  { name: "Familie Marshall/Mostert", adults: 2, kids: 1 },
  { name: "Familie Reichert", adults: 2, kids: 1 },
  { name: "Familie Haselbauer", adults: 2, kids: 1 },
  { name: "Familie Sibler", adults: 2, kids: 2 },
  { name: "Familie Riedel", adults: 1, kids: 1 },
  { name: "Familie Henke", adults: 2, kids: 2 }
];

window.CONTRIBUTIONS = [
  { category: "Herzhaft", items: [
    { what: "Blätterteigschnecken", amount: "20", family: "Familie Candar/Sesselmann", note: null },
    { what: "Nudelsalat", amount: "1 Schüssel", family: "Familie Sibler", note: null },
    { what: "Brezn u. Obazdn", amount: "10/10", family: "Familie Riedel", note: null }
  ]},
  { category: "Süß", items: [
    { what: "Brownies", amount: "2 Bleche", family: "Familie Haselbauer", note: null },
    { what: "Muffins", amount: null, family: "Familie Haselbauer", note: null }
  ]},
  { category: "Obst & Gemüse", items: [
    { what: "Obstspieße", amount: null, family: "Familie Reichert", note: null }
  ]},
  { category: "Getränke", items: [
    { what: "Aperol Spritz", amount: null, family: "Familie Haselbauer", note: "für die großen Mäuse" },
    { what: "Orangen & Apfelsaft", amount: "6 L", family: "Familie Marshall/Mostert", note: null },
    { what: "2 Sixpack Bier", amount: null, family: "Familie Reichert", note: null },
    { what: "Alkfree Bier", amount: null, family: "Familie Riedel", note: null }
  ]},
  { category: "Geschirr & Nützliches", items: [
    { what: "Musikbox", amount: null, family: "Familie Haselbauer", note: null }
  ]}
];

// lat/lng eintragen → Marker erscheint automatisch. URLs sind bestätigt.
window.MAP_POINTS = [
  { id: "treffpunkt", label: "Unser Mäuse-Treffpunkt", glyph: "★", color: "#E58D78", primary: true, lat: 48.19911, lng: 11.42178, url: "https://maps.app.goo.gl/DqGHp4KkU9VFazPf9" },
  { id: "parkplatz",  label: "Parkplatz Süd", glyph: "P",  color: "#2F6672", labelPos: "above", lat: 48.19284, lng: 11.42085, url: "https://maps.app.goo.gl/hnYRj4DnoZGB6NHJ9" },
  { id: "parkplatz2", label: "Parkplatz West", glyph: "P", color: "#2F6672", labelPos: "right", lat: 48.19949, lng: 11.41303, url: "https://www.google.com/maps?q=48.19949,11.41303" },
  { id: "kiosk",      label: "Kiosk", glyph: "K", color: "#F4C965", labelPos: "above", lat: 48.20036, lng: 11.41430, url: "https://maps.app.goo.gl/K6eSJMqBrfSi4wX47" },
  { id: "toiletten",  label: "Toiletten", glyph: "WC", color: "#A8C6A0", labelPos: "above", lat: 48.20077, lng: 11.42181, url: "https://maps.app.goo.gl/b9dtb4gsLjx44iaz8" },
  { id: "toiletten2", label: "Ausweich-Toiletten", glyph: "WC", color: "#A8C6A0", lat: 48.19841, lng: 11.41268, url: "https://maps.app.goo.gl/Y7SkRWjbec4bPbdE9" },
  { id: "spielplatz", label: "Spielplatz", glyph: "S", color: "#A9DDE7", lat: 48.20063, lng: 11.42047, url: "https://maps.app.goo.gl/7McXnQCWdsjqCKBNA" }
];

// ─── Fotogalerie: thumb = Vorschau (Web), full = Original (Download) ───
window.GALLERY = [
  {"thumb":"fotos/vorschau/01.jpg","full":"uploads/fotos-1786221319339-c696.jpg","name":"Spielmaeuse-am-See-01.jpg"},
  {"thumb":"fotos/vorschau/02.jpg","full":"uploads/fotos-1786221319349-hiox.jpg","name":"Spielmaeuse-am-See-02.jpg"},
  {"thumb":"fotos/vorschau/03.jpg","full":"uploads/fotos-1786221320361-0df6.jpg","name":"Spielmaeuse-am-See-03.jpg"},
  {"thumb":"fotos/vorschau/04.jpg","full":"uploads/fotos-1786221320370-y89o.jpg","name":"Spielmaeuse-am-See-04.jpg"},
  {"thumb":"fotos/vorschau/05.jpg","full":"uploads/fotos-1786221319464-ygk9.jpg","name":"Spielmaeuse-am-See-05.jpg"},
  {"thumb":"fotos/vorschau/06.jpg","full":"uploads/fotos-1786221304781-vlo6.jpg","name":"Spielmaeuse-am-See-06.jpg"},
  {"thumb":"fotos/vorschau/07.jpg","full":"uploads/fotos-1786221304812-1dm7.jpg","name":"Spielmaeuse-am-See-07.jpg"},
  {"thumb":"fotos/vorschau/08.jpg","full":"uploads/fotos-1786221304833-kk2r.jpg","name":"Spielmaeuse-am-See-08.jpg"},
  {"thumb":"fotos/vorschau/09.jpg","full":"uploads/fotos-1786221318351-b3pr.jpg","name":"Spielmaeuse-am-See-09.jpg"},
  {"thumb":"fotos/vorschau/10.jpg","full":"uploads/fotos-1786221304876-xvkz.jpg","name":"Spielmaeuse-am-See-10.jpg"},
  {"thumb":"fotos/vorschau/11.jpg","full":"uploads/fotos-1786221319455-c8st.jpg","name":"Spielmaeuse-am-See-11.jpg"},
  {"thumb":"fotos/vorschau/12.jpg","full":"uploads/fotos-1786221319462-8cka.jpg","name":"Spielmaeuse-am-See-12.jpg"},
  {"thumb":"fotos/vorschau/13.jpg","full":"uploads/fotos-1786221304961-o10m.jpg","name":"Spielmaeuse-am-See-13.jpg"},
  {"thumb":"fotos/vorschau/14.jpg","full":"uploads/fotos-1786221319459-axu7.jpg","name":"Spielmaeuse-am-See-14.jpg"},
  {"thumb":"fotos/vorschau/15.jpg","full":"uploads/fotos-1786221305019-d5nj.jpg","name":"Spielmaeuse-am-See-15.jpg"},
  {"thumb":"fotos/vorschau/16.jpg","full":"uploads/fotos-1786221319390-rizs.jpg","name":"Spielmaeuse-am-See-16.jpg"},
  {"thumb":"fotos/vorschau/17.jpg","full":"uploads/fotos-1786221305066-5zbk.jpg","name":"Spielmaeuse-am-See-17.jpg"},
  {"thumb":"fotos/vorschau/18.jpg","full":"uploads/fotos-1786221317350-fc45.jpg","name":"Spielmaeuse-am-See-18.jpg"},
  {"thumb":"fotos/vorschau/19.jpg","full":"uploads/fotos-1786221305107-8g1z.jpg","name":"Spielmaeuse-am-See-19.jpg"},
  {"thumb":"fotos/vorschau/20.jpg","full":"uploads/fotos-1786221318356-yz79.jpg","name":"Spielmaeuse-am-See-20.jpg"},
  {"thumb":"fotos/vorschau/21.jpg","full":"uploads/DSCF0021.jpg","name":"Spielmaeuse-am-See-21.jpg"},
  {"thumb":"fotos/vorschau/22.jpg","full":"uploads/DSCF0022.jpg","name":"Spielmaeuse-am-See-22.jpg"},
  {"thumb":"fotos/vorschau/23.jpg","full":"uploads/DSCF0023.jpg","name":"Spielmaeuse-am-See-23.jpg"},
  {"thumb":"fotos/vorschau/24.jpg","full":"uploads/DSCF0024.jpg","name":"Spielmaeuse-am-See-24.jpg"},
  {"thumb":"fotos/vorschau/25.jpg","full":"uploads/DSCF0025.jpg","name":"Spielmaeuse-am-See-25.jpg"},
  {"thumb":"fotos/vorschau/26.jpg","full":"uploads/DSCF0026.jpg","name":"Spielmaeuse-am-See-26.jpg"},
  {"thumb":"fotos/vorschau/27.jpg","full":"uploads/DSCF0027.jpg","name":"Spielmaeuse-am-See-27.jpg"},
  {"thumb":"fotos/vorschau/28.jpg","full":"uploads/DSCF0028.jpg","name":"Spielmaeuse-am-See-28.jpg"},
  {"thumb":"fotos/vorschau/29.jpg","full":"uploads/DSCF0029.jpg","name":"Spielmaeuse-am-See-29.jpg"},
  {"thumb":"fotos/vorschau/30.jpg","full":"uploads/DSCF0030.jpg","name":"Spielmaeuse-am-See-30.jpg"},
  {"thumb":"fotos/vorschau/31.jpg","full":"uploads/DSCF0031.jpg","name":"Spielmaeuse-am-See-31.jpg"},
  {"thumb":"fotos/vorschau/32.jpg","full":"uploads/DSCF0032.jpg","name":"Spielmaeuse-am-See-32.jpg"},
  {"thumb":"fotos/vorschau/33.jpg","full":"uploads/DSCF0033.jpg","name":"Spielmaeuse-am-See-33.jpg"},
  {"thumb":"fotos/vorschau/34.jpg","full":"uploads/DSCF0034.jpg","name":"Spielmaeuse-am-See-34.jpg"},
  {"thumb":"fotos/vorschau/35.jpg","full":"uploads/DSCF0037.JPG","name":"Spielmaeuse-am-See-35.jpg"},
  {"thumb":"fotos/vorschau/36.jpg","full":"uploads/DSCF0038.JPG","name":"Spielmaeuse-am-See-36.jpg"},
  {"thumb":"fotos/vorschau/37.jpg","full":"uploads/DSCF0040.JPG","name":"Spielmaeuse-am-See-37.jpg"},
  {"thumb":"fotos/vorschau/38.jpg","full":"uploads/DSCF0041.JPG","name":"Spielmaeuse-am-See-38.jpg"},
  {"thumb":"fotos/vorschau/39.jpg","full":"uploads/DSCF0042.JPG","name":"Spielmaeuse-am-See-39.jpg"},
  {"thumb":"fotos/vorschau/40.jpg","full":"uploads/DSCF0048.JPG","name":"Spielmaeuse-am-See-40.jpg"},
  {"thumb":"fotos/vorschau/41.jpg","full":"uploads/DSCF0049.JPG","name":"Spielmaeuse-am-See-41.jpg"},
  {"thumb":"fotos/vorschau/42.jpg","full":"uploads/DSCF0035.JPG","name":"Spielmaeuse-am-See-42.jpg"},
  {"thumb":"fotos/vorschau/43.jpg","full":"uploads/DSCF0039.JPG","name":"Spielmaeuse-am-See-43.jpg"},
  {"thumb":"fotos/vorschau/46.jpg","full":"uploads/DSCF0050.JPG","name":"Spielmaeuse-am-See-46.jpg"},
  {"thumb":"fotos/vorschau/47.jpg","full":"uploads/DSCF0051.JPG","name":"Spielmaeuse-am-See-47.jpg"},
  {"thumb":"fotos/vorschau/48.jpg","full":"uploads/DSCF0052.JPG","name":"Spielmaeuse-am-See-48.jpg"},
  {"thumb":"fotos/vorschau/49.jpg","full":"uploads/DSCF0053.JPG","name":"Spielmaeuse-am-See-49.jpg"},
  {"thumb":"fotos/vorschau/50.jpg","full":"uploads/DSCF0054.JPG","name":"Spielmaeuse-am-See-50.jpg"},
  {"thumb":"fotos/vorschau/51.jpg","full":"uploads/DSCF0055.JPG","name":"Spielmaeuse-am-See-51.jpg"},
  {"thumb":"fotos/vorschau/52.jpg","full":"uploads/DSCF0056.JPG","name":"Spielmaeuse-am-See-52.jpg"},
  {"thumb":"fotos/vorschau/53.jpg","full":"uploads/DSCF0057.JPG","name":"Spielmaeuse-am-See-53.jpg"},
  {"thumb":"fotos/vorschau/54.jpg","full":"uploads/DSCF0060.JPG","name":"Spielmaeuse-am-See-54.jpg"},
  {"thumb":"fotos/vorschau/55.jpg","full":"uploads/DSCF0061.JPG","name":"Spielmaeuse-am-See-55.jpg"},
  {"thumb":"fotos/vorschau/56.jpg","full":"uploads/DSCF0062.JPG","name":"Spielmaeuse-am-See-56.jpg"},
  {"thumb":"fotos/vorschau/57.jpg","full":"uploads/DSCF0063.JPG","name":"Spielmaeuse-am-See-57.jpg"},
  {"thumb":"fotos/vorschau/58.jpg","full":"uploads/DSCF0064.JPG","name":"Spielmaeuse-am-See-58.jpg"},
  {"thumb":"fotos/vorschau/59.jpg","full":"uploads/DSCF0065.JPG","name":"Spielmaeuse-am-See-59.jpg"},
  {"thumb":"fotos/vorschau/60.jpg","full":"uploads/DSCF0069.JPG","name":"Spielmaeuse-am-See-60.jpg"},
  {"thumb":"fotos/vorschau/61.jpg","full":"uploads/DSCF0066.JPG","name":"Spielmaeuse-am-See-61.jpg"},
  {"thumb":"fotos/vorschau/62.jpg","full":"uploads/DSCF0067.JPG","name":"Spielmaeuse-am-See-62.jpg"},
  {"thumb":"fotos/vorschau/63.jpg","full":"uploads/DSCF0068.JPG","name":"Spielmaeuse-am-See-63.jpg"},
  {"thumb":"fotos/vorschau/64.jpg","full":"uploads/DSCF0070.JPG","name":"Spielmaeuse-am-See-64.jpg"},
  {"thumb":"fotos/vorschau/65.jpg","full":"uploads/DSCF0071.JPG","name":"Spielmaeuse-am-See-65.jpg"},
  {"thumb":"fotos/vorschau/66.jpg","full":"uploads/DSCF0072.JPG","name":"Spielmaeuse-am-See-66.jpg"},
  {"thumb":"fotos/vorschau/67.jpg","full":"uploads/DSCF0073.JPG","name":"Spielmaeuse-am-See-67.jpg"}
];
