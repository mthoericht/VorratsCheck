# MUI Migration Execution Guide

Dieses Dokument ist die operative Grundlage fuer die schrittweise Migration mit dem Agenten.
Es ist bewusst so strukturiert, dass jeder Schritt einzeln abgearbeitet, geprueft und dokumentiert werden kann.

> Strategischer Gesamtplan: `docs/mui-migration-plan.md`

---

## 1) Arbeitsmodus fuer die Migration

Wir arbeiten in kleinen, reviewbaren Inkrementen mit festem Ablauf:

1. **Scope setzen** (nur 1 kleiner Block, z. B. 1-3 Komponenten oder 1 Seite)
2. **Implementieren**
3. **Qualitaets-Gates ausfuehren** (Lint, Tests, Storybook, AXE, Responsive)
4. **Ergebnis dokumentieren**
5. **Erst dann** naechsten Block starten

Wichtig:

- Keine Big-Bang-Merges
- Keine Vermischung vieler Seiten in einem Schritt
- Jeder Schritt muss einen klaren "done/not done"-Status haben

---

## 2) Quality Gates (verpflichtend pro Schritt)

Jeder abgeschlossene Schritt muss diese Gates erfuellen:

1. **Build/Lint**
   - `npm run lint`

2. **Unit/Component Tests**
   - `npm run test:run`

3. **Storybook**
   - Story fuer neu/angepasste UI pruefen (mindestens visuelle Smoke-Pruefung)
   - Optional lokal: `npm run storybook`

4. **AXE / Accessibility**
   - `npm run test:a11y`
   - Zusaetzlich manuell pruefen:
     - Tastaturfokus sichtbar
     - Dialog-Focus-Trap
     - Label/Input Zuordnung
     - Kontrast in Light und Dark

5. **Responsive**
   - Mindestens folgende Breakpoints manuell pruefen:
     - Mobile: 360x800
     - Tablet: 768x1024
     - Desktop: 1440x900
   - Kritische Faelle:
     - Dialoge/Drawer nicht abgeschnitten
     - Tabellen/Karten scrollen sinnvoll
     - Navbar/Layout umbrechen korrekt

Wenn ein Gate fehlschlaegt, gilt der Schritt als **nicht abgeschlossen**.

---

## 3) Standard-Template fuer jeden Migrationsschritt

Fuer jeden Schritt wird ein Eintrag in Abschnitt 6 angelegt/aktualisiert:

- **ID:** `MUI-XX`
- **Scope:** Welche Dateien/Komponenten
- **Ziel:** Was soll danach auf MUI laufen
- **Aenderungen:** Kurzliste der konkreten Anpassungen
- **Checks:** Lint/Test/AXE/Responsive/Storybook
- **Ergebnis:** Done, Blocked oder Follow-up noetig
- **Risiken/Notizen:** Besonderheiten fuer naechste Schritte

---

## 4) Sequenz (empfohlene Reihenfolge)

Die Reihenfolge ist auf Risiko-Minimierung und schnelle Sichtbarkeit optimiert.

### Wave A - Fundament

- `MUI-01` MUI Dependencies + Theme-Basis + Provider Integration
- `MUI-02` Core Wrapper: Button, Input, Card, Dialog, Select
- `MUI-03` Storybook Stories fuer Core Wrapper + A11y-Baseline

### Wave B - Seiten mit hohem Impact

- `MUI-04` Login
- `MUI-05` Signup
- `MUI-06` Dashboard
- `MUI-07` Inventory (inkl. Dialog + Filter)
- `MUI-08` Must-Have
- `MUI-09` Wishlist

### Wave C - Restseiten und Navigation

- `MUI-10` Deals
- `MUI-11` Recipes
- `MUI-12` Settings (Categories, Appearance, Language)
- `MUI-13` Layout / Navigation / Menues

### Wave D - Cleanup

- `MUI-14` Alte UI-Primitives ausduennen
- `MUI-15` Abhaengigkeiten bereinigen (Radix/Tailwind-Helfer soweit moeglich)
- `MUI-16` Finale Regression + Responsive + AXE Gesamtabnahme

---

## 5) Definition of Done pro Schritt

Ein Schritt ist nur "Done", wenn:

- Scope ist vollstaendig umgesetzt
- keine offensichtliche visuelle Regression im betroffenen Bereich
- alle Quality Gates erfolgreich oder sauber dokumentiert mit Follow-up
- Eintrag in Abschnitt 6 vollstaendig aktualisiert

---

## 6) Arbeitsprotokoll (laufend fortschreiben)

## MUI-01 - Foundation

- **Status:** TODO
- **Scope:** MUI Pakete, Theme, Provider
- **Dateien (erwartet):** `package.json`, `src/main.tsx` oder `src/app/App.tsx`, neues Theme-Modul
- **Ziel:** MUI parallel lauffaehig machen (ohne bestehende UI zu brechen)
- **Checks:**
  - Lint: TODO
  - Test run: TODO
  - Storybook smoke: TODO
  - AXE: TODO
  - Responsive smoke: TODO
- **Notizen:** Tokens aus `src/styles/theme.css` auf MUI Theme mappen.

## MUI-02 - Core Wrapper Set 1

- **Status:** TODO
- **Scope:** `Button`, `Input`, `Card`, `Dialog`, `Select`
- **Ziel:** Kerninteraktionen ueber MUI abstrahieren
- **Checks:**
  - Lint: TODO
  - Test run: TODO
  - Storybook smoke: TODO
  - AXE: TODO
  - Responsive smoke: TODO
- **Notizen:** APIs moeglichst kompatibel zum bisherigen Aufruf halten.

