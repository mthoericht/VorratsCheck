# MUI-Migrationsplan fuer VorratsCheck

## Zielbild

Migration der Frontend-UI von `shadcn/Radix + Tailwind` auf `MUI` (Material UI), ohne funktionale Regressionen in den bestehenden Flows:

- Auth (`/login`, `/signup`)
- Dashboard
- Inventory
- Must-Have
- Wishlist
- Deals
- Recipes
- Settings (Categories, Appearance, Language)

Der Backend- und Store-Layer bleiben unveraendert. Fokus ist der UI-Stack.

## Aufwand (realistisch)

Je nach Teamgroesse, Verfuegbarkeit und Testtiefe:

- **MVP-Migration (nur Kernkomponenten + Seiten lauffaehig):** ca. `8-15 PT`
- **Vollstaendige saubere Migration (inkl. visuellem Feinschliff, A11y- und Regression-Absicherung):** ca. `15-30 PT`

> PT = Personentage.

## Scope und Leitplanken

- Keine Aenderung an API-Vertraegen, Stores oder Business-Logik.
- Schrittweise Migration statt Big-Bang.
- Tailwind darf in einer Uebergangsphase parallel bestehen.
- Der bestehende Dark/Light/System-Mode bleibt erhalten.
- UI-Texte und i18n-Keys bleiben unveraendert.

## Bestand (Ist-Zustand)

Aktuell existieren:

- ein umfangreiches Primitives-Layer unter `src/app/components/ui/` (ca. 50 Komponenten)
- viele Feature-Komponenten unter `src/app/components/**`
- konsistente Nutzung von `className` und Tailwind-Klassen
- Radix-basierte Patterns fuer Dialoge, Popovers, Selects, Menus, Tabs usw.

## Migrationsstrategie in 3 Phasen

## Phase 1 - Fundament (ca. 2-4 PT)

Ziel: MUI technisch einziehen, ohne sofort alles umzubauen.

1. Dependencies und Basiskonfiguration
   - `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled` hinzufuegen.
   - Optional: `@mui/x-date-pickers` nur wenn Date-Picker aus MUI gewuenscht.

2. Theme-Bruecke bauen
   - Zentrales MUI-Theme definieren (Palette, Typografie, Spacing, Radius, Shadows).
   - Mapping der bestehenden CSS-Variablen aus `src/styles/theme.css` auf MUI-Theme-Werte.
   - Dark/Light/System mit bestehendem Settings-Flow synchronisieren.

3. App-Integration
   - `ThemeProvider` + `CssBaseline` in `src/app/App.tsx` oder `src/main.tsx` einhaengen.
   - Sicherstellen, dass bestehende Seiten weiterhin rendern.

4. Architektur-Regeln festlegen
   - Festlegen, ob Feature-Code MUI direkt nutzt oder ueber interne Wrapper (empfohlen).
   - Migrationsrichtlinie dokumentieren: wann `sx`, wann `styled`, wann Rest-Tailwind erlaubt ist.

Ergebnis:

- MUI laeuft parallel zur bestehenden UI.
- Theme und Dark Mode sind kompatibel.
- Keine sichtbaren Breaking Changes fuer User.

## Phase 2 - Kernkomponenten und High-Traffic-Seiten (ca. 6-12 PT)

Ziel: Haupt-User-Flows zuerst migrieren, Risiko frueh reduzieren.

### 2.1 Primitive-Layer priorisiert migrieren

Prioritaet A (zuerst):

- `button`, `input`, `textarea`, `label`
- `card`, `badge`, `alert`, `separator`
- `dialog`, `select`, `tabs`, `switch`, `checkbox`, `radio-group`
- `dropdown-menu` / `popover` (MUI `Menu`, `Popover`)

Prioritaet B:

- `table`, `tooltip`, `progress`, `avatar`, `skeleton`
- `sheet`/`drawer`, `accordion`, `breadcrumb`, `pagination`

Prioritaet C (spaeter oder optional):

- `carousel`, `chart`, `sidebar`, `resizable`, `command`, `input-otp`

### 2.2 Seiten in sinnvoller Reihenfolge migrieren

Empfohlene Reihenfolge:

