# Prisma Schema (VorratsCheck)

Diese Datei beschreibt kurz das Datenmodell in `prisma/schema.prisma`.

## Zweck

Das Schema definiert alle Datenstrukturen fuer die VorratsCheck-App:

- Benutzerkonten
- Vorrat
- Must-Have-Liste
- Wunschliste
- Rezepte
- Angebote
- Kategorien

Aktuell ist als Datenbank `sqlite` konfiguriert. Die Verbindungs-URL wird ueber `DATABASE_URL` aus der `.env` geladen.

## Modelle im Ueberblick

- `User`: Basis fuer alle nutzerbezogenen Daten.
- `Category`: Benutzerdefinierte Kategorien.
- `InventoryItem`: Artikel im Vorrat.
- `MustHaveItem`: Artikel mit Mindestbestand.
- `WishListItem`: Wunschlisten-Eintraege mit Prioritaet.
- `Recipe`: Rezepte mit Zutaten und Schritten als JSON-Strings.
- `Deal`: Angebote (optional benutzerbezogen, z. B. Seed-Daten ohne `userId`).

## Beziehungen

Die zentrale Beziehung ist immer `User (1) -> (n)`:

- `User` -> `InventoryItem` (`inventory`)
- `User` -> `MustHaveItem` (`mustHaveList`)
- `User` -> `WishListItem` (`wishList`)
- `User` -> `Recipe` (`recipes`)
- `User` -> `Category` (`categories`)
- `User` -> `Deal` (`deals`, optional ueber `Deal.userId`)

Technisch bedeutet das:

- In den jeweiligen Modellen liegt ein `userId`-Feld als Fremdschluessel auf `User.id`.
- Bei `Category`, `InventoryItem`, `MustHaveItem`, `WishListItem` und `Recipe` gilt `onDelete: Cascade`.
  Wird ein User geloescht, werden diese Datensaetze automatisch mit geloescht.
- Bei `Deal` gilt `onDelete: SetNull`.
  Wird ein User geloescht, bleibt das Angebot bestehen und `userId` wird auf `null` gesetzt.

## Typische Befehle

Im Projekt-Root ausfuehren:

- `npm run db:generate` - Prisma Client erzeugen
- `npm run db:push` - Schema auf die Datenbank anwenden

Hinweis: Bei Modell-Aenderungen danach ggf. Seeds erneut ausfuehren.