## MUI-03 - Storybook + A11y Baseline

- **Status:** TODO
- **Scope:** Stories fuer Core Wrapper, a11y-pruefbare Referenzfaelle
- **Ziel:** Regressionen frueh visuell und via AXE erkennen
- **Checks:**
  - Lint: TODO
  - Test run: TODO
  - Storybook smoke: TODO
  - AXE: TODO
  - Responsive smoke: TODO
- **Notizen:** Mindestens Light/Dark Variationen in Stories.

## MUI-04 - Login

- **Status:** TODO
- **Scope:** `src/app/pages/Login.tsx` + verwendete Komponenten
- **Ziel:** Login UI auf MUI/Wrapper umstellen
- **Checks:**
  - Lint: TODO
  - Test run: TODO
  - Storybook smoke: TODO
  - AXE: TODO
  - Responsive smoke: TODO
- **Notizen:** Fokus-Reihenfolge und Fehlermeldungsdarstellung pruefen.

## MUI-05 - Signup

- **Status:** TODO
- **Scope:** `src/app/pages/Signup.tsx` + verwendete Komponenten
- **Ziel:** Signup UI auf MUI/Wrapper umstellen
- **Checks:** alle TODO
- **Notizen:** Konsistenz zu Login sicherstellen.

## MUI-06 - Dashboard

- **Status:** TODO
- **Scope:** Dashboard + Kartenkomponenten
- **Ziel:** Stat-/Alert-/Action-Cards in MUI konsistent darstellen
- **Checks:** alle TODO
- **Notizen:** Light/Dark Kontrast bei Statusfarben pruefen.

## MUI-07 - Inventory

- **Status:** TODO
- **Scope:** Inventory Seite + `InventoryItemFormDialog`, Filter-Komponenten
- **Ziel:** Form- und Dialog-Patterns stabil migrieren
- **Checks:** alle TODO
- **Notizen:** Responsive Verhalten bei langen Listen und Filtern pruefen.

## MUI-08 - Must-Have

- **Status:** TODO
- **Scope:** Must-Have Seite + Dialog/Stats/Card
- **Ziel:** Konsistente Darstellung mit Inventory/Wishlist
- **Checks:** alle TODO
- **Notizen:** Badge/Farbsemantik fuer low stock pruefen.

## MUI-09 - Wishlist

- **Status:** TODO
- **Scope:** Wishlist Seite + Priority Sections + Dialog
- **Ziel:** Prioritaetsvisualisierung MUI-konsistent
- **Checks:** alle TODO
- **Notizen:** Gruppierte Bereiche auf Mobile pruefen.

## MUI-10 - Deals

- **Status:** TODO
- **Scope:** Deals Seite + Cards + Filterbar
- **Ziel:** Filter und Match-Hinweise sauber migrieren
- **Checks:** alle TODO
- **Notizen:** Kartenhoehen und CTA-Ausrichtung responsive testen.

## MUI-11 - Recipes

- **Status:** TODO
- **Scope:** Recipe Seite + Dialoge (view/edit/import)
- **Ziel:** Komplexe Dialogfluesse stabil migrieren
- **Checks:** alle TODO
- **Notizen:** Lange Inhalte + Scrollverhalten in Dialogen pruefen.

## MUI-12 - Settings

- **Status:** TODO
- **Scope:** Settings + Unterseiten
- **Ziel:** Formulare/Navigation in Settings konsistent
- **Checks:** alle TODO
- **Notizen:** Appearance/Language Umschaltung funktional gegentesten.

## MUI-13 - Layout and Navigation

- **Status:** TODO
- **Scope:** `src/app/components/Layout.tsx` + Menues
- **Ziel:** Header, Nav, User-Menue final auf MUI
- **Checks:** alle TODO
- **Notizen:** Tastaturnavigation im Menue und Fokus-Management pruefen.

## MUI-14 - UI Cleanup

- **Status:** TODO
- **Scope:** nicht mehr genutzte UI-Wrapper entfernen
- **Ziel:** toter Code raus, Komplexitaet runter
- **Checks:** alle TODO
- **Notizen:** nur entfernen, wenn keine Importe mehr bestehen.

## MUI-15 - Dependency Cleanup

- **Status:** TODO
- **Scope:** Radix/Tailwind-Helfer reduzieren
- **Ziel:** Paketlandschaft vereinfachen
- **Checks:** alle TODO
- **Notizen:** immer in kleinen Schritten entfernen und testen.

## MUI-16 - Final Acceptance

- **Status:** TODO
- **Scope:** gesamtes Frontend
- **Ziel:** finale Abnahme fuer MUI Migration
- **Checks:**
  - Lint: TODO
  - Test run: TODO
  - Storybook smoke: TODO
  - AXE: TODO
  - Responsive smoke: TODO
- **Notizen:** finale manuelle End-to-End Smoke-Session.

---

## 7) Arbeitsregeln fuer die Zusammenarbeit mit dem Agenten

Damit die schrittweise Zusammenarbeit stabil bleibt:

- Pro Anfrage nur einen Schritt (oder klar benannte Teilmenge) umsetzen.
- Ich aktualisiere nach jedem Schritt dieses Dokument (Status, Checks, Notizen).
- Bei Blockern wird der Schritt auf **BLOCKED** gesetzt mit konkretem naechsten Vorschlag.
- Bei offenen Restpunkten wird **FOLLOW-UP** dokumentiert, statt stillschweigend weiterzugehen.

Empfohlener Prompt pro Iteration:

`Bitte setze MUI-XX um und aktualisiere danach docs/mui-migration-execution-guide.md inkl. Checks und Status.`