1. `src/app/pages/Login.tsx`
2. `src/app/pages/Signup.tsx`
3. `src/app/pages/Dashboard.tsx`
4. `src/app/pages/Inventory.tsx`
5. `src/app/pages/MustHaveList.tsx`
6. `src/app/pages/WishList.tsx`
7. `src/app/pages/Deals.tsx`
8. `src/app/pages/Recipes.tsx`
9. `src/app/pages/Settings.tsx` + `src/app/components/settings/*`
10. `src/app/components/Layout.tsx`

Warum diese Reihenfolge:

- Auth + Dashboard geben frueh sichtbares Feedback.
- Inventory/Must-Have/Wishlist sind Kernnutzen der App.
- Recipes/Settings sind etwas detailreicher, aber funktional weniger kritisch fuer den Erstnutzen.

### 2.3 Tests waehrend der Phase

- Nach jedem groesseren Schritt: `npm run lint` und `npm run test:run`
- API-Tests (`npm run test:integration:api`) zur Sicherheit gegen unbeabsichtigte Seiteneffekte
- Storybook/A11y (`npm run storybook`, `npm run test:a11y`) fuer UI-Qualitaet

Ergebnis:

- Hauptseiten laufen auf MUI.
- Kern-UI-Layer ist konsolidiert.
- Bestehende Flows sind funktional abgesichert.

## Phase 3 - Bereinigung und Optimierung (ca. 3-8 PT)

Ziel: technische Schulden abbauen und UI stabilisieren.

1. Altes UI-Layer ausduennen
   - Nicht mehr benoetigte `src/app/components/ui/*`-Dateien entfernen.
   - Radix- und Tailwind-Hilfen abbauen, sofern nicht mehr genutzt.

2. Dependency-Cleanup
   - Ungenutzte `@radix-ui/*`, `class-variance-authority`, `tailwind-merge`, ggf. weitere Pakete entfernen.
   - Tailwind nur entfernen, wenn wirklich keine Abhaengigkeiten mehr bestehen.

3. Visuelle Politur
   - Spacing/Typografie angleichen.
   - Fokus-States, Keyboard-Navigation, Kontraste final pruefen.

4. Regression-Hardening
   - Kritische Flows manuell gegenchecken (Dialoge, Formvalidierung, Filter, Navigation).
   - Optional Snapshot/Visual Regression einfuehren.

Ergebnis:

- Konsistente MUI-basierte UI ohne Mischzustand.
- Schlankere Dependencies.
- Stabiler Zustand fuer weitere Feature-Entwicklung.

## Hauptrisiken und Gegenmassnahmen

1. **Verhaltensunterschiede bei Overlays**
   - Risiko: Dialog/Popover/Menu verhalten sich anders als Radix.
   - Gegenmassnahme: zuerst High-Traffic-Flows migrieren, Keyboard-/Focus-Tests frueh.

2. **Theme-Drift (Dark/Light)**
   - Risiko: Farben/Contrast inkonsistent.
   - Gegenmassnahme: fruehes Theme-Mapping und gemeinsame Tokens.

3. **Lange Mischphase**
   - Risiko: Tailwind + MUI + alte Wrapper erschweren Wartung.
   - Gegenmassnahme: klare Exit-Kriterien pro Phase und harte Deadlines fuer Cleanup.

4. **Unterschaetzter QA-Aufwand**
   - Risiko: visuelle/UX-Regressionen trotz gruenem Build.
   - Gegenmassnahme: Storybook + A11y + gezielte manuelle Smoke-Tests pro Seite.

## Definition of Done (gesamt)

Die Migration gilt als abgeschlossen, wenn:

- alle Seiten unter `src/app/pages/` ohne alte UI-Primitives laufen
- Dark/Light/System unveraendert funktioniert
- Lint + Tests gruen sind
- keine ungenutzten alten UI-Dependencies verbleiben
- die wichtigsten User-Flows manuell geprueft wurden

## Backlog fuer einen Start-Sprint (Vorschlag)

1. MUI-Basispakete installieren und Theme anlegen
2. `ThemeProvider` + `CssBaseline` integrieren
3. Wrapper fuer `Button`, `Input`, `Dialog`, `Select`, `Card` bauen
4. `Login` und `Signup` auf neue Wrapper umstellen
5. Smoke-Test + Lint + Tests

Damit ist nach kurzer Zeit sichtbarer Fortschritt da und das Team hat ein stabiles Migrationsgeruest.
