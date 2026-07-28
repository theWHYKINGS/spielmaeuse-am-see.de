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
  weatherPlan: "Bei schlechtem Wetter entscheidet jede Familie für sich – schaut morgens kurz in die Signal-Gruppe.",
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
  { name: "Familie Candar/Sesselmann", adults: null, kids: null },
  { name: "Familie Gudd", adults: null, kids: null },
  { name: "Familie Haselbauer", adults: null, kids: null },
  { name: "Familie Heinz", adults: null, kids: null },
  { name: "Familie Henke", adults: null, kids: null },
  { name: "Familie Käsbauer/Müffling", adults: null, kids: null },
  { name: "Familie Lefere", adults: null, kids: null },
  { name: "Familie Marshall/Mostert", adults: null, kids: null },
  { name: "Familie Reichert", adults: null, kids: null }
];

window.CONTRIBUTIONS = [
  { category: "Herzhaft", items: [] },
  { category: "Süß", items: [
    { what: "Brownies", amount: "2 Bleche", family: "Familie Haselbauer", note: null },
    { what: "Muffins", amount: null, family: "Familie Haselbauer", note: null }
  ]},
  { category: "Obst & Gemüse", items: [] },
  { category: "Getränke", items: [
    { what: "Aperol Spritz", amount: null, family: "Familie Haselbauer", note: "für die großen Mäuse" }
  ]},
  { category: "Geschirr & Nützliches", items: [] }
];

// lat/lng eintragen → Marker erscheint automatisch. URLs sind bestätigt.
window.MAP_POINTS = [
  { id: "treffpunkt", label: "Unser Mäuse-Treffpunkt", glyph: "★", color: "#E58D78", primary: true, lat: 48.19911, lng: 11.42178, url: "https://maps.app.goo.gl/DqGHp4KkU9VFazPf9" },
  { id: "parkplatz",  label: "Parkplatz Süd", glyph: "P",  color: "#2F6672", lat: 48.19284, lng: 11.42085, url: "https://maps.app.goo.gl/hnYRj4DnoZGB6NHJ9" },
  { id: "parkplatz2", label: "Parkplatz West", glyph: "P", color: "#2F6672", labelPos: "above", lat: 48.19949, lng: 11.41303, url: "https://www.google.com/maps?q=48.19949,11.41303" },
  { id: "kiosk",      label: "Kiosk", glyph: "K", color: "#F4C965", labelPos: "above", lat: 48.20036, lng: 11.41430, url: "https://maps.app.goo.gl/K6eSJMqBrfSi4wX47" },
  { id: "toiletten",  label: "Toiletten", glyph: "WC", color: "#A8C6A0", labelPos: "above", lat: 48.20077, lng: 11.42181, url: "https://maps.app.goo.gl/b9dtb4gsLjx44iaz8" },
  { id: "toiletten2", label: "Ausweich-Toiletten", glyph: "WC", color: "#A8C6A0", lat: 48.19841, lng: 11.41268, url: "https://maps.app.goo.gl/Y7SkRWjbec4bPbdE9" },
  { id: "spielplatz", label: "Spielplatz", glyph: "S", color: "#A9DDE7", lat: 48.20063, lng: 11.42047, url: "https://maps.app.goo.gl/7McXnQCWdsjqCKBNA" }
];
