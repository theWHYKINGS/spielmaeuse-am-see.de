# Backend einrichten (Google Sheet + Apps Script)

Einmalig ~5 Minuten. Danach speichern die Formulare in dein Google Sheet,
zeigen die Einträge live auf der Seite und schicken dir bei jeder Einsendung
eine E-Mail. Alles kostenlos, die Daten liegen in deinem Google-Konto.

## 1. Google Sheet anlegen
1. https://sheets.new öffnen (neue leere Tabelle).
2. Oben einen Namen geben, z. B. **„Spielmäuse am See – Anmeldungen"**.

## 2. Apps Script einfügen
1. Im Sheet: **Erweiterungen → Apps Script**.
2. Den vorhandenen Code (`function myFunction() {}`) komplett löschen.
3. Den ganzen Inhalt von **`backend/Code.gs`** hineinkopieren.
4. Oben in der Datei bei Bedarf anpassen:
   - `NOTIFY_EMAIL` – wohin die Benachrichtigung geht (Standard: dominik@thewhykings.com)
   - `SHARED_TOKEN` – frei wählbares Kennwort; **muss identisch** in `enhance.js`
     stehen (macht Claude beim Verdrahten). Standard: `SPIELMAEUSE_2026`.
5. **Speichern** (Disketten-Symbol).

## 3. Als Web-App veröffentlichen
1. Oben rechts **Bereitstellen → Neue Bereitstellung**.
2. Zahnrad → Typ **Web-App**.
3. Einstellen:
   - **Ausführen als:** Ich (dein Konto)
   - **Zugriff:** **Alle** ( „Anyone" ) — nötig, damit die Seite ohne Login speichern kann.
4. **Bereitstellen**. Beim ersten Mal fragt Google nach Berechtigung
   (Sheet schreiben + E-Mail senden) → **Zulassen**.
   - Falls „Diese App wurde nicht überprüft" erscheint: **Erweitert → … (unsicher) öffnen → Zulassen**.
     Das ist dein eigenes Skript, das ist ok.
5. Google zeigt eine **Web-App-URL** an, die auf `…/exec` endet. **Diese URL kopieren.**

## 4. URL an Claude geben
Schick Claude die `…/exec`-URL. Claude trägt sie in `enhance.js` ein, deployt neu,
und testet einmal live (Testeintrag, dann wieder gelöscht). Ab da sind die
Formulare auf der Seite scharf.

## Später ändern
- **Inhalte/Start-Listen** (wer schon zugesagt hat, was schon mitgebracht wird):
  in `event-data.js` (`window.FAMILIES`, `window.CONTRIBUTIONS`). Über die Seite
  gemeldete Einträge stehen zusätzlich darunter.
- **Skript geändert?** In Apps Script erneut **Bereitstellen → Bereitstellung
  verwalten → Bearbeiten → Neue Version**, sonst greift die Änderung nicht.

## Hinweis Sicherheit
Die Seite ist passwortgeschützt, aber die Backend-URL steht (wie das Seiten-
Passwort) im Quelltext. Der `SHARED_TOKEN` hält nur zufälliges Rauschen ab — für
eine private Familienseite ok, aber kein echter Schutz. Keine sensiblen Daten
abfragen.
